import { Component, inject, signal } from '@angular/core';
import { BillingService, BillingSchedule } from '../../billing.service';
import { BILLING_FEATURES, PlanDefinition } from '../../billing.config';

@Component({
  selector: 'lib-pricing',
  standalone: true,
  imports: [],
  template: `
    <div class="pricing-wrap">
      <div class="pricing-header">
        <h2>Wähle deinen Plan</h2>
        <p>Jederzeit kündbar. Keine versteckten Kosten.</p>

        @if (features.annualBilling) {
          <div class="billing-toggle">
            <button
              [class.active]="schedule() === 'monthly'"
              (click)="schedule.set('monthly')">Monatlich</button>
            <button
              [class.active]="schedule() === 'annual'"
              (click)="schedule.set('annual')">
              Jährlich
              <span class="discount-badge">-{{ features.annualDiscountPercent }}%</span>
            </button>
          </div>
        }
      </div>

      <div class="pricing-cards">
        @for (plan of features.plans; track plan.id) {
          <div class="pricing-card" [class.highlighted]="plan.highlighted">
            @if (plan.highlighted) {
              <div class="popular-badge">Beliebt</div>
            }
            <div class="plan-name">{{ plan.name }}</div>
            @if (plan.description) {
              <div class="plan-desc">{{ plan.description }}</div>
            }

            <div class="plan-price">
              @if (plan.monthlyPrice === 0) {
                <span class="price">Kostenlos</span>
              } @else {
                <span class="price">
                  {{ schedule() === 'annual'
                    ? (plan.annualPrice / 12).toFixed(0)
                    : plan.monthlyPrice }}€
                </span>
                <span class="per-month">/Monat</span>
                @if (schedule() === 'annual') {
                  <div class="annually-note">{{ plan.annualPrice }}€/Jahr</div>
                }
              }
            </div>

            <button
              class="plan-cta"
              [class.current]="billing.currentPlanId() === plan.id"
              [disabled]="billing.currentPlanId() === plan.id || loading()"
              (click)="selectPlan(plan)">
              {{ billing.currentPlanId() === plan.id ? 'Dein Plan' : 'Wählen' }}
            </button>

            <ul class="entitlement-list">
              @for (item of getEntitlementLabels(plan); track item) {
                <li>✓ {{ item }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pricing-wrap { padding: 3rem 1.5rem; max-width: 1100px; margin: 0 auto; }
    .pricing-header { text-align: center; margin-bottom: 3rem; }
    .pricing-header h2 { font-size: 2rem; font-weight: 700; color: #e8e8f0; }
    .pricing-header p  { color: #8b8ca8; margin-top: 0.5rem; }

    .billing-toggle {
      display: inline-flex; gap: 0; margin-top: 1.5rem;
      border: 1px solid #2d2d4e; border-radius: 8px; overflow: hidden;
    }
    .billing-toggle button {
      padding: 0.5rem 1.25rem; background: transparent;
      color: #8b8ca8; border: none; cursor: pointer; font-size: 0.9rem;
      transition: all 0.15s;
    }
    .billing-toggle button.active { background: #6c47ff; color: #fff; }
    .discount-badge {
      display: inline-block; background: #22c55e; color: #fff;
      font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px; margin-left: 0.4rem;
    }

    .pricing-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .pricing-card {
      background: #1c1e2e; border: 1px solid #2d2d4e; border-radius: 16px;
      padding: 2rem; position: relative; transition: transform 0.2s;
    }
    .pricing-card:hover { transform: translateY(-4px); }
    .pricing-card.highlighted {
      border-color: #6c47ff;
      box-shadow: 0 0 0 1px #6c47ff, 0 8px 32px rgba(108,71,255,0.2);
    }
    .popular-badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: #6c47ff; color: #fff; font-size: 0.75rem; font-weight: 600;
      padding: 0.25rem 0.875rem; border-radius: 99px;
    }
    .plan-name { font-size: 1.25rem; font-weight: 700; color: #e8e8f0; }
    .plan-desc { font-size: 0.875rem; color: #8b8ca8; margin-top: 0.25rem; }
    .plan-price { margin: 1.5rem 0; }
    .price { font-size: 2.25rem; font-weight: 800; color: #e8e8f0; }
    .per-month { font-size: 0.875rem; color: #8b8ca8; margin-left: 0.25rem; }
    .annually-note { font-size: 0.8rem; color: #6b6b8a; margin-top: 0.25rem; }

    .plan-cta {
      width: 100%; padding: 0.7rem; background: #6c47ff;
      color: #fff; border: none; border-radius: 8px; font-weight: 600;
      cursor: pointer; transition: opacity 0.15s;
    }
    .plan-cta:hover:not(:disabled) { opacity: 0.85; }
    .plan-cta:disabled { opacity: 0.5; cursor: default; }
    .plan-cta.current { background: #2d2d4e; color: #8b8ca8; }

    .entitlement-list { list-style: none; padding: 0; margin: 1.5rem 0 0; }
    .entitlement-list li { font-size: 0.875rem; color: #c4c4d4; padding: 0.3rem 0; }
  `]
})
export class PricingComponent {
  readonly billing  = inject(BillingService);
  readonly features = inject(BILLING_FEATURES);
  readonly schedule = signal<BillingSchedule>('monthly');
  readonly loading  = signal(false);

  async selectPlan(plan: PlanDefinition): Promise<void> {
    if (plan.monthlyPrice === 0) return; // Free Plan braucht keinen Checkout
    this.loading.set(true);
    try {
      await this.billing.startCheckout(plan.id, this.schedule());
    } finally {
      this.loading.set(false);
    }
  }

  getEntitlementLabels(plan: PlanDefinition): string[] {
    const e = plan.entitlements;
    const labels: string[] = [];
    if (e['maxSeats']) labels.push(e['maxSeats'] === -1 ? 'Unbegrenzte Nutzer' : `${e['maxSeats']} Nutzer`);
    if (e['storageGB']) labels.push(e['storageGB'] === -1 ? 'Unbegrenzt Speicher' : `${e['storageGB']} GB Speicher`);
    if (e['canExport'])     labels.push('Export');
    if (e['canApi'])        labels.push('API-Zugang');
    if (e['canWhiteLabel']) labels.push('White-Label');
    return labels;
  }
}
