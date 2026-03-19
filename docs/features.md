# Feature-Katalog

## Namenskonventionen

### Was ist ein "Feature"?

Ein **Feature** ist ein optionales, eigenständiges Modul das in die SaaS-Anwendung eingebunden werden kann.

> **Wichtige Unterscheidung:**
> - **Feature** = technische Funktionalität der SaaS-Anwendung (z.B. Authentifizierung, Billing)
> - **Entitlement** = was ein Endnutzer mit seinem Plan nutzen darf (z.B. `maxProjects: 5`)
> - **App-Bereich** = ein Seiten-Bereich der durch ein Feature aktiviert wird (z.B. `/app/billing`)

### Benennungsregeln

| Bereich | Konvention | Beispiel |
|---|---|---|
| Modul-Ordner | `libs/[feature-name]/` | `libs/firebase-auth/` |
| NX Library | `@saas-base/[feature-name]` | `@saas-base/firebase-auth` |
| Provider-Funktion | `provide[Feature]()` | `provideFirebaseAuth()` |
| Config-Interface | `[Feature]Config` | `FirebaseAuthConfig` |
| Feature-Flags | camelCase Boolean | `publicSignup`, `googleLogin` |
| Entitlements | camelCase | `maxProjects`, `canExport` |
| Setup-Script | `libs/[feature]/setup.js` | `libs/firebase-auth/setup.js` |

---

## Verfügbare Features

### ✅ `firebase-auth` – Authentifizierung
**Status:** Implementiert  
**Modul:** `libs/firebase-auth/`  
**Einbindung:** `provideFirebaseAuth(config)` in `app.config.ts`  

**Bietet:**
- Login/Register/ForgotPassword Komponenten
- `AuthService`, `AuthStateService`
- `authGuard`, `adminGuard`
- Feature-Flags: `publicSignup`, `googleLogin`, `emailLogin`, `inviteOnly`, `passwordReset`, `emailVerification`

**Abhängigkeiten:** keine (Basis-Feature)

---

### 🔶 `billing` – Zahlungsabwicklung
**Status:** Geplant (Milestone 4)  
**Modul:** `libs/billing/`  
**Einbindung:** `provideBilling(config)` in `app.config.ts`  

**Bietet:**
- `BillingService` mit `canUse()`, `currentPlan()`, `startCheckout()`
- `PlanGuard`, `PricingComponent`, `BillingComponent`
- Stripe Checkout + Customer Portal Integration

**Abhängigkeiten:** `firebase-auth` (Nutzer muss eingeloggt sein)

---

### 🔶 `multi-organization` – Multi-Tenancy (B2B)
**Status:** Teilweise implementiert (OnboardingComponent + onboardingGuard)  
**Konfiguration:** `features.multiOrganization: true` in `saas.config.ts`  

**Bietet:**
- Onboarding-Wizard (Org-Erstellung)
- `onboardingGuard`
- Organisations-Verwaltungsseite (geplant)
- Org-Switcher in Top-Bar (geplant)

**Abhängigkeiten:** `firebase-auth`

---

### 🔜 Geplante Features

| Feature | Beschreibung | Abhängigkeiten |
|---|---|---|
| `notifications` | In-App Benachrichtigungen | `firebase-auth` |
| `invitations` | Team-Mitglieder einladen | `firebase-auth`, `multi-organization` |
| `storage` | Firebase Storage Integration | `firebase-auth` |
| `admin-panel` | Super-Admin Dashboard | `firebase-auth` |

---

## Feature-Abhängigkeitsgraph

```
firebase-auth (Basis)
    ├── billing
    ├── multi-organization
    │       └── invitations
    ├── notifications
    ├── storage
    └── admin-panel
```

> **Regel:** Ein Feature kann nur aktiviert werden wenn alle seine Abhängigkeiten ebenfalls aktiv sind.
> Dies wird zur Laufzeit durch `saas.config.ts` sichergestellt.
