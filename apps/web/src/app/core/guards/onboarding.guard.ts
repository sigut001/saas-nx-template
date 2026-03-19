import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * onboardingGuard – prüft ob der User eine activeOrganizationId hat.
 * Falls nicht → Weiterleitung zu /onboarding.
 * Wird nur geprüft wenn SAAS_CONFIG.features.multiOrganization: true ist.
 */
export const onboardingGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return router.parseUrl('/login');
  }

  try {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Dokument existiert noch nicht → onUserCreated läuft noch
      return true;
    }

    const data = userDoc.data();
    if (!data['activeOrganizationId']) {
      return router.parseUrl('/onboarding');
    }

    return true;
  } catch {
    // Bei Fehler durchlassen, nicht blockieren
    return true;
  }
};
