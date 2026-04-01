import { Route } from '@angular/router';
import { BlogEditorComponent } from './blog-editor/blog-editor.component';
import { requireIntegrationGuard } from '@saas-base/tenant-integration';
import { FeatureManifest } from '@saas-base/core-interfaces';

export const BLOG_MANIFEST: FeatureManifest = {
  featureId: 'blog-editor',
  name: 'Blog',
  requiredIntegrations: ['target-firebase']
};

export const blogEditorRoutes: Route[] = [
  { 
    path: '', 
    component: BlogEditorComponent,
    canActivate: [requireIntegrationGuard],
    data: { manifest: BLOG_MANIFEST }
  },
];
