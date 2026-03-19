import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  BillingConfig,
  BillingFeatures,
  BILLING_CONFIG,
  BILLING_FEATURES,
  DEFAULT_BILLING_FEATURES,
} from './billing.config';
import { BillingService } from './billing.service';

/**
 * Stellt das Billing-Modul bereit.
 * In app.config.ts aufrufen:
 *
 * ```ts
 * provideBilling({
 *   provider: 'stripe',
 *   stripePublicKey: environment.stripe.publicKey,
 *   features: SAAS_CONFIG.features.billing,
 * })
 * ```
 */
export function provideBilling(config: BillingConfig): EnvironmentProviders {
  const features: BillingFeatures = {
    ...DEFAULT_BILLING_FEATURES,
    ...(config.features ?? {}),
    plans: config.features?.plans ?? DEFAULT_BILLING_FEATURES.plans,
    paymentMethods: {
      ...DEFAULT_BILLING_FEATURES.paymentMethods,
      ...(config.features?.paymentMethods ?? {}),
    },
  };

  return makeEnvironmentProviders([
    { provide: BILLING_CONFIG, useValue: config },
    { provide: BILLING_FEATURES, useValue: features },
    BillingService,
  ]);
}
