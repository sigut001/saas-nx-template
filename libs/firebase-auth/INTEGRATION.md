# firebase-auth – Integration Points

## Was dieses Feature bietet

| Export | Typ | Beschreibung |
|---|---|---|
| `provideFirebaseAuth()` | Funktion | Provider für `app.config.ts` |
| `AuthService` | Service | Login, Logout, Register, Passwort-Reset |
| `AuthStateService` | Service | `currentUser` Signal, `isLoggedIn` |
| `authGuard` | Guard | Schützt App-Zone Routen |
| `adminGuard` | Guard | Schützt Admin-Zone Routen |
| `LoginComponent` | Komponente | Login-Formular (feature-gesteuert) |
| `RegisterComponent` | Komponente | Registrierungs-Formular |
| `ForgotPasswordComponent` | Komponente | Passwort-Zurücksetzen |
| `AUTH_FEATURES` | Token | InjectionToken für Feature-Flags |

---

## Touch Points

### Automatisch (via `setup.js`)
- [x] `app.config.ts` → `provideFirebaseAuth()` Aufruf
- [x] `app.routes.ts` → `/login`, `/register`, `/forgot-password` Routen
- [x] `apps/web/src/environments/environment.ts` → Firebase Config Placeholder
- [x] `.gitignore` → `environment.ts` ausgenommen

### Manuell
- [x] `functions/src/index.ts` → `onUserCreated` Cloud Function (legt `users/{uid}` an)
- [x] `firestore.rules` → `users/{uid}` Collection absichern
- [x] `apps/web/src/app/saas.config.ts` → Auth Feature-Flags eintragen

---

## Abhängigkeiten

| Feature | Pflicht | Grund |
|---|---|---|
| keine | – | Basis-Feature, hat selbst keine Abhängigkeiten |

---

## Feature-Flags

| Flag | Default | Effekt auf UI / Routing |
|---|---|---|
| `publicSignup` | `true` | `/register` Route + "Registrieren"-Link in Login |
| `googleLogin` | `true` | Google OAuth Button in Login |
| `emailLogin` | `true` | E-Mail/Passwort Formular |
| `inviteOnly` | `false` | Signup nur via `/invite/:token`, `/register` weg |
| `passwordReset` | `true` | "Passwort vergessen" Link + `/forgot-password` Route |
| `emailVerification` | `true` | Verifikationsmail nach Signup |

---

## Cloud Functions

### `onUserCreated`
- **Trigger:** Firebase Auth `user.onCreate`
- **Effekt:** Legt `users/{uid}` in Firestore an mit Basis-Profil + `plan: 'free'`
- **Bekannte Issues:** Verifikationsmail kommt in einigen Projekten nicht an (SMTP-Problem)

---

## Getestete Szenarien

- [x] Unautorisierter Zugriff auf `users/{uid}` → HTTP 403
- [x] `publicSignup: false` → kein RegisterComponent-Chunk im Bundle
- [x] Login-Flow (Emulator und Live)
- [ ] Google OAuth (manueller Test erforderlich)
- [ ] Email-Verifikation (bekanntes Issue)
