# billing – Setup Guide

> **KI-Anleitung:** Lies diese Datei vollständig. Führe alle Schritte mit `[AUTO]` selbständig aus.
> Für Schritte mit `[MANUAL]` frage den Nutzer nach den nötigen Werten und setze dann fort.
> Das Modul `firebase-auth` muss bereits eingebunden sein bevor du anfängst.

---

## Was dieses Modul tut

Bindet Stripe Billing in die SaaS-Anwendung ein:
- Pricing-Seite mit Plan-Vergleich
- Stripe Checkout (Plankauf)
- Stripe Customer Portal (Abo verwalten/kündigen)
- `BillingService.canUse('feature')` für Entitlement-Prüfungen
- `planGuard('pro')` zum Schützen von Routen
- Cloud Functions: Stripe Customer beim Signup anlegen + Webhook für Plan-Updates

---

## Voraussetzungen

| Was | Status prüfen |
|---|---|
| `firebase-auth` Modul eingebunden | `app.config.ts` enthält `provideFirebaseAuth()` |
| Stripe Account vorhanden | [stripe.com](https://stripe.com) (Test-Modus reicht) |
| Firebase Functions deployed | `health` Function erreichbar |

---

## Schritt 1 – Stripe API Keys erfassen

**[MANUAL]:** Frage den Nutzer:
> "Bitte öffne [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) und kopiere:
> - Publishable key (beginnt mit `pk_test_...`)
> - Secret key (beginnt mit `sk_test_...`)"

---

## Schritt 2 – Stripe Keys eintragen

**[AUTO]:** Trage den **Public Key** in `apps/web/src/environments/environment.ts` ein:

```typescript
stripe: {
  publicKey: '<<STRIPE_PUBLIC_KEY>>',
},
```

**[AUTO]:** Trage den **Secret Key** in `functions/.env` ein (wird nicht committed):

```
STRIPE_SECRET_KEY=<<STRIPE_SECRET_KEY>>
STRIPE_WEBHOOK_SECRET=
```

Prüfe dass `functions/.env` in `.gitignore` steht.

---

## Schritt 3 – Stripe Produkte anlegen

**[MANUAL]:** Führe folgendes Script aus um Stripe-Produkte für alle Pläne aus der `billing.config.ts` anzulegen:

```bash
npx tsx libs/billing/setup.js
```

> Das Script liest die Plan-Definitionen aus `billing.config.ts`, legt Produkte + Preise in Stripe an
> und trägt die `stripePriceId`s automatisch zurück in die Config ein.

**[MANUAL]:** Falls das Script noch nicht existiert, frage: "Soll ich das setup.js Script jetzt schreiben?"

**Prüfung:** In `billing.config.ts` sind alle `stripePriceIdMonthly` + `stripePriceIdAnnual` befüllt.

---

## Schritt 4 – Stripe Metadata auf Prices setzen

**[AUTO]:** Für jeden Stripe Price muss `metadata.planId` gesetzt sein damit der Webhook den Plan korrekt erkennt.

Das erledigt `setup.js` automatisch. Zur manuellen Prüfung:
```
Stripe Dashboard → Products → [Plan] → Price → Metadata → planId: 'pro'
```

---

## Schritt 5 – Path-Alias registrieren

**[AUTO]:** Prüfe ob `@saas-base/billing` in `tsconfig.base.json` → `paths` eingetragen ist.

Falls nicht:
```json
"@saas-base/billing": ["libs/billing/src/index.ts"]
```

---

## Schritt 6 – Provider in app.config.ts einbinden

**[AUTO]:** Füge `provideBilling()` in `apps/web/src/app/app.config.ts` ein:

```typescript
import { provideBilling } from '@saas-base/billing';
import { environment } from '../environments/environment';

// in providers[], nach provideFirebaseAuth():
...(SAAS_CONFIG.features.billing ? [
  provideBilling({
    provider: 'stripe',
    stripePublicKey: environment.stripe.publicKey,
    redirectAfterCheckout: '/app/billing',
    features: {
      enabled: SAAS_CONFIG.features.billing,
      trialDays: SAAS_CONFIG.features.trialDays,
      showPricingPage: true,
      annualBilling: true,
    },
  }),
] : []),
```

---

## Schritt 7 – Routen in app.routes.ts ergänzen

**[AUTO]:** Prüfe ob diese Routen vorhanden sind. Falls nicht, füge ein:

```typescript
// Public (nach Auth-Routen):
...(f.billing ? [{
  path: 'pricing',
  title: 'Pricing',
  loadComponent: () => import('@saas-base/billing').then(m => m.PricingComponent),
}] as Routes : []),

// In App-Zone children:
...(f.billing ? [{
  path: 'billing',
  title: 'Billing',
  loadComponent: () => import('@saas-base/billing').then(m => m.BillingComponent),
}] as Routes : []),
```

---

## Schritt 8 – Feature-Flag in saas.config.ts aktivieren

**[AUTO]:** Prüfe ob `billing: true` in `SAAS_CONFIG.features` gesetzt ist.

---

## Schritt 9 – Cloud Functions deployen

**[AUTO]:** Führe aus:
```bash
npx firebase deploy --only functions
```

Functions die deployed werden müssen:
- `onUserCreated` (erweitert mit Stripe Customer-Erstellung)
- `stripeWebhook`
- `createCheckoutSession`
- `createPortalSession`

**Prüfung:** Exit Code 0, alle 4 Functions aktiv.

---

## Schritt 10 – Webhook in Stripe Dashboard registrieren

**[AUTO]:** Ermittle zuerst die exakte Webhook-URL indem du in `firebase.json` oder `.firebaserc` die
`PROJECT_ID` liest (z.B. `saas-example-94204`). Die URL hat dann dieses Format:

```
https://europe-west1-<<PROJECT_ID>>.cloudfunctions.net/stripeWebhook
```

Beispiel: Wenn die PROJECT_ID `saas-example-94204` ist, lautet die URL:
```
https://europe-west1-saas-example-94204.cloudfunctions.net/stripeWebhook
```

**[AUTO]:** Teile dem Nutzer diese fertige URL mit, bevor er das Stripe Dashboard öffnet.

---

**[MANUAL]:** Weise den Nutzer an, exakt diese Schritte zu folgen:

> **1. Stripe Webhook anlegen:**
>
> → Öffne: [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
>
> → Klicke oben rechts auf **„Add endpoint"**
>
> → Im Feld **„Endpoint URL"** die oben genannte URL einfügen
>
> → Klicke auf **„Select events"** und suche + aktiviere diese 4 Events:
> - `customer.subscription.created`
> - `customer.subscription.updated`
> - `customer.subscription.deleted`
> - `invoice.payment_failed`
>
> → Klicke **„Add endpoint"** um zu speichern

---

> **2. Webhook Secret kopieren:**
>
> → Nach dem Anlegen: Klicke auf den neu angelegten Webhook-Eintrag in der Liste
>
> → Suche den Abschnitt **„Signing secret"** → Klicke auf **„Reveal"**
>
> → Kopiere den angezeigten Wert (beginnt mit `whsec_...`)

---

**[AUTO]:** Sobald der Nutzer den `whsec_...` Wert mitteilt, trage ihn in `functions/.env` ein:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

**[AUTO]:** Deploye Functions erneut damit der neue Secret aktiv wird:
```bash
npx firebase deploy --only functions
```

> **Warum nochmal deployen?** Die `functions/.env` Datei wird beim Deploy in die Cloud hochgeladen.
> Ohne erneuten Deploy kennt die laufende Function den Webhook Secret noch nicht und würde
> alle eingehenden Stripe Events mit `400 Webhook Signatur ungültig` ablehnen.

---

## Schritt 11 – Build und Verify

**[AUTO]:** Führe aus:
```bash
npx nx build web --configuration=development
```

**[AUTO]:** Führe den Billing-Test aus:
```bash
npx tsx scripts/test-billing.ts
```

**Erwartetes Ergebnis:** Build Exit 0, alle Test Cases bestanden.

---

## Schritt 12 – Checkout Flow manuell testen

**[MANUAL]:** Frage den Nutzer:
> "Bitte teste den Checkout Flow im Browser:
> 1. Öffne `/pricing`
> 2. Klicke auf 'Pro' → 'Wählen'
> 3. Im Stripe Checkout: Testkarte `4242 4242 4242 4242`, Datum beliebig, CVC `123`
> 4. Nach Kauf: prüfe ob `/app/billing` den Plan `Pro` anzeigt
> 5. Prüfe in Firebase Console → Firestore → `users/{uid}.plan` ob `'pro'` gesetzt ist"

---

## Fertig ✅

Das `billing` Modul ist vollständig eingebunden wenn:
- `npx nx build web` Exit 0
- `/pricing` zeigt Plan-Tabelle
- Stripe Checkout öffnet sich beim Plan-Kauf
- Nach Kauf: `users/{uid}.plan = 'pro'` in Firestore
- `BillingService.canUse('canExport')` gibt `true` zurück
