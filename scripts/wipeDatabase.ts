/**
 * Remet la base de données à zéro.
 * Supprime : users, products, orders, reviews, wishlists, coupons,
 *            loyaltypoints, referrals, tickets, conversations, notifications, brands, blogs
 * Conserve : settings, shippingzones, categories
 *
 * Utilisation: npx tsx scripts/wipeDatabase.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI introuvable');
  process.exit(1);
}

const TO_WIPE = [
  'users',
  'products',
  'orders',
  'reviews',
  'wishlists',
  'coupons',
  'loyaltypoints',
  'referrals',
  'tickets',
  'conversations',
  'notifications',
  'brands',
  'blogs',
];

const TO_KEEP = ['settings', 'shippingzones', 'categories'];

async function wipeDatabase() {
  console.log('🔌 Connexion à MongoDB...');
  await mongoose.connect(MONGODB_URI!);
  console.log('✅ Connecté\n');

  const db = mongoose.connection.db!;

  console.log(`✔  Conservé : ${TO_KEEP.join(', ')}\n`);

  let totalDeleted = 0;

  for (const colName of TO_WIPE) {
    const col = db.collection(colName);
    const count = await col.countDocuments();
    if (count === 0) {
      console.log(`   ${colName}: vide`);
      continue;
    }
    const result = await col.deleteMany({});
    console.log(`🗑️  ${colName}: ${result.deletedCount} supprimé(s)`);
    totalDeleted += result.deletedCount;
  }

  console.log(`\n✅ Terminé — ${totalDeleted} document(s) supprimé(s) au total`);

  // Vérification
  console.log('\n📊 État final :');
  for (const colName of [...TO_WIPE, ...TO_KEEP]) {
    const n = await db.collection(colName).countDocuments();
    const kept = TO_KEEP.includes(colName);
    console.log(`   ${kept ? '✔' : n === 0 ? '✅' : '❌'} ${colName}: ${n}`);
  }

  await mongoose.disconnect();
  console.log('\n🔌 Déconnecté.');
}

wipeDatabase().catch((err) => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
