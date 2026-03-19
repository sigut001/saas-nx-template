import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BillingService } from '@saas-base/billing';

@Component({
  selector: 'app-pro-feature-test',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-wrap">

      <div class="access-card" [class.granted]="hasAccess()" [class.denied]="!hasAccess()">
        <div class="access-icon">{{ hasAccess() ? '✅' : '🔒' }}</div>

        <h1>Pro Feature Test</h1>

        @if (hasAccess()) {
          <p class="access-msg granted-msg">
            Du hast Zugriff!<br>
            <span>Dein aktueller Plan: <strong>{{ billing.currentPlan()?.name }}</strong></span>
          </p>
          <div class="feature-demo">
            <p>Hier würde eine Pro-Feature stehen – z.B. ein Export-Button, API-Zugang etc.</p>
            <div class="demo-box">✨ Dein Pro-Content</div>
          </div>
        } @else {
          <p class="access-msg denied-msg">
            Kein Zugriff.<br>
            <span>Dein aktueller Plan: <strong>{{ billing.currentPlan()?.name ?? 'Free' }}</strong></span>
          </p>
          <p class="hint">Upgrade auf <strong>Pro</strong> um dieses Feature zu nutzen.</p>
          <a class="btn-upgrade" routerLink="/pricing">Jetzt upgraden →</a>
        }

        <a class="back-link" routerLink="/app/dashboard">← Zurück zum Dashboard</a>
      </div>

    </div>
  `,
  styles: [`
    .page-wrap {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0f0f1a; padding: 2rem;
    }
    .access-card {
      background: #1c1e2e; border: 2px solid #2d2d4e; border-radius: 20px;
      padding: 3rem 2.5rem; max-width: 480px; width: 100%; text-align: center;
      transition: border-color 0.3s;
    }
    .access-card.granted { border-color: #22c55e; box-shadow: 0 0 40px rgba(34,197,94,0.15); }
    .access-card.denied  { border-color: #ef4444; box-shadow: 0 0 40px rgba(239,68,68,0.1); }

    .access-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #e8e8f0; margin-bottom: 0.5rem; }

    .access-msg { font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; }
    .access-msg span { font-size: 0.9rem; color: #8b8ca8; }
    .granted-msg { color: #4ade80; }
    .denied-msg  { color: #f87171; }

    .hint { color: #8b8ca8; font-size: 0.9rem; margin-bottom: 1.5rem; }

    .feature-demo { margin-top: 1.5rem; }
    .feature-demo p { color: #8b8ca8; font-size: 0.9rem; margin-bottom: 1rem; }
    .demo-box {
      background: rgba(108,71,255,0.15); border: 1px dashed #6c47ff;
      border-radius: 12px; padding: 1.5rem; color: #a78bfa; font-weight: 600;
    }

    .btn-upgrade {
      display: inline-block; padding: 0.75rem 2rem; background: #6c47ff;
      color: #fff; border-radius: 10px; font-weight: 600; text-decoration: none;
      transition: opacity 0.15s; margin-bottom: 1.5rem;
    }
    .btn-upgrade:hover { opacity: 0.85; }

    .back-link {
      display: block; margin-top: 1.5rem; color: #6b6b8a;
      font-size: 0.875rem; text-decoration: none;
    }
    .back-link:hover { color: #8b8ca8; }
  `]
})
export class ProFeatureTestComponent {
  readonly billing = inject(BillingService);
  readonly hasAccess = computed(() => {
    const planOrder = ['free', 'pro', 'enterprise'];
    return planOrder.indexOf(this.billing.currentPlanId()) >= planOrder.indexOf('pro')
      && this.billing.isActive();
  });
}
