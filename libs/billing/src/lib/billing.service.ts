import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  BILLING_CONFIG,
  BILLING_FEATURES,
  PlanDefinition,
} from './billing.config';

export type BillingSchedule = 'monthly' | 'annual';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly config  = inject(BILLING_CONFIG);
  private readonly features = inject(BILLING_FEATURES);

  // ─── State Signals ─────────────────────────────────────────────────────────
  readonly currentPlanId       = signal<string>('free');
  readonly subscriptionStatus  = signal<string>('active');
  readonly schedule            = signal<BillingSchedule>('monthly');
  readonly trialEndsAt         = signal<Date | null>(null);
  readonly stripeCustomerId    = signal<string | null>(null);

  // ─── Computed ──────────────────────────────────────────────────────────────
  readonly currentPlan = computed<PlanDefinition | undefined>(() =>
    this.features.plans.find(p => p.id === this.currentPlanId())
  );

  readonly isTrialing = computed(() => this.subscriptionStatus() === 'trialing');
  readonly isCanceled = computed(() => this.subscriptionStatus() === 'canceled');
  readonly isActive   = computed(() =>
    this.subscriptionStatus() === 'active' || this.isTrialing()
  );

  private _stripe: Stripe | null = null;
  private _unsubscribe: (() => void) | null = null;

  constructor() {
    effect(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) this._subscribeToUser(user.uid);
    });
  }

  // ─── Entitlement Checks ────────────────────────────────────────────────────

  /**
   * Prüft ob der aktuelle Plan ein Entitlement erlaubt.
   * @example billing.canUse('canExport') → true/false
   */
  canUse(key: string): boolean {
    const plan = this.currentPlan();
    if (!plan) return false;
    const value = plan.entitlements[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number')  return value !== 0;
    return false;
  }

  /**
   * Liest einen numerischen Entitlement-Wert.
   * -1 bedeutet unbegrenzt.
   * @example billing.entitlement('maxSeats') → 10
   */
  entitlement(key: string): number {
    const plan = this.currentPlan();
    if (!plan) return 0;
    const value = plan.entitlements[key];
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Checkt ob eine Grenze überschritten wurde.
   * @example billing.isWithinLimit('maxSeats', teamSize) → true/false
   */
  isWithinLimit(key: string, current: number): boolean {
    const limit = this.entitlement(key);
    if (limit === -1) return true; // unbegrenzt
    return current < limit;
  }

  // ─── Stripe Aktionen ───────────────────────────────────────────────────────

  /**
   * Öffnet den Stripe Checkout für einen Plan.
   */
  async startCheckout(planId: string, schedule: BillingSchedule = 'monthly'): Promise<void> {
    const plan = this.features.plans.find(p => p.id === planId);
    if (!plan) throw new Error(`Plan '${planId}' nicht gefunden`);

    const priceId = schedule === 'annual'
      ? plan.stripePriceIdAnnual
      : plan.stripePriceIdMonthly;

    if (!priceId) throw new Error(`Kein Stripe Price ID für Plan '${planId}' (${schedule})`);

    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Nicht angemeldet');

    // Checkout Session via Cloud Function erstellen
    const res = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        priceId,
        successUrl: window.location.origin + '/app/billing',
        cancelUrl: window.location.href,
      }),
    });

    if (!res.ok) throw new Error('Checkout konnte nicht erstellt werden');
    const { url } = await res.json() as { url: string };
    // Moderne Stripe API: redirect zu Checkout URL
    window.location.href = url;
  }

  /**
   * Öffnet das Stripe Customer Portal (Abo verwalten, kündigen).
   */
  async openCustomerPortal(): Promise<void> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Nicht angemeldet');

    const res = await fetch('/api/billing/create-portal-session', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Portal konnte nicht geöffnet werden');
    const { url } = await res.json() as { url: string };
    window.location.href = url;
  }

  // ─── Privat ────────────────────────────────────────────────────────────────

  private async _getStripe(): Promise<Stripe | null> {
    if (!this._stripe) {
      this._stripe = await loadStripe(this.config.stripePublicKey);
    }
    return this._stripe;
  }

  private _subscribeToUser(uid: string): void {
    if (this._unsubscribe) this._unsubscribe();
    const db = getFirestore();
    this._unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      this.currentPlanId.set(data['plan'] ?? 'free');
      this.subscriptionStatus.set(data['subscriptionStatus'] ?? 'active');
      this.stripeCustomerId.set(data['stripeCustomerId'] ?? null);
      if (data['trialEndsAt']) {
        this.trialEndsAt.set(data['trialEndsAt'].toDate());
      }
    });
  }
}
