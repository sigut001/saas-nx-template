import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

/**
 * Die Firebase-Konfiguration des Ziel-Kunden (Das "Test-Backend" des neuen Kunden)
 */
export interface TargetFirebaseConfig {
  projectId: string;
  apiKey: string;
  authDomain: string;
  storageBucket: string;
  // NEU: Die Tresor-Geheimnisse für das Backend
  privateKey?: string;
  clientEmail?: string;
}

/**
 * Das Konfigurationsobjekt, das alle Daten zum Anlegen eines frischen
 * SaaS Mandanten bereithält.
 */
export interface CreateTenantConfig {
  user: {
    email: string;
    password?: string;
    displayName?: string;
  };
  subscription: {
    plan: string;
    activeFeatures?: string[];
    role?: string;
  };
  targetFirebaseConfig: TargetFirebaseConfig;
  /**
   * Ein untypisierter Satz von Schlüssel-Werte-Paaren für Konfigurationen
   * (z.B. CUSTOMER_DOMAIN), die Frontend-Modulen konfigurationsfrei 
   * zur Verfügung stehen sollen.
   */
  vault?: Record<string, string | undefined>;
  /**
   * Generierte Analytics-Widgets für das Dashboard (z.B. PostHog Insights)
   */
  dashboardConfig?: {
    widgets: any[];
  };
  /**
   * Die bereits authentifizierte Firebase Admin-Instanz (Referenz auf die SaaS-Master-DB).
   */
  masterAdminDbInstance: admin.app.App;
}

/**
 * Kern-Funktion des SaaS-Tenant-Managements: 
 * Legt einen Benutzer im SaaS-Admin-Panel an und injiziert ihm
 * dynamisch die Zugangsdaten zu seiner eigenen Ziel-Datenbank.
 * 
 * @param config Die vollständige Konfiguration des Neukunden
 * @returns Die UID des neu angelegten Accounts im Admin Panel
 */
export async function createTenant(config: CreateTenantConfig): Promise<string> {
  if (!config.masterAdminDbInstance) {
    throw new Error('❌ [createTenant] FEHLER: Die masterAdminDbInstance fehlt!');
  }

  const auth = getAuth(config.masterAdminDbInstance);
  const db = getFirestore(config.masterAdminDbInstance);

  const email = config.user.email;
  const password = config.user.password || Math.random().toString(36).slice(-8);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`ℹ️  [createTenant] User ${email} existiert bereits (UID: ${userRecord.uid}). Aktualisiere Passwort...`);
    await auth.updateUser(userRecord.uid, { password: password });
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      console.log(`📦 [createTenant] Lege neuen User ${email} in SaaS-Auth an...`);
      userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: config.user.displayName || 'Unnamed Tenant',
        emailVerified: true
      });
    } else {
      console.error('❌ [createTenant] Fehler in FirebaseAuth:', err);
      throw err;
    }
  }

  const uid = userRecord.uid;

  // 1. ÖFFENTLICHE DATEN (Lesbar für Frontend)
  console.log(`📦 [createTenant] Speichere öffentliches Firestore-Profil für users/${uid}...`);
  const userRef = db.collection('users').doc(uid);
  
  // Wir extrahieren die harmlosen Daten für das Frontend
  const publicTargetConfig = {
    projectId: config.targetFirebaseConfig.projectId,
    apiKey: config.targetFirebaseConfig.apiKey,
    authDomain: config.targetFirebaseConfig.authDomain,
    storageBucket: config.targetFirebaseConfig.storageBucket,
  };

  await userRef.set({
    uid: uid,
    email: email,
    displayName: config.user.displayName || 'Unnamed Tenant',
    role: config.subscription.role || 'user',
    plan: config.subscription.plan || 'free',
    activeFeatures: config.subscription.activeFeatures || [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    
    integrations: {
      'target-firebase': publicTargetConfig
    },
    // Optionaler Tresor: Liefert dem Frontend (z.B. Analytics-Modulen) Variablen wie CUSTOMER_DOMAIN
    ...(config.vault ? { vault: config.vault } : {}),
    // Dashboard Config (PostHog KPIs)
    ...(config.dashboardConfig ? { dashboardConfig: config.dashboardConfig } : {})
  }, { merge: true });

  // 2. GEHEIME DATEN (Der Tresor - Nur für Cloud Functions lesbar!)
  if (config.targetFirebaseConfig.privateKey && config.targetFirebaseConfig.clientEmail) {
    console.log(`🔐 [createTenant] Versiegle Tresor in users/${uid}/private/secrets...`);
    const vaultRef = db.collection('users').doc(uid).collection('private').doc('secrets');
    
    await vaultRef.set({
      targetFirebase: {
        privateKey: config.targetFirebaseConfig.privateKey,
        clientEmail: config.targetFirebaseConfig.clientEmail
      },
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log(`✅ [createTenant] Tresor erfolgreich angelegt!`);
  } else {
    console.log(`⚠️ [createTenant] WARNUNG: Kein Private Key übergeben. Tresor wurde nicht befüllt!`);
  }

  console.log(`🎉 [createTenant] Einrichtung für ${email} abgeschlossen!`);
  return uid;
}
