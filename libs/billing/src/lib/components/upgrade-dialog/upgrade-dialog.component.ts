import { Component, inject, signal, input } from '@angular/core';
import { BillingService } from '../../billing.service';
import { BILLING_FEATURES } from '../../billing.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-upgrade-dialog',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isOpen()) {
      <div class="dialog-backdrop" (click)="close()">
        <div class="dialog-card" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="close()">✕</button>

          <div class="lock-icon">🔒</div>
          <h2>Upgrade erforderlich</h2>
          <p>
            <strong>{{ featureLabel() }}</strong> ist nicht in deinem
            aktuellen Plan (<strong>{{ billing.currentPlan()?.name }}</strong>) enthalten.
          </p>

          <a class="btn-upgrade" routerLink="/pricing" (click)="close()">
            Jetzt upgraden →
          </a>
          <button class="btn-cancel" (click)="close()">Abbrechen</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; animation: fadeIn 0.15s;
    }
    .dialog-card {
      background: #1c1e2e; border: 1px solid #2d2d4e;
      border-radius: 16px; padding: 2rem; max-width: 380px; width: 90%;
      text-align: center; position: relative;
    }
    .close-btn {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none; color: #6b6b8a; cursor: pointer; font-size: 1rem;
    }
    .lock-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    h2 { color: #e8e8f0; font-size: 1.25rem; margin-bottom: 0.5rem; }
    p  { color: #8b8ca8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }

    .btn-upgrade {
      display: block; padding: 0.75rem; background: #6c47ff; color: #fff;
      border-radius: 8px; font-weight: 600; text-decoration: none;
      margin-bottom: 0.75rem; transition: opacity 0.15s;
    }
    .btn-upgrade:hover { opacity: 0.85; }
    .btn-cancel {
      background: none; border: none; color: #6b6b8a;
      cursor: pointer; font-size: 0.875rem;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UpgradeDialogComponent {
  readonly billing  = inject(BillingService);
  readonly features = inject(BILLING_FEATURES);

  readonly featureKey = input<string>('');
  readonly isOpen     = signal(false);

  readonly featureLabel = () => {
    const labelMap: Record<string, string> = {
      canExport: 'Export', canApi: 'API-Zugang', canWhiteLabel: 'White-Label',
    };
    return labelMap[this.featureKey()] ?? this.featureKey();
  };

  open(key?: string): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
