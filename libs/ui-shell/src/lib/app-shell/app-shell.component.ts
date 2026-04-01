import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { AuthService, AuthStateService } from '@saas-base/auth-core';
import { UI_SHELL_CONFIG, UiShellConfig, UiShellFeatureConfig } from '../ui-shell.config';
import { CmsDataService } from '@saas-base/content-management-system';
import { analyticsManifest } from '@saas-base/analytics';
import { documentsManifest } from '@saas-base/documents';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  featureKey?: keyof UiShellFeatureConfig;
  hideIfFeature?: keyof UiShellFeatureConfig;
  category: 'business' | 'system';
  children?: NavItem[];
}

@Component({
  selector: 'lib-app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
    NzBreadCrumbModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzBreakpoint="lg"
        nzCollapsible
        [(nzCollapsed)]="isCollapsed"
        [nzWidth]="256"
        [nzTrigger]="null"
      >
        <div class="sidebar-logo" [class.collapsed]="isCollapsed()">
          <img [src]="config.logoUrl" alt="Qubits Digital" *ngIf="config.logoUrl" />
        </div>
        
        <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed()" class="nav-menu">
          
          <!-- Business Logic Links -->
          <ng-container *ngFor="let item of businessNavItems">
            <li nz-menu-item nzMatchRouter *ngIf="item.route && hasFeature(item.featureKey) && !hideFeature(item.hideIfFeature)">
              <a [routerLink]="item.route">
                <span nz-icon [nzType]="item.icon"></span>
                <span>{{ item.label }}</span>
              </a>
            </li>
            <li nz-submenu [nzTitle]="item.label" [nzIcon]="item.icon" *ngIf="item.children && hasFeature(item.featureKey) && !hideFeature(item.hideIfFeature)">
              <ul>
                <li nz-menu-item nzMatchRouter *ngFor="let child of item.children">
                  <a [routerLink]="child.route">{{ child.label }}</a>
                </li>
              </ul>
            </li>
          </ng-container>

          <div class="nav-spacer"></div>

          <!-- System Features (Unten angeheftet) -->
          <ng-container *ngFor="let item of systemNavItems">
            <li nz-menu-item nzMatchRouter *ngIf="item.route && hasFeature(item.featureKey) && !hideFeature(item.hideIfFeature)">
              <a [routerLink]="item.route">
                <span nz-icon [nzType]="item.icon"></span>
                <span>{{ item.label }}</span>
              </a>
            </li>
            <li nz-submenu [nzTitle]="item.label" [nzIcon]="item.icon" *ngIf="item.children && hasFeature(item.featureKey) && !hideFeature(item.hideIfFeature)">
              <ul>
                <li nz-menu-item nzMatchRouter *ngFor="let child of item.children">
                  <a [routerLink]="child.route">{{ child.label }}</a>
                </li>
              </ul>
            </li>
          </ng-container>

        </ul>
      </nz-sider>
      
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="toggleCollapsed()" (keydown.enter)="toggleCollapsed()" tabindex="0" role="button">
              <span nz-icon [nzType]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"></span>
            </span>
            
            <div class="header-right" *ngIf="config.features.authEnabled">
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item routerLink="/app/account">
                    <span nz-icon nzType="user"></span>
                    Account
                  </li>
                  <li nz-menu-divider></li>
                  <li nz-menu-item (click)="logout()" (keydown.enter)="logout()" tabindex="0">
                    <span nz-icon nzType="logout"></span>
                    Logout
                  </li>
                </ul>
              </nz-dropdown-menu>

              <button nz-button nzType="text" nz-dropdown [nzDropdownMenu]="menu">
                <nz-avatar nzIcon="user" [nzSrc]="authState.currentUser()?.photoURL || ''"></nz-avatar>
                <span class="username" *ngIf="authState.currentUser()?.displayName">
                  {{ authState.currentUser()?.displayName }}
                </span>
                <span nz-icon nzType="down"></span>
              </button>
            </div>
          </div>
        </nz-header>
        
        <nz-content>
          <div class="inner-content">
            <nz-breadcrumb class="app-breadcrumb">
              <nz-breadcrumb-item>App</nz-breadcrumb-item>
              <nz-breadcrumb-item>Current Page</nz-breadcrumb-item>
            </nz-breadcrumb>
            
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      height: 100vh;
      overflow: hidden;
    }

    .menu-sidebar {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    }

    .sidebar-logo {
      position: relative;
      height: 64px;
      padding: 8px 16px;
      overflow: hidden;
      background: #001529;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .sidebar-logo img {
      display: inline-block;
      max-height: 48px;
      max-width: 100%;
      height: auto;
      object-fit: contain;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    nz-header {
      padding: 0;
      width: 100%;
      z-index: 2;
      flex-shrink: 0;
    }

    .app-header {
      position: relative;
      height: 64px;
      padding: 0;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-trigger {
      height: 64px;
      padding: 0 24px;
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .header-trigger:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .header-right {
      padding-right: 24px;
      display: flex;
      align-items: center;
    }

    .username {
      margin: 0 8px;
      color: var(--text-main);
    }

    nz-content {
      overflow-y: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .inner-content {
      padding: 24px;
      background: #f0f2f5;
      flex-grow: 1;
      height: 100%;
    }

    .app-breadcrumb {
      margin-bottom: 16px;
    }

    [nz-menu] {
      line-height: 48px;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px); /* Subtract logo height */
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-spacer {
      flex-grow: 1;
      min-height: 24px;
    }
  `]
})
export class AppShellComponent {
  isCollapsed = signal(false);
  config = inject<UiShellConfig>(UI_SHELL_CONFIG);

  private readonly auth = inject(AuthService);
  readonly authState = inject(AuthStateService);
  
  // Eager Loading: Da der App-Shell direkt beim Rendern des Dashboards instanziiert wird,
  // zieht er den CmsDataService mit hoch. Dieser prüft selbst, ob ein target-firebase existiert
  // und lädt im Hintergrund direkt alle Collections und Seiten, bevor der User überhaupt auf /cms klickt.
  private readonly _cmsPreload = inject(CmsDataService);

  // --- Dynamic Navigation ---
  readonly APP_NAVIGATION: NavItem[] = [
    // Business Features (Top)
    { label: 'CMS', icon: 'file-text', route: '/app/cms', category: 'business' },
    { label: analyticsManifest.label, icon: analyticsManifest.icon, route: `/app/${analyticsManifest.route}`, category: 'business' },
    { label: documentsManifest.label, icon: documentsManifest.icon, route: `/app/${documentsManifest.route}`, category: 'business' },
    
    // System Features (Bottom)
    { 
      label: 'Organization', 
      icon: 'team', 
      featureKey: 'multiOrganization', 
      category: 'system',
      children: [
        { label: 'Team', icon: '', route: '/app/organization', category: 'system' },
        { label: 'Billing', icon: '', route: '/app/billing', category: 'system' }
      ]
    },
    { label: 'Billing', icon: 'credit-card', route: '/app/billing', hideIfFeature: 'multiOrganization', category: 'system' },
    { label: 'Settings', icon: 'setting', route: '/app/settings', category: 'system' }
  ];

  get businessNavItems() {
    return this.APP_NAVIGATION.filter(item => item.category === 'business');
  }

  get systemNavItems() {
    return this.APP_NAVIGATION.filter(item => item.category === 'system');
  }

  hasFeature(featureKey?: keyof UiShellConfig['features']): boolean {
    if (!featureKey) return true; // Always show if no feature is bound
    return !!this.config.features[featureKey];
  }

  hideFeature(featureKey?: keyof UiShellConfig['features']): boolean {
    if (!featureKey) return false;
    return !!this.config.features[featureKey];
  }

  toggleCollapsed(): void {
    this.isCollapsed.update(val => !val);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
  }
}
