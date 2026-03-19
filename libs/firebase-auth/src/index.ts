/**
 * @saas-base/firebase-auth – Public API
 *
 * Alles was außerhalb der Library importiert werden soll,
 * wird hier re-exportiert.
 */

// Config & Provider
export type { FirebaseAuthConfig, AuthFeatures } from './lib/auth-module.config';
export { FIREBASE_AUTH_CONFIG, AUTH_FEATURES, DEFAULT_AUTH_FEATURES } from './lib/auth-module.config';
export { provideFirebaseAuth } from './lib/auth.providers';

// Services
export { AuthService } from './lib/auth.service';
export { AuthStateService } from './lib/auth-state.service';

// Guards
export { authGuard } from './lib/guards/auth.guard';
export { adminGuard } from './lib/guards/admin.guard';

// UI-Komponenten
export { LoginComponent } from './lib/components/login/login.component';
export { RegisterComponent } from './lib/components/register/register.component';
export { ForgotPasswordComponent } from './lib/components/forgot-password/forgot-password.component';
