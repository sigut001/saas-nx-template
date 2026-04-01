/**
 * Skript: Test-Kunden (Mock-Tenant) generieren
 * 
 * Verwendet die abstrakte Logik aus create-tenant.ts.
 * 
 * Ausführen:
 * npx tsx scripts/tenant-management/test-tenant-onboarding.ts
 */

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createTenant, CreateTenantConfig } from './create-tenant';

// Lade .env Datei aus dem Root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID || 'saas-example-94204'; 

async function runTest() {
  console.log('🚀 Starte Tenant-Onboarding Simulator...\n');

  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    console.error(`❌ FEHLER: FIREBASE_ADMIN_PRIVATE_KEY nicht in .env gefunden!`);
    process.exit(1);
  }

  // 1. Initialisieren der Admin DB (Agency Base)
  // Fix für mehrzeilige Private Keys aus der .env
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  
  const masterApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: PROJECT_ID,
      clientEmail: clientEmail,
      privateKey: privateKey,
    }),
    projectId: PROJECT_ID
  });

  console.log('✅ Firebase Admin SDK aktiv.');

  // 2. Mock Daten definieren
  const config: CreateTenantConfig = {
    user: {
      email: 'testkunde@qubits.de',
      password: 'TestPassword123!',
      displayName: 'Demo Kunde'
    },
    subscription: {
      plan: 'pro',
      role: 'user', // "user" repräsentiert den Endkunden im SaaS-Dashboard
      activeFeatures: ['blog-editor']
    },
    targetFirebaseConfig: {
      projectId: "test-angular-automation",
      apiKey: "AIzaSyA8s-0IXSxqevX8Y306HVXRldEfxSBrg-8",
      authDomain: "test-angular-automation.firebaseapp.com",
      storageBucket: "test-angular-automation.firebasestorage.app",
      
      // ECHTER PRIVATE-KEY der Company Website (test-angular-automation) 
      clientEmail: "firebase-adminsdk-fbsvc@test-angular-automation.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkRi41/oC98/vM\nbQHZKKJWiS8u7vuOPv6EFSjUa5+R/43TmwHuuyc2NsSrqJymSFga8xT7aI96XZaC\n8aFGA856aasEb6ZWzvh5cWA6UgtgChjaLMJI0V1CRNNMHT3ge9Q+7sFXkTUCW8T4\nc7LoOu4B6k4d36UlLIFBuGRBF/9d8h7I62a9BfyXuF6EbOsw6kdlMP9jThMAf0e2\nU9B+cvoIPnCqUTc5jgd22J58zMY0KBDedBZEhBmE6GnwjhS2Hz431bqfg/3L/cem\nDEqkp2A0bg0e2mmpMlSVAp+PZl+I0Sl7aWAIF5xpRJrqLGu3WdkC4uzNm9P6Z0Vu\ncHGvYdsrAgMBAAECggEAAi86uxYU0THW5duHPEOJkRwG6BleeABHcysy3UxHFXJw\nCOHVTz7m4RYuXFgEKUPqBAW6gDNeQRLQhxI+gkdXrhIMp6TycdITxM2oqW3g39iS\nhwg0VzKNim2O38K9yWfsJSAYqxjvuwXMYz9qoCL0eksK2ePY9tsWJvEUSDdQ+odR\nwdgMIa12jllHhL5T0UEBeR9qG1XaefkzlkSfgz6rVT1VDX0Buxl33nLXwIMSse0h\n5iYmHilx69es52nQE8SWALXnR7LlPwZq9CGm6Ai5RnBSxDkonvEqLyuJx+1MvM1U\nf1+bDol+kQVxr8iZ3msmq/v2bAH8a7qi/EHJrmbacQKBgQDZbet3z3VmWHc6FmDv\n0Nk/osT34ihqriXev0AJX/K1T+JS6zeRr8a/DiqsLrS/zV5d5YWDXOZeC2BHUbK3\nRRO1i6IZt4un1C6lBDLqJvaYnVQMr6Cwz2ufFM3wSMF8rWNMHtmKyrvXkfiRowSB\nZMKvgyfjQdODtoqFwN8ZWHfv0QKBgQDBalT6588WFQDZz8NDBoab6rLBOcdF960c\nKM45bOC9xTxz3e0UZXE5c8eXI7LqWVOEelAqiJIa251cBZq+WqwiNwY/Wi+Th/2N\nsDYwjj++ShxwMPkkxd1KVPWwwUJuzCJuRADyIbs0wPgcTfl1Z+GZq5sxgRZ4l5Aq\nMTuW2g+2OwKBgADKI2bF/BkpDRXK6wMz8PYIM0rrKVZp131dmG/wR0NdTOccL5F5\n3/DlrkX9zW484rDYmomFltiUlf7sTwfXWmD4ZthNEFbFsH2s7Dppdc/MEngRUzYR\nKsTjIHRU707ymj+2hPe6EMCRqSNuQh/uK77TbRuoK4p46TvfHXBMH/NhAoGBALjf\nHA8fV2+x77hBwE/mgu+xK99JjNGx5YNO9Z8qFL8PMbNGYv/l3o2dvx8V/kPF0fCE\nwO+GzrBhTk3RBZIBNRsXIR+Y4nTPvWmbDpDmxsLqL7iE9v9RKS2Ne7HRZ+Bjul1P\nHuBRoZDRCdZ0KYcxHhA2WQa+bm4h4KiTmnOcRvxVAoGAcIldDls2cSSme0Y2Dpr1\nNq03sEGWGJAEmf9n5GvHbUEXfFjqA78BLchxQpnzOaxRF61xivt7xCC/QU8VE8My\nl2PJcmJsjZ3dbpnkn48gOrFvMX/awz4sRlA+EqtIhfiFskVb8f4QuIRMZ+oFxUs7\nZ6bzPpEAA96JQqAQxiy/1AA=\n-----END PRIVATE KEY-----\n"
    },
    masterAdminDbInstance: masterApp
  };

  // 3. Modulare Kern: create-tenant aufrufen
  try {
    const newUid = await createTenant(config);
    console.log(`🎉 Erfolgreich durchlaufen. UID: ${newUid}`);
    console.log('\nDu kannst dich jetzt im KUNDENADMIN einloggen!');
  } catch (err) {
    console.error('\n❌ Schwerer Fehler beim Einrichten des Mandanten:', err);
  } finally {
    // Firebase Verbindung sauber beenden
    await masterApp.delete();
  }
}

runTest();
