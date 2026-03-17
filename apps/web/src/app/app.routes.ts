import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  // Root redirect
  { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },

  // ─── Auth Zone (kein Guard, keine Shell) ───────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./shell/auth-shell/auth-shell.component').then(m => m.AuthShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },

  // ─── App Zone (authGuard + AppShell) ──────────────────────────────────────
  {
    path: 'app',
    loadComponent: () => import('./shell/app-shell/app-shell.component').then(m => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'account',
        title: 'Account',
        loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent)
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'billing',
        title: 'Billing',
        loadComponent: () => import('./features/billing/billing.component').then(m => m.BillingComponent)
      },
      {
        path: 'organization',
        title: 'Organization',
        loadComponent: () => import('./features/organization/organization.component').then(m => m.OrganizationComponent)
      },
      // ↓ SLOT: Hier werden Business-Feature-Routen via Generator eingetragen
    ]
  },

  // ─── Admin Zone (adminGuard + AdminShell) ─────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./shell/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        title: 'Admin – Users',
        loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      }
    ]
  },

  // ─── 404 ──────────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
