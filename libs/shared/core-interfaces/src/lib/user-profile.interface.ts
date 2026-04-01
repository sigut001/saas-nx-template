export interface UserProfile {
  /**
   * Firebase Auth UID des Nutzers.
   */
  uid: string;

  /**
   * E-Mail-Adresse des Nutzers.
   */
  email: string;

  /**
   * Optional: Anzeigename.
   */
  displayName?: string;

  /**
   * Die freigeschalteten Features dieses Nutzers.
   * Beispiel: ['blog-editor', 'analytics']
   */
  activeFeatures?: string[];

  /**
   * Das Dictionary für alle berechtigten Drittanbieter-Integrationen.
   * Ein FeatureManifest kann fordern, dass hier ein bestimmter Schlüssel 
   * (z.B. 'target-firebase') hinterlegt ist.
   */
  integrations?: Record<string, any>;
}
