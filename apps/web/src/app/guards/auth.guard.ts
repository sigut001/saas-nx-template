import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

/**
 * Auth Guard (Placeholder – Phase 3 ersetzt dies mit Firebase authState)
 * Bis Phase 3: Liest ein Flag aus localStorage ('dev_authenticated')
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('dev_authenticated') === 'true';
  if (isAuthenticated) return true;
  return router.createUrlTree(['/login']);
};
