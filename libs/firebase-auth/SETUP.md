# firebase-auth – Setup Guide

> **KI-Anleitung:** Lies diese Datei vollständig. Führe alle Schritte mit `[AUTO]` selbständig aus.
> Für Schritte mit `[MANUAL]` frage den Nutzer nach den nötigen Werten und setze dann fort.
> Prüfe nach jedem Schritt das Ergebnis bevor du weitermachst.

---

## Was dieses Modul tut

Bindet Firebase Authentication in die SaaS-Anwendung ein:
- Login / Registrierung / Passwort-Reset Seiten
- Auth Guards für geschützte Routen
- Cloud Function die beim Signup automatisch `users/{uid}` in Firestore anlegt
- Feature-Flags für jede Auth-Funktion unabhängig

---

## Voraussetzungen

| Was | Wo |
|---|---|
| Firebase Projekt | [console.firebase.google.com](https://console.firebase.google.com) |
| Firebase Auth aktiviert | Firebase Console → Authentication → Sign-in method |
| Firebase Web Config | Firebase Console → Projekteinstellungen → Web App |

---

## Schritt 1 – Firebase Konfiguration erfassen

**[MANUAL]:** Frage den Nutzer:
> "Bitte öffne die Firebase Console → Projekteinstellungen → deine Web App und kopiere den `firebaseConfig`-Block."

Erwartete Werte:
```
apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
```

---

## Schritt 2 – Environment-Datei anlegen

**[AUTO]:** Erstelle `apps/web/src/environments/environment.ts` mit den Werten aus Schritt 1:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: '<<API_KEY>>',
    authDomain: '<<AUTH_DOMAIN>>',
    projectId: '<<PROJECT_ID>>',
    storageBucket: '<<STORAGE_BUCKET>>',
    messagingSenderId: '<<SENDER_ID>>',
    appId: '<<APP_ID>>',
  },
};
```

**Prüfung:** Datei existiert und ist in `.gitignore` eingetragen.

---

## Schritt 3 – Path-Alias registrieren

**[AUTO]:** Prüfe ob `@saas-base/firebase-auth` in `tsconfig.base.json` → `paths` eingetragen ist.

Falls nicht, füge hinzu:
```json
"@saas-base/firebase-auth": ["libs/firebase-auth/src/index.ts"]
```

---

## Schritt 4 – Provider in app.config.ts einbinden

**[AUTO]:** Füge `provideFirebaseAuth()` in `apps/web/src/app/app.config.ts` ein:

```typescript
import { provideFirebaseAuth } from '@saas-base/firebase-auth';
import { environment } from '../environments/environment';
import { SAAS_CONFIG } from './saas.config';

// in providers[]:
provideFirebaseAuth({
  firebaseConfig: environment.firebase,
  redirectAfterLogin: '/app/dashboard',
  redirectAfterLogout: '/login',
  loginRoute: '/login',
  features: {
    publicSignup:      SAAS_CONFIG.features.publicSignup,
    googleLogin:       SAAS_CONFIG.features.googleLogin,
    emailLogin:        SAAS_CONFIG.features.emailLogin,
    inviteOnly:        SAAS_CONFIG.features.inviteOnly,
    passwordReset:     SAAS_CONFIG.features.passwordReset,
    emailVerification: SAAS_CONFIG.features.emailVerification,
  },
}),
```

---

## Schritt 5 – Routen in app.routes.ts prüfen

**[AUTO]:** Prüfe ob diese Routen vorhanden sind. Falls nicht, füge sie ein:

```typescript
{ path: 'login', loadComponent: () => import('@saas-base/firebase-auth').then(m => m.LoginComponent) },
// conditional:
{ path: 'register', loadComponent: () => import('@saas-base/firebase-auth').then(m => m.RegisterComponent) },
{ path: 'forgot-password', loadComponent: () => import('@saas-base/firebase-auth').then(m => m.ForgotPasswordComponent) },
```

---

## Schritt 6 – Cloud Functions deployen

**[AUTO]:** Führe aus:
```bash
npx firebase deploy --only functions
```

**Prüfung:** Exit Code 0. Funktion `onUserCreated` muss erfolgreich deployed sein.

---

## Schritt 7 – Feature-Flags konfigurieren

**[MANUAL]:** Frage den Nutzer welche Auth-Features aktiv sein sollen und passe `apps/web/src/app/saas.config.ts` an:

```typescript
features: {
  publicSignup: true,     // Registrierung offen für alle?
  googleLogin: true,      // Google OAuth Button?
  emailLogin: true,       // E-Mail/Passwort?
  inviteOnly: false,      // Nur mit Einladungslink registrieren?
  passwordReset: true,    // Passwort-Reset Seite?
  emailVerification: true // E-Mail Verifikationsmail?
}
```

---

## Schritt 8 – Build und Verify

**[AUTO]:** Führe aus und prüfe Exit Code:
```bash
npx nx build web --configuration=development
```

**[AUTO]:** Starte bidirektionalen Rules-Test:
```bash
npx tsx scripts/test-firestore-rules.ts
```

**Erwartetes Ergebnis:** Build Exit 0, alle Tests bestanden.

---

## Schritt 9 – Google Login aktivieren (optional)

**[MANUAL]** (nur wenn `googleLogin: true`): Frage den Nutzer:
> "Bitte öffne Firebase Console → Authentication → Sign-in method → Google → aktivieren."

---

## Fertig ✅

Das `firebase-auth` Modul ist eingebunden wenn:
- `npx nx build web` Exit 0
- `/login` Route im Browser erreichbar
- Neuer User → `users/{uid}` erscheint in Firestore
