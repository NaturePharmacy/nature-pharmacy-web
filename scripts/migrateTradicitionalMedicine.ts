/**
 * Script de migration pour ajouter les champs de médecine traditionnelle aux produits existants
 *
 * Ce script ajoute les nouveaux champs optionnels à tous les produits existants
 * Les vendeurs pourront ensuite les remplir via leur dashboard
 *
 * Usage: npx tsx scripts/migrateTradicitionalMedicine.ts
 */

import mongoose from 'mongoose';
import Product from '../models/Product';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nature-pharmacy';

async function migrateProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📦 Fetching products...');
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Vérifier si le produit a déjà les nouveaux champs
      if ((product as any).therapeuticCategory !== undefined) {
        console.log(`⏭️  Skipping ${product.name.fr} - already migrated`);
        skipped++;
        continue;
      }

      // Initialiser les nouveaux champs avec des valeurs par défaut
      const updateData: any = {
        // Champs médicaux (optionnels, à remplir par les vendeurs)
        therapeuticCategory: undefined,
        indications: { fr: [], en: [], es: [] },
        traditionalUses: { fr: '', en: '', es: '' },
        contraindications: { fr: [], en: [], es: [] },
        dosage: { fr: '', en: '', es: '' },
        preparationMethod: { fr: '', en: '', es: '' },
        activeIngredients: { fr: [], en: [], es: [] },

        // Origine (peut être déduit du vendeur ou défini manuellement)
        origin: undefined,
        harvestMethod: undefined,
        certifications: [],

        // Forme du produit (à définir)
        form: undefined,
        concentration: undefined,

        // Avertissements de sécurité (par défaut false)
        warnings: {
          pregnancy: false,
          breastfeeding: false,
          children: false,
          minAge: undefined,
          prescriptionRequired: false,
        },
      };

      // Mise à jour du produit
      await Product.updateOne({ _id: product._id }, { $set: updateData });

      console.log(`✅ Updated ${product.name.fr}`);
      updated++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${products.length}`);

    console.log('\n💡 Next steps:');
    console.log('   1. Run: npx tsx scripts/seedMedicalCategories.ts (to create new categories)');
    console.log('   2. Sellers can now fill in medical information for their products');
    console.log('   3. Update product forms to use new medical fields');

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateProducts();
