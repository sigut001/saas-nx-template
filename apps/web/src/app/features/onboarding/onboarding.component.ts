import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getFirestore, doc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * OnboardingComponent – Org-Erstellungs-Wizard.
 * Wird angezeigt wenn features.multiOrganization: true und
 * der User noch keine activeOrganizationId hat.
 */
@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="onboarding-wrap">
      <div class="onboarding-card">

        <div class="onboarding-header">
          <div class="onboarding-icon">🏢</div>
          <h1>Willkommen!</h1>
          <p>Erstelle deine Organisation um loszulegen.</p>
        </div>

        @if (error()) {
          <div class="onboarding-error">⚠ {{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="orgName">Name der Organisation</label>
            <input
              id="orgName"
              type="text"
              formControlName="orgName"
              placeholder="z.B. Meine Agentur GmbH"
              class="input"
              [class.input--error]="isInvalid()"
            />
            @if (isInvalid()) {
              <span class="field-error">Bitte einen Namen eingeben (mind. 2 Zeichen)</span>
            }
            @if (slug()) {
              <span class="field-hint">Slug: {{ slug() }}</span>
            }
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loading()"
          >
            @if (loading()) {
              <span class="spinner"></span> Wird erstellt…
            } @else {
              Organisation erstellen →
            }
          </button>
        </form>

      </div>
    </div>
  `,
  styles: [`
    .onboarding-wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f1117;
      padding: 1.5rem;
    }
    .onboarding-card {
      background: #1c1e2e;
      border: 1px solid #2d2d4e;
      border-radius: 16px;
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .onboarding-header { text-align: center; }
    .onboarding-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #e8e8f0; margin: 0 0 0.25rem; }
    p  { font-size: 0.9rem; color: #8b8ca8; margin: 0; }

    .onboarding-error {
      background: rgba(239,68,68,0.12);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }

    .field { display: flex; flex-direction: column; gap: 0.375rem; }
    label { font-size: 0.875rem; font-weight: 500; color: #c4c4d4; }
    .input {
      padding: 0.65rem 0.875rem;
      background: #0f0f1a;
      border: 1px solid #2d2d4e;
      border-radius: 8px;
      color: #e8e8f0;
      font-size: 0.9375rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .input:focus { outline: none; border-color: #6c47ff; box-shadow: 0 0 0 3px rgba(108,71,255,0.2); }
    .input--error { border-color: #ef4444; }
    .field-error { font-size: 0.8rem; color: #fca5a5; }
    .field-hint  { font-size: 0.78rem; color: #4a4a6a; font-family: monospace; }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #6c47ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: opacity 0.15s;
    }
    .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-primary:not(:disabled):hover { opacity: 0.9; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class OnboardingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    orgName: ['', [Validators.required, Validators.minLength(2)]],
  });

  get slug(): () => string {
    return () => this.toSlug(this.form.value.orgName ?? '');
  }

  isInvalid(): boolean {
    const ctrl = this.form.get('orgName');
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('Nicht angemeldet');

      const db = getFirestore();
      const orgName = this.form.value.orgName!.trim();
      const slug = this.toSlug(orgName);

      // Neue Org-ID generieren
      const orgRef = doc(collection(db, 'organizations'));
      const orgId = orgRef.id;

      // 1. Organization anlegen
      await setDoc(orgRef, {
        id: orgId,
        name: orgName,
        slug,
        plan: 'free',
        subscriptionStatus: 'active',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        seats: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 2. User als Owner eintragen
      await setDoc(doc(db, 'organizations', orgId, 'members', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'owner',
        joinedAt: new Date(),
        invitedBy: null,
      });

      // 3. User-Dokument aktualisieren
      await updateDoc(doc(db, 'users', user.uid), {
        activeOrganizationId: orgId,
        onboardedAt: new Date(),
        updatedAt: new Date(),
      });

      // 4. Weiterleitung ins Dashboard
      await this.router.navigate(['/app/dashboard']);

    } catch (err: any) {
      this.error.set('Fehler beim Erstellen der Organisation. Bitte versuche es erneut.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
