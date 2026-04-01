import { Routes } from '@angular/router';
import { authGuard, adminGuard } from '@saas-base/auth-core';
// SAAS_CONFIG import kann entfernt werden, da Routen jetzt manifest-basiert gesteuert werden.

export const appRoutes: Routes = [
  // Auth Zone (fest registriert, Steuerung über Links)
  {
    path: 'login',
    loadComponent: () => import('@saas-base/firebase-auth').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@saas-base/firebase-auth').then(m => m.ForgotPasswordComponent),
  },

  // Root
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },

  // App Zone
  {
    path: 'app',
    canActivate: [authGuard], // Auth ist als feste Core-Abhängigkeit definiert
    loadComponent: () => import('@saas-base/ui-shell').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('@saas-base/ui-shell').then(m => m.DashboardComponent),
      },
      // HIER: Das Blog-Feature wird bedingungslos eingebunden. 
      // Den Schutz (Fehlerresistenz) regelt das Modul selbst über den RequireIntegrationGuard
      {
        path: 'blog',
        loadChildren: () => import('@saas-base/blog-editor').then(m => m.blogEditorRoutes),
      },
      // HIER: Das CMS Server Modul (Web-Entwicklung)
      {
        path: 'cms',
        loadChildren: () => import('@saas-base/content-management-system').then(m => m.contentManagementSystemRoutes),
      },
      // HIER: Analytics Modul (Web-Entwicklung)
      {
        path: 'analytics',
        loadChildren: () => import('@saas-base/analytics').then(m => m.analyticsRoutes),
      },
      // HIER: Documents Modul (Web-Entwicklung)
      {
        path: 'documents',
        loadChildren: () => import('@saas-base/documents').then(m => m.documentsRoutes),
      },
    ],
  },

  // Admin Zone
  {
    path: 'admin',
    canActivate: [adminGuard], // AuthGuard prüft auf super_admin
    loadComponent: () => import('@saas-base/ui-shell').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadComponent: () => import('@saas-base/ui-shell').then(m => m.AdminUsersComponent),
      },
    ],
  },

  // 404
  {
    path: '**',
    redirectTo: 'app'
  }
];
