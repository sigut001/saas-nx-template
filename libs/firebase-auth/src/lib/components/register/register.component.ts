import { Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Konto erstellen</h1>
        <p class="auth-subtitle">Registriere dich kostenlos</p>
      </div>

      <!-- Success Banner -->
      @if (successMessage()) {
        <div class="auth-success" role="status">
          <span>✉</span> {{ successMessage() }}
        </div>
      }

      <!-- Error Banner -->
      @if (errorMessage()) {
        <div class="auth-error" role="alert">
          <span>⚠</span> {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

        <div class="form-field">
          <label class="form-label" for="displayName">Name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('displayName')"
            placeholder="Max Mustermann"
            autocomplete="name"
          />
        </div>

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

        <div class="form-field">
          <label class="form-label" for="password">Passwort</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('password')"
            placeholder="Mindestens 8 Zeichen"
            autocomplete="new-password"
          />
          @if (isFieldInvalid('password')) {
            <span class="form-error-text">Mindestens 8 Zeichen</span>
          }
        </div>

        <div class="form-field">
          <label class="form-label" for="confirmPassword">Passwort bestätigen</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('confirmPassword') || form.errors?.['passwordMismatch']"
            placeholder="••••••••"
            autocomplete="new-password"
          />
          @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched) {
            <span class="form-error-text">Passwörter stimmen nicht überein</span>
          }
        </div>

        <button
          type="submit"
          class="btn btn--primary"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="btn-spinner"></span>Registrieren…
          } @else {
            Konto erstellen
          }
        </button>
      </form>

      @if (showLoginLink) {
        <p class="auth-footer-text">
          Bereits Konto?
          <a routerLink="/login" class="auth-link">Anmelden</a>
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
    .btn:not(:disabled):active { transform: scale(0.98); }
    .btn--primary { background: #6c47ff; color: #fff; }

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
export class RegisterComponent {
  @Input() showLoginLink = true;

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

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
    this.successMessage.set(null);

    try {
      const { email, password, displayName } = this.form.value;
      await this.authService.register(email!, password!, displayName || undefined);
      this.successMessage.set(
        'Registrierung erfolgreich! Bitte prüfe deine E-Mails und bestätige dein Konto.'
      );
      this.form.reset();
    } catch (err: any) {
      this.errorMessage.set(this.mapFirebaseError(err?.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  private mapFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'Diese E-Mail-Adresse ist bereits registriert.',
      'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
      'auth/weak-password': 'Passwort zu schwach. Mindestens 8 Zeichen.',
      'auth/network-request-failed': 'Keine Internetverbindung.',
    };
    return errors[code] ?? 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
  }
}
