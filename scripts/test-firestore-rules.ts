/**
 * Firestore Security Rules – Test-Script
 *
 * Testet die Rules direkt gegen Firebase (ohne Emulator).
 * Nutzt firebase-admin mit Service Account für legitime Writes
 * und den Firebase REST API für unauthentifizierte Zugriffe.
 *
 * Ausführen: npx tsx scripts/test-firestore-rules.ts
 */

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { getFirestore } from 'firebase-admin/firestore';

// ─── Config ──────────────────────────────────────────────────────────────────

const PROJECT_ID = 'saas-example-94204';
const REST_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Service Account Key (liegt neben diesem Script)
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../../service-account.json');

type TestResult = { name: string; pass: boolean; detail?: string };
const results: TestResult[] = [];

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function log(pass: boolean, name: string, detail?: string) {
  const icon = pass ? '✅' : '❌';
  console.log(`  ${icon} ${name}${detail ? ` (${detail})` : ''}`);
  results.push({ name, pass, detail });
}

/** Unauthentifizierter REST GET – erwartet 403 oder 401 */
async function fetchUnauthenticated(path: string): Promise<number> {
  const res = await fetch(`${REST_BASE}/${path}`);
  return res.status;
}

// ─── Admin SDK Setup ──────────────────────────────────────────────────────────

async function initAdmin() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.log('\n⚠️  Kein Service Account gefunden. Einige Tests werden übersprungen.');
    console.log(`   Erwartet unter: ${SERVICE_ACCOUNT_PATH}\n`);
    return null;
  }
  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
  return getFirestore();
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function runTests() {
  console.log('\n🔷 Firestore Security Rules – Tests\n');
  console.log('═'.repeat(50));

  const db = await initAdmin();

  // ── Testdaten Setup ─────────────────────────────────────────────────────────
  const testUid   = 'test-user-' + Date.now();
  const otherUid  = 'other-user-' + Date.now();
  const testOrgId = 'test-org-' + Date.now();

  if (db) {
    console.log('\n📦 Test-Dokumente anlegen (via Admin SDK)...');

    // User-Dokumente anlegen (Admin SDK umgeht Rules)
    await db.collection('users').doc(testUid).set({
      uid: testUid, email: 'test@example.com', role: 'user',
      activeOrganizationId: testOrgId, createdAt: new Date(),
    });
    await db.collection('users').doc(otherUid).set({
      uid: otherUid, email: 'other@example.com', role: 'user',
      activeOrganizationId: null, createdAt: new Date(),
    });

    // Org anlegen
    await db.collection('organizations').doc(testOrgId).set({
      id: testOrgId, name: 'Test Org', plan: 'free', createdAt: new Date(),
    });
    await db.collection('organizations').doc(testOrgId)
      .collection('members').doc(testUid).set({
        uid: testUid, role: 'owner', joinedAt: new Date(),
      });

    console.log('   ✓ Test-Dokumente angelegt\n');
  }

  // ── Test-Block 1: Unauthentifizierter Zugriff ────────────────────────────────
  console.log('─'.repeat(50));
  console.log('🔒 Block 1: Unauthentifizierter Zugriff (erwartet: alle 403)');
  console.log('─'.repeat(50));

  const status1 = await fetchUnauthenticated(`users/${testUid}`);
  log(status1 === 403 || status1 === 401,
    `GET users/${testUid} ohne Login`, `HTTP ${status1}`);

  const status2 = await fetchUnauthenticated(`organizations/${testOrgId}`);
  log(status2 === 403 || status2 === 401,
    `GET organizations/${testOrgId} ohne Login`, `HTTP ${status2}`);

  const status3 = await fetchUnauthenticated(`subscriptions/${testUid}`);
  log(status3 === 403 || status3 === 401,
    `GET subscriptions/${testUid} ohne Login`, `HTTP ${status3}`);

  // ── Test-Block 2: Admin SDK (bypassed Rules – Setup-Verification) ─────────────
  if (db) {
    console.log('\n─'.repeat(50));
    console.log('🔑 Block 2: Admin SDK (Rules bypass) – Daten vorhanden?');
    console.log('─'.repeat(50));

    const userDoc = await db.collection('users').doc(testUid).get();
    log(userDoc.exists, `users/${testUid} existiert als Admin lesbar`);

    const orgDoc = await db.collection('organizations').doc(testOrgId).get();
    log(orgDoc.exists, `organizations/${testOrgId} existiert als Admin lesbar`);

    const memberDoc = await db.collection('organizations').doc(testOrgId)
      .collection('members').doc(testUid).get();
    log(memberDoc.exists, `organizations/${testOrgId}/members/${testUid} existiert`);

    // ── Aufräumen ─────────────────────────────────────────────────────────────
    console.log('\n🧹 Test-Dokumente aufräumen...');
    await db.collection('users').doc(testUid).delete();
    await db.collection('users').doc(otherUid).delete();
    await db.collection('organizations').doc(testOrgId)
      .collection('members').doc(testUid).delete();
    await db.collection('organizations').doc(testOrgId).delete();
    console.log('   ✓ Aufgeräumt\n');
  }

  // ── Zusammenfassung ──────────────────────────────────────────────────────────
  console.log('═'.repeat(50));
  const passed = results.filter(r => r.pass).length;
  const total  = results.length;
  const allPass = passed === total;
  console.log(`\n${allPass ? '🎉' : '⚠️ '} Ergebnis: ${passed}/${total} Tests bestanden`);
  if (!allPass) {
    console.log('\nFehlgeschlagene Tests:');
    results.filter(r => !r.pass).forEach(r =>
      console.log(`  ❌ ${r.name}${r.detail ? ` → ${r.detail}` : ''}`));
  }
  console.log();
  process.exit(allPass ? 0 : 1);
}

runTests().catch(err => {
  console.error('Fehler:', err);
  process.exit(1);
});
