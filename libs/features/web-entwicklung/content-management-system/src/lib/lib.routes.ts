import { Route } from '@angular/router';
import { ContentManagementSystemComponent } from './content-management-system/content-management-system.component';
import { requireIntegrationGuard } from '@saas-base/tenant-integration';

export const contentManagementSystemRoutes: Route[] = [
  {
    path: '',
    component: ContentManagementSystemComponent,
    canActivate: [requireIntegrationGuard],
    data: { requiredIntegration: 'target-firebase' },
  },
];
