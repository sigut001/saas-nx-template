/**
 * Firestore Security Rules – Bidirektionaler Test-Script
 *
 * Testet BEIDE Richtungen:
 *   ✅ autorisierter Zugriff  → erwartet 200 (erlaubt)
 *   🚫 unautorisierter Zugriff → erwartet 403 (geblockt)
 *
 * Strategie:
 *   - Email/Passwort Login via Firebase Auth REST → echte ID Tokens
 *   - Firestore REST API mit/ohne Token → prüft Rules bidirektional
 *
 * Ausführen: npx tsx scripts/test-firestore-rules.ts
 * Voraussetzung: FIREBASE_API_KEY env-Variable oder hardcoded API_KEY unten
 */

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// ─── Konfiguration ────────────────────────────────────────────────────────────
const PROJECT_ID = 'saas-example-94204';
const API_KEY    = 'AIzaSyBv3uQqb7z5OSggcpm8GZMCRPWPm6rAzCM'; // Web API Key
const REST_BASE  = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../service-account.json');

// ─── Test-Tracker ─────────────────────────────────────────────────────────────
type Result = { name: string; pass: boolean; detail: string };
const results: Result[] = [];
let passed = 0;

function log(pass: boolean, name: string, detail: string) {
  console.log(`  ${pass ? '✅' : '❌'} ${name.padEnd(48)} ${detail}`);
  results.push({ name, pass, detail });
  if (pass) passed++;
}

// ─── HTTP Helpers ─────────────────────────────────────────────────────────────

async function fsGet(docPath: string, token?: string): Promise<number> {
  const headers: HeadersInit = token
    ? { 'Authorization': `Bearer ${token}` }
    : {};
  const res = await fetch(`${REST_BASE}/${docPath}`, { headers });
  return res.status;
}

/** Firebase Email/PW Signup via REST → ID Token */
async function signUp(email: string, password: string): Promise<string | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }) }
  );
  const data = await res.json() as { idToken?: string; error?: { message: string } };
  if (!res.ok) { console.log(`    ⚠️ signUp Fehler: ${data.error?.message}`); return null; }
  return data.idToken ?? null;
}

/** Firebase Email/PW Signin → ID Token */
async function signIn(email: string, password: string): Promise<string | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }) }
  );
  const data = await res.json() as { idToken?: string; localId?: string; error?: { message: string } };
  if (!res.ok) { console.log(`    ⚠️ signIn Fehler: ${data.error?.message}`); return null; }
  return data.idToken ?? null;
}

/** Firebase Email/PW Signup → Gibt auch localId (uid) zurück */
async function signUpWithUid(email: string, password: string): Promise<{ idToken: string; uid: string } | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }) }
  );
  const data = await res.json() as { idToken?: string; localId?: string; error?: { message: string } };
  if (!res.ok || !data.idToken || !data.localId) return null;
  return { idToken: data.idToken, uid: data.localId };
}

// ─── Haupttest ────────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n🔷 Firestore Security Rules – Bidirektionale Tests');
  console.log('   ✅ = erlaubt erwartet  |  🚫 = geblockt erwartet\n');
  console.log('═'.repeat(70));

  // Admin SDK (optional – für Testdaten-Setup)
  let db: FirebaseFirestore.Firestore | null = null;
  let authSDK: ReturnType<typeof getAuth> | null = null;
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    const sa = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
    admin.initializeApp({ credential: admin.credential.cert(sa), projectId: PROJECT_ID });
    db = getFirestore();
    authSDK = getAuth();
    console.log('✓ Admin SDK geladen (Service Account gefunden)\n');
  } else {
    console.log('ℹ️  Kein Service Account – nutze Firebase Auth REST für Tokens\n');
  }

  // ─── Test-User anlegen ──────────────────────────────────────────────────────
  const ts   = Date.now();
  const emailA = `test-a-${ts}@rules-test.dev`;
  const emailB = `test-b-${ts}@rules-test.dev`;
  const pw     = 'Test1234!';

  console.log('📦 Setup: Test-User A und B registrieren...');
  const userA = await signUpWithUid(emailA, pw);
  const userB = await signUpWithUid(emailB, pw);

  if (!userA || !userB) {
    console.log('❌ Fehler: Konnte Test-User nicht anlegen. Abbruch.\n');
    process.exit(1);
  }

  const tokenA = userA.idToken;
  const tokenB = userB.idToken;
  const uidA   = userA.uid;
  const uidB   = userB.uid;
  const orgId  = `org-${ts}`;

  console.log(`   ✓ User A: uid=${uidA.slice(-6)}`);
  console.log(`   ✓ User B: uid=${uidB.slice(-6)}\n`);

  // Admin SDK legt Firestore-Dokumente an (umgeht Rules)
  if (db) {
    await db.collection('users').doc(uidA).set({
      uid: uidA, email: emailA, role: 'user', activeOrganizationId: orgId, createdAt: new Date(),
    });
    await db.collection('users').doc(uidB).set({
      uid: uidB, email: emailB, role: 'user', activeOrganizationId: null, createdAt: new Date(),
    });
    await db.collection('organizations').doc(orgId).set({
      id: orgId, name: 'Test Org', plan: 'free', createdAt: new Date(),
    });
    await db.collection('organizations').doc(orgId)
      .collection('members').doc(uidA).set({ uid: uidA, role: 'owner', joinedAt: new Date() });
    console.log('📦 Firestore-Testdaten angelegt (Admin SDK)\n');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BLOCK 1: Unautorisiert (kein Token) → alles 403
  // ════════════════════════════════════════════════════════════════════════════
  console.log('─'.repeat(70));
  console.log('🚫 Block 1: Ohne Token (erwartet: 403)\n');

  log([403,401].includes(await fsGet(`users/${uidA}`)),
    'GET users/A ohne Token', `HTTP ${await fsGet(`users/${uidA}`)}`);
  log([403,401].includes(await fsGet(`organizations/${orgId}`)),
    'GET organizations/Org ohne Token', `HTTP ${await fsGet(`organizations/${orgId}`)}`);
  log([403,401].includes(await fsGet(`subscriptions/${uidA}`)),
    'GET subscriptions/A ohne Token', `HTTP ${await fsGet(`subscriptions/${uidA}`)}`);

  // ════════════════════════════════════════════════════════════════════════════
  // BLOCK 2: User A – eigene Daten (autorisiert) → 200
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n─'.repeat(70));
  console.log('✅ Block 2: User A – eigene Daten (erwartet: 200)\n');

  log([200, 404].includes(await fsGet(`users/${uidA}`, tokenA)),
    'User A liest eigenes users/A', `HTTP ${await fsGet(`users/${uidA}`, tokenA)} (200/404=Rules OK)`);
  if (db) {
    log(await fsGet(`organizations/${orgId}`, tokenA) === 200,
      'User A (Owner) liest eigene Org', `HTTP ${await fsGet(`organizations/${orgId}`, tokenA)}`);
    log(await fsGet(`organizations/${orgId}/members/${uidA}`, tokenA) === 200,
      'User A liest eigenen Member-Eintrag', `HTTP ${await fsGet(`organizations/${orgId}/members/${uidA}`, tokenA)}`);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BLOCK 3: User B – fremde Daten (cross-user) → 403
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n─'.repeat(70));
  console.log('🚫 Block 3: User B – fremde Daten (erwartet: 403)\n');

  log([403,401].includes(await fsGet(`users/${uidA}`, tokenB)),
    'User B liest fremdes users/A', `HTTP ${await fsGet(`users/${uidA}`, tokenB)}`);
  if (db) {
    log([403,401].includes(await fsGet(`organizations/${orgId}`, tokenB)),
      'User B (kein Mitglied) liest fremde Org', `HTTP ${await fsGet(`organizations/${orgId}`, tokenB)}`);
  }

  // ── Aufräumen ────────────────────────────────────────────────────────────────
  if (db && authSDK) {
    console.log('\n🧹 Aufräumen...');
    await db.collection('organizations').doc(orgId).collection('members').doc(uidA).delete();
    await db.collection('organizations').doc(orgId).delete();
    await db.collection('users').doc(uidA).delete();
    await db.collection('users').doc(uidB).delete();
    await authSDK.deleteUser(uidA).catch(() => {});
    await authSDK.deleteUser(uidB).catch(() => {});
    console.log('   ✓ Testdaten + Auth-User gelöscht');
  }

  // ── Zusammenfassung ──────────────────────────────────────────────────────────
  const total   = results.length;
  const allPass = passed === total;
  console.log('\n' + '═'.repeat(70));
  console.log(`\n${allPass ? '🎉' : '⚠️ '} Ergebnis: ${passed}/${total} Tests bestanden\n`);
  if (!allPass) {
    console.log('Fehlgeschlagene Tests:');
    results.filter(r => !r.pass).forEach(r => console.log(`  ❌ ${r.name} → ${r.detail}`));
  }
  process.exit(allPass ? 0 : 1);
}

runTests().catch(err => { console.error('Fehler:', err); process.exit(1); });
