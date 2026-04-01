import { Injectable, inject, signal, effect } from '@angular/core';
import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions';
import { TenantIntegrationService } from '@saas-base/tenant-integration';

export interface CmsNode {
  id: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CmsDataService {
  private tenantService = inject(TenantIntegrationService);

  tenantApp = signal<FirebaseApp | null>(null);
  isReady = signal(false);
  error = signal<string | null>(null);

  // Cache for available languages
  availableLanguages = signal<string[]>([]);

  // Cache for Data
  staticPagesCache = signal<string[] | null>(null);
  dynamicCollectionsCache = signal<string[] | null>(null);

  constructor() {
    console.log('[CmsDataService] Service instantiated globally');

    // Globale Initialisierung der Tenant-Datenbank sobald die Auth/Integrationen geladen sind
    effect(() => {
      const integrations = this.tenantService.integrations();

      // Nur triggern, wenn wir Integrationen haben, es Firebase gibt und wir noch nicht ready/in-Error sind
      if (integrations && Object.keys(integrations).length > 0) {
        if (
          integrations['target-firebase'] &&
          !this.isReady() &&
          !this.error()
        ) {
          console.log(
            '[CmsDataService] Firebase Integration erkannt, beginne sofortigen Backend-Login...',
          );
          this.initializeTenantConnection();
        } else if (
          !integrations['target-firebase'] &&
          !this.tenantService.isLoading()
        ) {
          this.error.set('Datenbank-Integrationsprofil fehlt.');
        }
      }
    });

    // Sobald die Datenbank ready ist, laden wir im Hintergrund ("Pre-Warm") direkt die Menü-Listen
    effect(() => {
      if (
        this.isReady() &&
        this.staticPagesCache() === null &&
        this.dynamicCollectionsCache() === null
      ) {
        console.log(
          '[CmsDataService] Hintergrund-Caching der CMS Einträge startet...',
        );
        this.loadStaticPagesList().then((res) =>
          this.staticPagesCache.set(res),
        );
        this.loadDynamicCollectionsList().then((res) =>
          this.dynamicCollectionsCache.set(res),
        );
      }
    });
  }

  async initializeTenantConnection() {
    this.error.set(null);
    try {
      const integrations = this.tenantService.integrations();
      if (!integrations || !integrations['target-firebase']) {
        throw new Error(
          'Keine Firebase-Integration im Mandantenprofil gefunden.',
        );
      }

      const targetFirebase = integrations['target-firebase'];
      const functionsInstance = getFunctions(getApp(), 'europe-west1');

      if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        try {
          connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
        } catch (e) {
          /* ignore if already connected */
        }
      }

      const getTenantToken = httpsCallable<
        { targetProjectId: string },
        { token: string }
      >(functionsInstance, 'getTenantCustomToken');

      const res = await getTenantToken({
        targetProjectId: targetFirebase.projectId,
      });
      const customToken = res.data.token;

      const tenantAppName = `tenant-${targetFirebase.projectId}`;
      const existingApp = getApps().find((app) => app.name === tenantAppName);
      const appInst = existingApp
        ? existingApp
        : initializeApp(targetFirebase, tenantAppName);

      const tenantAuth = getAuth(appInst);
      await signInWithCustomToken(tenantAuth, customToken);

      this.tenantApp.set(appInst);

      // Load languages initially
      await this.loadAvailableLanguages(appInst);

      this.isReady.set(true);
    } catch (err: any) {
      console.error('[CmsDataService] Setup Error:', err);
      this.error.set(
        err.message || 'Unbekannter Fehler beim Verbindungsaufbau.',
      );
    }
  }

  private async loadAvailableLanguages(app: FirebaseApp) {
    try {
      const db = getFirestore(app);
      console.log(
        '[CMS DB-Abfrage] Lade unterstützte Sprachen aus /config/settings',
      );
      const docSnap = await getDoc(doc(db, 'config/settings'));

      if (docSnap.exists() && docSnap.data()['supportedLanguages']) {
        const langs = docSnap.data()['supportedLanguages'];
        console.log(
          `[CMS DB-Abfrage] ${langs.length} Sprachen gefunden: ${langs.join(', ')}`,
        );
        this.availableLanguages.set(langs);
      } else {
        console.warn(
          `[CmsDataService] Kein 'supportedLanguages' Array in config/settings gefunden. Fallback auf 'de'.`,
        );
        this.availableLanguages.set(['de']);
      }
    } catch (error) {
      console.error('[CmsDataService] Fehler beim Laden der Sprachen:', error);
      this.availableLanguages.set(['de']);
    }
  }

  getDb() {
    const app = this.tenantApp();
    if (!app) throw new Error('Tenant DB nicht initialisiert');
    return getFirestore(app);
  }

  async loadStaticPagesList(): Promise<string[]> {
    const langs = this.availableLanguages();
    if (langs.length === 0) return [];

    // Wir iterieren über alle verfügbaren Sprachen und sammeln die einzigartigen Dokument-IDs
    const pageIds = new Set<string>();
    const db = this.getDb();

    try {
      const firstLang = langs[0];
      const queryPath = `languages/${firstLang}/static_pages`;
      console.log(
        `[CMS DB-Abfrage] Lade statische Seiten aus Pfad: /${queryPath}`,
      );

      const snapshot = await getDocs(collection(db, queryPath));
      console.log(
        `[CMS DB-Abfrage] ${snapshot.size} statische Seiten gefunden in /${queryPath}:`,
      );

      snapshot.forEach((doc) => {
        console.log(`  -> Dokument-ID: ${doc.id}`);
        pageIds.add(doc.id);
      });
    } catch (error) {
      console.error(
        '[CmsDataService] Fehler beim Laden der statischen Seiten:',
        error,
      );
    }

    return Array.from(pageIds);
  }

  async loadStaticPageTranslations(
    pageId: string,
  ): Promise<Record<string, any>> {
    const langs = this.availableLanguages();
    const db = this.getDb();
    const translations: Record<string, any> = {};

    for (const lang of langs) {
      try {
        const docRef = doc(db, `languages/${lang}/static_pages/${pageId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          translations[lang] = snap.data();
        } else {
          translations[lang] = null; // Dokument existiert nicht in dieser Sprache
        }
      } catch (e) {
        console.error(
          `[CmsDataService] Error loading ${lang} translation for ${pageId}`,
          e,
        );
        translations[lang] = null;
      }
    }
    return translations;
  }

  async saveStaticPageTranslation(pageId: string, lang: string, data: any) {
    const db = this.getDb();
    const docRef = doc(db, `languages/${lang}/static_pages/${pageId}`);
    return setDoc(docRef, data, { merge: true });
  }

  // --- Dynamic Collections Methods ---

  async loadDynamicCollectionsList(): Promise<string[]> {
    const langs = this.availableLanguages();
    if (langs.length === 0) return [];

    const collectionsIds = new Set<string>();
    const db = this.getDb();

    try {
      const firstLang = langs[0];
      const queryPath = `languages/${firstLang}/dynamic_pages`;
      console.log(
        `[CMS DB-Abfrage] Lade dynamische Kollektionen aus Pfad: /${queryPath}`,
      );

      const snapshot = await getDocs(collection(db, queryPath));
      console.log(
        `[CMS DB-Abfrage] ${snapshot.size} dynamische Kollektionen (Parent-Dokumente) gefunden in /${queryPath}:`,
      );

      snapshot.forEach((doc) => {
        console.log(`  -> Kollektions-ID: ${doc.id}`, doc.data());
        collectionsIds.add(doc.id);
      });
    } catch (error) {
      console.error(
        '[CmsDataService] Fehler beim Laden der dynamischen Collections:',
        error,
      );
    }

    return Array.from(collectionsIds);
  }

  async loadDynamicElementsList(collectionId: string): Promise<string[]> {
    const langs = this.availableLanguages();
    if (langs.length === 0) return [];

    const elementsIds = new Set<string>();
    const db = this.getDb();

    try {
      const firstLang = langs[0];
      const queryPath = `languages/${firstLang}/dynamic_pages/${collectionId}/elements`;
      console.log(
        `[CMS DB-Abfrage] Lade dynamische Elemente für Liste aus Pfad: /${queryPath}`,
      );

      const snapshot = await getDocs(collection(db, queryPath));
      console.log(
        `[CMS DB-Abfrage] ${snapshot.size} Elemente in Kollektion '${collectionId}' gefunden:`,
      );

      snapshot.forEach((doc) => {
        console.log(`  -> Element-ID: ${doc.id}`);
        elementsIds.add(doc.id);
      });
    } catch (error) {
      console.error(
        `[CmsDataService] Fehler beim Laden der Elemente für Collection ${collectionId}:`,
        error,
      );
    }

    return Array.from(elementsIds);
  }

  async loadDynamicElementTranslations(
    collectionId: string,
    elementId: string,
  ): Promise<Record<string, any>> {
    const langs = this.availableLanguages();
    const db = this.getDb();
    const translations: Record<string, any> = {};

    for (const lang of langs) {
      try {
        const docRef = doc(
          db,
          `languages/${lang}/dynamic_pages/${collectionId}/elements/${elementId}`,
        );
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          translations[lang] = snap.data();
        } else {
          translations[lang] = null;
        }
      } catch (e) {
        translations[lang] = null;
      }
    }
    return translations;
  }

  async saveDynamicElementTranslation(
    collectionId: string,
    elementId: string,
    lang: string,
    data: any,
  ) {
    const db = this.getDb();
    const docRef = doc(
      db,
      `languages/${lang}/dynamic_pages/${collectionId}/elements/${elementId}`,
    );
    return setDoc(docRef, data, { merge: true });
  }
}
