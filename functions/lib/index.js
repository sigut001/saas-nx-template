"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = exports.onUserCreated = void 0;
const admin = require("firebase-admin");
const v1_1 = require("firebase-functions/v1");
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
// ─── Firebase Admin initialisieren ───────────────────────────────────────────
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = (0, firestore_1.getFirestore)();
// ─── AUTH TRIGGER: onUserCreated ─────────────────────────────────────────────
/**
 * Wird automatisch ausgelöst wenn ein neuer Firebase-Auth-Nutzer erstellt wird.
 * Legt das Firestore-Profil unter users/{uid} an.
 *
 * Test: Neuen Account registrieren →
 *   Firebase Console → Firestore → users/{uid} prüfen
 */
exports.onUserCreated = v1_1.auth.user().onCreate(async (user) => {
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
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        logger.info(`✅ users/${uid} erfolgreich angelegt`);
    }
    catch (error) {
        logger.error(`❌ Fehler beim Anlegen von users/${uid}:`, error);
        throw error;
    }
});
// ─── HTTPS: Health-Check ─────────────────────────────────────────────────────
/**
 * Einfacher Health-Check Endpoint.
 * GET https://<region>-saas-example-94204.cloudfunctions.net/health
 */
exports.health = (0, https_1.onRequest)({ region: 'europe-west1' }, (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        project: process.env.GCLOUD_PROJECT ?? 'unknown',
    });
});
//# sourceMappingURL=index.js.map