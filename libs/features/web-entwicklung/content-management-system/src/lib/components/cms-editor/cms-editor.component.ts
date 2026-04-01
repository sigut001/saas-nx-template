import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsDataService } from '../../services/cms-data.service';
import { CmsDynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import {
  CmsSecurityError,
  verifyAndSanitizePayload,
} from '../../utils/sanitization.utils';

// Ant Design Modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'lib-cms-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CmsDynamicFormComponent,
    NzPageHeaderModule,
    NzButtonModule,
    NzTabsModule,
    NzSpinModule,
    NzModalModule,
    NzBreadCrumbModule,
    NzBadgeModule,
  ],
  template: `
    <nz-page-header class="site-page-header" (nzBack)="onBack()">
      <!-- Breadcrumb Navigation -->
      <nz-breadcrumb nz-page-header-breadcrumb>
        <nz-breadcrumb-item
          ><a (click)="onBack()">Übersicht</a></nz-breadcrumb-item
        >
        <nz-breadcrumb-item *ngIf="type === 'dynamic'">{{
          collectionId | titlecase
        }}</nz-breadcrumb-item>
        <nz-breadcrumb-item *ngIf="type === 'static'"
          >Statische Seiten</nz-breadcrumb-item
        >
        <nz-breadcrumb-item>{{ docId }}</nz-breadcrumb-item>
      </nz-breadcrumb>

      <!-- Titel -->
      <nz-page-header-title>{{ headerTitle }}</nz-page-header-title>
      <nz-page-header-subtitle>Editor Modus</nz-page-header-subtitle>

      <!-- Buttons -->
      <nz-page-header-extra>
        <button nz-button (click)="onBack()">Zurück zur Übersicht</button>
        <button
          nz-button
          nzType="primary"
          (click)="saveTranslations()"
          [nzLoading]="isSaving()"
        >
          Speichern
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div *ngIf="isLoading()" style="text-align:center; padding: 60px;">
      <nz-spin nzSimple></nz-spin>
    </div>

    <div
      *ngIf="!isLoading() && availableLanguages.length > 0"
      class="editor-content"
    >
      <nz-tabset
        [nzSelectedIndex]="activeTabIndex"
        (nzSelectedIndexChange)="onTabChange($event)"
      >
        <nz-tab
          *ngFor="let lang of availableLanguages"
          [nzTitle]="tabTitleTemplate"
        >
          <ng-template #tabTitleTemplate>
            <nz-badge [nzCount]="getMissingCount(lang)" nzSize="small">
              <span style="padding-right: 8px;">{{ lang | uppercase }}</span>
            </nz-badge>
          </ng-template>

          <div
            *ngIf="translations[lang] === null"
            style="padding: 24px; text-align:center;"
          >
            <p>
              Dieses Dokument existiert noch nicht in der Sprache
              <b>{{ lang | uppercase }}</b
              >.
            </p>
            <button
              nz-button
              nzType="dashed"
              (click)="initializeEmptyTranslation(lang)"
            >
              Leeres Dokument aus Default-Sprache generieren
            </button>
          </div>

          <div *ngIf="translations[lang] !== null" style="padding-top: 24px;">
            <!-- Dynamisches Formular übergibt geänderte Daten via Event nach oben -->
            <lib-cms-dynamic-form
              [data]="translations[lang]"
              [changedPaths]="getChangedPathsArray(lang)"
              [missingPaths]="getMissingPathsArray(lang)"
              (dataChange)="onDataChange(lang, $event)"
            >
            </lib-cms-dynamic-form>
          </div>
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [
    `
      .site-page-header {
        background-color: #fff;
        margin-bottom: 24px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
      }
      .editor-content {
        background-color: #fff;
        padding: 24px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzModalService],
})
export class CmsEditorComponent implements OnInit {
  @Input({ required: true }) type!: 'static' | 'dynamic';
  @Input({ required: true }) docId!: string;
  @Input() collectionId?: string; // Only needed if type = 'dynamic'

  @Output() closeEditor = new EventEmitter<void>();

  cmsData = inject(CmsDataService);
  message = inject(NzMessageService);
  modal = inject(NzModalService);

  isLoading = signal(true);
  isSaving = signal(false);

  availableLanguages: string[] = [];
  activeTabIndex = 0;

  // Speichert die aktuell im Formular angezeigten Versionen aller Sprachen
  translations: Record<string, any> = {};

  // Trackt, welche Sprachen in DIESER Sitzung bearbeitet wurden
  dirtyLanguages = new Set<string>();

  // State für Deep Diffing
  originalSnapshots: Record<string, any> = {};
  changedPaths: Record<string, Set<string>> = {};
  missingPaths: Record<string, Set<string>> = {};
  globalChangedPaths = new Set<string>();

  get headerTitle(): string {
    return this.type === 'static'
      ? `Statische Seite: ${this.docId}`
      : `Dynamisches Element: ${this.docId}`;
  }

  async ngOnInit() {
    this.availableLanguages = this.cmsData.availableLanguages();
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);

    if (this.type === 'static') {
      this.translations = await this.cmsData.loadStaticPageTranslations(
        this.docId,
      );
    } else if (this.type === 'dynamic' && this.collectionId) {
      this.translations = await this.cmsData.loadDynamicElementTranslations(
        this.collectionId,
        this.docId,
      );
    }

    // Fallback & Snapshot Initialisierung
    this.availableLanguages.forEach((lang) => {
      if (this.translations[lang] === undefined) {
        this.translations[lang] = null;
      } else if (this.translations[lang] !== null) {
        this.originalSnapshots[lang] = JSON.parse(
          JSON.stringify(this.translations[lang]),
        );
      }
      this.changedPaths[lang] = new Set<string>();
      this.missingPaths[lang] = new Set<string>();
    });

    this.dirtyLanguages = new Set<string>();
    this.isLoading.set(false);
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
  }

  onDataChange(lang: string, newData: any) {
    this.translations[lang] = newData;
    this.dirtyLanguages.add(lang);
    this.calculateDiffs();
  }

  initializeEmptyTranslation(lang: string) {
    const templateLang = this.availableLanguages.find(
      (l) => this.translations[l] !== null,
    );

    if (templateLang) {
      this.translations[lang] = JSON.parse(
        JSON.stringify(this.translations[templateLang]),
      );
    } else {
      this.translations[lang] = { CONTENT: { ui: {}, seo: {} } };
    }

    // Setze original Snapshot für diese komplett neue Sprache auf "leer",
    // damit alles als "changed" erkannt wird!
    this.originalSnapshots[lang] = {};

    this.dirtyLanguages.add(lang);
    this.translations = { ...this.translations };
    this.calculateDiffs();
  }

  // --- Deep Diffing Logik ---

  private calculateDiffs() {
    this.globalChangedPaths = new Set<string>();

    // 1. Finde alle geänderten Pfade für jede Sprache
    this.availableLanguages.forEach((lang) => {
      const changed = new Set<string>();
      const original = this.originalSnapshots[lang];
      const current = this.translations[lang];

      if (current && original) {
        this.deepDiff(original, current, '', changed);
      } else if (current && !original) {
        this.deepDiff({}, current, '', changed);
      }
      this.changedPaths[lang] = changed;

      changed.forEach((p) => this.globalChangedPaths.add(p));
    });

    // 2. Berechne fehlende Pfade
    this.availableLanguages.forEach((lang) => {
      const missing = new Set<string>();
      if (this.translations[lang] !== null) {
        this.globalChangedPaths.forEach((p) => {
          if (!this.changedPaths[lang].has(p)) {
            missing.add(p);
          }
        });
      }
      this.missingPaths[lang] = missing;
    });
  }

  private deepDiff(
    original: any,
    current: any,
    path: string,
    result: Set<string>,
  ) {
    if (typeof current !== 'object' || current === null) {
      if (original !== current) result.add(path);
      return;
    }

    if (Array.isArray(current)) {
      if (JSON.stringify(original) !== JSON.stringify(current)) {
        result.add(path);
      }
      return;
    }

    for (const key of Object.keys(current)) {
      const newPath = path ? `${path}.${key}` : key;
      const origVal = original ? original[key] : undefined;
      this.deepDiff(origVal, current[key], newPath, result);
    }
  }

  getMissingCount(lang: string): number {
    return this.missingPaths[lang] ? this.missingPaths[lang].size : 0;
  }

  getMissingPathsArray(lang: string): string[] {
    return this.missingPaths[lang] ? Array.from(this.missingPaths[lang]) : [];
  }

  getChangedPathsArray(lang: string): string[] {
    return this.changedPaths[lang] ? Array.from(this.changedPaths[lang]) : [];
  }

  // --- Speichern & Verlassen ---

  onBack() {
    if (this.dirtyLanguages.size > 0) {
      this.modal.confirm({
        nzTitle: 'Ungespeicherte Änderungen',
        nzContent:
          'Bist du sicher, dass du den Editor verlassen möchtest? Deine Änderungen gehen verloren.',
        nzOnOk: () => this.closeEditor.emit(),
      });
    } else {
      this.closeEditor.emit();
    }
  }

  async saveTranslations() {
    let hasMissing = false;
    let missingInfoText = '';

    this.availableLanguages.forEach((lang) => {
      if (this.missingPaths[lang] && this.missingPaths[lang].size > 0) {
        hasMissing = true;
        missingInfoText += `<br><b>Tab '${lang.toUpperCase()}':</b> ${Array.from(this.missingPaths[lang]).join(', ')}`;
      }
    });

    if (hasMissing) {
      this.modal.confirm({
        nzTitle: 'Achtung: Ungesicherte Übersetzungsstände',
        nzContent: `Du hast Felder bearbeitet, die in anderen Sprachen noch nicht nachgezogen wurden:<br>${missingInfoText}<br><br>Möchtest du trotzdem speichern?`,
        nzOkText: 'Ja, trotzdem speichern',
        nzCancelText: 'Abbrechen',
        nzOnOk: () => this.executeSave(),
      });
    } else {
      this.executeSave();
    }
  }

  private async executeSave() {
    if (this.dirtyLanguages.size === 0) {
      this.message.info('Keine Änderungen zum Speichern.');
      return;
    }

    this.isSaving.set(true);
    try {
      const savePromises = Array.from(this.dirtyLanguages).map((lang) => {
        // Security Pipeline: Type Verification & Recursive Strict HTML Stripping
        const original = this.originalSnapshots[lang];
        const rawData = this.translations[lang];
        const sanitizedData = verifyAndSanitizePayload(
          original,
          rawData,
          'root',
        );

        // UI Update: Spiegle den bereinigten Wert sofort ins Formular zurück
        this.translations = { ...this.translations, [lang]: sanitizedData };

        if (this.type === 'static') {
          return this.cmsData.saveStaticPageTranslation(
            this.docId,
            lang,
            sanitizedData,
          );
        } else {
          return this.cmsData.saveDynamicElementTranslation(
            this.collectionId!,
            this.docId,
            lang,
            sanitizedData,
          );
        }
      });

      await Promise.all(savePromises);
      this.message.success('Änderungen erfolgreich hochgeladen!');

      // Zustand zurücksetzen
      this.dirtyLanguages.clear();
      this.availableLanguages.forEach((lang) => {
        if (this.translations[lang] !== null) {
          this.originalSnapshots[lang] = JSON.parse(
            JSON.stringify(this.translations[lang]),
          );
        }
        this.changedPaths[lang] = new Set<string>();
        this.missingPaths[lang] = new Set<string>();
      });
      this.globalChangedPaths.clear();
    } catch (err: any) {
      if (err.name === 'CmsSecurityError') {
        this.modal.error({
          nzTitle: 'Sicherheitsfehler - Ungültiges Format',
          nzContent: err.message,
        });
      } else {
        this.message.error('Fehler beim Speichern: ' + err.message);
      }
    } finally {
      this.isSaving.set(false);
    }
  }
}
