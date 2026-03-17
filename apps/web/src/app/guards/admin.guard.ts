import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

/**
 * Admin Guard (Placeholder – Phase 3 ersetzt dies mit Firebase Custom Claims)
 * Bis Phase 3: Liest ein Flag aus localStorage ('dev_admin')
 */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('dev_admin') === 'true';
  if (isAdmin) return true;
  const isAuthenticated = localStorage.getItem('dev_authenticated') === 'true';
  return router.createUrlTree([isAuthenticated ? '/app/dashboard' : '/login']);
};
