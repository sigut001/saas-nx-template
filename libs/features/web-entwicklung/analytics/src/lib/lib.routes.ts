import { Route } from '@angular/router';
import { AnalyticsShellComponent } from './shell/shell.component';

export const analyticsRoutes: Route[] = [
  { 
    path: '', 
    component: AnalyticsShellComponent,
    children: [
      { path: '', redirectTo: 'posthog', pathMatch: 'full' },
      { 
        path: 'seo', 
        loadComponent: () => import('./seo/seo.component').then(m => m.SeoComponent) 
      },
      { 
        path: 'performance', 
        loadComponent: () => import('./performance/performance.component').then(m => m.PerformanceComponent) 
      },
      {
        path: 'posthog',
        loadComponent: () => import('./posthog/posthog.component').then(m => m.PosthogComponent)
      }
    ]
  },
];
