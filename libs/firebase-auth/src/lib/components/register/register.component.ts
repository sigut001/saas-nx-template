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
import { AuthService } from '@saas-base/auth-core';

// NG-ZORRO Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzIconModule
  ],
  template: `
    <div class="register-wrapper">
      <div class="register-header">
        <h2>Konto erstellen</h2>
        <p>Registriere dich kostenlos</p>
      </div>

      <nz-alert
        *ngIf="successMessage()"
        nzType="success"
        [nzMessage]="successMessage()"
        nzShowIcon
        class="auth-alert"
      ></nz-alert>

      <nz-alert
        *ngIf="errorMessage()"
        nzType="error"
        [nzMessage]="errorMessage()"
        nzShowIcon
        class="auth-alert"
      ></nz-alert>

      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label nzFor="displayName">Name</nz-form-label>
          <nz-form-control>
            <nz-input-group nzPrefixIcon="user">
              <input type="text" nz-input formControlName="displayName" placeholder="Max Mustermann" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

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
          <nz-form-control [nzErrorTip]="passwordErrorTpl">
            <nz-input-group nzPrefixIcon="lock" [nzSuffix]="pwSuffix">
              <input
                [type]="passwordVisible ? 'text' : 'password'"
                nz-input
                formControlName="password"
                placeholder="Mindestens 8 Zeichen"
              />
            </nz-input-group>
            <ng-template #pwSuffix>
              <span nz-icon [nzType]="passwordVisible ? 'eye-invisible' : 'eye'" (click)="passwordVisible = !passwordVisible"></span>
            </ng-template>
            <ng-template #passwordErrorTpl let-control>
              <ng-container *ngIf="control.hasError('minlength')">Das Passwort muss mindestens 8 Zeichen lang sein</ng-container>
              <ng-container *ngIf="control.hasError('required')">Passwort ist erforderlich</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired nzFor="confirmPassword">Passwort bestätigen</nz-form-label>
          <nz-form-control [nzErrorTip]="confirmErrorTpl">
            <nz-input-group nzPrefixIcon="lock">
              <input
                type="password"
                nz-input
                formControlName="confirmPassword"
                placeholder="Passwort bestätigen"
              />
            </nz-input-group>
            <ng-template #confirmErrorTpl let-control>
              <ng-container *ngIf="form.hasError('passwordMismatch')">Passwörter stimmen nicht überein</ng-container>
              <ng-container *ngIf="control.hasError('required')">Bitte bestätige dein Passwort</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <button
          nz-button
          nzType="primary"
          nzBlock
          [nzLoading]="isLoading()"
          class="register-button"
        >
          Konto erstellen
        </button>
      </form>

      <div class="auth-footer" *ngIf="showLoginLink">
        Bereits ein Konto? <a routerLink="/login">Anmelden</a>
      </div>
    </div>
  `,
  styles: [`
    .register-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .register-header h2 {
      margin-bottom: 8px;
      font-weight: 600;
    }
    .register-header p {
      color: var(--text-secondary);
    }
    .auth-alert {
      margin-bottom: 24px;
    }
    .register-button {
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      margin-top: 8px;
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
export class RegisterComponent {
  @Input() showLoginLink = true;

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  passwordVisible = false;

  readonly form = this.fb.group(
    {
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

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
