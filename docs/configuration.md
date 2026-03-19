# Konfigurationssystem

## Übersicht

Das Konfigurationssystem besteht aus zwei Ebenen:

```
saas.config.ts          ← Globale App-Konfiguration (EINZIGE Datei die du anpasst)
    └── feature-configs ← Lokale Feature-Konfigurationen (werden eingebettet)
```

---

## Globale Konfiguration: `saas.config.ts`

**Pfad:** `apps/web/src/app/saas.config.ts`

Dies ist die **einzige Datei** die bei der Erstellung einer neuen SaaS-Anwendung aus diesem Template angepasst wird.

```typescript
export const SAAS_CONFIG: SaaSConfig = {
  appName: 'Mein SaaS',
  appTagline: 'Kurze Beschreibung',
  logoUrl: '/assets/logo.svg',
  supportEmail: 'support@example.com',

  features: {
    // Auth-Feature Flags
    publicSignup: true,
    googleLogin: true,
    emailLogin: true,
    inviteOnly: false,
    passwordReset: true,
    emailVerification: true,

    // Multi-Tenancy
    multiOrganization: false,
    onboarding: false,
    invitations: false,

    // App-Bereiche
    billing: true,
    adminPanel: true,
    notifications: false,
    trialDays: 0,
  },

  legal: {
    termsUrl: '/legal/terms',
    privacyUrl: '/legal/privacy',
  },
};
```

---

## Feature-spezifische Konfigurationen

Jedes Feature das mehr als einfache Boolean-Flags benötigt
hat eine **eigene Konfigurationsdatei** im Feature-Modul-Ordner.

### Pattern: Lokale Feature-Config

```typescript
// libs/[feature]/src/lib/[feature].config.ts
export interface [Feature]Config {
  // Technische Config (API-Keys, Endpoints, etc.)
  apiKey: string;
  
  // Feature-Flags dieses Moduls
  features?: [Feature]Features;
  
  // Redirect-Pfade / UI-Einstellungen
  redirectAfterLogin?: string;
}
```

### Einbettung in die globale Config

Die globale `saas.config.ts` bindet Feature-Configs über `app.config.ts` ein:

```typescript
// apps/web/src/app/app.config.ts
provideFirebaseAuth({
  firebaseConfig: environment.firebase,
  features: SAAS_CONFIG.features,  // ← Auth-Flags aus globaler Config
  redirectAfterLogin: '/app/dashboard',
})

provideBilling({
  stripePublicKey: environment.stripe.publicKey,
  features: SAAS_CONFIG.features,  // ← Billing-Flags aus globaler Config
})
```

---

## Verfügbare Feature-Configs nach Feature

| Feature | Config-Interface | Config-Datei |
|---|---|---|
| `firebase-auth` | `FirebaseAuthConfig` | `libs/firebase-auth/src/lib/auth-module.config.ts` |
| `billing` *(geplant)* | `BillingConfig` | `libs/billing/src/lib/billing.config.ts` |

---

## Environment-Dateien

Technische Secrets (API-Keys) gehören **nicht** in `saas.config.ts`
sondern in die Environment-Dateien:

```
apps/web/src/environments/
├── environment.ts          ← Entwicklung (nicht in Git)
└── environment.prod.ts     ← Produktion (nicht in Git)
```

```typescript
// environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    projectId: '...',
    // etc.
  },
  stripe: {
    publicKey: 'pk_test_...',
  }
};
```

> **Regel:** `saas.config.ts` enthält **was** aktiviert ist.
> `environment.ts` enthält **womit** (API-Keys, Endpoints).

---

## Feature-Flags Referenz

### Auth-Flags (immer verfügbar)

| Flag | Typ | Default | Effekt |
|---|---|---|---|
| `publicSignup` | boolean | `true` | `/register` Route + Link in Login |
| `googleLogin` | boolean | `true` | Google OAuth Button |
| `emailLogin` | boolean | `true` | E-Mail/Passwort Formular |
| `inviteOnly` | boolean | `false` | Signup nur via `/invite/:token` |
| `passwordReset` | boolean | `true` | "Passwort vergessen" Link |
| `emailVerification` | boolean | `true` | Verifikationsmail nach Signup |

### App-Flags

| Flag | Typ | Default | Effekt |
|---|---|---|---|
| `multiOrganization` | boolean | `false` | Org-Wizard, Mitglieder, Switcher |
| `onboarding` | boolean | `false` | Onboarding-Flow nach Registrierung |
| `billing` | boolean | `true` | `/pricing` + `/app/billing` Routen |
| `adminPanel` | boolean | `true` | `/admin/**` Routen |
| `notifications` | boolean | `false` | Notification Bell |
| `trialDays` | number | `0` | Trial-Zeitraum (0 = kein Trial) |
