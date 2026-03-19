import * as admin from 'firebase-admin';
import { auth } from 'firebase-functions/v1';
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';

// ─── Firebase Admin initialisieren ───────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = getFirestore();

// ─── AUTH TRIGGER: onUserCreated ─────────────────────────────────────────────
/**
 * Wird automatisch ausgelöst wenn ein neuer Firebase-Auth-Nutzer erstellt wird.
 * Legt das Firestore-Profil unter users/{uid} an.
 *
 * Test: Neuen Account registrieren →
 *   Firebase Console → Firestore → users/{uid} prüfen
 */
export const onUserCreated = auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  logger.info(`Neuer Nutzer: ${email} (${uid})`);

  try {
    await db.collection('users').doc(uid).set({
      uid,
      email: email ?? null,
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
      role: 'user',
      activeOrganizationId: null,
      stripeCustomerId: null,
      onboardedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info(`✅ users/${uid} erfolgreich angelegt`);
  } catch (error) {
    logger.error(`❌ Fehler beim Anlegen von users/${uid}:`, error);
    throw error;
  }
});

// ─── HTTPS: Health-Check ─────────────────────────────────────────────────────
/**
 * Einfacher Health-Check Endpoint.
 * GET https://<region>-saas-example-94204.cloudfunctions.net/health
 */
export const health = onRequest({ region: 'europe-west1' }, (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    project: process.env.GCLOUD_PROJECT ?? 'unknown',
  });
});
