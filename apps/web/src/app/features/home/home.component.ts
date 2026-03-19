import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '@saas-base/firebase-auth';
import { AuthService } from '@saas-base/firebase-auth';

/**
 * Öffentliche Test/Landing-Seite
 * Zeigt Auth-Status und ermöglicht Login/Logout zum Testen.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">

      <header class="home-header">
        <h1 class="home-title">🚀 SaaS Base Template</h1>
        <p class="home-subtitle">Firebase Auth Module – Test & Demo</p>
      </header>

      <!-- Auth Status Card -->
      <div class="status-card" [class.status-card--authed]="authState.isAuthenticated()">
        <div class="status-indicator">
          <span class="status-dot" [class.status-dot--active]="authState.isAuthenticated()"></span>
          <span class="status-label">
            {{ authState.isAuthenticated() ? 'Eingeloggt' : 'Nicht eingeloggt' }}
          </span>
        </div>

        @if (authState.isAuthenticated()) {
          <div class="debug-info">
            <h3 class="debug-title">🔐 Auth Debug Info</h3>
            <table class="debug-table">
              <tr>
                <td class="debug-key">UID</td>
                <td class="debug-value">{{ authState.uid() }}</td>
              </tr>
              <tr>
                <td class="debug-key">Name</td>
                <td class="debug-value">{{ authState.displayName() ?? '–' }}</td>
              </tr>
              <tr>
                <td class="debug-key">E-Mail verifiziert</td>
                <td class="debug-value">{{ authState.isEmailVerified() ? '✅ Ja' : '❌ Nein' }}</td>
              </tr>
              <tr>
                <td class="debug-key">Rolle</td>
                <td class="debug-value">{{ authState.role() }}</td>
              </tr>
              <tr>
                <td class="debug-key">Avatar</td>
                <td class="debug-value">
                  @if (authState.photoURL()) {
                    <img [src]="authState.photoURL()!" class="debug-avatar" alt="Avatar" />
                  } @else {
                    –
                  }
                </td>
              </tr>
            </table>
          </div>
        }
      </div>

      <!-- Action Buttons -->
      <div class="action-row">
        @if (!authState.isAuthenticated()) {
          <a routerLink="/login" class="btn btn--primary">🔑 Login</a>
          <a routerLink="/register" class="btn btn--outline">📝 Registrieren</a>
        } @else {
          <a routerLink="/app/dashboard" class="btn btn--primary">📊 Zum Dashboard</a>
          <button class="btn btn--danger" (click)="logout()">🚪 Logout</button>
        }
      </div>

      <!-- Quick Nav -->
      <div class="quick-nav">
        <h3 class="quick-nav-title">Quick-Links zum Testen</h3>
        <div class="quick-nav-links">
          <a routerLink="/login" class="nav-chip">/login</a>
          <a routerLink="/register" class="nav-chip">/register</a>
          <a routerLink="/forgot-password" class="nav-chip">/forgot-password</a>
          <a routerLink="/app/dashboard" class="nav-chip">/app/dashboard (Guard)</a>
          <a routerLink="/admin/users" class="nav-chip">/admin/users (Admin Guard)</a>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
      background: #0f0f1a;
      color: #e8e8f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1.5rem;
      gap: 2rem;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .home-header { text-align: center; }
    .home-title { font-size: 2rem; font-weight: 800; margin: 0 0 0.5rem; }
    .home-subtitle { color: #8b8ca8; margin: 0; font-size: 1rem; }

    /* Status Card */
    .status-card {
      width: 100%;
      max-width: 560px;
      background: #1c1e2e;
      border: 1px solid #2d2d4e;
      border-radius: 16px;
      padding: 1.5rem;
      transition: border-color 0.3s;
    }
    .status-card--authed {
      border-color: #22c55e;
      box-shadow: 0 0 0 1px rgba(34,197,94,0.2);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .status-dot {
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #4a4a6a;
      transition: background 0.3s;
    }
    .status-dot--active { background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,0.6); }
    .status-label { font-weight: 600; font-size: 1rem; }

    .debug-title { font-size: 0.9rem; color: #8b8ca8; margin: 0 0 0.75rem; font-weight: 600; }
    .debug-table { width: 100%; border-collapse: collapse; }
    .debug-table tr { border-bottom: 1px solid #2d2d4e; }
    .debug-table tr:last-child { border-bottom: none; }
    .debug-key {
      padding: 0.5rem 0.75rem 0.5rem 0;
      color: #8b8ca8;
      font-size: 0.8rem;
      font-weight: 500;
      width: 140px;
      vertical-align: middle;
    }
    .debug-value {
      padding: 0.5rem 0;
      font-size: 0.85rem;
      color: #e8e8f0;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }
    .debug-avatar { width: 32px; height: 32px; border-radius: 50%; }

    /* Buttons */
    .action-row { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .btn {
      padding: 0.7rem 1.5rem;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.15s, transform 0.1s;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .btn:hover { opacity: 0.85; }
    .btn:active { transform: scale(0.97); }
    .btn--primary { background: #6c47ff; color: #fff; }
    .btn--outline { background: transparent; color: #6c47ff; border: 1.5px solid #6c47ff; }
    .btn--danger { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

    /* Quick Nav */
    .quick-nav { width: 100%; max-width: 560px; }
    .quick-nav-title { font-size: 0.8rem; color: #4a4a6a; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .quick-nav-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .nav-chip {
      background: #1c1e2e;
      border: 1px solid #2d2d4e;
      color: #6c47ff;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      text-decoration: none;
      font-family: monospace;
      transition: border-color 0.15s, background 0.15s;
    }
    .nav-chip:hover { border-color: #6c47ff; background: rgba(108,71,255,0.08); }
  `]
})
export class HomeComponent {
  readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
