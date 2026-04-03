import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GscApiService } from './gsc-api.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AnalyticsDebugComponent } from '../debug/analytics-debug.component';

@Component({
  selector: 'saas-analytics-seo',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, NzAlertModule, AnalyticsDebugComponent],
  template: `
    <div class="slice-container">
      <h2>Search Console Metriken (SEO)</h2>
      <p class="subtitle">Organische Performance und Keyword-Rankings direkt aus Google.</p>

      <!-- Banner für fehlenden/abgelaufenen Token -->
      <nz-alert
        *ngIf="gsc.hasTokenError()"
        nzType="warning"
        nzShowIcon
        nzMessage="Google Search Console Token abgelaufen oder nicht vorhanden"
        nzDescription="Um die aktuellen Ranking-Daten in Echtzeit abzufragen, benötigen wir (erneut) temporären Zugriff."
        [nzAction]="actionTemplate"
        class="token-alert"
      ></nz-alert>
      <ng-template #actionTemplate>
        <button nz-button nzType="primary" (click)="connect()">Jetzt verbinden</button>
      </ng-template>

      <!-- Dashboard Content (nur wenn kein Error existiert) -->
      <div *ngIf="!gsc.hasTokenError()" class="dashboard-content">
        <div class="success-alert" *ngIf="gsc.isConnected">
          <span nz-icon nzType="check-circle" nzTheme="fill"></span>
          Verbindung aktiv! Token hinterlegt.
        </div>
        
        <div class="pipeline-card">
          <h3>Echtzeit-Synchronisierung</h3>
          <p>Das System liest die verifizierte Domain aus deinem Firebase-Kunden-Tresor aus und holt die Daten von Google.</p>
          
          <div class="form-row">
            <button nz-button nzType="default" nzSize="large" (click)="fetchApi()" [nzLoading]="gsc.isLoadingData()">
              <span nz-icon nzType="sync"></span> Neu laden
            </button>
          </div>
        </div>

        <!-- JSON PREVIEW DATA -->
        <div class="data-preview" *ngIf="gsc.seoDataResponse() && !gsc.seoDataResponse()?.error">
           <h4>Google API RAW Response:</h4>
           <pre><code>{{ gsc.seoDataResponse() | json }}</code></pre>
        </div>
        
        <!-- ERROR PREVIEW -->
        <div class="data-preview error" *ngIf="gsc.seoDataResponse()?.error">
           <h4 style="color: #ff4d4f;">API Fehler:</h4>
           <pre><code>{{ gsc.seoDataResponse()?.message }}</code></pre>
        </div>
        
        <!-- FALLBACK PLATZHALTER -->
        <div class="placeholder-box" *ngIf="!gsc.seoDataResponse() && !gsc.isLoadingData()">
          <p>Hier werden die ECharts Diagramme (Klicks vs. Impressions) geladen.</p>
        </div>
      </div>

      <!-- DEBUG PANEL -->
      <saas-base-analytics-debug [data]="debugData()"></saas-base-analytics-debug>
    </div>
  `,
  styles: [`
    .slice-container h2 { font-size: 1.5rem; color: #222; margin-bottom: 0.5rem; }
    .subtitle { color: #555; margin-bottom: 2rem; }

    .token-alert { margin-bottom: 2rem; }

    .dashboard-content { animation: fadeIn 0.4s ease; }

    .success-alert {
      background: #e6ffed;
      border: 1px solid #b7ebc6;
      color: #138739;
      padding: 1rem 1.2rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .pipeline-card {
      background: #fff;
      border: 1px solid #eaeaea;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      margin-bottom: 2rem;
    }
    
    .pipeline-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #111; }
    .pipeline-card p { color: #666; margin-bottom: 1.5rem; }
    
    .form-row { display: flex; gap: 1rem; }

    .data-preview {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    .data-preview.error {
      background: #2b1111;
      border: 1px solid #ff4d4f;
    }
    .data-preview h4 { color: #9cdcfe; margin-bottom: 1rem; font-size: 1rem; }
    .data-preview pre { margin: 0; font-family: monospace; }

    .placeholder-box {
      border: 2px dashed #eaeaea;
      padding: 3rem;
      text-align: center;
      border-radius: 12px;
      color: #888;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SeoComponent implements OnInit {
  readonly gsc = inject(GscApiService);
  readonly debugData = signal<any>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit() {
    // Versuch automatisch zu fetchen beim Aufruf des Tabs
    this.fetchApi();
  }

  async connect() {
    try {
      await this.gsc.connectSearchConsole();
      // fetchAnalyticsData() happens automatically in connectSearchConsole() success
      this.debugData.set(this.gsc.seoDataResponse());
    } catch (error: any) {
      console.error('Connect failed', error);
      this.debugData.set({ error: true, message: error?.message || 'Verbindung fehlgeschlagen.' });
    }
  }

  async fetchApi() {
    this.isLoading.set(true);
    try {
      await this.gsc.fetchAnalyticsData();
      
      if (!this.gsc.hasTokenError()) {
        this.debugData.set(this.gsc.seoDataResponse());
      }
    } catch (e: any) {
      console.error(e);
      this.debugData.set({ error: true, message: e.message || 'Fehler beim Abrufen der Daten.' });
    } finally {
      this.isLoading.set(false);
    }
  }
}
