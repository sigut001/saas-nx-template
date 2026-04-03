import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideFirebaseAuth } from '@saas-base/auth-core';
import { environment } from '../environments/environment';
import { SAAS_CONFIG } from './saas.config';
import { UI_SHELL_CONFIG } from '@saas-base/ui-shell';

// NG-ZORRO
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  DashboardOutline,
  UserOutline,
  SettingOutline,
  TeamOutline,
  LogoutOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  GlobalOutline,
  LockOutline,
  MailOutline,
  EditOutline,
  FileTextOutline,
  CreditCardOutline,
  GoogleOutline,
  AppstoreOutline
} from '@ant-design/icons-angular/icons';

registerLocaleData(en);

const icons = [
  DashboardOutline,
  UserOutline,
  SettingOutline,
  TeamOutline,
  LogoutOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  GlobalOutline,
  LockOutline,
  MailOutline,
  EditOutline,
  FileTextOutline,
  CreditCardOutline,
  GoogleOutline,
  AppstoreOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(),
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
    {
      provide: UI_SHELL_CONFIG,
      useValue: SAAS_CONFIG,
    },
  ],
};
