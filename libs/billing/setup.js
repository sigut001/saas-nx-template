#!/usr/bin/env node
/**
 * Stripe Setup Script – libs/billing
 *
 * Was es tut:
 * 1. Liest Plan-Definitionen aus billing.config.ts (via require)
 * 2. Legt Stripe Produkte + Preise an (idempotent – überspringt bereits vorhandene)
 * 3. Setzt metadata.planId auf jedem Price (braucht der Webhook)
 * 4. Schreibt die Price IDs zurück in billing.config.ts
 *
 * Ausführen:
 *   npx tsx libs/billing/setup.js
 *
 * Voraussetzung:
 *   STRIPE_SECRET_KEY in .env (Root oder functions/.env)
 */

const path = require('path');
const fs   = require('fs');

// .env laden
const dotenv = require('dotenv');
const rootEnv     = path.resolve(__dirname, '../../.env');
const functionsEnv = path.resolve(__dirname, '../../functions/.env');
if (fs.existsSync(rootEnv))      dotenv.config({ path: rootEnv });
if (fs.existsSync(functionsEnv)) dotenv.config({ path: functionsEnv });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY nicht gefunden. Bitte in .env oder functions/.env eintragen.');
  process.exit(1);
}

const Stripe = require('stripe');
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' });

// ─── Plan-Definitionen (direkt hier – keine TS-Abhängigkeit) ────────────────
const PLANS = [
  {
    id:          'pro',
    name:        'Pro',
    description: 'Für professionelle Nutzer',
    monthlyPrice: 2900,   // in Cent
    annualPrice:  27900,
  },
  {
    id:          'enterprise',
    name:        'Enterprise',
    description: 'Für Teams und Unternehmen',
    monthlyPrice: 9900,
    annualPrice:  95000,
  },
];

// ─── Config-Datei Pfad ────────────────────────────────────────────────────
const CONFIG_PATH = path.resolve(__dirname, 'src/lib/billing.config.ts');

async function main() {
  console.log('🚀 Stripe Setup startet...\n');

  const results = {};

  for (const plan of PLANS) {
    console.log(`📦 Plan: ${plan.name}`);

    // Produkt anlegen oder finden
    let product;
    const existing = await stripe.products.search({
      query: `metadata['planId']:'${plan.id}'`,
      limit: 1,
    });

    if (existing.data.length > 0) {
      product = existing.data[0];
      console.log(`   ↳ Produkt bereits vorhanden: ${product.id}`);
    } else {
      product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { planId: plan.id },
      });
      console.log(`   ✅ Produkt angelegt: ${product.id}`);
    }

    // Monatlichen Preis anlegen
    const monthlyPriceId = await getOrCreatePrice(product.id, plan.id, plan.monthlyPrice, 'month');
    console.log(`   ✅ Monatlicher Preis: ${monthlyPriceId} (${plan.monthlyPrice / 100}€/Monat)`);

    // Jährlichen Preis anlegen
    const annualPriceId = await getOrCreatePrice(product.id, plan.id, plan.annualPrice, 'year');
    console.log(`   ✅ Jährlicher Preis:  ${annualPriceId} (${plan.annualPrice / 100}€/Jahr)\n`);

    results[plan.id] = { monthlyPriceId, annualPriceId };
  }

  // ─── Price IDs in billing.config.ts eintragen ────────────────────────────
  console.log('📝 Trage Price IDs in billing.config.ts ein...');
  let config = fs.readFileSync(CONFIG_PATH, 'utf8');

  for (const [planId, { monthlyPriceId, annualPriceId }] of Object.entries(results)) {
    // Ersetze stripePriceIdMonthly für diesen Plan
    // Sucht den Plan-Block und ersetzt die leeren Strings
    config = config.replace(
      new RegExp(`(id:\\s*'${planId}'[\\s\\S]*?stripePriceIdMonthly:\\s*)'[^']*'`),
      `$1'${monthlyPriceId}'`
    );
    config = config.replace(
      new RegExp(`(id:\\s*'${planId}'[\\s\\S]*?stripePriceIdAnnual:\\s*)'[^']*'`),
      `$1'${annualPriceId}'`
    );
    console.log(`   ✅ ${planId}: monatlich=${monthlyPriceId}, jährlich=${annualPriceId}`);
  }

  fs.writeFileSync(CONFIG_PATH, config, 'utf8');
  console.log('\n✅ billing.config.ts aktualisiert!');
  console.log('\n🎉 Setup abgeschlossen. Nächster Schritt: App neu bauen und testen.\n');
}

async function getOrCreatePrice(productId, planId, amount, interval) {
  // Suche ob bereits ein Preis mit dieser planId + interval existiert
  const existing = await stripe.prices.search({
    query: `product:'${productId}' AND metadata['planId']:'${planId}' AND metadata['interval']:'${interval}'`,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const price = await stripe.prices.create({
    product:    productId,
    unit_amount: amount,
    currency:   'eur',
    recurring:  { interval },
    metadata:   { planId, interval },
  });

  return price.id;
}

main().catch((err) => {
  console.error('❌ Fehler:', err.message);
  process.exit(1);
});
