# Systemarchitektur

## Zonenmodell

Die Anwendung ist in drei Zonen aufgeteilt:

```
┌─────────────────────────────────────────────────────┐
│  PUBLIC ZONE  (/login, /register, /pricing, /)       │
│  Kein Auth erforderlich                              │
├─────────────────────────────────────────────────────┤
│  APP ZONE  (/app/**)                                 │
│  authGuard → [onboardingGuard] → AppShell            │
│  ┌─────────┬──────────┬──────────────────────────┐  │
│  │ Sidebar │ Top-Bar  │   Content Slot (Feature)  │  │
│  └─────────┴──────────┴──────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  ADMIN ZONE  (/admin/**)                             │
│  adminGuard → AdminShell                             │
└─────────────────────────────────────────────────────┘
```

---

## Modul-Interaktionsmatrix

Zeigt welches Modul auf welche Bereiche Einfluss nimmt:

```
                    app.   app.   Cloud  Fire-  Fire-  Loca-
                    config routes Fns    store  Rules  tion
                    .ts    .ts           Rules
─────────────────────────────────────────────────────────────
firebase-auth        ✏️     ✏️     ✏️     ✏️     ✏️
billing              ✏️     ✏️     ✏️     ✏️     ✏️
multi-organization          ✏️     ✏️     ✏️     ✏️
notifications               ✏️            ✏️     ✏️
admin-panel                 ✏️                   ✏️
─────────────────────────────────────────────────────────────
✏️ = schreibt in / fügt hinzu
```

---

## Feature-Abhängigkeiten im Detail

### `firebase-auth` (Basis-Feature)
**Touch Points:**
- `app.config.ts` → `provideFirebaseAuth()`
- `app.routes.ts` → `/login`, `/register`, `/forgot-password`
- `functions/src/index.ts` → `onUserCreated` Trigger
- `firestore.rules` → `users/{uid}` Collection
- `saas.config.ts` → Auth Feature-Flags

**Abhängigkeiten:** keine

---

### `billing`
**Touch Points:**
- `app.config.ts` → `provideBilling()`
- `app.routes.ts` → `/pricing`, `/app/billing`
- `functions/src/index.ts` → `onUserCreated` erweitern (Stripe Customer), Webhook Handler
- `firestore.rules` → `subscriptions`, `customers` Collections
- `saas.config.ts` → Billing Feature-Flags

**Abhängigkeiten:** `firebase-auth` (AuthStateService für aktuellen User)

---

### `multi-organization`
**Touch Points:**
- `app.routes.ts` → `/onboarding`, `/app/organization`
- `functions/src/index.ts` → Invite-Handling Cloud Function
- `firestore.rules` → `organizations`, `invites` Collections
- `saas.config.ts` → `multiOrganization`, `onboarding`, `invitations` Flags

**Abhängigkeiten:** `firebase-auth`

---

## Datenfluss: Authentifizierung → Billing

```
User Login
    ↓
AuthStateService (Signal: currentUser)
    ↓
BillingService liest users/{uid}.plan aus Firestore
    ↓
Entitlements berechnen (plan → BillingConfig.plans[x].entitlements)
    ↓
canUse('feature') überall im Code nutzbar
```

---

## Datenmodell (Firestore)

```
users/{uid}
  ├── uid, email, displayName, photoURL
  ├── role: 'user' | 'super_admin'
  ├── plan: 'free' | 'pro' | 'enterprise'          ← billing
  ├── subscriptionStatus: 'active' | 'trialing'    ← billing
  ├── stripeCustomerId: string                      ← billing
  ├── activeOrganizationId: string                  ← multi-org
  └── onboardedAt: Timestamp                        ← multi-org

organizations/{orgId}
  ├── id, name, slug, plan, createdAt
  └── members/{uid}
        ├── uid, email, role: 'owner' | 'admin' | 'member'
        └── joinedAt

customers/{uid}                                     ← Stripe Extension
  └── subscriptions/{subId}
        ├── status, priceId, currentPeriodEnd
        └── ...

invites/{inviteId}                                   ← multi-org + invitations
  ├── organizationId, email, role
  └── expiresAt
```
