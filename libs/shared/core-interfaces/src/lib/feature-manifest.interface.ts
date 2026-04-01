export interface FeatureManifest {
  /**
   * Eindeutige ID des Features, z.B. 'blog-editor'.
   */
  featureId: string;

  /**
   * Name des Features für die UI, z.B. 'Blog Beiträge'.
   */
  name: string;

  /**
   * Optionales Material Icon, z.B. 'edit'.
   */
  icon?: string;

  /**
   * Array von Integration-Keys, die der eingeloggte User in seiner
   * Datenbank-Konfiguration benötigt, damit dieses Feature funktioniert.
   * Beispiel: ['target-firebase']
   */
  requiredIntegrations?: string[];

  /**
   * Array von notwendigen Rollen aus dem Auth-System.
   * Beispiel: ['editor', 'admin']
   */
  requiredRoles?: string[];
}
