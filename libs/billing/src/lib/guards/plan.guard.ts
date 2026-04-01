import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BillingService } from '../billing.service';

/**
 * Plan-Guard: Schützt Routen die einen bestimmten Plan erfordern.
 *
 * Verwendung in app.routes.ts:
 * ```ts
 * {
 *   path: 'advanced-feature',
 *   canActivate: [authGuard, planGuard('pro')],
 * }
 * ```
 */
export function planGuard(requiredPlan: string): CanActivateFn {
  return () => {
    const billing = inject(BillingService);
    const router  = inject(Router);

    const planOrder = ['free', 'pro', 'enterprise'];
    const userPlanIndex     = planOrder.indexOf(billing.currentPlanId());
    const requiredPlanIndex = planOrder.indexOf(requiredPlan);

    if (userPlanIndex >= requiredPlanIndex && billing.isActive()) {
      return true;
    }

    // Nicht ausreichend → zurück zur Billing-Seite
    return router.parseUrl('/app/billing');
  };
}
