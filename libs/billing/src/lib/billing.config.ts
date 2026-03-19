import { InjectionToken } from '@angular/core';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface BillingConfig {
  provider: 'stripe';
  stripePublicKey: string;
  redirectAfterCheckout?: string;
  customerPortalUrl?: string;
  features?: Partial<BillingFeatures>;
}

export interface BillingFeatures {
  enabled: boolean;
  trialDays: number;
  annualBilling: boolean;
  annualDiscountPercent: number;
  teamBilling: boolean;
  showPricingPage: boolean;
  plans: PlanDefinition[];
  defaultPlan: string;
  paymentMethods: PaymentMethods;
}

export interface PlanDefinition {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
  highlighted?: boolean;           // "Most Popular" Badge
  entitlements: Record<string, number | boolean | string>;
}

export interface PaymentMethods {
  card: boolean;
  sepa: boolean;
  paypal: boolean;
  klarna: boolean;
  applePay: boolean;
  googlePay: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_BILLING_FEATURES: BillingFeatures = {
  enabled: false,
  trialDays: 0,
  annualBilling: true,
  annualDiscountPercent: 20,
  teamBilling: false,
  showPricingPage: true,
  defaultPlan: 'free',
  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Zum Ausprobieren',
      monthlyPrice: 0,
      annualPrice: 0,
      stripePriceIdMonthly: null,
      stripePriceIdAnnual: null,
      entitlements: {
        maxSeats: 1,
        storageGB: 1,
        canExport: false,
        canApi: false,
        canWhiteLabel: false,
        supportLevel: 'community',
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Für professionelle Nutzer',
      monthlyPrice: 29,
      annualPrice: 279,
      stripePriceIdMonthly: '',
      stripePriceIdAnnual: '',
      highlighted: true,
      entitlements: {
        maxSeats: 10,
        storageGB: 50,
        canExport: true,
        canApi: true,
        canWhiteLabel: false,
        supportLevel: 'email',
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Für Teams und Unternehmen',
      monthlyPrice: 99,
      annualPrice: 950,
      stripePriceIdMonthly: '',
      stripePriceIdAnnual: '',
      entitlements: {
        maxSeats: -1,
        storageGB: -1,
        canExport: true,
        canApi: true,
        canWhiteLabel: true,
        supportLevel: 'dedicated',
      },
    },
  ],
  paymentMethods: {
    card: true,
    sepa: true,
    paypal: false,
    klarna: false,
    applePay: true,
    googlePay: true,
  },
};

// ─── InjectionTokens ──────────────────────────────────────────────────────────

export const BILLING_CONFIG = new InjectionToken<BillingConfig>('BILLING_CONFIG');
export const BILLING_FEATURES = new InjectionToken<BillingFeatures>('BILLING_FEATURES');
