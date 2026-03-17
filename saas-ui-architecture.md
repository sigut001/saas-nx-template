# SaaS UI-Architektur: Oberfläche, Struktur & Business-Logic-Slots

> **Zweck dieses Dokuments:** Abstrakte Beschreibung des UI-Aufbaus einer SaaS-Anwendung – unabhängig von konkreter Business-Logik. Es definiert die Oberflächenschichten, welche Einstiegspunkte ("Slots") für beliebige Business-Logik existieren und welche Pakete für die Umsetzung empfohlen werden.

---

## 1. Die drei Zonen einer SaaS-Oberfläche

Jede SaaS-Anwendung hat strukturell drei klar trennbare Zonen:

```
┌─────────────────────────────────────────────────────────┐
│  ZONE 1: PUBLIC SHELL                                    │
│  (Nicht eingeloggt – Marketing, Auth)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Landing  │ │ Pricing  │ │  Login   │ │ Register  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│  ZONE 2: APP SHELL                                       │
│  (Eingeloggt – Kern der Anwendung)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Sidebar  │  Top-Bar  │                          │   │
│  │           │           │   ┌──────────────────┐   │   │
│  │  [Nav]    │  [User]   │   │  CONTENT SLOT    │   │   │
│  │           │           │   │  (Business Logic)│   │   │
│  │           │           │   └──────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  ZONE 3: ADMIN SHELL                                     │
│  (Nur Super-Admins – Plattformverwaltung)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │  Users   │ │  Orgs    │ │ Flags    │                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Zone 1: Public Shell

### Zweck
Marketing, Conversion, Authentifizierung. Keine Personalisierung, keine Daten aus der Business-Logik.

### Feste Seiten (immer vorhanden)

| Route | Seite | Inhalt |
|---|---|---|
| `/` | **Landing Page** | Hero, Features, Testimonials, Pricing CTA |
| `/pricing` | **Pricing Page** | Plantabelle mit Vergleich |
| `/login` | **Login** | Email + Social Login |
| `/register` | **Registrierung** | Form + Email-Verifikation |
| `/forgot-password` | **PW Reset** | Email-Formular |
| `/legal/privacy` | Datenschutz | Statischer Text |
| `/legal/terms` | AGB | Statischer Text |

### Business-Logic-Slots in Zone 1

| Slot | Was wird eingetragen |
|---|---|
| **Feature-Liste** auf Landing | App-spezifische Vorteile ("Verwalte deine X...") |
| **Plan-Namen & Preise** auf Pricing | Stripe-Produkte der konkreten App |
| **App-Name & Logo** | Branding-Konfiguration |

---

## 3. Zone 2: App Shell

Das ist der Kern. Alle Business-Logik lebt hier.

### Shell-Komponenten (immer vorhanden, nie app-spezifisch)

#### 3.1 Sidebar-Navigation
```
┌─────────────────┐
│ [Logo]          │
├─────────────────┤
│ ○ Dashboard     │  ← immer vorhanden
│ ○ [SLOT: Nav]   │  ← app-spezifische Menüpunkte
│ ○ [SLOT: Nav]   │
│ ○ [SLOT: Nav]   │
├─────────────────┤
│ ○ Account       │  ← immer vorhanden
│ ○ Settings      │  ← immer vorhanden
│ ○ Billing       │  ← immer vorhanden
└─────────────────┘
```

Die Navigation wird über eine **Konfigurationsdatei** gesteuert:
```typescript
// app.config.ts – wird pro SaaS-App angepasst
export const NAV_ITEMS: NavItem[] = [
  // → SLOT: Hier trägt die Business-App ihre Features ein
  { icon: 'folder', label: 'Projekte', route: '/app/projects', requiredPlan: 'basic' },
  { icon: 'chart',  label: 'Analytics', route: '/app/analytics', requiredPlan: 'pro' },
];
```

#### 3.2 Top-Bar
Immer sichtbar. Enthält:
- Breadcrumb (automatisch aus Route generiert)
- Notification Bell (generisch, jede App kann Notifications pushen)
- User-Avatar + Dropdown (Account, Billing, Logout)
- Organisation-Switcher (falls Multi-Tenancy aktiv)

#### 3.3 Content Area – der zentrale SLOT
```
┌──────────────────────────────────────────┐
│  <router-outlet>                         │
│                                          │
│  → Hier werden Feature-Module gerendert  │
│  → Vollständig austauschbar              │
│  → Jedes Feature ist ein eigenes         │
│     Angular Lazy-Loaded Module           │
│                                          │
└──────────────────────────────────────────┘
```

### Feste Seiten in Zone 2 (gehören zur Basis)

| Route | Seite | Inhalt |
|---|---|---|
| `/app/dashboard` | **Dashboard** | KPI-Cards, Charts – **SLOT für App-Daten** |
| `/app/account` | Profil | Avatar, Name, Email, PW-Änderung |
| `/app/settings` | Einstellungen | Notification Prefs, Theme |
| `/app/billing` | Abrechnung | Plan-Badge, Stripe Portal, Rechnungen |
| `/app/organization` | Org-Verwaltung | Mitglieder, Rollen, Einladungen |
| `/onboarding` | Onboarding | Wizard: Org erstellen → Erster Schritt |

### Business-Logic-Slots in Zone 2

| Slot | Typ | Wie eingebunden |
|---|---|---|
| **Sidebar-Einträge** | Konfiguration | `NAV_ITEMS[]` in `app.config.ts` |
| **Dashboard-Widgets** | Komponenten | `DashboardWidgetRegistry` – jede App registriert eigene KPI-Cards |
| **Feature-Routes** | Lazy Modules | `app.routes.ts` → `loadChildren(...)` |
| **Notification-Typen** | Enum/Handler | `NotificationHandlerRegistry` |
| **Feature Flags** | Plan-Matrix | `FeatureFlagService.canUse('feature-key')` |

---

## 4. Zone 3: Admin Shell

Nur erreichbar für Nutzer mit `role: 'super_admin'`. Komplett separate Route-Gruppe.

### Feste Seiten

| Route | Inhalt |
|---|---|
| `/admin/users` | Alle Nutzer, sperren/löschen |
| `/admin/organizations` | Alle Orgs, Plan-Override |
| `/admin/flags` | Feature-Flags pro Plan/Tenant |
| `/admin/stats` | MRR, Churn, aktive Nutzer |

### Business-Logic-Slots in Zone 3

| Slot | Was wird eingetragen |
|---|---|
| **Stats-Metriken** | App-spezifische KPIs (z.B. "Erstellte Projekte/Tag") |
| **Zusatz-Admin-Seiten** | Feature-spezifische Verwaltung |

---

## 5. Querschnittsthemen (Shell-übergreifend)

Diese Systeme laufen in allen Zonen und sind vollständig generisch:

| System | Funktion | Business-Logic-Slot |
|---|---|---|
| **Auth Guard** | Schützt Zone 2 + 3 | Kein Slot – fix |
| **Plan Guard** | Prüft Subscription für Features | `requiredPlan: 'pro'` pro Route |
| **Theme System** | Dark/Light Mode | Branding-Farben in Konfiguration |
| **Toast/Snackbar** | Globale Notifications | Jedes Feature kann Toasts auslösen |
| **Dialog Service** | Modals | Features öffnen eigene Dialoge |
| **Loading States** | Skeleton Screens | Fix – jede Feature-Komponente nutzt es |
| **Error Boundary** | 404, 500, Offline | Fix |
| **i18n** | Mehrsprachigkeit (optional) | Feature-Modul bringt eigene Translations |

---

## 6. Wie wird Business-Logik eingebunden?

### Schritt 1: Feature-Route registrieren
```typescript
// apps/web/src/app/app.routes.ts
{
  path: 'app',
  component: AppShellComponent,  // ← Sidebar + Topbar
  children: [
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/...')},
    // → HIER trägt die Business-App ihre Feature-Routen ein:
    { path: 'projects', loadChildren: () => import('@saas-app/projects').then(m => m.routes) },
    { path: 'invoices', loadChildren: () => import('@saas-app/invoices').then(m => m.routes) },
  ]
}
```

### Schritt 2: Nav-Eintrag hinzufügen
```typescript
// app.config.ts
NAV_ITEMS: [
  { label: 'Projekte', icon: 'folder', route: '/app/projects' },
]
```

### Schritt 3: Dashboard-Widget registrieren (optional)
```typescript
// Feature-Modul registriert eigene KPI-Card
DashboardRegistry.register({
  id: 'projects-count',
  component: ProjectsKpiCard,
  requiredPlan: 'basic'
});
```

Das war es. Die Shell weiß nichts von "Projekten" – sie rendert nur was registriert ist.

---

## 7. Standardisierte Feature-Modul-Struktur

Jede Business-Logik-Einheit folgt diesem Schema:

```
libs/features/[feature-name]/
├── src/
│   ├── lib/
│   │   ├── [feature].routes.ts        ← Routing
│   │   ├── [feature]-list/            ← Übersicht
│   │   ├── [feature]-detail/          ← Detail-Ansicht
│   │   ├── [feature]-form/            ← Create/Edit
│   │   └── [feature].service.ts       ← Firestore-Zugriff
│   ├── index.ts                       ← Public API
│   └── models/
│       └── [feature].model.ts         ← TypeScript Interface
```

Dieses Schema funktioniert für: CRM, Projektmanagement, Buchungen, Rechnungen, Inventar, Tickets, etc.

---

## 8. Empfohlene Pakete für die Umsetzung

### 8.1 UI-Framework & Komponenten

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Angular Material** (`@angular/material`) | Basis-Komponenten (Buttons, Inputs, Tables, Dialoge) | ✅ Erste Wahl – offiziell, stabil, Angular-native |
| **NG Matero** (`@ng-matero/extensions`) | Erweiterte Material-Komponenten (DataGrid, DatePicker) | ✅ Als Ergänzung zu Angular Material |
| **PrimeNG** (`primeng`) | Komplettes UI-Kit (Alternative zu Material) | ⚠️ Nur wenn Material nicht gewünscht |
| **CDK** (`@angular/cdk`) | Drag & Drop, Overlay, Virtual Scrolling | ✅ Immer – ist Teil von Material |

### 8.2 State Management

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Angular Signals** (built-in) | Reaktiver State ohne externe Libs | ✅ Erste Wahl für einfache States |
| **NgRx** (`@ngrx/store`) | Komplexer globaler State (Redux-Pattern) | ✅ Wenn globaler Subscription/Auth-State komplex wird |
| **NgRx Signals** (`@ngrx/signals`) | Modernes NgRx ohne Boilerplate | ✅ Empfohlen als NgRx-Alternative |

### 8.3 Firebase

| Paket | Zweck | Empfehlung |
|---|---|---|
| **AngularFire** (`@angular/fire`) | Offizielle Angular Firebase Integration | ✅ Pflicht |
| `firebase` | Firebase SDK | ✅ Pflicht (Peer Dependency) |

### 8.4 Routing & Guards

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Angular Router** (built-in) | Routing, Lazy Loading | ✅ Pflicht |
| Functional Guards (`CanActivateFn`) | Auth + Plan-Guards | ✅ Moderner Ansatz ohne Klassen |

### 8.5 Formulare

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Reactive Forms** (built-in) | Alle Formulare | ✅ Pflicht |
| **Zod** (`zod`) | Schema-Validierung | ✅ Empfohlen für typsichere Validierung |

### 8.6 Charts & Visualisierung

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Apache ECharts** (`ngx-echarts`) | Leistungsstarke Charts | ✅ Erste Wahl |
| **Chart.js** (`ng2-charts`) | Einfachere Charts | ⚠️ Als Alternative |

### 8.7 Utilities

| Paket | Zweck | Empfehlung |
|---|---|---|
| **date-fns** | Datum-Formatierung | ✅ |
| **rxjs** | Reaktive Streams | ✅ Pflicht (Angular-Kern) |
| **uuid** | IDs generieren | ✅ |

### 8.8 Payments

| Paket | Zweck | Empfehlung |
|---|---|---|
| **Stripe.js** (`@stripe/stripe-js`) | Stripe Checkout, Customer Portal | ✅ Pflicht |

---

## 9. Zusammenfassung: Was ist fix, was ist Slot?

| Bereich | Fix (Basis-Shell) | Slot (Business-App) |
|---|---|---|
| Routing-Struktur | ✅ Public/App/Admin Gruppen | Feature-Routen darin |
| Sidebar | ✅ Shell + Account-Links | NAV_ITEMS[] konfigurierbar |
| Dashboard | ✅ Layout + Widget-Grid | Widget-Komponenten registrierbar |
| Auth | ✅ Login/Register/Guards | – |
| Subscription | ✅ Billing-Seite + Plan-Guards | Plan-Namen + Preise |
| Org-Management | ✅ Komplett | – |
| Admin Panel | ✅ User/Org/Flags | App-spezifische Stats |
| Notifications | ✅ Bell + Toast-System | Notification-Typen definierbar |
| Feature-Inhalte | – | Vollständig by App |
| Firestore Collections | Basis: users, orgs | Feature: eigene Collections |
| Cloud Functions | Auth-Trigger, Stripe | Feature-spezifische Functions |

---

## 10. Feature-Generator (Schematic)

### Konzept

Wenn die SaaS-Base als Template genutzt wird, soll ein NX Generator den Entwickler in Sekunden von 0 auf ein vollständiges Feature bringen – ohne manuelle Datei-Anpassungen.

```bash
npx nx generate @saas-base/schematics:feature --name=projects --icon=folder --plan=basic
```

### Was der Generator automatisch erledigt

#### 10.1 Dateien anlegen (aus Templates)
```
libs/features/projects/
├── projects-list/projects-list.component.ts
├── projects-detail/projects-detail.component.ts
├── projects-form/projects-form.component.ts
├── projects.service.ts        ← Firestore CRUD für 'projects'-Collection
├── projects.model.ts          ← TypeScript Interface
└── projects.routes.ts         ← /app/projects + /:id + /new
```

#### 10.2 Bestehende Dateien automatisch anpassen

| Datei | Änderung |
|---|---|
| `app.routes.ts` | `loadChildren`-Eintrag für `/app/projects` hinzufügen |
| `nav.config.ts` | Sidebar-Eintrag `{ label: 'Projects', icon: 'folder', route: '/app/projects', requiredPlan: 'basic' }` |
| `firestore.rules` | Basis-Read/Write-Rule für `organizations/{orgId}/projects` |

#### 10.3 Interaktive Parameter

| Parameter | Beispiel | Wirkung |
|---|---|---|
| `--name` | `projects` | Feature-Name (Ordner, Klassen, Routen) |
| `--icon` | `folder` | Material Icon für Sidebar |
| `--plan` | `basic` | Mindest-Plan für Route Guard |
| `--detail` | `true/false` | Detail-Seite generieren? |
| `--collection` | `projects` | Firestore Collection Name |

### Was dafür gebaut werden muss

1. **NX Plugin** in `libs/schematics/` des Template-Repos
2. **Dateivorlagen** (`.template`-Dateien) für alle 5 Dateitypen
3. **AST-Transformationen** via `@nx/devkit` Tree-API:
   - `addRoute()` für `app.routes.ts`
   - String-Injection für `nav.config.ts`
   - Regel-Append für `firestore.rules`
4. **Schema** (`schema.json`) mit den Parametern und Validierung

### Standardisierter Feature-Slot-Vertrag

Jedes generierte Feature muss diese "Schnittstelle" einhalten damit die Shell es nahtlos einbinden kann:

```typescript
// Jedes Feature exportiert diese public API (index.ts)
export { ProjectsRoutes } from './projects.routes';      // ← für app.routes.ts
export { PROJECTS_NAV } from './projects.nav';           // ← für nav.config.ts
export { ProjectsKpiCard } from './projects-kpi-card';  // ← für Dashboard (optional)
```

Die Shell importiert Features **ausschließlich** über diese Public API – keine internen Pfade.

