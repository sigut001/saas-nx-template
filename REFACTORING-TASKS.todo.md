# 🚀 SaaS Modularisierungs-Refactoring (Tenant & Custom Token)

Diese To-Do-Liste fasst alle Schritte zusammen, um die SaaS-Anwendung vom starren `config.ts`-Format auf das dynamische "Capability-Based" System mit sicheren Mandanten-Tokens (Firebase Cloud Functions) umzubauen.

## Phase 1: Shared Core & Typisierung (`libs/shared/...`)
- [x] `FeatureManifest` Interface anlegen (`requiredIntegrations: string[]`, `requiredRoles: string[]`).
- [x] UserProfile/UserCompany Interface in der Base-App um `integrations: Record<string, any>` erweitern. (Dort werden z.B. die öffentlichen `firebaseConfigs` der Zielländer/Kunden abgelegt).

## Phase 2: State Management & Provider
- [x] Service `IntegrationStateService` (Signals-basiert) in der Base-App implementieren.
- [x] Nach dem erfolgreichen Firebase-Login den Service updaten, sodass das `integrations`-Objekt des Users aus Firestore global im Arbeitsspeicher (RAM) der App liegt.

## Phase 3: Inversion of Control & Route Guards
- [x] Generischen `RequireIntegrationGuard` bauen. (Prüft im Manifest der Ziel-Route, ob die geforderten Keys im `IntegrationStateService` vorliegen. Wenn nicht -> Fallback-Redirect).
- [x] `apps/kundenadmin/src/app/app.routes.ts` bereinigen: Alle statischen IF-Abfragen (wie `if(f.blogEditor)`) entfernen. Die Routen laden per `loadChildren` dynamisch nach.
- [x] Jedes Feature-Modul (z.B. `@saas-base/blog-editor`) bringt seine *eigenen* Route-Exports mit den geflächteten Guards mit.

## Phase 4: Backend (Firebase Cloud Functions)
- [x] Firebase Functions im Root-Verzeichnis (`/apps/functions` oder `/functions`) initialisieren, falls noch nicht vorhanden.
- [x] Callable Function (`onCall`) namens `getTenantCustomToken` schreiben.
  - Zieht sich den Service-Account-Key des vom UX angeforderten Kunden (aus dem Google Secret Manager oder einer geschlossenen Collection).
  - Nutzt das Admin SDK für einen temporären Ausweis: `admin.auth().createCustomToken(agencyUid)`.

## Phase 5: Das Blog-Feature (Die Kür)
- [x] Der Blog-Editor lädt beim Start seiner Route die benötigte `firebaseConfig` des Kunden aus dem `IntegrationStateService`.
- [x] Er macht über das `@angular/fire` SDK einen Call in Phase 4: `httpsCallable('getTenantCustomToken')`.
- [x] Er erhält den Token und loggt sich im Hintergrund selbstständig über `signInWithCustomToken` in die zweite (sekundäre) FirebaseApp ein.
- [x] Der Editor liest und schreibt nun sicher als Admin in die Fremddatenbank.
