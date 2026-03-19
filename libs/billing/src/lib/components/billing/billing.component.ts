import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BillingService } from '../../billing.service';
import { RouterLink } from '@angular/router';
import { PlanBadgeComponent } from '../plan-badge/plan-badge.component';

@Component({
  selector: 'lib-billing',
  standalone: true,
  imports: [RouterLink, DatePipe, PlanBadgeComponent],
  template: `
    <div class="billing-wrap">
      <h1>Abonnement & Billing</h1>

      <div class="billing-card">
        <div class="plan-row">
          <div>
            <div class="label">Aktueller Plan</div>
            <div class="plan-name">{{ billing.currentPlan()?.name ?? 'Free' }}</div>
          </div>
          <lib-plan-badge />
        </div>

        <div class="status-row">
          <span class="status-badge" [class]="statusClass()">{{ statusLabel() }}</span>
          @if (billing.isTrialing() && billing.trialEndsAt()) {
            <span class="trial-info">
              Trial endet am {{ billing.trialEndsAt() | date:'dd.MM.yyyy' }}
            </span>
          }
        </div>

        <div class="billing-actions">
          @if (billing.currentPlanId() !== 'free') {
            <button class="btn-secondary" (click)="openPortal()">
              Abo verwalten / kündigen
            </button>
          } @else {
            <a class="btn-primary" routerLink="/pricing">Upgrade</a>
          }
        </div>
      </div>

      @if (billing.currentPlan()) {
        <div class="entitlements-card">
          <h3>Deine Berechtigungen</h3>
          <div class="entitlement-grid">
            @for (entry of entitlementEntries(); track entry.key) {
              <div class="entitlement-item">
                <span class="e-key">{{ entry.label }}</span>
                <span class="e-val">{{ entry.display }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .billing-wrap { padding: 2rem; max-width: 640px; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #e8e8f0; margin-bottom: 1.5rem; }

    .billing-card, .entitlements-card {
      background: #1c1e2e; border: 1px solid #2d2d4e;
      border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .plan-row { display: flex; justify-content: space-between; align-items: center; }
    .label { font-size: 0.8rem; color: #6b6b8a; text-transform: uppercase; letter-spacing: 0.05em; }
    .plan-name { font-size: 1.5rem; font-weight: 700; color: #e8e8f0; margin-top: 0.25rem; }

    .status-row { margin-top: 1rem; display: flex; align-items: center; gap: 0.75rem; }
    .status-badge {
      font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.625rem;
      border-radius: 99px; text-transform: capitalize;
    }
    .status-badge.active   { background: rgba(34,197,94,0.15); color: #22c55e; }
    .status-badge.trialing { background: rgba(234,179,8,0.15);  color: #eab308; }
    .status-badge.canceled { background: rgba(239,68,68,0.15);  color: #ef4444; }
    .trial-info { font-size: 0.8rem; color: #8b8ca8; }

    .billing-actions { margin-top: 1.5rem; }
    .btn-primary, .btn-secondary {
      display: inline-block; padding: 0.65rem 1.5rem; border-radius: 8px;
      font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: none;
      border: none; transition: opacity 0.15s;
    }
    .btn-primary  { background: #6c47ff; color: #fff; }
    .btn-secondary { background: #2d2d4e; color: #c4c4d4; }
    .btn-primary:hover, .btn-secondary:hover { opacity: 0.85; }

    h3 { font-size: 1rem; font-weight: 600; color: #e8e8f0; margin-bottom: 1rem; }
    .entitlement-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .entitlement-item {
      background: #0f0f1a; border-radius: 8px; padding: 0.75rem;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .e-key { font-size: 0.75rem; color: #6b6b8a; }
    .e-val { font-size: 0.95rem; font-weight: 600; color: #e8e8f0; }
  `]
})
export class BillingComponent {
  readonly billing = inject(BillingService);

  readonly statusClass = computed(() => this.billing.subscriptionStatus());
  readonly statusLabel = computed(() => {
    const s = this.billing.subscriptionStatus();
    const labels: Record<string, string> = {
      active: 'Aktiv', trialing: 'Trial', canceled: 'Gekündigt',
      past_due: 'Zahlung ausstehend', unpaid: 'Unbezahlt',
    };
    return labels[s] ?? s;
  });

  readonly entitlementEntries = computed(() => {
    const e = this.billing.currentPlan()?.entitlements ?? {};
    const labelMap: Record<string, string> = {
      maxSeats: 'Max. Nutzer', storageGB: 'Speicher (GB)',
      canExport: 'Export', canApi: 'API', canWhiteLabel: 'White-Label',
      supportLevel: 'Support',
    };
    return Object.entries(e).map(([key, val]) => ({
      key,
      label: labelMap[key] ?? key,
      display: typeof val === 'boolean'
        ? (val ? '✓' : '✗')
        : (val === -1 ? '∞' : String(val)),
    }));
  });

  async openPortal(): Promise<void> {
    await this.billing.openCustomerPortal();
  }
}
