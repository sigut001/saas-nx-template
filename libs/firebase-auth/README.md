# @saas-base/firebase-auth

Wiederverwendbares Firebase Authentication Modul für Angular 19+ Standalone-Apps.  
Einmal bauen, beliebig oft kopieren.

---

## Funktionsweise

Das Modul kapselt die gesamte Firebase-Authentifizierung hinter einer sauberen Angular-API:

```
provideFirebaseAuth(config)   ←── einziger Einstiegspunkt in app.config.ts
        │
        ├── initializeApp()           Firebase App (eager, außerhalb Angular-DI)
        ├── getAuth()                 Firebase Auth Instanz
        ├── FIREBASE_AUTH_CONFIG      InjectionToken mit deiner Konfiguration
        └── FIREBASE_AUTH             InjectionToken mit der Auth-Instanz
        
        ↓ darauf aufbauend (providedIn: 'root')
        
AuthStateService    ←── Signal-basierter Auth-State (currentUser, isAuthenticated, role)
AuthService         ←── Firebase-Wrapper (login, register, logout, googleLogin, ...)
authGuard           ←── Funktionaler Route Guard (schützt /app/**)
adminGuard          ←── Admin Route Guard (prüft Custom Claim role='super_admin')
```

> **Warum eager Initialisierung?**  
> Firebase muss initialisiert sein bevor Angular's DI die ersten Tokens auflöst.  
> `provideFirebaseAuth()` ruft deshalb `initializeApp()` sofort auf – noch im  
> `app.config.ts` Schritt, bevor die App bootstrapped.

---

## Voraussetzungen

```bash
npm install firebase
npm install @angular/fire   # nur als Peer-Dependency, kein direkter Import in der Library
```

**Firebase-Projekt anlegen:**
1. [Firebase Console](https://console.firebase.google.com) → Neues Projekt
2. **Authentication** → Sign-in method aktivieren:
   - ✅ E-Mail/Passwort
   - ✅ Google (benötigt Support-E-Mail)
3. Web-App registrieren → Firebase-Config kopieren

---

## Einbindung (1 Schritt)

```typescript
// apps/web/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseAuth } from '@saas-base/firebase-auth';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideFirebaseAuth({
      firebaseConfig: environment.firebase,   // deine Firebase-Config
      redirectAfterLogin: '/app/dashboard',   // Ziel nach erfolgreichem Login
      redirectAfterLogout: '/login',          // Ziel nach Logout
      loginRoute: '/login',                   // Guards leiten hierhin weiter
    }),
  ],
};
```

### Environment-Datei befüllen

```typescript
// apps/web/src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIza...',
    authDomain: 'dein-projekt.firebaseapp.com',
    projectId: 'dein-projekt',
    storageBucket: 'dein-projekt.firebasestorage.app',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
  },
};
```

> ⚠️ `environment.ts` in `.gitignore` eintragen – keine echten Keys committen!

---

## Routing – Auth-Komponenten einbinden

```typescript
// app.routes.ts
import { authGuard, adminGuard } from '@saas-base/firebase-auth';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@saas-base/firebase-auth').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@saas-base/firebase-auth').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@saas-base/firebase-auth').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'app',
    canActivate: [authGuard],   // ← schützt alle /app/** Routen
    children: [ ... ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],  // ← nur role='super_admin'
    children: [ ... ]
  },
];
```

---

## Public API – Was du importieren kannst

```typescript
import {
  // Einrichtung
  provideFirebaseAuth,       // Provider-Funktion für app.config.ts
  FIREBASE_AUTH_CONFIG,      // InjectionToken für die Config
  FIREBASE_AUTH,             // InjectionToken für die Auth-Instanz

  // Services
  AuthService,               // Firebase-Wrapper: login, register, logout, ...
  AuthStateService,          // Signal-State: currentUser, isAuthenticated, role

  // Guards
  authGuard,                 // Route Guard für eingeloggte User
  adminGuard,                // Route Guard für super_admin

  // UI-Komponenten (standalone, direkt lazy-loadbar)
  LoginComponent,
  RegisterComponent,
  ForgotPasswordComponent,
} from '@saas-base/firebase-auth';
```

---

## AuthStateService – Auth-State in deinen Komponenten

```typescript
import { Component, inject } from '@angular/core';
import { AuthStateService } from '@saas-base/firebase-auth';

@Component({ ... })
export class MyComponent {
  readonly auth = inject(AuthStateService);

  // Signals – reaktiv, kein subscribe nötig:
  // auth.isAuthenticated()     → boolean
  // auth.currentUser()         → Firebase User | null
  // auth.uid()                 → string | null
  // auth.displayName()         → string | null
  // auth.photoURL()            → string | null
  // auth.isEmailVerified()     → boolean
  // auth.role()                → 'user' | 'super_admin'
  // auth.isLoading()           → boolean (true bis authState resolved)
}
```

Im Template:
```html
@if (auth.isAuthenticated()) {
  <p>Hallo {{ auth.displayName() }}!</p>
  <p>UID: {{ auth.uid() }}</p>
}
```

---

## AuthService – Auth-Operationen

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@saas-base/firebase-auth';

@Component({ ... })
export class MyComponent {
  private readonly authService = inject(AuthService);

  // Login mit E-Mail + Passwort → navigiert zu redirectAfterLogin
  await this.authService.loginWithEmail(email, password);

  // Google OAuth Popup → navigiert zu redirectAfterLogin
  await this.authService.loginWithGoogle();

  // Registrierung + E-Mail-Verifikation
  await this.authService.register(email, password, displayName?);

  // Logout → navigiert zu redirectAfterLogout
  await this.authService.logout();

  // Passwort-Reset-E-Mail senden
  await this.authService.sendPasswordReset(email);

  // Firebase ID-Token (für Backend-Calls)
  const token = await this.authService.getIdToken();
}
```

---

## Admin-Rolle setzen (Firebase Admin SDK)

Rollen werden als **Firebase Custom Claims** gesetzt – über eine Cloud Function oder ein Admin-Skript:

```typescript
// Beispiel: Cloud Function oder Admin-Skript
await admin.auth().setCustomUserClaims(uid, { role: 'super_admin' });
```

Danach muss der User sich neu einloggen (Token-Refresh) damit der `adminGuard` die Rolle erkennt.

Das `FIREBASE_ADMIN_*`-Credential dafür liegt in der `.env` Datei des Projekts.

---

## UI-Komponenten anpassen

Die Komponenten sind vollständig standalone und haben kein Framework-Coupling.  
Du kannst sie direkt stylen indem du die CSS-Custom-Properties überschreibst,  
oder du ersetzt sie durch eigene Komponenten – die Services bleiben gleich.

**Inputs der LoginComponent:**
```html
<lib-login [showRegisterLink]="true" [showForgotLink]="true" />
```

**Inputs der RegisterComponent:**
```html
<lib-register [showLoginLink]="true" />
```

---

## In anderen Projekten verwenden

1. Ordner `libs/firebase-auth/` in das Ziel-Repo kopieren
2. In `tsconfig.base.json` des Ziel-Repos den Alias eintragen:
   ```json
   "paths": {
     "@saas-base/firebase-auth": ["libs/firebase-auth/src/index.ts"]
   }
   ```
3. In `tsconfig.app.json` das `include` erweitern:
   ```json
   "include": ["src/**/*.ts", "../../libs/**/*.ts"]
   ```
4. `firebase` installieren: `npm install firebase`
5. `provideFirebaseAuth()` in `app.config.ts` einbinden (siehe oben)

---

## Dateistruktur

```
libs/firebase-auth/
├── README.md                          ← diese Datei
└── src/
    ├── index.ts                       ← Public API (alle Exports)
    └── lib/
        ├── auth-module.config.ts      ← FirebaseAuthConfig Interface + InjectionToken
        ├── auth.providers.ts          ← provideFirebaseAuth() + FIREBASE_AUTH Token
        ├── auth.service.ts            ← Firebase-Wrapper Service
        ├── auth-state.service.ts      ← Signal-basierter Auth-State
        ├── guards/
        │   ├── auth.guard.ts          ← authGuard (eingeloggt?)
        │   └── admin.guard.ts         ← adminGuard (role='super_admin'?)
        └── components/
            ├── login/
            │   └── login.component.ts
            ├── register/
            │   └── register.component.ts
            └── forgot-password/
                └── forgot-password.component.ts
```
