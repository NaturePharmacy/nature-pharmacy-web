/**
 * Script de migration pour ajouter basePrice et commission aux produits existants
 *
 * Ce script:
 * 1. Récupère tous les produits existants
 * 2. Pour chaque produit, calcule basePrice à partir du prix actuel
 * 3. Ajoute les champs basePrice et commission
 *
 * Usage: npx tsx scripts/migrateProductPrices.ts
 */

import mongoose from 'mongoose';
import Product from '../models/Product';
import { calculateBasePriceFromFinal, calculatePriceWithCommission } from '../lib/commission';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nature-pharmacy';
const COMMISSION_RATE = 10; // 10%

async function migrateProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📦 Fetching products...');
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const product of products) {
      // Si le produit a déjà basePrice, on le saute
      if ((product as any).basePrice !== undefined) {
        console.log(`⏭️  Skipping ${product.name.fr} - already migrated`);
        skipped++;
        continue;
      }

      // Le prix actuel est considéré comme le prix final (avec commission)
      // On calcule le basePrice (ce que le vendeur reçoit)
      const basePrice = calculateBasePriceFromFinal(product.price, COMMISSION_RATE);

      // On recalcule le prix et la commission pour s'assurer de la cohérence
      const { price, commission } = calculatePriceWithCommission(basePrice, COMMISSION_RATE);

      // Mise à jour du produit
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            basePrice,
            price, // On garde le prix arrondi calculé
            commission,
          },
        }
      );

      console.log(
        `✅ Migrated ${product.name.fr}: price=${product.price} → basePrice=${basePrice}, commission=${commission}, finalPrice=${price}`
      );
      migrated++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${products.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateProducts();
