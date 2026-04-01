import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { TenantIntegrationService } from '@saas-base/tenant-integration';
import { CommonModule } from '@angular/common';
import { CmsDataService } from '../services/cms-data.service';

// UI Components
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

// Editor Component
import { CmsEditorComponent } from '../components/cms-editor/cms-editor.component';

@Component({
  selector: 'lib-content-management-system',
  standalone: true,
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzSpinModule,
    NzCardModule,
    NzTagModule,
    NzEmptyModule,
    NzTabsModule,
    CmsEditorComponent,
  ],
  template: `
    <div class="cms-container">
      <div *ngIf="!cmsData.isReady()" class="loader-container">
        <nz-page-header
          class="site-page-header"
          nzTitle="CMS (Kunden-Datenbank)"
          nzSubtitle="Inhalte bearbeiten"
        ></nz-page-header>
        <nz-spin
          nzSimple
          nzTip="Verbinde sicher zur Mandanten-Datenbank..."
        ></nz-spin>
        <div style="margin-top: 16px; color: #ff4d4f" *ngIf="cmsData.error()">
          Verbindungsfehler: {{ cmsData.error() }}
        </div>
      </div>

      <div *ngIf="cmsData.isReady()">
        <!-- EDITOR LAYER (Wenn aktiv, wird Navigationstabelle ausgeblendet) -->
        <div *ngIf="editingDocId() !== null">
          <lib-cms-editor
            [type]="editingType()!"
            [docId]="editingDocId()!"
            [collectionId]="activeCollection() || undefined"
            (closeEditor)="closeEditor()"
          >
          </lib-cms-editor>
        </div>

        <!-- NAVIGATION LAYER -->
        <div *ngIf="editingDocId() === null">
          <nz-page-header
            class="site-page-header"
            nzTitle="CMS (Kunden-Datenbank)"
            nzSubtitle="Inhalte bearbeiten"
          >
            <nz-page-header-extra>
              <button
                nz-button
                nzType="primary"
                (click)="refreshData()"
                [disabled]="!cmsData.isReady() || isLoading()"
              >
                Neu laden
              </button>
            </nz-page-header-extra>
          </nz-page-header>

          <nz-card>
            <nz-tabset>
              <!-- TAB 1: Statische Seiten -->
              <nz-tab nzTitle="Statische Seiten">
                <nz-table
                  #staticTable
                  [nzData]="staticPages()"
                  [nzLoading]="isLoading()"
                  [nzFrontPagination]="false"
                >
                  <thead>
                    <tr>
                      <th>Seiten-ID (Slug)</th>
                      <th>Verfügbare Sprachen</th>
                      <th>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let pageId of staticTable.data">
                      <td>
                        <strong>{{ pageId }}</strong>
                      </td>
                      <td>
                        <nz-tag
                          *ngFor="let l of cmsData.availableLanguages()"
                          >{{ l | uppercase }}</nz-tag
                        >
                      </td>
                      <td>
                        <button
                          nz-button
                          nzType="link"
                          (click)="editStaticPage(pageId)"
                        >
                          Bearbeiten
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </nz-table>
                <nz-empty
                  *ngIf="staticPages().length === 0 && !isLoading()"
                  nzNotFoundContent="Keine statischen Seiten gefunden."
                ></nz-empty>
              </nz-tab>

              <!-- TAB 2: Dynamische Kollektionen -->
              <nz-tab nzTitle="Dynamische Inhalte">
                <div *ngIf="activeCollection() === null">
                  <!-- Übersicht der Collections -->
                  <nz-table
                    #collectionTable
                    [nzData]="dynamicCollections()"
                    [nzLoading]="isLoading()"
                    [nzFrontPagination]="false"
                  >
                    <thead>
                      <tr>
                        <th>Kollektions-ID</th>
                        <th>Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let colId of collectionTable.data">
                        <td>
                          <strong>{{ colId | titlecase }}</strong>
                        </td>
                        <td>
                          <button
                            nz-button
                            nzType="link"
                            (click)="loadElementsForCollection(colId)"
                          >
                            Elemente anzeigen
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </nz-table>
                  <nz-empty
                    *ngIf="dynamicCollections().length === 0 && !isLoading()"
                    nzNotFoundContent="Keine dynamischen Kollektionen."
                  ></nz-empty>
                </div>

                <div *ngIf="activeCollection() !== null">
                  <!-- Elemente innerhalb einer Collection -->
                  <div style="margin-bottom: 16px;">
                    <button
                      nz-button
                      nzType="default"
                      (click)="activeCollection.set(null)"
                    >
                      &larr; Zurück zur Übersicht
                    </button>
                    <strong style="margin-left: 16px;"
                      >Elemente für:
                      {{ activeCollection() | titlecase }}</strong
                    >
                  </div>

                  <nz-table
                    #elementsTable
                    [nzData]="dynamicElements()"
                    [nzLoading]="isLoading()"
                    [nzFrontPagination]="false"
                  >
                    <thead>
                      <tr>
                        <th>Element-ID (Slug)</th>
                        <th>Status</th>
                        <th>Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let elementId of elementsTable.data">
                        <td>
                          <strong>{{ elementId }}</strong>
                        </td>
                        <td>
                          <nz-tag [nzColor]="'green'">Geplublished</nz-tag>
                        </td>
                        <td>
                          <button
                            nz-button
                            nzType="link"
                            (click)="editDynamicElement(elementId)"
                          >
                            Bearbeiten
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </nz-table>
                  <nz-empty
                    *ngIf="dynamicElements().length === 0 && !isLoading()"
                    nzNotFoundContent="Keine Elemente in dieser Kollektion."
                  ></nz-empty>
                </div>
              </nz-tab>
            </nz-tabset>
          </nz-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 24px;
        background: #f0f2f5;
        min-height: 100vh;
      }
      .cms-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .site-page-header {
        background-color: #fff;
        margin-bottom: 24px;
        border: 1px solid #d9d9d9;
        border-radius: 8px;
      }
      .loader-container {
        text-align: center;
        padding: 60px;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #d9d9d9;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentManagementSystemComponent {
  cmsData = inject(CmsDataService);

  isLoading = signal(false);

  staticPages = signal<string[]>([]);
  dynamicCollections = signal<string[]>([]);

  // Navigation State for Dynamic Content
  activeCollection = signal<string | null>(null);
  dynamicElements = signal<string[]>([]);

  // Editor State
  editingType = signal<'static' | 'dynamic' | null>(null);
  editingDocId = signal<string | null>(null);

  tenantService = inject(TenantIntegrationService);

  constructor() {
    // 1. Warte reaktiv auf den TenantIntegrationService
    effect(() => {
      const integrations = this.tenantService.integrations();
      const isLoadingIntegration = this.tenantService.isLoading();

      if (!integrations || Object.keys(integrations).length === 0) {
        if (!isLoadingIntegration) {
          this.cmsData.error.set(
            'Datenbank-Integrationsprofil fehlt oder Firestore-Regeln blockieren den Zugriff.',
          );
        }
        return;
      }

      // 2. Sobald die Integration da ist und wir noch nicht verbunden sind, initiieren
      if (
        integrations['target-firebase'] &&
        !this.cmsData.isReady() &&
        !this.cmsData.error()
      ) {
        this.cmsData.initializeTenantConnection();
      }
    });

    // 3. Wenn die CMS-Datenbank-Verbindung steht, laden wir die UI
    effect(() => {
      if (this.cmsData.isReady()) {
        console.log('[CMS] Tenant DB bereit. Lade UI-Daten.');
        this.loadAllData();
      }
    });
  }

  async refreshData() {
    this.cmsData.staticPagesCache.set(null);
    this.cmsData.dynamicCollectionsCache.set(null);
    await this.loadAllData();
  }

  async loadAllData() {
    this.isLoading.set(true);

    // Nutze den Eager-Cache aus dem App/Admin-Shell, falls vorhanden
    const cachedStatic = this.cmsData.staticPagesCache();
    const cachedCollections = this.cmsData.dynamicCollectionsCache();

    if (cachedStatic && cachedCollections) {
      this.staticPages.set(cachedStatic);
      this.dynamicCollections.set(cachedCollections);
    } else {
      // Fallback: Manuelles Laden, falls direkt navigiert wurde oder Cache leer ist
      const [staticResult, collectionsResult] = await Promise.all([
        this.cmsData.loadStaticPagesList(),
        this.cmsData.loadDynamicCollectionsList(),
      ]);
      this.staticPages.set(staticResult);
      this.dynamicCollections.set(collectionsResult);

      this.cmsData.staticPagesCache.set(staticResult);
      this.cmsData.dynamicCollectionsCache.set(collectionsResult);
    }

    // Reset Navigation
    this.activeCollection.set(null);
    this.dynamicElements.set([]);

    this.isLoading.set(false);
  }

  async loadElementsForCollection(collectionId: string) {
    this.isLoading.set(true);
    this.activeCollection.set(collectionId);

    const elements = await this.cmsData.loadDynamicElementsList(collectionId);
    this.dynamicElements.set(elements);

    this.isLoading.set(false);
  }

  editStaticPage(pageId: string) {
    this.editingType.set('static');
    this.editingDocId.set(pageId);
  }

  editDynamicElement(elementId: string) {
    this.editingType.set('dynamic');
    this.editingDocId.set(elementId);
  }

  closeEditor() {
    this.editingType.set(null);
    this.editingDocId.set(null);
  }
}
