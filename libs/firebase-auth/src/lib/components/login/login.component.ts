import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, AUTH_FEATURES, AuthFeatures, DEFAULT_AUTH_FEATURES } from '@saas-base/auth-core';

// NG-ZORRO
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthDebugComponent } from '../debug/auth-debug.component';

/**
 * LoginComponent – Premium SaaS Split-Screen UI
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
    AuthDebugComponent
  ],
  template: `
    <div class="split-layout">
      <!-- Left: Form Container -->
      <div class="form-side">
        <div class="form-content">
          <div class="login-header">
            <div class="brand-logo">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                 <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
            </div>
            <h2>Willkommen zurück</h2>
            <p>Melde dich an, um in dein Dashboard zu gelangen.</p>
          </div>

          <nz-alert
            *ngIf="errorMessage()"
            nzType="error"
            [nzMessage]="errorMessage()"
            nzShowIcon
            class="auth-alert"
          ></nz-alert>

          <!-- Email/Password Login Option -->
          <ng-container *ngIf="features.emailLogin">
            <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()" nzLayout="vertical">
              <nz-form-item>
                <nz-form-label nzRequired nzFor="email">E-Mail Adresse</nz-form-label>
                <nz-form-control [nzErrorTip]="emailErrorTpl">
                  <nz-input-group nzPrefixIcon="mail" nzSize="large" class="premium-input">
                    <input type="email" nz-input formControlName="email" placeholder="name@firma.de" />
                  </nz-input-group>
                  <ng-template #emailErrorTpl let-control>
                    <ng-container *ngIf="control.hasError('email')">Bitte ein gültiges E-Mail-Format eingeben</ng-container>
                    <ng-container *ngIf="control.hasError('required')">Dieses Feld ist erforderlich</ng-container>
                  </ng-template>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label nzRequired nzFor="password">Passwort</nz-form-label>
                <nz-form-control nzErrorTip="Bitte Passwort eingeben">
                  <nz-input-group nzPrefixIcon="lock" [nzSuffix]="suffixTemplate" nzSize="large" class="premium-input">
                    <input
                      [type]="passwordVisible ? 'text' : 'password'"
                      nz-input
                      formControlName="password"
                      placeholder="Dein sicheres Passwort"
                    />
                  </nz-input-group>
                  <ng-template #suffixTemplate>
                    <span
                      nz-icon
                      [nzType]="passwordVisible ? 'eye-invisible' : 'eye'"
                      (click)="passwordVisible = !passwordVisible"
                      class="cursor-pointer"
                    ></span>
                  </ng-template>
                </nz-form-control>
                <div class="forgot-wrapper" *ngIf="features.passwordReset">
                  <a routerLink="/forgot-password" class="forgot-link">Passwort vergessen?</a>
                </div>
              </nz-form-item>

              <button
                nz-button
                nzType="primary"
                nzSize="large"
                nzBlock
                [nzLoading]="isLoading()"
                class="login-button"
              >
                Konto anmelden
              </button>
            </form>
          </ng-container>

          <!-- Google Login Option -->
          <ng-container *ngIf="features.googleLogin">
            <div class="divider" *ngIf="features.emailLogin">
              <span>oder fortfahren mit</span>
            </div>

            <button
              nz-button
              nzSize="large"
              nzBlock
              (click)="onGoogleLogin()"
              [disabled]="isLoading()"
              class="google-button"
              [ngClass]="{'only-google-button': !features.emailLogin}"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.56V20.31H19.28C21.36 18.4 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.31L15.72 17.56C14.73 18.22 13.46 18.63 12 18.63C9.17 18.63 6.77 16.72 5.9 14.16H2.23V17.01C4.04 20.59 7.72 23 12 23Z" fill="#34A853"/>
                <path d="M5.9 14.16C5.67 13.5 5.55 12.77 5.55 12C5.55 11.23 5.68 10.5 5.9 9.84V6.99H2.23C1.48 8.48 1.05 10.18 1.05 12C1.05 13.82 1.48 15.52 2.23 17.01L5.9 14.16Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.45 2.09 14.97 1 12 1C7.72 1 4.04 3.41 2.23 6.99L5.9 9.84C6.77 7.28 9.17 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              <span>Mit Google anmelden</span>
            </button>
            <p class="auth-notice" *ngIf="!features.emailLogin">
              Der Login ist exklusiv über ein autorisiertes Google-Konto möglich.
            </p>
          </ng-container>

          <p class="auth-footer" *ngIf="features.publicSignup && !features.inviteOnly">
            Du hast noch keinen Zugang? <a routerLink="/register">Jetzt registrieren</a>
          </p>
        </div>
      </div>
      
      <!-- Right: Hero Container -->
      <div class="hero-side">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Dein Business im Überblick</h1>
          <p>Verwalte Web-Inhalte, analysiere Performance und generiere mehr Leads aus einer zentralen Plattform.</p>
        </div>
      </div>
    </div>
    
    <!-- DEBUG PANEL -->
    <saas-base-auth-debug
      [user]="debugUser()"
      [error]="errorMessage()"
    ></saas-base-auth-debug>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
    }
    
    .split-layout {
      display: flex;
      height: 100vh;
      width: 100%;
    }

    /* Left Side Form */
    .form-side {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      height: 100%;
    }

    .form-content {
      width: 100%;
      max-width: 420px;
      padding: 0 2rem;
    }

    .brand-logo {
      color: #000;
      margin-bottom: 2rem;
    }

    .login-header {
      margin-bottom: 2.5rem;
    }

    .login-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #111;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .login-header p {
      color: #666;
      font-size: 1rem;
    }

    .premium-input input {
      padding: 0.5rem 0.2rem;
    }

    .forgot-wrapper {
      text-align: right;
      margin-top: 0.5rem;
    }

    .forgot-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: #0070f3;
      text-decoration: none;
    }
    
    .forgot-link:hover { text-decoration: underline; }

    .login-button {
      background: #111;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 1rem;
      margin-top: 1rem;
      transition: all 0.2s ease;
    }
    .login-button:hover {
      background: #333;
      transform: translateY(-1px);
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 2rem 0;
      color: #888;
      font-size: 0.875rem;
    }
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #eaeaea;
    }
    .divider span { padding: 0 1rem; }

    /* Google Button */
    .google-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      border-radius: 8px;
      border: 1px solid #eaeaea;
      color: #333;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #fff;
    }
    .google-button:hover {
      background: #fafafa;
      border-color: #ddd;
    }
    
    .only-google-button {
      margin-top: 2rem;
    }
    .auth-notice {
      text-align: center;
      margin-top: 1rem;
      color: #666;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: #666;
      font-size: 0.9rem;
    }
    .auth-footer a { color: #0070f3; font-weight: 500; }

    /* Right Side Hero (Responsive) */
    .hero-side {
      display: none;
      flex: 1.2;
      position: relative;
      background-image: url('https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2670&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      overflow: hidden;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,40,0.7) 100%);
      backdrop-filter: blur(2px);
    }
    .hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding: 4rem 15%;
      color: white;
    }
    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .hero-content p {
      font-size: 1.25rem;
      color: #d1d5db;
      line-height: 1.6;
      max-width: 450px;
    }
    
    .cursor-pointer { cursor: pointer; }

    /* Responsive */
    @media (min-width: 1024px) {
      .hero-side { display: block; }
    }
  `]
})
export class LoginComponent {
  readonly features: Required<AuthFeatures> = inject(AUTH_FEATURES, { optional: true }) ?? DEFAULT_AUTH_FEATURES;
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly debugUser = signal<any>(null);
  passwordVisible = false;

  constructor() {
    // Einfacher Auto-Refresh für das Debug-Panel
    setInterval(() => {
      this.debugUser.set(this.authService.currentUser);
    }, 1000);
  }

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
      'auth/invite-only': 'Zugriff verweigert. Dein Account ist nicht als Mandant hinterlegt.',
    };
    return errors[code] ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
  }
}
