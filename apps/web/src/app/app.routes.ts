import { Routes } from '@angular/router';
import { authGuard, adminGuard } from '@saas-base/firebase-auth';
import { SAAS_CONFIG } from './saas.config';
import { onboardingGuard } from './core/guards/onboarding.guard';

const f = SAAS_CONFIG.features;

// App-Zone Guards: authGuard immer, onboardingGuard nur wenn multiOrg
const appCanActivate = f.multiOrganization
  ? [authGuard, onboardingGuard]
  : [authGuard];

export const appRoutes: Routes = [

  // ─── Auth Zone ──────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.LoginComponent),
  },
  ...(f.publicSignup && !f.inviteOnly ? [{
    path: 'register',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.RegisterComponent),
  }] as Routes : []),
  ...(f.passwordReset ? [{
    path: 'forgot-password',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.ForgotPasswordComponent),
  }] as Routes : []),

  // ─── Onboarding (nur wenn multiOrganization: true) ────────────────────────
  ...(f.multiOrganization ? [{
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  }] as Routes : []),

  // ─── Pricing (nur wenn billing: true) ──────────────────────────────────────
  ...(f.billing ? [{
    path: 'pricing',
    title: 'Pricing',
    loadComponent: () =>
      import('@saas-base/billing').then((m) => m.PricingComponent),
  }] as Routes : []),
  // ─── Root ───────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  // ─── App Zone ───────────────────────────────────────────────────────────
  {
    path: 'app',
    canActivate: appCanActivate,
    loadComponent: () =>
      import('./shell/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'account',
        title: 'Account',
        loadComponent: () =>
          import('./features/account/account.component').then((m) => m.AccountComponent),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      ...(f.billing ? [{
        path: 'billing',
        title: 'Billing',
        loadComponent: () =>
          import('@saas-base/billing').then((m) => m.BillingComponent),
      }] as Routes : []),
      ...(f.multiOrganization ? [{
        path: 'organization',
        title: 'Organization',
        loadComponent: () =>
          import('./features/organization/organization.component').then((m) => m.OrganizationComponent),
      }] as Routes : []),
    ],
  },

  // ─── Admin Zone (nur wenn adminPanel: true) ──────────────────────────────
  ...(f.adminPanel ? [{
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./shell/admin-shell/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        title: 'Admin – Users',
        loadComponent: () =>
          import('./features/admin/users/admin-users.component').then((m) => m.AdminUsersComponent),
      },
    ],
  }] as Routes : []),

  // ─── 404 ────────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
