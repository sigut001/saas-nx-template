import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideFirebaseAuth } from '@saas-base/firebase-auth';
import { provideBilling } from '@saas-base/billing';
import { environment } from '../environments/environment';
import { SAAS_CONFIG } from './saas.config';

// NG-ZORRO Imports
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  DashboardOutline,
  UserOutline,
  SettingOutline,
  CreditCardOutline,
  TeamOutline,
  LogoutOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  GlobalOutline,
  LockOutline,
  MailOutline
} from '@ant-design/icons-angular/icons';

registerLocaleData(en);

const icons = [
  DashboardOutline,
  UserOutline,
  SettingOutline,
  CreditCardOutline,
  TeamOutline,
  LogoutOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  GlobalOutline,
  LockOutline,
  MailOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    provideNzIcons(icons),
    provideFirebaseAuth({
      firebaseConfig: environment.firebase,
      redirectAfterLogin: '/app/dashboard',
      redirectAfterLogout: '/login',
      loginRoute: '/login',
      features: {
        publicSignup:      SAAS_CONFIG.features.publicSignup,
        googleLogin:       SAAS_CONFIG.features.googleLogin,
        emailLogin:        SAAS_CONFIG.features.emailLogin,
        inviteOnly:        SAAS_CONFIG.features.inviteOnly,
        passwordReset:     SAAS_CONFIG.features.passwordReset,
        emailVerification: SAAS_CONFIG.features.emailVerification,
      },
    }),
    // Billing-Modul – nur aktiv wenn billing: true in saas.config.ts
    ...(SAAS_CONFIG.features.billing ? [
      provideBilling({
        provider: 'stripe',
        stripePublicKey: environment.stripe.publicKey,
        redirectAfterCheckout: '/app/billing',
        features: {
          enabled: SAAS_CONFIG.features.billing,
          trialDays: SAAS_CONFIG.features.trialDays,
          showPricingPage: true,
          annualBilling: true,
        },
      }),
    ] : []),
  ],
};
