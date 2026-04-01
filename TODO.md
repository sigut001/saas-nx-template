# SaaS Base Template – Entwicklungs-TODO
> **Stand:** März 2026 | **Referenz:** `saas-base-application-plan.md` + `saas-ui-architecture.md`

---

## Phase 1: Foundation ✅ (abgeschlossen)

### 1.1 Projekt-Setup
- [x] NX Monorepo aufgesetzt (`saas-nx-template`)
- [x] Angular 19 App initialisiert (`apps/web`)
- [x] Standalone-Architektur (kein NgModule)
- [x] Router konfiguriert (`withComponentInputBinding`, `withViewTransitions`)
- [x] Firebase-Projekt angelegt (`saas-example-94204`)
- [x] `environments/environment.ts` + `environment.prod.ts` mit echter Firebase-Config

### 1.2 Routing-Struktur ✅
- [x] Drei Zonen: Auth Zone (`/login`), App Zone (`/app/**`), Admin Zone (`/admin/**`)
- [x] Alle Routen als Lazy-Loaded Komponenten
- [x] Wildcard-Route (404 NotFound) implementiert
- [ ] `onboardingGuard` – Weiterleitung zu `/onboarding` wenn kein `activeOrganizationId`

### 1.3 Shell-Komponenten ✅ (Basis vorhanden)
- [x] `AuthShellComponent` – Auth-Card-Layout
- [x] `AppShellComponent` – Sidebar + Top-Bar + Content-Area
- [x] `AdminShellComponent` – vorhanden
- [ ] Sidebar: Responsive (kollabierbar auf Mobile)
- [ ] Sidebar: Active-Route-Highlighting (`routerLinkActive`)
- [ ] Sidebar: `NAV_ITEMS` Konfig aus `app.config.ts` statt hartcodiert
- [ ] Top-Bar: User-Avatar + Dropdown (Account, Logout)
- [ ] Top-Bar: Organisation-Switcher

### 1.4 Design-System (noch offen)
- [ ] `@angular/material` installieren
- [ ] Design-Token-System in `styles.css` (CSS Custom Properties: `--color-primary`, `--color-surface`, etc.)
- [ ] Dark Mode Grundlage
- [ ] Google Font `Inter` einbinden

---

## Phase 2: Authentication ✅ (abgeschlossen!)

### 2.1 firebase-auth Library (`libs/firebase-auth/`)
- [x] `AuthService` – Firebase-Wrapper (Email/PW, Google, Register, Logout, Reset)
- [x] `AuthStateService` – Signal-basierter State (currentUser, isAuthenticated, uid, role)
- [x] `provideFirebaseAuth()` – Einzeiler-Provider für `app.config.ts`
- [x] `authGuard` – Schützt `/app/**` (echte Firebase Auth)
- [x] `adminGuard` – Custom Claims (`role === 'super_admin'`)
- [x] `LoginComponent` – Email + Google, Validierung, Error-Handling ✅ getestet
- [x] `RegisterComponent` – Name, Email, PW, PW-Bestätigung + Email-Verifikation ✅ getestet
- [x] `ForgotPasswordComponent` – Reset-Mail ✅ getestet
- [x] `setup.js` – Automatisches Einbindungs-Skript (`node libs/firebase-auth/setup.js --project=web`)
- [x] `README.md` für die Library

### 2.2 App-Integration
- [x] `provideFirebaseAuth()` in `app.config.ts` eingebunden
- [x] Auth-Routen in `app.routes.ts` (login, register, forgot-password)
- [x] `.env` mit Firebase Admin SDK Credentials
- [x] `.gitignore` schützt Secrets

### 2.3 Noch offen in Phase 2
- [ ] `onUserCreated` Cloud Function – legt `users/{uid}` Firestore-Dokument an ✅ deployed + getestet
- [ ] **⚠️ Known Issue:** E-Mail-Verifikation nach Registrierung kommt nicht an (Firebase default Sender prüfen – ggf. Custom SMTP / SendGrid nötig)
- [ ] Profil-Seite: Avatar-Anzeige, Name bearbeiten, PW ändern
- [ ] Avatar-Upload zu Firebase Storage
- [ ] E-Mail-Verifikations-Guard (Redirect wenn `emailVerified === false`)

---

## Phase 3: Multi-Tenancy & Organisation 🔴 (noch nicht begonnen)

### 3.1 Cloud Functions einrichten (Voraussetzung für alles weitere)
- [ ] `functions/` Ordner im Projekt anlegen
- [ ] Firebase CLI konfigurieren (`firebase init functions`)
- [ ] `onUserCreated` Trigger:
  - Firestore `users/{uid}` anlegen (`displayName`, `email`, `photoURL`, `role: 'user'`, `createdAt`)
  - Stripe Customer anlegen (falls Stripe bereits aktiv)

### 3.2 Onboarding-Flow
- [ ] Route `/onboarding` anlegen
- [ ] `OnboardingComponent` – Wizard: Org-Name eingeben
- [ ] Firestore: `organizations/{orgId}` Dokument anlegen
- [ ] Firestore: `organizations/{orgId}/members/{uid}` mit Rolle `owner`
- [ ] User-Dokument aktualisieren: `activeOrganizationId`
- [ ] `onboardingGuard` – prüft ob `activeOrganizationId` gesetzt

### 3.3 OrgService
- [ ] `OrgService` (`libs/org/`) mit `currentOrg` Signal
- [ ] Org laden aus Firestore anhand `activeOrganizationId`
- [ ] Organisation-Switcher in Top-Bar

### 3.4 Mitglieder-Verwaltung (Organization-Seite)
- [ ] Mitglieder-Tabelle (Name, E-Mail, Rolle, Beitrittsdatum)
- [ ] Mitglied einladen (Cloud Function + E-Mail via SendGrid/Resend)
- [ ] Einladungs-Link + Firestore `invites/{inviteId}`
- [ ] Invite-Akzeptierungs-Flow (`/invite/:token`)
- [ ] Rolle ändern / Mitglied entfernen

### 3.5 RBAC & Security
- [ ] `RoleDirective` – `*ifRole="'admin'"` – zeigt/versteckt Elemente
- [ ] `firestore.rules` schreiben (User-Isolation, Org-Isolation)
- [ ] `storage.rules` schreiben
- [ ] Lokal testen via Firebase Emulator

---

## Phase 4: Subscription & Stripe 🔴 (noch nicht begonnen)

- [ ] Stripe-Account anlegen + Pläne definieren
- [ ] Firebase Extension „Run Payments with Stripe" installieren
- [ ] Pricing-Seite (`/pricing`, Public Zone)
- [ ] `createCheckoutSession()` Cloud Function
- [ ] Stripe Webhooks: `checkout.session.completed`, `subscription.updated`, `subscription.deleted`
- [ ] Billing-Seite: Plan-Badge, Nächstes Datum, Stripe Customer Portal
- [ ] `PlanGuard` – Route nach Plan absichern
- [ ] `FeatureFlagService` – `canUseFeature('api_access')`

---

## Phase 5: Admin-Panel 🔴 (noch nicht begonnen)

- [ ] `/admin/users` – Nutzerliste, sperren/löschen, Rolle ändern
- [ ] `/admin/organizations` – Plan-Override, Org deaktivieren
- [ ] `/admin/flags` – Feature-Flags pro Plan/Tenant
- [ ] `/admin/stats` – MRR, Churn, aktive User (KPI-Charts)

---

## Phase 6: Querschnittsthemen 🔴 (noch nicht begonnen)

### 6.1 Shared UI-Library (`libs/shared/ui`)
- [ ] `ToastService` – globale Toast-Benachrichtigungen
- [ ] `DialogService` – generischer Modal-Wrapper
- [ ] `LoadingSkeletonComponent`
- [ ] `EmptyStateComponent`
- [ ] `PlanBadgeComponent`
- [ ] `ConfirmDialogComponent`

### 6.2 Notifications
- [ ] Notification Bell + Badge in Top-Bar
- [ ] Firestore `notifications/{id}` Listener
- [ ] E-Mail-Benachrichtigungen (Cloud Functions + SendGrid/Resend)

### 6.3 Fehler-Handling & CI/CD
- [ ] Globaler Angular `ErrorHandler`
- [ ] Sentry einbinden (optional)
- [ ] GitHub Actions: Build + Firebase Deploy bei Push auf `main`
- [ ] Preview Channels für Pull Requests

---

## Phase 7: Feature-Generator Schematic ✅ (abgeschlossen)

```bash
# Ziel: Ein vollständiges SaaS-Webentwicklung-Modul in Sekunden generieren
npx nx g ./tools/saas-generators:saas-feature name --directory=features/web-entwicklung
```

- [x] Lokales NX Plugin in `tools/saas-generators` aufgesetzt
- [x] Generator-Skript nutzt `@nx/angular:library` unter der Haube (Standalone, Routing, SCSS)
- [x] Automatische Erstellung einer deklarativen `manifest.ts` zur Shell-Anbindung
- [x] Generator automatisiert Export-Listen in der Bibliothek (`index.ts`)

---

## 🎯 Nächster konkreter Schritt: Analytics & Documents Module

**Phase 8 – Web-Entwicklungs-Portal weiter ausbauen:**

1. **Analytics Modul (`libs/features/web-entwicklung/analytics`) mit Leben füllen**
   - KPI-Charts, Besucherstatistiken, Traffic-Kurven.
2. **Documents Modul (`libs/features/web-entwicklung/documents`) mit Leben füllen**
   - Dokumentverwaltung, Formulare, Upload-Masken.
3. Content Management System (CMS) abschließen und mit den restlichen App-Logiken verknüpfen.
