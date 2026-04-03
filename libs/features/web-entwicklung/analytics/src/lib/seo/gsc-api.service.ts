import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FIREBASE_AUTH } from '@saas-base/auth-core';
import { TenantIntegrationService } from '@saas-base/tenant-integration';

@Injectable({ providedIn: 'root' })
export class GscApiService {
  private readonly auth: Auth = inject(FIREBASE_AUTH);
  private readonly http = inject(HttpClient);
  private readonly tenantService = inject(TenantIntegrationService);

  // Zustand
  readonly oauthToken = signal<string | null>(null);
  readonly isLoadingData = signal(false);
  readonly seoDataResponse = signal<any | null>(null);
  readonly hasTokenError = signal<boolean>(false);
  
  get isConnected(): boolean {
    return !!this.oauthToken();
  }

  /**
   * SCHRITT 1: Autorisierung (Bouncer)
   */
  async connectSearchConsole(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/webmasters.readonly');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(this.auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (token) {
        this.oauthToken.set(token);
        this.hasTokenError.set(false);
        console.log('Google Search Console OAuth-Token erfolgreich erhalten!');
        await this.fetchAnalyticsData(); // Lade Daten sofort nach Login
      } else {
        throw new Error('Kein Access Token von Google erhalten.');
      }
    } catch (error) {
      console.error('Fehler bei der Google Search Console Autorisierung:', error);
      throw error;
    }
  }

  /**
   * SCHRITT 2: API Pipeline Fetch (Automatischer Vault Zugriff)
   */
  async fetchAnalyticsData(): Promise<void> {
    const token = this.oauthToken();
    if (!token) {
      // Wenn wir noch keinen Token haben, schlagen wir stumm fehl und blenden das Banner ein
      this.hasTokenError.set(true);
      return;
    }
    
    this.isLoadingData.set(true);
    this.seoDataResponse.set(null); // Reset
    this.hasTokenError.set(false);
    
    try {
      // 1. Domäne sicher aus dem reaktiven Tenant-App-State laden
      const vault = (this.tenantService.userProfile() as any)?.vault;
      let siteUrl = vault?.['CUSTOMER_DOMAIN'];
      
      if (!siteUrl) {
         throw new Error('Keine CUSTOMER_DOMAIN im Tresor gefunden.');
      }
      
      // Google Search Console erfordert oft spezielle Präfixe für Domain-Properties
      if (!siteUrl.startsWith('http') && !siteUrl.startsWith('sc-domain:')) {
         siteUrl = 'sc-domain:' + siteUrl;
      }
      // GSC Daten haben ~3 Tage Latenzzeit. Daher Enddatum in Vergangenheit ansetzen.
      const d = new Date();
      d.setDate(d.getDate() - 3);
      const endDate = d.toISOString().split('T')[0];
      
      const d2 = new Date();
      d2.setDate(d2.getDate() - 33);
      const startDate = d2.toISOString().split('T')[0];

      // Exakter GSC Search Analytics Endpoint laut Dokumentation
      const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
      
      const body = {
        startDate,
        endDate,
        dimensions: ['date'], // Für die Performance-Timeline
      };

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      // API Call via Angular HttpClient
      const response = await firstValueFrom(this.http.post(url, body, { headers }));
      
      // Falls response leer ist, geben wir ein leeres array an (typisch bei unbespielten Domains)
      this.seoDataResponse.set(response || { rows: [] });

    } catch (e: any) {
      console.error('Search Console API Fehler:', e);
      // Wenn die URL nicht verifiziert wurde, schickt Google oft einen 403 HTTP Code
      this.seoDataResponse.set({ 
        error: true, 
        message: e?.error?.error?.message || 'Fehler beim Abrufen der Daten.' 
      });
    } finally {
      this.isLoadingData.set(false);
    }
  }
}
