import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideFirebaseAuth } from '@saas-base/firebase-auth';
import { environment } from '../environments/environment';
import { SAAS_CONFIG } from './saas.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideFirebaseAuth({
      firebaseConfig: environment.firebase,
      redirectAfterLogin: '/app/dashboard',
      redirectAfterLogout: '/login',
      loginRoute: '/login',
      // Auth-Flags aus dem einheitlichen Feature-Katalog
      features: {
        publicSignup:      SAAS_CONFIG.features.publicSignup,
        googleLogin:       SAAS_CONFIG.features.googleLogin,
        emailLogin:        SAAS_CONFIG.features.emailLogin,
        inviteOnly:        SAAS_CONFIG.features.inviteOnly,
        passwordReset:     SAAS_CONFIG.features.passwordReset,
        emailVerification: SAAS_CONFIG.features.emailVerification,
      },
    }),
  ],
};
