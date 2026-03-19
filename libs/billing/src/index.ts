/**
 * libs/billing – Öffentliche API
 */

// Config & Provider
export type { BillingConfig, BillingFeatures, PlanDefinition, PaymentMethods } from './lib/billing.config';
export { BILLING_CONFIG, BILLING_FEATURES, DEFAULT_BILLING_FEATURES } from './lib/billing.config';
export { provideBilling } from './lib/billing.providers';

// Services
export { BillingService } from './lib/billing.service';
export type { BillingSchedule } from './lib/billing.service';

// Guards
export { planGuard } from './lib/guards/plan.guard';

// Components
export { PricingComponent } from './lib/components/pricing/pricing.component';
export { BillingComponent } from './lib/components/billing/billing.component';
export { PlanBadgeComponent } from './lib/components/plan-badge/plan-badge.component';
export { UpgradeDialogComponent } from './lib/components/upgrade-dialog/upgrade-dialog.component';
