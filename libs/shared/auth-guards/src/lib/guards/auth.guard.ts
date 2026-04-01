import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStateService } from '../auth-state.service';
import { FIREBASE_AUTH_CONFIG } from '../auth-module.config';

/**
 * authGuard – schützt alle Routen die einen eingeloggten User erfordern.
 * Leitet zu loginRoute (default: '/login') weiter wenn nicht authentifiziert.
 *
 * Verwendung in app.routes.ts:
 *   canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const config = inject(FIREBASE_AUTH_CONFIG);

  if (authState.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree([config.loginRoute ?? '/login']);
};
