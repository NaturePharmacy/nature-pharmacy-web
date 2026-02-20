/**
 * Script de nettoyage des données de test E2E
 * Supprime les comptes test et les produits créés lors des tests automatisés.
 * Les vrais produits (Moringa, Kinkeliba, etc.) ne sont PAS touchés.
 *
 * Utilisation: npx tsx scripts/cleanTestData.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI introuvable dans les variables d\'environnement');
  process.exit(1);
}

// Emails des comptes de test fixes (créés par createTestUsers.ts)
const TEST_USER_EMAILS = [
  'admin@test.com',
  'seller@test.com',
  'buyer@test.com',
];

// Pattern pour les emails de test dynamiques créés pendant les tests E2E
// (ex: buyer-1234567890-abcdef12@test.com)
const TEST_EMAIL_DOMAIN = '@test.com';

// Patterns de noms de produits de test (en fr, en ou es)
const TEST_PRODUCT_NAME_PATTERNS = [
  /^Produit Test /i,
  /^Test Product /i,
  /^Update Product /i,
  /^Produit Update /i,
  /^Test Product Updated/i,
];

async function cleanTestData() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connecté à MongoDB\n');

    const db = mongoose.connection.db!;
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');
    const wishlistsCollection = db.collection('wishlists');
    const ordersCollection = db.collection('orders');
    const reviewsCollection = db.collection('reviews');

    // ── 1. Trouver tous les utilisateurs de test ─────────────────────────────
    console.log('🔍 Recherche des utilisateurs de test...');
    const testUsers = await usersCollection.find({
      $or: [
        { email: { $in: TEST_USER_EMAILS } },
        { email: { $regex: /^(admin|seller|buyer|test)-.*@test\.com$/ } },
      ],
    }).toArray();

    console.log(`   Trouvé: ${testUsers.length} utilisateur(s) de test`);
    testUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`));

    const testUserIds = testUsers.map(u => u._id);

    // ── 2. Trouver les produits créés par les vendeurs de test ───────────────
    console.log('\n🔍 Recherche des produits créés par les vendeurs de test...');

    // Produits liés aux comptes test (par seller ID)
    const productsByTestSeller = testUserIds.length > 0
      ? await productsCollection.find({
          seller: { $in: testUserIds },
        }).toArray()
      : [];

    // Produits dont le nom correspond aux patterns de test
    const allProducts = await productsCollection.find({}).toArray();
    const productsByName = allProducts.filter(p => {
      const nameFr = p.name?.fr || '';
      const nameEn = p.name?.en || '';
      const nameEs = p.name?.es || '';
      return TEST_PRODUCT_NAME_PATTERNS.some(
        pattern => pattern.test(nameFr) || pattern.test(nameEn) || pattern.test(nameEs)
      );
    });

    // Union des deux ensembles (sans doublons)
    const allTestProductIds = new Set([
      ...productsByTestSeller.map(p => p._id.toString()),
      ...productsByName.map(p => p._id.toString()),
    ]);

    const testProductIds = [...allTestProductIds].map(id => new mongoose.Types.ObjectId(id));

    console.log(`   Trouvé: ${testProductIds.length} produit(s) de test`);
    if (testProductIds.length > 0) {
      const sampleNames = [
        ...productsByTestSeller.slice(0, 5).map(p => p.name?.fr || p.name?.en || '?'),
        ...productsByName.slice(0, 5).map(p => p.name?.fr || p.name?.en || '?'),
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 10);
      sampleNames.forEach(n => console.log(`   - ${n}`));
      if (testProductIds.length > 10) {
        console.log(`   ... et ${testProductIds.length - 10} autres`);
      }
    }

    // ── 3. Résumé avant suppression ──────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RÉSUMÉ DE CE QUI SERA SUPPRIMÉ :');
    console.log(`   • ${testUsers.length} utilisateur(s) de test`);
    console.log(`   • ${testProductIds.length} produit(s) de test`);
    console.log('   • Wishlists et reviews liées à ces produits/utilisateurs');
    console.log('\n⚠️  Les vrais produits (Moringa, Kinkeliba, etc.) sont préservés.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ── 4. Suppression ───────────────────────────────────────────────────────
    let totalDeleted = 0;

    // Supprimer les reviews liées aux produits de test ou aux utilisateurs de test
    if (testProductIds.length > 0 || testUserIds.length > 0) {
      const reviewFilter: any = { $or: [] };
      if (testProductIds.length > 0) reviewFilter.$or.push({ product: { $in: testProductIds } });
      if (testUserIds.length > 0) reviewFilter.$or.push({ user: { $in: testUserIds } });
      const reviewResult = await reviewsCollection.deleteMany(reviewFilter);
      console.log(`🗑️  Reviews supprimées: ${reviewResult.deletedCount}`);
      totalDeleted += reviewResult.deletedCount;
    }

    // Supprimer les wishlists des utilisateurs de test
    if (testUserIds.length > 0) {
      const wishlistResult = await wishlistsCollection.deleteMany({
        user: { $in: testUserIds },
      });
      console.log(`🗑️  Wishlists supprimées: ${wishlistResult.deletedCount}`);
      totalDeleted += wishlistResult.deletedCount;
    }

    // Supprimer les produits de test
    if (testProductIds.length > 0) {
      const productResult = await productsCollection.deleteMany({
        _id: { $in: testProductIds },
      });
      console.log(`🗑️  Produits supprimés: ${productResult.deletedCount}`);
      totalDeleted += productResult.deletedCount;
    }

    // Supprimer les utilisateurs de test
    if (testUserIds.length > 0) {
      const userResult = await usersCollection.deleteMany({
        _id: { $in: testUserIds },
      });
      console.log(`🗑️  Utilisateurs supprimés: ${userResult.deletedCount}`);
      totalDeleted += userResult.deletedCount;
    }

    // ── 5. Vérification finale ───────────────────────────────────────────────
    const remainingProducts = await productsCollection.countDocuments();
    const remainingUsers = await usersCollection.countDocuments();

    console.log('\n✅ Nettoyage terminé !');
    console.log(`   Total supprimé: ${totalDeleted} document(s)`);
    console.log(`   Produits restants en base: ${remainingProducts}`);
    console.log(`   Utilisateurs restants en base: ${remainingUsers}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

cleanTestData();
