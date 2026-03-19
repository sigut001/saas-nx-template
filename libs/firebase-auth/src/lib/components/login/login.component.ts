import { Component, inject, signal, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AUTH_FEATURES, AuthFeatures, DEFAULT_AUTH_FEATURES } from '../../auth-module.config';

/**
 * LoginComponent – Fertige Login-UI mit E-Mail/Passwort + Google.
 * Standalone, kein Framework-Coupling, eigenes CSS.
 *
 * @example
 * // In der Route:
 * { path: '', loadComponent: () => import('@saas-base/firebase-auth').then(m => m.LoginComponent) }
 *
 * // Oder direkt in einer Wrapper-Komponente:
 * <lib-login [showRegisterLink]="true" [showForgotLink]="true" />
 */
@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Willkommen zurück</h1>
        <p class="auth-subtitle">Melde dich in deinem Konto an</p>
      </div>

      <!-- Error Banner -->
      @if (errorMessage()) {
        <div class="auth-error" role="alert">
          <span class="auth-error-icon">⚠</span>
          {{ errorMessage() }}
        </div>
      }

      <!-- E-Mail / Passwort Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

        <div class="form-field">
          <label class="form-label" for="email">E-Mail</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('email')"
            placeholder="name@beispiel.de"
            autocomplete="email"
          />
          @if (isFieldInvalid('email')) {
            <span class="form-error-text">
              {{ getEmailError() }}
            </span>
          }
        </div>

        <div class="form-field">
          <div class="form-label-row">
            <label class="form-label" for="password">Passwort</label>
            @if (features.passwordReset) {
              <a routerLink="/forgot-password" class="auth-link auth-link--sm">Vergessen?</a>
            }
          </div>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('password')"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          @if (isFieldInvalid('password')) {
            <span class="form-error-text">Bitte Passwort eingeben</span>
          }
        </div>

        <button
          type="submit"
          class="btn btn--primary"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="btn-spinner"></span>Anmelden…
          } @else {
            Anmelden
          }
        </button>
      </form>

      <!-- Divider -->
      <div class="auth-divider">
        <span class="auth-divider-text">oder</span>
      </div>

      <!-- Google Login -->
      @if (features.googleLogin) {
        <button
          type="button"
          class="btn btn--google"
          (click)="onGoogleLogin()"
          [disabled]="isLoading()"
        >
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Mit Google anmelden
        </button>
      }

      @if (features.publicSignup && !features.inviteOnly) {
        <p class="auth-footer-text">
          Noch kein Konto?
          <a routerLink="/register" class="auth-link">Registrieren</a>
        </p>
      }
    </div>
  `,
  styles: [`
    .auth-container { display: flex; flex-direction: column; gap: 1.25rem; }

    .auth-header { text-align: center; }
    .auth-title { font-size: 1.5rem; font-weight: 700; color: #e8e8f0; margin: 0 0 0.25rem; }
    .auth-subtitle { font-size: 0.875rem; color: #8b8ca8; margin: 0; }

    .auth-error {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5; border-radius: 8px; padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
    .auth-error-icon { font-size: 1rem; flex-shrink: 0; }

    .auth-form { display: flex; flex-direction: column; gap: 1rem; }

    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.875rem; font-weight: 500; color: #c4c4d4; }
    .form-label-row { display: flex; justify-content: space-between; align-items: center; }

    .form-input {
      width: 100%; padding: 0.625rem 0.875rem;
      background: #0f0f1a; border: 1px solid #2d2d4e;
      border-radius: 8px; color: #e8e8f0; font-size: 0.9375rem;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .form-input:focus { outline: none; border-color: #6c47ff; box-shadow: 0 0 0 3px rgba(108,71,255,0.2); }
    .form-input::placeholder { color: #4a4a6a; }
    .form-input--error { border-color: #ef4444; }
    .form-input--error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }

    .form-error-text { font-size: 0.8rem; color: #fca5a5; }

    .btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.7rem 1rem; border-radius: 8px; font-size: 0.9375rem;
      font-weight: 600; border: none; cursor: pointer;
      transition: opacity 0.15s, transform 0.1s; width: 100%;
    }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn:not(:disabled):hover { opacity: 0.9; }
    .btn:not(:disabled):active { transform: scale(0.98); }

    .btn--primary { background: #6c47ff; color: #fff; }
    .btn--google {
      background: #1c1e2e; color: #e8e8f0;
      border: 1px solid #2d2d4e;
    }
    .btn--google:not(:disabled):hover { background: #22243a; }

    .btn-spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .google-icon { flex-shrink: 0; }

    .auth-divider {
      display: flex; align-items: center; gap: 0.75rem;
    }
    .auth-divider::before, .auth-divider::after {
      content: ''; flex: 1; height: 1px; background: #2d2d4e;
    }
    .auth-divider-text { font-size: 0.8rem; color: #4a4a6a; white-space: nowrap; }

    .auth-footer-text { text-align: center; font-size: 0.875rem; color: #8b8ca8; margin: 0; }
    .auth-link { color: #6c47ff; text-decoration: none; font-weight: 500; }
    .auth-link:hover { text-decoration: underline; }
    .auth-link--sm { font-size: 0.8rem; }
  `]
})
export class LoginComponent {
  /** Auth-Features aus zentraler Config (AUTH_FEATURES Token) */
  readonly features: Required<AuthFeatures> = inject(AUTH_FEATURES, { optional: true }) ?? DEFAULT_AUTH_FEATURES;

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getEmailError(): string {
    const ctrl = this.form.get('email');
    if (ctrl?.errors?.['required']) return 'E-Mail ist erforderlich';
    if (ctrl?.errors?.['email']) return 'Bitte eine gültige E-Mail eingeben';
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { email, password } = this.form.value;
      await this.authService.loginWithEmail(email!, password!);
    } catch (err: any) {
      this.errorMessage.set(this.mapFirebaseError(err?.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.loginWithGoogle();
    } catch (err: any) {
      this.errorMessage.set(this.mapFirebaseError(err?.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  private mapFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
      'auth/wrong-password': 'Falsches Passwort.',
      'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
      'auth/too-many-requests': 'Zu viele Versuche. Bitte warte kurz.',
      'auth/user-disabled': 'Dieses Konto wurde deaktiviert.',
      'auth/popup-closed-by-user': 'Anmeldung abgebrochen.',
      'auth/network-request-failed': 'Keine Internetverbindung.',
    };
    return errors[code] ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
  }
}
