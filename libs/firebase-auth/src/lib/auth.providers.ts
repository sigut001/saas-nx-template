import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  InjectionToken,
} from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  FIREBASE_AUTH_CONFIG,
  FirebaseAuthConfig,
  AUTH_FEATURES,
  DEFAULT_AUTH_FEATURES,
} from './auth-module.config';

export const FIREBASE_AUTH = new InjectionToken<Auth>('FirebaseAuth');

export function provideFirebaseAuth(config: FirebaseAuthConfig): EnvironmentProviders {
  // Firebase eager außerhalb von Angular initialisieren
  const app = getApps().length ? getApp() : initializeApp(config.firebaseConfig);
  const auth = getAuth(app);

  // Feature-Flags mit Defaults zusammenführen
  const features = { ...DEFAULT_AUTH_FEATURES, ...(config.features ?? {}) };

  return makeEnvironmentProviders([
    { provide: FIREBASE_AUTH_CONFIG, useValue: config },
    { provide: FIREBASE_AUTH, useValue: auth },
    { provide: AUTH_FEATURES, useValue: features },
  ]);
}
