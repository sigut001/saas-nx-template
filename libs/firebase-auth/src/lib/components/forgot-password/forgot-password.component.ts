import { Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'lib-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Passwort zurücksetzen</h1>
        <p class="auth-subtitle">
          Gib deine E-Mail ein – wir senden dir einen Reset-Link.
        </p>
      </div>

      @if (successMessage()) {
        <div class="auth-success" role="status">
          <span>✉</span> {{ successMessage() }}
        </div>
        <a routerLink="/login" class="btn btn--secondary">Zurück zum Login</a>
      } @else {

        @if (errorMessage()) {
          <div class="auth-error" role="alert">
            <span>⚠</span> {{ errorMessage() }}
          </div>
        }

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
              <span class="form-error-text">Bitte eine gültige E-Mail eingeben</span>
            }
          </div>

          <button type="submit" class="btn btn--primary" [disabled]="isLoading()">
            @if (isLoading()) {
              <span class="btn-spinner"></span>Senden…
            } @else {
              Reset-Link senden
            }
          </button>
        </form>

        @if (showLoginLink) {
          <p class="auth-footer-text">
            <a routerLink="/login" class="auth-link">← Zurück zum Login</a>
          </p>
        }
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
      color: #fca5a5; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.875rem;
    }
    .auth-success {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3);
      color: #86efac; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.875rem;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.875rem; font-weight: 500; color: #c4c4d4; }
    .form-input {
      width: 100%; padding: 0.625rem 0.875rem; background: #0f0f1a;
      border: 1px solid #2d2d4e; border-radius: 8px; color: #e8e8f0;
      font-size: 0.9375rem; transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .form-input:focus { outline: none; border-color: #6c47ff; box-shadow: 0 0 0 3px rgba(108,71,255,0.2); }
    .form-input::placeholder { color: #4a4a6a; }
    .form-input--error { border-color: #ef4444; }
    .form-error-text { font-size: 0.8rem; color: #fca5a5; }
    .btn {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.7rem 1rem; border-radius: 8px; font-size: 0.9375rem;
      font-weight: 600; border: none; cursor: pointer;
      transition: opacity 0.15s, transform 0.1s; width: 100%;
    }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn:not(:disabled):hover { opacity: 0.9; }
    .btn--primary { background: #6c47ff; color: #fff; }
    .btn--secondary {
      background: transparent; color: #6c47ff;
      border: 1px solid #6c47ff; text-decoration: none;
    }
    .btn-spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-footer-text { text-align: center; font-size: 0.875rem; color: #8b8ca8; margin: 0; }
    .auth-link { color: #6c47ff; text-decoration: none; font-weight: 500; }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class ForgotPasswordComponent {
  @Input() showLoginLink = true;

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.sendPasswordReset(this.form.value.email!);
      this.successMessage.set(
        'E-Mail gesendet! Prüfe deinen Posteingang und folge dem Link.'
      );
    } catch (err: any) {
      const msg =
        err?.code === 'auth/user-not-found'
          ? 'Kein Konto mit dieser E-Mail gefunden.'
          : 'Fehler beim Senden. Bitte versuche es erneut.';
      this.errorMessage.set(msg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
