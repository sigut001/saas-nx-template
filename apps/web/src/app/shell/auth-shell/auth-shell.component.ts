import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SAAS_CONFIG } from '../../saas.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzCardModule],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-header">
          <img [src]="config.logoUrl" alt="logo" class="logo" *ngIf="config.logoUrl" />
          <h1 class="app-name">{{ config.appName }}</h1>
          <p class="tagline">{{ config.appTagline }}</p>
        </div>
        
        <nz-card class="auth-card" [nzBordered]="false">
          <router-outlet />
        </nz-card>
        
        <div class="auth-footer">
          &copy; {{ currentYear }} {{ config.appName }}. All rights reserved.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f0f2f5;
      padding: 24px;
    }

    .auth-content {
      width: 100%;
      max-width: 400px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      height: 44px;
      margin-bottom: 16px;
    }

    .app-name {
      font-size: 33px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin: 0;
    }

    .tagline {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 12px;
    }

    .auth-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
    }

    .auth-footer {
      margin-top: 48px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  `]
})
export class AuthShellComponent {
  config = SAAS_CONFIG;
  currentYear = new Date().getFullYear();
}
