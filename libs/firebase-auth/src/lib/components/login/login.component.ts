import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, AUTH_FEATURES, AuthFeatures, DEFAULT_AUTH_FEATURES } from '@saas-base/auth-core';

// NG-ZORRO Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

/**
 * LoginComponent – Fertige Login-UI mit E-Mail/Passwort + Google.
 * Nutzt NG-ZORRO für professionelles Design.
 */
@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzIconModule,
    NzDividerModule
  ],
  template: `
    <div class="login-wrapper">
      <div class="login-header">
        <h2>Willkommen zurück</h2>
        <p>Melde dich in deinem Konto an</p>
      </div>

      <nz-alert
        *ngIf="errorMessage()"
        nzType="error"
        [nzMessage]="errorMessage()"
        nzShowIcon
        class="auth-alert"
      ></nz-alert>

      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label nzRequired nzFor="email">E-Mail</nz-form-label>
          <nz-form-control [nzErrorTip]="emailErrorTpl">
            <nz-input-group nzPrefixIcon="mail">
              <input type="email" nz-input formControlName="email" placeholder="name@beispiel.de" />
            </nz-input-group>
            <ng-template #emailErrorTpl let-control>
              <ng-container *ngIf="control.hasError('email')">Bitte eine gültige E-Mail eingeben</ng-container>
              <ng-container *ngIf="control.hasError('required')">E-Mail ist erforderlich</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired nzFor="password">Passwort</nz-form-label>
          <nz-form-control nzErrorTip="Bitte Passwort eingeben">
            <nz-input-group nzPrefixIcon="lock" [nzSuffix]="suffixTemplate">
              <input
                [type]="passwordVisible ? 'text' : 'password'"
                nz-input
                formControlName="password"
                placeholder="Passwort"
              />
            </nz-input-group>
            <ng-template #suffixTemplate>
              <span
                nz-icon
                [nzType]="passwordVisible ? 'eye-invisible' : 'eye'"
                (click)="passwordVisible = !passwordVisible"
              ></span>
            </ng-template>
          </nz-form-control>
          <div class="forgot-password-link" *ngIf="features.passwordReset">
            <a routerLink="/forgot-password">Passwort vergessen?</a>
          </div>
        </nz-form-item>

        <button
          nz-button
          nzType="primary"
          nzBlock
          [nzLoading]="isLoading()"
          class="login-button"
        >
          Anmelden
        </button>
      </form>

      <div class="google-login-section" *ngIf="features.googleLogin">
        <nz-divider nzText="oder"></nz-divider>
        <button
          nz-button
          nzBlock
          (click)="onGoogleLogin()"
          [disabled]="isLoading()"
          class="google-button"
        >
          <span nz-icon nzType="google"></span>
          Mit Google anmelden
        </button>
      </div>

      <div class="auth-footer" *ngIf="features.publicSignup && !features.inviteOnly">
        Noch kein Konto? <a routerLink="/register">Registrieren</a>
      </div>
    </div>
  `,
  styles: [`
    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .login-header h2 {
      margin-bottom: 8px;
      font-weight: 600;
    }
    .login-header p {
      color: var(--text-secondary);
    }
    .auth-alert {
      margin-bottom: 24px;
    }
    .forgot-password-link {
      text-align: right;
      margin-top: 4px;
      font-size: 13px;
    }
    .login-button {
      height: 40px;
      font-size: 15px;
      font-weight: 500;
    }
    .google-button {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      color: var(--text-secondary);
    }
    .auth-footer a {
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  readonly features: Required<AuthFeatures> = inject(AUTH_FEATURES, { optional: true }) ?? DEFAULT_AUTH_FEATURES;
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  passwordVisible = false;

  readonly form = this.fb.group({
    email: ['testkunde@qubits.de', [Validators.required, Validators.email]],
    password: ['TestPassword123!', Validators.required],
  });

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
