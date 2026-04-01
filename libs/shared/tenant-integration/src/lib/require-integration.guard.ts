import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TenantIntegrationService } from './tenant-integration.service';
import { FeatureManifest } from '@saas-base/core-interfaces';

/**
 * Route Guard für Feature-Module.
 * Liest das angehängte `FeatureManifest` der Route aus und prüft, ob der
 * eingeloggte User im `TenantIntegrationService` alle benötigten `requiredIntegrations` besitzt.
 * Wenn nicht, wird die Navigation zu einem Fallback-Pfad umgeleitet.
 */
export const requireIntegrationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const integrationState = inject(TenantIntegrationService);

  // Manifest aus den Route-Daten extrahieren
  const manifest = route.data['manifest'] as FeatureManifest | undefined;

  // Wenn kein Manifest definiert ist, lassen wir passieren (keine Integration gefordert)
  if (!manifest || !manifest.requiredIntegrations || manifest.requiredIntegrations.length === 0) {
    return true;
  }

  const userIntegrations = integrationState.integrations();

  // Prüfen, ob alle geforderten Keys im User-Objekt existieren
  const missingKeys = manifest.requiredIntegrations.filter(
    (key) => !userIntegrations[key]
  );

  if (missingKeys.length > 0) {
    console.warn(
      `[RequireIntegrationGuard] Navigation zu ${state.url} blockiert. Fehlende Integrationen:`,
      missingKeys
    );
    // Optional: Könnte auch auf eine dezidierte Error-Page / Setup-Page leiten.
    return router.parseUrl('/app/dashboard');
  }

  return true;
};
