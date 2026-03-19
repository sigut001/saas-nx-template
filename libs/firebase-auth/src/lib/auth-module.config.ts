import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from 'firebase/app';

/**
 * Feature-Flags die das Auth-Modul-Verhalten steuern.
 * Wird von der SaaSConfig.auth über provideFirebaseAuth() übergeben.
 */
export interface AuthFeatures {
  /** Öffentliche Selbst-Registrierung (/register Route + Link in Login) */
  publicSignup?: boolean;
  /** Google OAuth Button anzeigen */
  googleLogin?: boolean;
  /** E-Mail/Passwort Login-Formular anzeigen */
  emailLogin?: boolean;
  /** Signup nur via Einladungs-Link */
  inviteOnly?: boolean;
  /** "Passwort vergessen" Link anzeigen */
  passwordReset?: boolean;
  /** E-Mail-Verifikationsmail nach Registrierung senden */
  emailVerification?: boolean;
}

/** Standard-Werte – alle Features sind standardmäßig aktiv */
export const DEFAULT_AUTH_FEATURES: Required<AuthFeatures> = {
  publicSignup: true,
  googleLogin: true,
  emailLogin: true,
  inviteOnly: false,
  passwordReset: true,
  emailVerification: true,
};

export interface FirebaseAuthConfig {
  /** Firebase-Projekt-Konfiguration (aus environment.ts) */
  firebaseConfig: FirebaseOptions;
  /** Route nach erfolgreichem Login */
  redirectAfterLogin?: string;
  /** Route nach Logout */
  redirectAfterLogout?: string;
  /** Route zur Login-Seite (für Guards) */
  loginRoute?: string;
  /** Auth-spezifische Feature-Flags */
  features?: AuthFeatures;
}

export const FIREBASE_AUTH_CONFIG = new InjectionToken<FirebaseAuthConfig>('FirebaseAuthConfig');
export const AUTH_FEATURES = new InjectionToken<Required<AuthFeatures>>('AuthFeatures');
