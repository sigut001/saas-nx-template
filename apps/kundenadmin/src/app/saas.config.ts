import { SaaSConfig } from './saas.config.interface';

export const SAAS_CONFIG: SaaSConfig = {
  appName: '',
  appTagline: 'Professionelle Website-Verwaltung',
  logoUrl: '/assets/qubits_logo.png',
  supportEmail: 'support@webentwicklung.com',
  features: {
    publicSignup: false,        // Geschlossener Admin
    googleLogin: true,
    emailLogin: true,
    inviteOnly: true,           // Nur mit Einladung
    passwordReset: true,
    emailVerification: true,
    multiOrganization: false,
    onboarding: false,
    invitations: false,
    billing: false,             // Kein Pricing im Admin
    adminPanel: true,           // Admin-Funktionen an
    notifications: false,
    blogEditor: true,           // HIER: Das neue Feature ist aktiv
    authEnabled: false,
    trialDays: 0,
  },
  legal: {
    termsUrl: '/legal/terms',
    privacyUrl: '/legal/privacy',
  },
};
