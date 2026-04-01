import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { AuthService } from '@saas-base/auth-core';
import { CmsDataService } from '@saas-base/content-management-system';
import { UI_SHELL_CONFIG, UiShellConfig } from '../ui-shell.config';

@Component({
  selector: 'lib-admin-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  template: `
    <nz-layout class="admin-layout">
      <nz-sider
        class="admin-sidebar"
        nzCollapsible
        [(nzCollapsed)]="isCollapsed"
        [nzWidth]="240"
        [nzTrigger]="null"
      >
        <div class="admin-logo">
          <span nz-icon nzType="setting" [nzSpin]="true"></span>
          <span *ngIf="!isCollapsed()">Admin Panel</span>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed()">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/admin/users">
              <span nz-icon nzType="team"></span>
              <span>Users</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/admin/organizations">
              <span nz-icon nzType="global"></span>
              <span>Organizations</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/admin/flags">
              <span nz-icon nzType="flag"></span>
              <span>Feature Flags</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/admin/stats">
              <span nz-icon nzType="line-chart"></span>
              <span>System Stats</span>
            </a>
          </li>
          <li nz-menu-divider></li>
          <li nz-menu-item>
            <a routerLink="/app/dashboard">
              <span nz-icon nzType="arrow-left"></span>
              <span>Back to App</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      
      <nz-layout>
        <nz-header>
          <div class="admin-header">
            <span class="header-trigger" (click)="toggleCollapsed()" (keydown.enter)="toggleCollapsed()" tabindex="0" role="button">
              <span nz-icon [nzType]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"></span>
            </span>
            
            <div class="header-right" *ngIf="config.features.authEnabled">
              <button nz-button nzType="text" (click)="logout()">
                <span nz-icon nzType="logout"></span>
                Logout
              </button>
            </div>
          </div>
        </nz-header>
        
        <nz-content>
          <div class="admin-inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .admin-layout { height: 100vh; }
    
    .admin-sidebar {
      background: #001529;
      box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    }

    .admin-logo {
      height: 64px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      background: #002140;
    }

    .admin-header {
      background: #fff;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .header-trigger {
      height: 64px;
      padding: 0 24px;
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .header-trigger:hover { background: rgba(0, 0, 0, 0.025); }

    .header-right { padding-right: 24px; }

    .admin-inner-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: #f0f2f5;
    }
  `]
})
export class AdminShellComponent {
  isCollapsed = signal(false);
  config = inject<UiShellConfig>(UI_SHELL_CONFIG);

  private readonly auth = inject(AuthService);
  private readonly _cmsPreload = inject(CmsDataService);

  toggleCollapsed(): void {
    this.isCollapsed.update(val => !val);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
  }
}
