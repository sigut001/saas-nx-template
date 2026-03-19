import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStateService } from '../auth-state.service';
import { FIREBASE_AUTH_CONFIG } from '../auth-module.config';

/**
 * adminGuard – schützt alle Admin-Routen.
 * Nur Nutzer mit Custom Claim role='super_admin' dürfen durch.
 * Andere eingeloggte User werden zu /app/dashboard geleitet,
 * nicht eingeloggte User zum Login.
 *
 * Verwendung in app.routes.ts:
 *   canActivate: [adminGuard]
 */
export const adminGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const config = inject(FIREBASE_AUTH_CONFIG);

  if (!authState.isAuthenticated()) {
    return router.createUrlTree([config.loginRoute ?? '/login']);
  }
  if (authState.role() === 'super_admin') {
    return true;
  }
  // Eingeloggt, aber kein Admin → Dashboard
  return router.createUrlTree([config.redirectAfterLogin ?? '/app/dashboard']);
};
