# SaaS Basis-Anwendung: Konzept & Architekturplan

> **Projekt:** Angular + Firebase SaaS-Basisanwendung  
> **Ziel:** Eine wiederverwendbare, standardisierte Basisanwendung für beliebige SaaS-Produkte  
> **Stand:** März 2026

---

## Inhaltsverzeichnis

1. [Was ist eine SaaS-Anwendung?](#1-was-ist-eine-saas-anwendung)
2. [Pflichtanforderungen jeder SaaS-App](#2-pflichtanforderungen-jeder-saas-app)
3. [Architektur der Basisanwendung](#3-architektur-der-basisanwendung)
4. [Tech Stack: Angular + Firebase](#4-tech-stack-angular--firebase)
5. [Theme & Design-System](#5-theme--design-system)
6. [Projektstruktur (NX Monorepo)](#6-projektstruktur-nx-monorepo)
7. [Firestore Datenmodell](#7-firestore-datenmodell)
8. [Firebase Features im Überblick](#8-firebase-features-im-überblick)
9. [Subscription & Abrechnung (Stripe)](#9-subscription--abrechnung-stripe)
10. [Multi-Tenancy Konzept](#10-multi-tenancy-konzept)
11. [Anpassbarkeit & White-Labeling](#11-anpassbarkeit--white-labeling)
12. [Standardisierung: Neue SaaS-Apps in < 1 Woche](#12-standardisierung-neue-saas-apps-in--1-woche)
13. [Roadmap & Phasen](#13-roadmap--phasen)

---

## 1. Was ist eine SaaS-Anwendung?

**SaaS** (Software as a Service) ist ein Softwarebereitstellungsmodell, bei dem die Anwendung zentral betrieben und über das Internet als Service angeboten wird. Nutzer zahlen typischerweise eine Abonnementgebühr (monatlich/jährlich) statt eine einmalige Lizenz.

### Typische SaaS-Geschäftsmodelle

| Modell | Beispiel | Merkmal |
|--------|----------|---------|
| **Freemium** | Notion, Slack | Kostenloser Basiszugang, bezahlte Erweiterungen |
| **Tiered Pricing** | HubSpot, Jira | Gestaffelte Preismodelle (Free/Basic/Pro/Enterprise) |
| **Per-Seat** | GitHub, Figma | Preis pro Benutzer/Sitz |
| **Usage-Based** | Twilio, Stripe | Bezahlen nach tatsächlicher Nutzung |

### Was unterscheidet SaaS von einer normalen Webapp?

- **Multi-Tenancy:** Viele Kunden nutzen dieselbe Infrastruktur
- **Subscription Management:** Automatische Rechnungsstellung, Upgrades/Downgrades
- **User Isolation:** Jeder Kunde sieht nur seine eigenen Daten
- **Skalierbarkeit by Design:** Muss mit 10 oder 10.000 Kunden gleich gut funktionieren
- **Self-Service Onboarding:** Nutzer registrieren sich und starten sofort (kein Sales-Prozess)

---

## 2. Pflichtanforderungen jeder SaaS-App

### 2.1 Authentifizierung & Nutzerverwaltung (MUST-HAVE)

- [ ] E-Mail/Passwort-Registrierung & Login
- [ ] Social Login (Google, GitHub, Microsoft)
- [ ] E-Mail-Verifikation
- [ ] Passwort zurücksetzen
- [ ] Multi-Factor Authentication (MFA/2FA)
- [ ] Session-Management (Token-Erneuerung, Logout überall)
- [ ] Benutzerprofil (Name, Avatar, Einstellungen)

### 2.2 Subscription & Abrechnung (MUST-HAVE)

- [ ] Pricing-Seite mit Plänen
- [ ] Checkout-Flow (Stripe)
- [ ] Aktiver Plan wird im Profil angezeigt
- [ ] Upgrade/Downgrade Plan
- [ ] Abo kündigen
- [ ] Rechnungshistorie
- [ ] Stripe Customer Portal (Self-Service)

### 2.3 Multi-Tenancy / Organisations-Management (MUST-HAVE für B2B)

- [ ] Organisation erstellen
- [ ] Mitglieder einladen (per E-Mail)
- [ ] Rollen innerhalb der Organisation (Owner, Admin, Member, Viewer)
- [ ] Organisation wechseln
- [ ] Daten-Isolation zwischen Organisationen

### 2.4 Dashboard & Navigation (MUST-HAVE)

- [ ] Sidebar-Navigation (kollabierbar)
- [ ] Top-Bar mit Nutzerprofil & Benachrichtigungen
- [ ] Responsive Layout (Mobile/Tablet/Desktop)
- [ ] Dark/Light Mode
- [ ] Breadcrumbs & aktive Navigation-States

### 2.5 Admin-Bereich (MUST-HAVE)

- [ ] Super-Admin Ansicht (alle Organisationen/User)
- [ ] Nutzerverwaltung (sperren, löschen, Rollen vergeben)
- [ ] Systemstatistiken (aktive User, MRR, Churn)
- [ ] Feature-Flags (Features pro Plan/Tenant ein-/ausschalten)

### 2.6 Benachrichtigungen (SHOULD-HAVE)

- [ ] In-App-Benachrichtigungen (Notification Bell)
- [ ] E-Mail-Benachrichtigungen (via Firebase Functions + SendGrid/Resend)
- [ ] Notification Preferences pro User

### 2.7 Sicherheit & Compliance (MUST-HAVE)

- [ ] HTTPS/TLS everywhere
- [ ] RBAC (Role-Based Access Control) auf Firestore-Ebene
- [ ] Datenschutz/DSGVO-konforme Datenverarbeitung
- [ ] Cookie-Banner & Consent Management
- [ ] Terms of Service & Privacy Policy Seiten
- [ ] Audit-Log (wer hat was wann getan)

### 2.8 Performance & Developer Experience (SHOULD-HAVE)

- [ ] Error Tracking (Sentry oder Firebase Crashlytics)
- [ ] Analytics (Firebase Analytics oder Plausible)
- [ ] Monitoring & Alerting (Firebase Performance Monitoring)
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Umgebungs-Management (dev/staging/prod getrennte Firebase-Projekte)

---

## 3. Architektur der Basisanwendung

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular Frontend                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │  Landing    │  │   App       │  │    Admin         │  │
│  │  (Public)   │  │  (Authed)   │  │    Panel         │  │
│  └─────────────┘  └─────────────┘  └──────────────────┘  │
│                                                             │
│  AngularFire SDK ─────────────────────────────────────────► │
└───────────────────────────────┬─────────────────────────────┘
                                │
        ┌───────────────────────▼───────────────────────┐
        │                  Firebase                      │
        │                                               │
        │  ┌────────────┐  ┌─────────────┐             │
        │  │    Auth    │  │  Firestore  │             │
        │  └────────────┘  └─────────────┘             │
        │  ┌────────────┐  ┌─────────────┐             │
        │  │  Storage   │  │  Functions  │             │
        │  └────────────┘  └─────────────┘             │
        │  ┌────────────┐  ┌─────────────┐             │
        │  │  Hosting   │  │  Analytics  │             │
        │  └────────────┘  └─────────────┘             │
        └───────────────────────────────────────────────┘
                        │           │
              ┌─────────▼──┐  ┌─────▼──────┐
              │   Stripe   │  │  SendGrid  │
              │ (Payments) │  │  (E-Mails) │
              └────────────┘  └────────────┘
```

### Layer-Übersicht

| Layer | Technologie | Aufgabe |
|-------|-------------|---------|
| **Presentation** | Angular 18+ | SPA, Routing, UI-Komponenten |
| **State Management** | NgRx oder Signals | App-State, User-State, Subscription-State |
| **Auth** | Firebase Auth | Login, Session, Custom Claims (Rollen) |
| **Datenbank** | Firestore | NoSQL Echtzeit-Datenbank |
| **Backend Logic** | Cloud Functions | Stripe-Webhooks, E-Mails, komplexe Logik |
| **Dateispeicher** | Firebase Storage | Avatare, Uploads |
| **Hosting** | Firebase Hosting | CDN, HTTPS, automatisches Caching |
| **Payments** | Stripe | Abonnements, Rechnungen, Checkout |
| **E-Mail** | SendGrid/Resend | Transaktionale E-Mails |

---

## 4. Tech Stack: Angular + Firebase

### Frontend

```
Angular 18+
├── Angular Material (UI-Komponente)
├── AngularFire (Firebase SDK für Angular)
├── NgRx (State Management) ODER Angular Signals
├── Angular Router (Routing + Route Guards)
├── Reactive Forms (Formulare)
└── i18n (Mehrsprachigkeit, wenn benötigt)
```

### Firebase

```
Firebase
├── Authentication
│   ├── Email/Password
│   ├── Google OAuth
│   ├── Custom Claims (Rollen: admin, owner, member)
│   └── Multi-Tenancy (Identity Platform)
├── Firestore
│   ├── Datenbank (NoSQL, Echtzeit)
│   └── Security Rules (Datenisolation)
├── Cloud Functions (Node.js/TypeScript)
│   ├── Stripe Webhooks
│   ├── E-Mail-Versand
│   ├── Nutzer-Onboarding Trigger
│   └── Admin-Operationen
├── Firebase Hosting
│   ├── SPA-Hosting (Angular Build)
│   └── Cloud Functions URL-Rewriting
├── Firebase Storage
│   └── User Uploads (Avatare, Dateien)
└── Firebase Analytics
    └── Event Tracking, Conversion Funnels
```

### Externe Services

```
Stripe                  → Subscription Billing
SendGrid / Resend       → Transaktionale E-Mails
Sentry (optional)       → Error Tracking
Plausible (optional)    → Privacy-freundliche Analytics
```

---

## 5. Theme & Design-System

### Empfehlung: Angular Material + Custom SaaS Theme

Für eine professionelle, kostenfreie SaaS-Basis empfehlen wir:

#### 🏆 Empfohlen: **MatDash Angular** (Angular Material Design 3)

- **URL:** https://adminmart.com/product/matdash-angular-free-admin-template/
- **Lizenz:** MIT (kostenlos)
- **Features:**
  - Material Design 3 (neueste Google-Design-Sprache)
  - 6 vordefinierte Themes
  - Dark/Light Mode
  - Vollständig responsive
  - Sidebar-Navigation
  - Dashboard-Komponenten (Charts, Cards, Tables)

#### Alternative: **NG Matero**

- **URL:** https://github.com/ng-matero/ng-matero
- **Lizenz:** MIT (kostenlos)
- **Features:**
  - Mehrere Layouts
  - Starkes Color-System
  - RTL-Support
  - Aktiv gepflegt

### Design-Token-System (CSS Custom Properties)

```css
/* saas-base theme tokens */
:root {
  /* Brand Colors */
  --color-primary: #6C47FF;          /* Haupt-Akzentfarbe */
  --color-primary-light: #8B6DFF;
  --color-primary-dark: #4F2EDB;

  /* Grays (Dark Mode First) */
  --color-surface: #0F1117;          /* Hintergrund */
  --color-surface-variant: #1C1E2E;  /* Karten */
  --color-on-surface: #E8E8F0;       /* Text */

  /* Status Colors */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Spacing & Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;
}
```

### Pflicht-UI-Komponenten der Basisanwendung

| Typ | Komponenten |
|-----|-------------|
| **Navigation** | Sidebar (collapsible), Top-Bar, Breadcrumbs, Tabs |
| **Auth Forms** | Login, Register, Forgot Password, MFA Setup |
| **Account** | Profile Page, Password Change, Avatar Upload |
| **Subscription** | Pricing Table, Plan Badge, Upgrade CTA |
| **Org Management** | Invite Form, Members Table, Role Select |
| **Dashboard** | KPI Cards, Line/Bar Charts, Data Tables |
| **Feedback** | Toast Notifications, Empty States, Loading Skeletons |
| **Admin** | User List, Feature Flags Table, System Stats |

---

## 6. Projektstruktur (NX Monorepo)

```
saas-base/                                    ← NX Workspace Root
├── apps/
│   ├── web/                                  ← Angular SPA (Haupt-App)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/                     ← Services, Guards, Interceptors
│   │   │   │   ├── features/
│   │   │   │   │   ├── auth/                 ← Login, Register, MFA
│   │   │   │   │   ├── dashboard/            ← Hauptdashboard
│   │   │   │   │   ├── account/              ← Profil, Einstellungen
│   │   │   │   │   ├── subscription/         ← Pläne, Stripe Portal
│   │   │   │   │   ├── organization/         ← Org-Verwaltung
│   │   │   │   │   └── admin/                ← Super-Admin Bereich
│   │   │   │   ├── shared/                   ← Shared Komponenten
│   │   │   │   └── app.routes.ts
│   │   │   └── environments/
│   │   │       ├── environment.ts            ← Dev (Firebase Emulator)
│   │   │       └── environment.prod.ts       ← Prod Firebase Config
│   │   └── project.json
│   │
│   └── landing/                              ← Optional: Marketing-Landing (SSR/SSG)
│       └── ...
│
├── libs/
│   ├── shared/
│   │   ├── ui/                               ← UI-Komponentenbibliothek
│   │   ├── types/                            ← TypeScript Interfaces & Types
│   │   └── utils/                            ← Hilfsfunktionen
│   ├── firebase/
│   │   ├── auth/                             ← Auth-Service, Guards
│   │   ├── firestore/                        ← Typed Firestore Repositories
│   │   └── functions/                        ← Function-Call-Wrapper
│   └── stripe/
│       └── ...                               ← Stripe-Service
│
├── functions/                                ← Firebase Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── auth/                             ← onUserCreated, Custom Claims
│   │   ├── stripe/                           ← Webhook Handler, Checkout Sessions
│   │   ├── email/                            ← E-Mail-Trigger
│   │   └── admin/                            ← Admin-Operationen
│   └── package.json
│
├── firebase.json                             ← Firebase Hosting + Functions Config
├── firestore.rules                           ← Firestore Security Rules
├── storage.rules                             ← Storage Security Rules
└── nx.json
```

---

## 7. Firestore Datenmodell

### Collections-Übersicht

```
firestore/
│
├── users/{userId}                            ← Erweiterte Nutzerprofile
│   ├── displayName: string
│   ├── email: string
│   ├── photoURL: string
│   ├── role: 'super_admin' | 'user'
│   ├── stripeCustomerId: string
│   ├── activeOrganizationId: string
│   ├── onboardedAt: Timestamp
│   └── updatedAt: Timestamp
│
├── organizations/{orgId}                     ← Organisations-Tenants
│   ├── name: string
│   ├── slug: string
│   ├── plan: 'free' | 'basic' | 'pro' | 'enterprise'
│   ├── stripeSubscriptionId: string
│   ├── stripeCustomerId: string
│   ├── subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled'
│   ├── seats: number
│   ├── createdAt: Timestamp
│   │
│   ├── members/{userId}                      ← Mitglieder der Organisation
│   │   ├── role: 'owner' | 'admin' | 'member' | 'viewer'
│   │   ├── email: string
│   │   ├── joinedAt: Timestamp
│   │   └── invitedBy: string
│   │
│   ├── invites/{inviteId}                    ← Ausstehende Einladungen
│   │   ├── email: string
│   │   ├── role: string
│   │   ├── token: string
│   │   ├── expiresAt: Timestamp
│   │   └── createdBy: string
│   │
│   └── [feature-specific-collections]/       ← App-spezifische Daten (erweiterbar)
│
├── subscriptions/{subscriptionId}            ← Stripe-Sync (via Firebase Extension)
│   ├── status: string
│   ├── priceId: string
│   ├── currentPeriodEnd: Timestamp
│   └── ...
│
└── notifications/{notificationId}           ← In-App-Benachrichtigungen
    ├── userId: string
    ├── type: string
    ├── message: string
    ├── read: boolean
    └── createdAt: Timestamp
```

### Firestore Security Rules (Grundprinzip)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Nutzer können nur ihr eigenes Profil lesen/schreiben
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if isSuperAdmin();
    }

    // Organisation: Nur Mitglieder mit entsprechender Rolle
    match /organizations/{orgId} {
      allow read: if isOrgMember(orgId);
      allow write: if isOrgOwnerOrAdmin(orgId);

      match /members/{memberId} {
        allow read: if isOrgMember(orgId);
        allow write: if isOrgOwnerOrAdmin(orgId);
      }

      // Feature-Daten: Nur Mitglieder der Organisation
      match /{collection}/{docId} {
        allow read, write: if isOrgMember(orgId);
      }
    }

    function isOrgMember(orgId) {
      return exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
    }

    function isOrgOwnerOrAdmin(orgId) {
      let member = get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
      return member.data.role in ['owner', 'admin'];
    }

    function isSuperAdmin() {
      return request.auth.token.role == 'super_admin';
    }
  }
}
```

---

## 8. Firebase Features im Überblick

### Firebase Authentication

| Feature | Nutzung in der Basisapp |
|---------|------------------------|
| Email/Password | Standard-Login |
| Google OAuth | Social Login |
| Custom Claims | Rollen-Management (`role`, `orgId`) |
| Multi-Tenancy (Identity Platform) | Optional: Separate Auth-Tenants pro Organisation |
| Email Verification | Pflicht vor Dashboard-Zugang |
| Password Reset | Self-Service |

### Firestore

| Feature | Nutzung |
|---------|---------|
| Collections/Documents | Datenmodell (Users, Orgs, etc.) |
| Real-time Listeners | Live-Updates im Dashboard |
| Security Rules | Datenisolation zwischen Tenants |
| Composite Indexes | Query-Optimierung |
| Offline Persistence | Bei Bedarf aktivierbar |

### Cloud Functions

| Trigger | Aufgabe |
|---------|---------|
| `auth.user().onCreate` | Nutzer-Profil anlegen, Stripe Customer erstellen |
| `https.onCall` | Checkout Session erstellen, Invite senden |
| `https.onRequest` | Stripe Webhook Handler |
| `firestore.document().onCreate` | E-Mail-Benachrichtigungen auslösen |

### Firebase Hosting

| Feature | Nutzung |
|---------|---------|
| SPA Hosting | Angular Build deployen |
| CDN (Cloud CDN) | Globale Verteilung, schnelle Ladezeiten |
| Custom Domains | Eigene Domain konfigurieren |
| URL Rewriting | `/api/*` → Cloud Functions |
| Preview Channels | Feature-Branch-Previews |

### Firebase Storage

| Feature | Nutzung |
|---------|---------|
| User Uploads | Avatare, Anhänge |
| Security Rules | Nur autorisierte Nutzer |
| Automatic Scaling | Keine Kapazitätsplanung nötig |

---

## 9. Subscription & Abrechnung (Stripe)

### Plan-Struktur (Beispiel)

```typescript
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    seats: 1,
    features: ['1 Nutzer', '2 Projekte', 'Community Support'],
    stripePriceId: null,
  },
  basic: {
    name: 'Basic',
    price: 19,        // €/Monat
    seats: 5,
    features: ['5 Nutzer', '10 Projekte', 'E-Mail Support', 'API-Zugang'],
    stripePriceId: 'price_xxx_basic_monthly',
  },
  pro: {
    name: 'Pro',
    price: 49,
    seats: 20,
    features: ['20 Nutzer', 'Unbegrenzte Projekte', 'Priority Support', 'Custom Domain'],
    stripePriceId: 'price_xxx_pro_monthly',
  },
  enterprise: {
    name: 'Enterprise',
    price: null,       // Custom Pricing
    seats: -1,         // Unbegrenzt
    features: ['Unbegrenzte Nutzer', 'SLA', 'Dedicated Support', 'SSO', 'Custom Integration'],
    stripePriceId: null, // Individueller Stripe-Vertrag
  },
};
```

### Stripe-Integrations-Flow

```
User klickt "Upgrade"
       ↓
Angular → Cloud Function: createCheckoutSession(priceId, orgId)
       ↓
Cloud Function erstellt Stripe Checkout Session
       ↓
User wird zu Stripe Checkout weitergeleitet
       ↓
User zahlt → Stripe sendet Webhook an Firebase Function
       ↓
Cloud Function: checkout.session.completed
       ↓
Firestore: organizations/{orgId}.plan = 'pro'
           organizations/{orgId}.stripeSubscriptionId = '...'
       ↓
Angular (Real-time Listener) aktualisiert UI sofort
```

### Empfohlene Stripe Firebase Extension

Firebase bietet die offizielle Extension **"Run Payments with Stripe"**:
- Automatisches Erstellen von Stripe Customers bei Nutzerregistrierung
- Firestore-basiertes Subscriptions-Management
- Webhook-Handling bereits eingebaut
- **Installation:** `firebase ext:install stripe/firestore-stripe-payments`

---

## 10. Multi-Tenancy Konzept

### Ansatz: Single Firebase Project, Organisation-basierte Isolation

Für unsere Basisanwendung wählen wir **eine Firebase-Instanz mit organisationsbasierter Trennung**. Dies ist der pragmatische Ansatz für den Start.

```
Firebase Project: saas-base-prod
│
├── Tenant A: Organization "Firma XY" (orgId: org_abc123)
│   ├── users/ (Mitglieder)
│   ├── [feature-data]/ (isoliert durch Security Rules)
│   └── subscriptionStatus: 'pro'
│
└── Tenant B: Organization "Startup Z" (orgId: org_def456)
    ├── users/ (Mitglieder)
    ├── [feature-data]/ (isoliert durch Security Rules)
    └── subscriptionStatus: 'basic'
```

### Tenant-Identifikation im Frontend

```typescript
// Angular Route Guard
@Injectable()
export class OrgGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user?.activeOrganizationId) {
          this.router.navigate(['/onboarding']);
          return false;
        }
        return true;
      })
    );
  }
}
```

### Feature-Flags (Plan-basiert)

```typescript
// Feature Flag Service
@Injectable()
export class FeatureFlagService {
  canUseFeature(feature: string): Observable<boolean> {
    return this.orgService.currentOrg$.pipe(
      map(org => {
        const plan = org.plan;
        const featureMatrix = {
          'api_access':     ['basic', 'pro', 'enterprise'],
          'custom_domain':  ['pro', 'enterprise'],
          'sso':           ['enterprise'],
          'audit_log':     ['pro', 'enterprise'],
        };
        return featureMatrix[feature]?.includes(plan) ?? false;
      })
    );
  }
}
```

---

## 11. Anpassbarkeit & White-Labeling

### Konfigurationsbasierter Ansatz

Jede neue SaaS-Anwendung auf Basis dieser Basisapp wird über eine zentrale Konfigurationsdatei angepasst:

```typescript
// apps/web/src/app/app.config.ts
export const APP_CONFIG: SaaSConfig = {
  // Branding
  appName: 'MeinSaaS',
  appTagline: 'Die beste Lösung für X',
  logoUrl: '/assets/logo.svg',
  primaryColor: '#6C47FF',

  // Feature-Toggle
  features: {
    multiOrganization: true,
    publicSignup: true,
    inviteOnly: false,
    trialDays: 14,
  },

  // Pläne
  plans: PLANS,  // Aus dem Stripe-Modul

  // Navigation (anpassbar je nach App)
  sidebarItems: [
    { icon: 'dashboard', label: 'Dashboard', route: '/app/dashboard' },
    { icon: 'project', label: 'Projekte', route: '/app/projects' },
    // → Hier werden App-spezifische Menüpunkte eingetragen
  ],

  // Legal
  supportEmail: 'support@meinsaas.de',
  termsUrl: '/legal/terms',
  privacyUrl: '/legal/privacy',
};
```

---

## 12. Standardisierung: Neue SaaS-Apps in < 1 Woche

### Vorgehensmodell

```
Woche 1: Setup & Core (bereits durch Basisapp gelöst!)
├── ✅ Firebase-Projekt anlegen (dev, staging, prod)
├── ✅ Angular-App aus Template klonen
├── ✅ Stripe-Account konfigurieren, Pläne anlegen
├── ✅ App-Konfiguration anpassen (Name, Farben, Pläne)
└── ✅ Eigene Feature-Collections in Firestore definieren

Woche 2: Kernfunktionalität (App-spezifisch)
├── Neue Feature-Module anlegen (z.B. /app/projekte)
├── Firestore Collections für Features definieren
├── UI-Komponenten aus der Shared-Library nutzen
└── Feature-spezifische Cloud Functions schreiben

Woche 3: Polish & Launch
├── Landing Page anpassen
├── E-Mail-Templates anpassen
├── Beta-Test mit echten Nutzern
└── Production Deploy
```

### Schablonen-Prinzip

Die Basisanwendung stellt bereit:
- **Core-Modul:** Auth, Guards, HTTP-Interceptors, State-Management
- **Auth-Modul:** Fertige Login/Register/MFA-Seiten
- **Account-Modul:** Profil, Passwort, Benachrichtigungseinstellungen
- **Subscription-Modul:** Pricing-Seite, Stripe-Integration, Plan-Upgrade
- **Org-Modul:** Team-Management, Einladungen, Rollen
- **Admin-Modul:** Super-Admin-Panel
- **Shared-UI-Lib:** Design System, Atomic Components

**Neu für jede App:** Nur die Feature-Module (den eigentlichen Kern der SaaS-Anwendung)

---

## 13. Roadmap & Phasen

### Phase 1: Foundation (2-3 Wochen)

```
[ ] NX Monorepo aufsetzen (saas-base)
[ ] Angular 18 App initialisieren
[ ] Firebase Projekte anlegen (dev + prod)
[ ] AngularFire integrieren
[ ] Theme integrieren (MatDash oder NG Matero)
[ ] Design-Token-System definieren
[ ] Grundlegendes Routing-Setup (public/auth/app)
[ ] Basis-Layouts: AuthLayout, AppLayout, AdminLayout
```

### Phase 2: Authentication (1-2 Wochen)

```
[ ] Firebase Auth integrieren
[ ] Login-Seite (Email + Google)
[ ] Registrierung mit E-Mail-Verifikation
[ ] Passwort-Reset
[ ] Auth-Guards & Route Protection
[ ] User-Profil in Firestore anlegen (onUserCreated Function)
[ ] Profil-Seite (Avatar, Name, E-Mail)
```

### Phase 3: Organisation & Multi-Tenancy (1-2 Wochen)

```
[ ] Onboarding-Flow (Org erstellen nach Registrierung)
[ ] Organisation-Service (CRUD, State)
[ ] Mitglieder einladen (Cloud Function + E-Mail)
[ ] Invite-Akzeptierung-Flow
[ ] RBAC im Frontend (Direktiven für Rolle)
[ ] Firestore Security Rules für Tenant-Isolation
```

### Phase 4: Subscription (1-2 Wochen)

```
[ ] Stripe-Account Setup
[ ] Firebase Stripe Extension installieren
[ ] Pricing-Seite designen
[ ] Checkout-Flow implementieren
[ ] Webhook-Handler testen
[ ] Plan-basierte Feature-Guards
[ ] Stripe Customer Portal integrieren
[ ] Subscription-Status im Dashboard anzeigen
```

### Phase 5: Admin & Polish (1 Woche)

```
[ ] Super-Admin Panel
[ ] Nutzerübersicht & -verwaltung
[ ] System-Statistiken
[ ] In-App-Benachrichtigungen
[ ] Error Tracking (Sentry)
[ ] Performance Monitoring
[ ] CI/CD Pipeline (GitHub Actions → Firebase Hosting)
[ ] Dokumentation für Entwickler
```

### Phase 6: Erste produktive SaaS-App (2-3 Wochen)

```
[ ] Feature-Module der ersten echten App implementieren
[ ] Landing-Page erstellen
[ ] Beta-Test
[ ] Stripe Produktiv-Konfiguration
[ ] DSGVO/Datenschutz prüfen
[ ] Go-Live
```

---

## Zusammenfassung

| Aspekt | Entscheidung | Begründung |
|--------|-------------|------------|
| **Frontend** | Angular 18+ | Typsicherheit, Enterprise-ready, bestehendes Know-how |
| **UI** | Angular Material + MatDash | MIT, Material Design 3, SaaS-optimiert |
| **Backend** | Firebase | Managed, skalierbar, gutes Free-Tier |
| **Auth** | Firebase Authentication | Native Integration, Custom Claims für RBAC |
| **Datenbank** | Firestore | NoSQL, Real-time, gut für SaaS-Datenmodelle |
| **Serverless** | Cloud Functions (TypeScript) | Stripe Webhooks, E-Mail, Admin-Logic |
| **Payments** | Stripe + Firebase Extension | Standard, gut dokumentiert, einfache Integration |
| **Hosting** | Firebase Hosting | CDN, Preview Channels, kostengünstig |
| **Monorepo** | NX | Bestehende Infrastruktur, Code-Sharing |
| **Multi-Tenancy** | Org-basiert (Single Project) | Pragmatisch für Start, erweiterbar |

---

*Dieses Dokument ist ein lebendiges Konzept. Es wird mit dem Fortschritt des Projekts aktualisiert.*
