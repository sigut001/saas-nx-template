import { Component, inject, computed } from '@angular/core';
import { BillingService } from '../../billing.service';

@Component({
  selector: 'lib-plan-badge',
  standalone: true,
  template: `
    <span class="plan-badge" [class]="badgeClass()">
      {{ billing.currentPlan()?.name ?? 'Free' }}
    </span>
  `,
  styles: [`
    .plan-badge {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 99px;
    }
    .plan-badge.free       { background: rgba(139,140,168,0.15); color: #8b8ca8; }
    .plan-badge.pro        { background: rgba(108,71,255,0.2);   color: #a78bfa; }
    .plan-badge.enterprise { background: rgba(234,179,8,0.15);   color: #eab308; }
  `]
})
export class PlanBadgeComponent {
  readonly billing    = inject(BillingService);
  readonly badgeClass = computed(() => this.billing.currentPlanId());
}
