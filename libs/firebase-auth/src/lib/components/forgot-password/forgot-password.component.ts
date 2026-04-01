import { Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@saas-base/auth-core';

// NG-ZORRO Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'lib-forgot-password',
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
    <div class="forgot-password-wrapper">
      <div class="forgot-password-header">
        <h2>Passwort zurücksetzen</h2>
        <p>Gib deine E-Mail ein – wir senden dir einen Reset-Link.</p>
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

      <div *ngIf="successMessage()" class="success-actions">
        <button nz-button nzType="default" nzBlock routerLink="/login">
          Zurück zum Login
        </button>
      </div>

      <form *ngIf="!successMessage()" nz-form [formGroup]="form" (ngSubmit)="onSubmit()" nzLayout="vertical">
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

        <button
          nz-button
          nzType="primary"
          nzBlock
          [nzLoading]="isLoading()"
          class="reset-button"
        >
          Reset-Link senden
        </button>
      </form>

      <div class="auth-footer" *ngIf="showLoginLink && !successMessage()">
        <a routerLink="/login">← Zurück zum Login</a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .forgot-password-header h2 {
      margin-bottom: 8px;
      font-weight: 600;
    }
    .forgot-password-header p {
      color: var(--text-secondary);
    }
    .auth-alert {
      margin-bottom: 24px;
    }
    .reset-button {
      height: 40px;
      font-size: 15px;
      font-weight: 500;
    }
    .success-actions {
      margin-top: 16px;
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
