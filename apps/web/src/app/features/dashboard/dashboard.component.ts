import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BillingService, PlanBadgeComponent } from '@saas-base/billing';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, PlanBadgeComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Willkommen in deiner SaaS-Anwendung.</p>
        </div>
        <lib-plan-badge />
      </div>

      <!-- Test-Links für Guard & Billing-Tests -->
      <div class="test-section">
        <h2>🧪 Guard & Billing Tests</h2>
        <div class="test-cards">

          <a routerLink="/app/pro-feature" class="test-card">
            <div class="test-icon">🔒</div>
            <div>
              <div class="test-title">Pro Feature Test</div>
              <div class="test-desc">
                @if (isPro()) {
                  <span class="badge granted">✅ Du hast Zugriff</span>
                } @else {
                  <span class="badge denied">🔒 Kein Zugriff ({{ billing.currentPlan()?.name ?? 'Free' }})</span>
                }
              </div>
            </div>
            <div class="arrow">→</div>
          </a>

          <a routerLink="/pricing" class="test-card">
            <div class="test-icon">💳</div>
            <div>
              <div class="test-title">Pricing / Upgrade</div>
              <div class="test-desc">Plan wechseln oder kaufen</div>
            </div>
            <div class="arrow">→</div>
          </a>

          <a routerLink="/app/billing" class="test-card">
            <div class="test-icon">🧾</div>
            <div>
              <div class="test-title">Billing & Abonnement</div>
              <div class="test-desc">Aktuellen Plan ansehen</div>
            </div>
            <div class="arrow">→</div>
          </a>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; max-width: 860px; }

    .dashboard-header {
      display: flex; justify-content: space-between; align-items: start;
      margin-bottom: 2.5rem;
    }
    h1 { font-size: 1.75rem; font-weight: 700; color: #e8e8f0; }
    h1 + p { color: #8b8ca8; margin-top: 0.25rem; }

    h2 { font-size: 1rem; font-weight: 600; color: #6b6b8a; text-transform: uppercase;
         letter-spacing: 0.08em; margin-bottom: 1rem; }

    .test-section { margin-top: 2rem; }

    .test-cards { display: flex; flex-direction: column; gap: 0.75rem; }
    .test-card {
      display: flex; align-items: center; gap: 1rem;
      background: #1c1e2e; border: 1px solid #2d2d4e; border-radius: 12px;
      padding: 1rem 1.25rem; text-decoration: none; transition: all 0.15s;
      cursor: pointer;
    }
    .test-card:hover { border-color: #6c47ff; transform: translateX(4px); }

    .test-icon { font-size: 1.5rem; min-width: 2rem; text-align: center; }
    .test-title { font-size: 0.95rem; font-weight: 600; color: #e8e8f0; }
    .test-desc { font-size: 0.8rem; color: #8b8ca8; margin-top: 0.2rem; }

    .badge {
      font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.5rem;
      border-radius: 99px;
    }
    .badge.granted { background: rgba(34,197,94,0.15); color: #4ade80; }
    .badge.denied  { background: rgba(239,68,68,0.15);  color: #f87171; }

    .arrow { margin-left: auto; color: #6b6b8a; font-size: 1.25rem; }
  `]
})
export class DashboardComponent {
  readonly billing = inject(BillingService);
  isPro = () => {
    const planOrder = ['free', 'pro', 'enterprise'];
    return planOrder.indexOf(this.billing.currentPlanId()) >= planOrder.indexOf('pro');
  };
}
