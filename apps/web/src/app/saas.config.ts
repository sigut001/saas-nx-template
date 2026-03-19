/**
 * SaaS-Anwendungskonfiguration – EINZIGE Datei die pro App angepasst wird.
 *
 * Alle Feature-Flags in einem flachen Katalog.
 * provideFirebaseAuth() liest intern den auth-relevanten Slice.
 */
export const SAAS_CONFIG: SaaSConfig = {
  appName: 'SaaS Base',
  appTagline: 'Deine SaaS-Beschreibung',
  logoUrl: '/assets/logo.svg',
  supportEmail: 'support@example.com',

  /** Firebase Projekt-Config – kommt aus environment.ts  */
  // firebaseConfig wird in app.config.ts aus environment injiziert

  features: {
    // ─── Auth-Features ──────────────────────────────────────────────────
    publicSignup: true,        // false → /register deaktiviert + Link weg
    googleLogin: true,         // false → Google-Button ausgeblendet
    emailLogin: true,          // false → nur Social Login
    inviteOnly: false,         // true → Signup nur via /invite/:token
    passwordReset: true,       // false → "Passwort vergessen" Link weg
    emailVerification: true,   // false → keine Verifikationsmail

    // ─── Multi-Tenancy ──────────────────────────────────────────────────
    multiOrganization: false,  // true → B2B: Org-Wizard, Mitglieder, Switcher
    onboarding: false,         // true → Org-Wizard nach Registrierung (nur wenn multiOrg: true)
    invitations: false,        // true → Mitglieder per E-Mail einladen

    // ─── App-Bereiche ───────────────────────────────────────────────────
    billing: true,             // false → /pricing + /billing deaktiviert
    adminPanel: true,          // false → /admin/** komplett deaktiviert
    notifications: false,      // true → Notification Bell in Top-Bar
    trialDays: 0,              // > 0 → Trial-Zeitraum in Tagen
  },

  legal: {
    termsUrl: '/legal/terms',
    privacyUrl: '/legal/privacy',
  },
};

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface SaaSConfig {
  appName: string;
  appTagline: string;
  logoUrl: string;
  supportEmail: string;
  features: SaaSFeatures;
  legal: { termsUrl: string; privacyUrl: string };
}

export interface SaaSFeatures {
  // Auth
  publicSignup: boolean;
  googleLogin: boolean;
  emailLogin: boolean;
  inviteOnly: boolean;
  passwordReset: boolean;
  emailVerification: boolean;

  // Multi-Tenancy
  multiOrganization: boolean;
  onboarding: boolean;
  invitations: boolean;

  // App-Bereiche
  billing: boolean;
  adminPanel: boolean;
  notifications: boolean;
  trialDays: number;
}
