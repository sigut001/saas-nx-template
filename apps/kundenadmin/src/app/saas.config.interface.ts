export interface SaaSFeatures {
  publicSignup: boolean;
  googleLogin: boolean;
  emailLogin: boolean;
  inviteOnly: boolean;
  passwordReset: boolean;
  emailVerification: boolean;
  multiOrganization: boolean;
  onboarding: boolean;
  invitations: boolean;
  billing: boolean;
  adminPanel: boolean;
  notifications: boolean;
  blogEditor: boolean;
  authEnabled: boolean;
  trialDays: number;
}

export interface SaaSConfig {
  appName: string;
  appTagline: string;
  logoUrl: string;
  supportEmail: string;
  features: SaaSFeatures;
  legal: { termsUrl: string; privacyUrl: string };
}
