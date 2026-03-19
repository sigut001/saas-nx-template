"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = exports.createPortalSession = exports.createCheckoutSession = exports.stripeWebhook = exports.onUserCreated = void 0;
const admin = require("firebase-admin");
const v1_1 = require("firebase-functions/v1");
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
const stripe_1 = require("stripe");
// ─── Firebase Admin initialisieren ───────────────────────────────────────────
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = (0, firestore_1.getFirestore)();
// ─── Stripe initialisieren ────────────────────────────────────────────────────
const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
const stripe = stripeSecretKey
    ? new stripe_1.default(stripeSecretKey, { apiVersion: '2026-02-25.clover' })
    : null;
// ─── AUTH TRIGGER: onUserCreated ─────────────────────────────────────────────
/**
 * Wird automatisch ausgelöst wenn ein neuer Firebase-Auth-Nutzer erstellt wird.
 * 1. Legt Firestore-Profil unter users/{uid} an
 * 2. Legt Stripe Customer an (wenn Stripe konfiguriert)
 * 3. Speichert stripeCustomerId in users/{uid}
 */
exports.onUserCreated = v1_1.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;
    logger.info(`Neuer Nutzer: ${email} (${uid})`);
    // Stripe Customer anlegen
    let stripeCustomerId = null;
    if (stripe && email) {
        try {
            const customer = await stripe.customers.create({
                email,
                name: displayName ?? undefined,
                metadata: { firebaseUid: uid },
            });
            stripeCustomerId = customer.id;
            logger.info(`✅ Stripe Customer angelegt: ${customer.id}`);
        }
        catch (error) {
            logger.error('❌ Stripe Customer anlegen fehlgeschlagen:', error);
            // Nicht abbrechen – User wird trotzdem in Firestore angelegt
        }
    }
    // Firestore-Profil anlegen
    try {
        await db.collection('users').doc(uid).set({
            uid,
            email: email ?? null,
            displayName: displayName ?? null,
            photoURL: photoURL ?? null,
            role: 'user',
            plan: 'free',
            subscriptionStatus: 'active',
            activeOrganizationId: null,
            stripeCustomerId,
            onboardedAt: null,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        logger.info(`✅ users/${uid} erfolgreich angelegt (Stripe: ${stripeCustomerId ?? 'nicht konfiguriert'})`);
    }
    catch (error) {
        logger.error(`❌ Fehler beim Anlegen von users/${uid}:`, error);
        throw error;
    }
});
// ─── HTTPS: Stripe Webhook ───────────────────────────────────────────────────
/**
 * Empfängt Stripe Webhook Events und aktualisiert Firestore.
 *
 * Events:
 *   customer.subscription.created  → plan setzen, status = 'active'/'trialing'
 *   customer.subscription.updated  → plan + status updaten
 *   customer.subscription.deleted  → plan = 'free', status = 'canceled'
 *   invoice.payment_failed         → status = 'past_due'
 *
 * Stripe Webhook URL: https://europe-west1-saas-example-94204.cloudfunctions.net/stripeWebhook
 */
exports.stripeWebhook = (0, https_1.onRequest)({ region: 'europe-west1' }, async (req, res) => {
    if (!stripe) {
        logger.error('STRIPE_SECRET_KEY nicht gesetzt');
        res.status(500).send('Stripe nicht konfiguriert');
        return;
    }
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];
    const sig = req.headers['stripe-signature'];
    let event;
    // Stripe Signatur prüfen (nur in Produktion nötig, im Test überspringen)
    if (webhookSecret && sig) {
        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
        }
        catch (err) {
            logger.error('Webhook Signatur ungültig:', err);
            res.status(400).send('Webhook Signatur ungültig');
            return;
        }
    }
    else {
        // Test-Modus: Signatur nicht prüfen
        event = req.body;
    }
    logger.info(`Stripe Event empfangen: ${event.type}`);
    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object;
                const uid = await getUidFromCustomer(sub.customer);
                if (!uid)
                    break;
                const planId = getPlanFromSubscription(sub);
                const status = sub.status; // 'active', 'trialing', 'past_due', etc.
                await db.collection('users').doc(uid).update({
                    plan: planId,
                    subscriptionStatus: status,
                    subscriptionId: sub.id,
                    currentPeriodEnd: new Date(sub.current_period_end * 1000),
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                });
                logger.info(`✅ User ${uid}: plan=${planId}, status=${status}`);
                break;
            }
            case 'customer.subscription.deleted': {
                const sub = event.data.object;
                const uid = await getUidFromCustomer(sub.customer);
                if (!uid)
                    break;
                await db.collection('users').doc(uid).update({
                    plan: 'free',
                    subscriptionStatus: 'canceled',
                    subscriptionId: null,
                    currentPeriodEnd: null,
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                });
                logger.info(`✅ User ${uid}: Abo gekündigt → Free Plan`);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const uid = await getUidFromCustomer(invoice.customer);
                if (!uid)
                    break;
                await db.collection('users').doc(uid).update({
                    subscriptionStatus: 'past_due',
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                });
                logger.info(`⚠️ User ${uid}: Zahlung fehlgeschlagen → past_due`);
                break;
            }
            default:
                logger.info(`Unbehandelter Event-Typ: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        logger.error('Fehler beim Verarbeiten des Webhooks:', error);
        res.status(500).send('Webhook-Fehler');
    }
});
// ─── HTTPS: Checkout Session erstellen ───────────────────────────────────────
/**
 * Erstellt eine Stripe Checkout Session.
 * POST /createCheckoutSession  { priceId, successUrl, cancelUrl }
 * Authorization: Bearer <Firebase ID Token>
 */
exports.createCheckoutSession = (0, https_1.onRequest)({ region: 'europe-west1', cors: true }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('POST only');
        return;
    }
    if (!stripe) {
        res.status(500).send('Stripe nicht konfiguriert');
        return;
    }
    // Firebase ID Token prüfen
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).send('Nicht autorisiert');
        return;
    }
    let uid;
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        uid = decoded.uid;
    }
    catch {
        res.status(401).send('Ungültiges Token');
        return;
    }
    const { priceId, successUrl, cancelUrl } = req.body;
    // Stripe Customer ID aus Firestore lesen
    const userDoc = await db.collection('users').doc(uid).get();
    const stripeCustomerId = userDoc.data()?.['stripeCustomerId'];
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: stripeCustomerId ?? undefined,
            customer_email: stripeCustomerId ? undefined : userDoc.data()?.['email'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: cancelUrl,
            metadata: { firebaseUid: uid },
        });
        res.json({ url: session.url, sessionId: session.id });
    }
    catch (error) {
        logger.error('Checkout Session Fehler:', error);
        res.status(500).json({ error: 'Checkout Session konnte nicht erstellt werden' });
    }
});
// ─── HTTPS: Customer Portal Session ──────────────────────────────────────────
/**
 * Erstellt eine Stripe Customer Portal Session.
 * POST /createPortalSession
 * Authorization: Bearer <Firebase ID Token>
 */
exports.createPortalSession = (0, https_1.onRequest)({ region: 'europe-west1', cors: true }, async (req, res) => {
    if (!stripe) {
        res.status(500).send('Stripe nicht konfiguriert');
        return;
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).send('Nicht autorisiert');
        return;
    }
    let uid;
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        uid = decoded.uid;
    }
    catch {
        res.status(401).send('Ungültiges Token');
        return;
    }
    const userDoc = await db.collection('users').doc(uid).get();
    const stripeCustomerId = userDoc.data()?.['stripeCustomerId'];
    if (!stripeCustomerId) {
        res.status(400).send('Kein Stripe Customer');
        return;
    }
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: req.body?.['returnUrl'] ?? 'https://saas-example-94204.web.app/app/billing',
        });
        res.json({ url: session.url });
    }
    catch (error) {
        logger.error('Portal Session Fehler:', error);
        res.status(500).json({ error: 'Portal Session konnte nicht erstellt werden' });
    }
});
// ─── HTTPS: Health-Check ─────────────────────────────────────────────────────
exports.health = (0, https_1.onRequest)({ region: 'europe-west1' }, (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        project: process.env.GCLOUD_PROJECT ?? 'unknown',
        stripe: stripe ? 'konfiguriert' : 'nicht konfiguriert',
    });
});
// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────
/** Findet Firebase UID anhand der Stripe Customer ID */
async function getUidFromCustomer(customerId) {
    // Erst in Firestore suchen (via stripeCustomerId Feld)
    const snapshot = await db.collection('users')
        .where('stripeCustomerId', '==', customerId)
        .limit(1)
        .get();
    if (!snapshot.empty)
        return snapshot.docs[0].id;
    // Fallback: Stripe Customer Metadata prüfen
    if (stripe) {
        try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!customer.deleted && customer.metadata?.['firebaseUid']) {
                return customer.metadata['firebaseUid'];
            }
        }
        catch { /* ignorieren */ }
    }
    logger.warn(`Kein User gefunden für Stripe Customer: ${customerId}`);
    return null;
}
/** Liest Plan-ID aus Stripe Subscription (via Price Metadata oder Fallback) */
function getPlanFromSubscription(sub) {
    const item = sub.items.data[0];
    if (!item)
        return 'free';
    const priceId = item.price.id;
    // Plan-Map (muss mit billing.config.ts übereinstimmen)
    // Wird idealerweise aus Stripe Price Metadata gelesen:
    // stripe.prices.update(priceId, { metadata: { planId: 'pro' } })
    const plan = item.price.metadata?.['planId'];
    if (plan)
        return plan;
    // Fallback: nach Preis-ID suchen (wird durch setup.js befüllt)
    logger.warn(`Keine planId Metadata für Price ${priceId} – nutze 'pro' als Fallback`);
    return 'pro';
}
//# sourceMappingURL=index.js.map