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
import { AuthService, AuthStateService } from '@saas-base/firebase-auth';
import { SAAS_CONFIG } from '../../saas.config';

@Component({
  selector: 'app-shell',
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
        <div class="sidebar-logo">
          <img [src]="config.logoUrl" alt="logo" *ngIf="config.logoUrl" />
          <span *ngIf="!isCollapsed()">{{ config.appName }}</span>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed()">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/app/dashboard">
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </a>
          </li>
          
          <li nz-submenu nzTitle="Organization" nzIcon="team" *ngIf="config.features.multiOrganization">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/app/organization">Team</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/app/billing">Billing</a>
              </li>
            </ul>
          </li>

          <li nz-menu-item nzMatchRouter *ngIf="!config.features.multiOrganization">
            <a routerLink="/app/billing">
              <span nz-icon nzType="credit-card"></span>
              <span>Billing</span>
            </a>
          </li>

          <li nz-menu-item nzMatchRouter>
            <a routerLink="/app/settings">
              <span nz-icon nzType="setting"></span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="toggleCollapsed()">
              <span nz-icon [nzType]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"></span>
            </span>
            
            <div class="header-right">
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item routerLink="/app/account">
                    <span nz-icon nzType="user"></span>
                    Account
                  </li>
                  <li nz-menu-divider></li>
                  <li nz-menu-item (click)="logout()">
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
      padding-left: 24px;
      overflow: hidden;
      line-height: 64px;
      background: #001529;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar-logo img {
      display: inline-block;
      height: 32px;
      vertical-align: middle;
    }

    .sidebar-logo span {
      display: inline-block;
      margin: 0 0 0 12px;
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    nz-header {
      padding: 0;
      width: 100%;
      z-index: 2;
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

    .inner-content {
      padding: 24px;
      background: #f0f2f5;
      min-height: calc(100vh - 64px);
    }

    .app-breadcrumb {
      margin-bottom: 16px;
    }

    [nz-menu] {
      line-height: 48px;
    }
  `]
})
export class AppShellComponent {
  isCollapsed = signal(false);
  config = SAAS_CONFIG;

  private readonly auth = inject(AuthService);
  readonly authState = inject(AuthStateService);

  toggleCollapsed(): void {
    this.isCollapsed.update(val => !val);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
  }
}
