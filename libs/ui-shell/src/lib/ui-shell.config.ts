import { InjectionToken } from '@angular/core';

export interface UiShellFeatureConfig {
  multiOrganization: boolean;
  billing: boolean;
  adminPanel: boolean;
  publicSignup: boolean;
  inviteOnly: boolean;
  passwordReset: boolean;
  blogEditor: boolean;
  authEnabled: boolean;
}

export interface UiShellConfig {
  appName: string;
  appTagline: string;
  logoUrl: string;
  features: UiShellFeatureConfig;
}

export const UI_SHELL_CONFIG = new InjectionToken<UiShellConfig>('UI_SHELL_CONFIG');
