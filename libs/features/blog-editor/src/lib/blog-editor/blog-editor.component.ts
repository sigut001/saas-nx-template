import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiEditorComponent } from '@saas-base/ui-editor';
import { TenantIntegrationService } from '@saas-base/tenant-integration';
import { getApp, initializeApp, getApps } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'lib-blog-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,   
    UiEditorComponent, 
    NzPageHeaderModule, 
    NzButtonModule, 
    NzBreadCrumbModule,
    NzSpaceModule,
    NzIconModule,
    NzSpinModule
  ],
  template: `
    <div class="page-layout">
      <nz-page-header class="site-page-header" nzTitle="Neuer Blogartikel" nzSubtitle="Verfasse deinen Content mit dem Block-Editor">
        <nz-breadcrumb nz-page-header-breadcrumb>
          <nz-breadcrumb-item>App</nz-breadcrumb-item>
          <nz-breadcrumb-item>Blog</nz-breadcrumb-item>
          <nz-breadcrumb-item>Editor</nz-breadcrumb-item>
        </nz-breadcrumb>
        <nz-page-header-extra>
          <nz-space>
            <button *nzSpaceItem nz-button (click)="onCancel()">Abbrechen</button>
            <button *nzSpaceItem nz-button nzType="primary" [disabled]="!tenantReady()" (click)="onSave()">Speichern</button>
          </nz-space>
        </nz-page-header-extra>
      </nz-page-header>

      <div class="editor-wrapper" *ngIf="tenantReady(); else loadingTpl">
        <lib-ui-editor 
          [(ngModel)]="content" 
          placeholder="Schreib deinen Artikel hier...">
        </lib-ui-editor>
      </div>

      <ng-template #loadingTpl>
        <div class="loader-container">
          <nz-spin nzSimple nzTip="Verbinde mit Server des Kunden..."></nz-spin>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
      background: #f0f2f5;
      min-height: 100vh;
    }
    .page-layout {
      max-width: 1000px;
      margin: 0 auto;
    }
    .site-page-header {
      background-color: #fff;
      margin-bottom: 24px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
    }
    .editor-wrapper {
      margin-bottom: 24px;
    }
    .loader-container {
      text-align: center;
      padding: 50px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogEditorComponent implements OnInit {
  private tenantService = inject(TenantIntegrationService);
  
  content: any = null;
  tenantReady = signal(false);

  async ngOnInit() {
    const integrations = this.tenantService.integrations();
    const targetFirebase = integrations['target-firebase'];

    if (!targetFirebase) {
      console.error('[BlogEditor] Target Firebase config is missing in Integrations!');
      return;
    }

    try {
      // 1. Cloud Function der Master-App aufrufen, um das Token zu erhalten
      const functionsInstance = getFunctions(getApp(), 'europe-west1');
      const getTenantToken = httpsCallable<{ targetProjectId: string }, { token: string }>(
        functionsInstance, 
        'getTenantCustomToken'
      );
      
      const res = await getTenantToken({ targetProjectId: targetFirebase.projectId });
      const customToken = res.data.token;

      // 2. Zweite Firebase App für diesen Tenant initialisieren
      const tenantAppName = `tenant-${targetFirebase.projectId}`;
      const existingApp = getApps().find(app => app.name === tenantAppName);
      const tenantApp = existingApp ? existingApp : initializeApp(targetFirebase, tenantAppName);
      
      // 3. Mit dem generierten JWT-Token im Frontend dynamisch einloggen
      const tenantAuth = getAuth(tenantApp);
      await signInWithCustomToken(tenantAuth, customToken);
      
      console.log(`✅ Erfolgreich über Custom Token in Ziel-Datenbank (${targetFirebase.projectId}) eingeloggt!`);
      // Ab hier hat der Tiptap Editor vollen Schreibzugriff!
      this.tenantReady.set(true);

    } catch (err) {
      console.error('❌ Setup für Tenant-Datenbank fehlgeschlagen:', err);
    }
  }

  onSave() {
    console.log('Speichere Content in Fremd-Datenbank...', this.content);
    // Hier folgt die Firebase Firestore Call für den aktiven "tenantApp"
  }

  onCancel() {
    console.log('Abgebrochen');
  }
}
