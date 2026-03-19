# billing – Integration Points

## Was dieses Feature bietet

| Export | Typ | Beschreibung |
|---|---|---|
| `provideBilling()` | Funktion | Provider für `app.config.ts` |
| `BillingService` | Service | `canUse()`, `entitlement()`, `startCheckout()`, `openCustomerPortal()` |
| `planGuard(planId)` | Guard-Factory | Schützt Routen die einen Mindest-Plan erfordern |
| `PricingComponent` | Komponente | Pricing-Tabelle mit Toggle Monatlich/Jährlich |
| `BillingComponent` | Komponente | Abo-Verwaltung mit Entitlement-Übersicht |
| `PlanBadgeComponent` | Komponente | Kleines Plan-Badge für TopBar/Sidebar |
| `UpgradeDialogComponent` | Komponente | Modal wenn Nutzer gesperrte Funktion nutzt |

---

## Touch Points

### Automatisch (via künftigem `setup.js`)
- [ ] `app.config.ts` → `provideBilling()` hinzufügen
- [ ] `app.routes.ts` → `/pricing` und `/app/billing` Routen
- [ ] `saas.config.ts` → billing Feature-Flags

### Manuell
- [ ] `functions/src/index.ts` → `onUserCreated` erweitern (Stripe Customer anlegen)
- [ ] `functions/src/index.ts` → Webhook-Handler für `invoice.paid`, `customer.subscription.updated`
- [ ] `firestore.rules` → `subscriptions`, `customers` Collections (bereits in Rules vorhanden)
- [ ] `environment.ts` → `stripe.publicKey` eintragen
- [ ] `.env` → `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` eintragen

---

## Abhängigkeiten

| Feature | Pflicht | Grund |
|---|---|---|
| `firebase-auth` | ✅ | `AuthStateService` für aktuellen User |
| `multi-organization` | ❌ | Optional: Org-basiertes Billing (`teamBilling: true`) |

---

## Feature-Flags

| Flag | Default | Effekt |
|---|---|---|
| `billing.enabled` | `false` | Gesamtes Billing-Modul an/aus |
| `billing.trialDays` | `0` | Trial-Zeitraum (0 = kein Trial) |
| `billing.annualBilling` | `true` | Jährliche Abrechnungsoption im Pricing |
| `billing.teamBilling` | `false` | Org-basiertes Billing für B2B |
| `billing.showPricingPage` | `true` | `/pricing` Route aktiv |
| `billing.plans` | 3 Pläne | Free, Pro, Enterprise |
| `billing.paymentMethods.card` | `true` | Kreditkarte |
| `billing.paymentMethods.sepa` | `true` | SEPA-Lastschrift |

---

## Stripe-Setup Reihenfolge

1. Stripe Account erstellen unter [stripe.com](https://stripe.com)
2. Public Key → `environment.ts`
3. Secret Key + Webhook Secret → `.env`
4. `node libs/billing/setup.js` ausführen (legt Produkte + Preise in Stripe an)
5. Stripe Firebase Extension installieren (synct Subscriptions → Firestore)
6. Cloud Functions: `onUserCreated` um Stripe Customer-Erstellung erweitern
7. Webhook Endpoint in Stripe Dashboard registrieren

---

## Entitlements Konvention

| Key | Typ | -1 bedeutet |
|---|---|---|
| `maxSeats` | number | Unbegrenzte Nutzer |
| `storageGB` | number | Unbegrenzter Speicher |
| `canExport` | boolean | – |
| `canApi` | boolean | – |
| `canWhiteLabel` | boolean | – |
| `supportLevel` | string | `'community'` / `'email'` / `'dedicated'` |

> Eigene Entitlement-Keys nach Bedarf hinzufügen. Das Modul unterstützt beliebige `Record<string, number | boolean | string>`.

---

## Getestete Szenarien (geplant)

- [ ] `canUse('canExport')` → `false` für Free-User
- [ ] `canUse('canExport')` → `true` nach Pro-Upgrade (Stripe Test-Checkout)
- [ ] Stripe Webhook updated `users/{uid}.plan` korrekt
- [ ] `planGuard('pro')` redirectet Free-User zu `/app/billing`
- [ ] UpgradeDialog erscheint wenn `canUse()` false
- [ ] Trial: Pro-Entitlements während Trial aktiv
