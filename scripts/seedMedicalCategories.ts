/**
 * Script pour créer les catégories de médecine traditionnelle
 *
 * Usage: npx tsx scripts/seedMedicalCategories.ts
 */

import mongoose from 'mongoose';
import Category from '../models/Category';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nature-pharmacy';

const medicalCategories = [
  {
    name: {
      fr: 'Plantes Médicinales',
      en: 'Medicinal Plants',
      es: 'Plantas Medicinales',
    },
    slug: 'medicinal-plants',
    description: {
      fr: 'Plantes médicinales séchées, poudres, racines et écorces pour la médecine traditionnelle',
      en: 'Dried medicinal plants, powders, roots and barks for traditional medicine',
      es: 'Plantas medicinales secas, polvos, raíces y cortezas para medicina tradicional',
    },
    icon: '🌿',
  },
  {
    name: {
      fr: 'Remèdes Traditionnels',
      en: 'Traditional Remedies',
      es: 'Remedios Tradicionales',
    },
    slug: 'traditional-remedies',
    description: {
      fr: 'Préparations traditionnelles africaines, tisanes thérapeutiques et macérations',
      en: 'African traditional preparations, therapeutic teas and macerations',
      es: 'Preparaciones tradicionales africanas, tés terapéuticos y maceraciones',
    },
    icon: '💊',
  },
  {
    name: {
      fr: 'Huiles et Baumes Thérapeutiques',
      en: 'Therapeutic Oils and Balms',
      es: 'Aceites y Bálsamos Terapéuticos',
    },
    slug: 'therapeutic-oils-balms',
    description: {
      fr: 'Huiles médicinales, baumes, onguents et huiles de massage thérapeutique',
      en: 'Medicinal oils, balms, ointments and therapeutic massage oils',
      es: 'Aceites medicinales, bálsamos, ungüentos y aceites de masaje terapéutico',
    },
    icon: '🧴',
  },
  {
    name: {
      fr: 'Compléments Naturels',
      en: 'Natural Supplements',
      es: 'Complementos Naturales',
    },
    slug: 'natural-supplements',
    description: {
      fr: 'Gélules de plantes, extraits concentrés et compléments immunitaires naturels',
      en: 'Plant capsules, concentrated extracts and natural immune supplements',
      es: 'Cápsulas de plantas, extractos concentrados y complementos inmunes naturales',
    },
    icon: '💊',
  },
  {
    name: {
      fr: 'Soins Digestifs',
      en: 'Digestive Care',
      es: 'Cuidado Digestivo',
    },
    slug: 'digestive-care',
    description: {
      fr: 'Remèdes naturels pour la digestion, ballonnements et troubles digestifs',
      en: 'Natural remedies for digestion, bloating and digestive disorders',
      es: 'Remedios naturales para la digestión, hinchazón y trastornos digestivos',
    },
    icon: '🫃',
  },
  {
    name: {
      fr: 'Soins Respiratoires',
      en: 'Respiratory Care',
      es: 'Cuidado Respiratorio',
    },
    slug: 'respiratory-care',
    description: {
      fr: 'Traitements naturels pour la toux, bronchite et problèmes respiratoires',
      en: 'Natural treatments for cough, bronchitis and respiratory problems',
      es: 'Tratamientos naturales para tos, bronquitis y problemas respiratorios',
    },
    icon: '🫁',
  },
  {
    name: {
      fr: 'Douleurs et Inflammations',
      en: 'Pain and Inflammation',
      es: 'Dolor e Inflamación',
    },
    slug: 'pain-inflammation',
    description: {
      fr: 'Remèdes anti-douleur et anti-inflammatoires naturels',
      en: 'Natural pain relief and anti-inflammatory remedies',
      es: 'Remedios naturales para el dolor y antiinflamatorios',
    },
    icon: '🦴',
  },
  {
    name: {
      fr: 'Soins de la Peau',
      en: 'Skin Care',
      es: 'Cuidado de la Piel',
    },
    slug: 'skin-care',
    description: {
      fr: 'Traitements naturels pour eczéma, acné et problèmes de peau',
      en: 'Natural treatments for eczema, acne and skin problems',
      es: 'Tratamientos naturales para eczema, acné y problemas de piel',
    },
    icon: '🧖',
  },
  {
    name: {
      fr: 'Bien-être Mental',
      en: 'Mental Wellness',
      es: 'Bienestar Mental',
    },
    slug: 'mental-wellness',
    description: {
      fr: 'Plantes pour le stress, anxiété, sommeil et équilibre nerveux',
      en: 'Plants for stress, anxiety, sleep and nervous balance',
      es: 'Plantas para estrés, ansiedad, sueño y equilibrio nervioso',
    },
    icon: '🧘',
  },
  {
    name: {
      fr: 'Immunité et Vitalité',
      en: 'Immunity and Vitality',
      es: 'Inmunidad y Vitalidad',
    },
    slug: 'immunity-vitality',
    description: {
      fr: 'Renforcement immunitaire et boosters d\'énergie naturels',
      en: 'Immune support and natural energy boosters',
      es: 'Apoyo inmunológico y refuerzos de energía naturales',
    },
    icon: '💪',
  },
  {
    name: {
      fr: 'Santé Féminine',
      en: 'Women\'s Health',
      es: 'Salud Femenina',
    },
    slug: 'womens-health',
    description: {
      fr: 'Remèdes traditionnels pour le bien-être féminin et l\'équilibre hormonal',
      en: 'Traditional remedies for women\'s wellness and hormonal balance',
      es: 'Remedios tradicionales para el bienestar femenino y equilibrio hormonal',
    },
    icon: '🌸',
  },
  {
    name: {
      fr: 'Santé Masculine',
      en: 'Men\'s Health',
      es: 'Salud Masculina',
    },
    slug: 'mens-health',
    description: {
      fr: 'Plantes pour la vitalité masculine et l\'équilibre hormonal',
      en: 'Plants for male vitality and hormonal balance',
      es: 'Plantas para vitalidad masculina y equilibrio hormonal',
    },
    icon: '💪',
  },
  {
    name: {
      fr: 'Équipements Traditionnels',
      en: 'Traditional Equipment',
      es: 'Equipos Tradicionales',
    },
    slug: 'traditional-equipment',
    description: {
      fr: 'Mortiers, pilons et ustensiles pour la préparation de remèdes traditionnels',
      en: 'Mortars, pestles and utensils for traditional remedy preparation',
      es: 'Morteros, mazos y utensilios para preparación de remedios tradicionales',
    },
    icon: '🏺',
  },
];

async function seedCategories() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📚 Creating medical categories...');

    for (const categoryData of medicalCategories) {
      const existing = await Category.findOne({ slug: categoryData.slug });

      if (existing) {
        console.log(`⏭️  Category "${categoryData.slug}" already exists, skipping...`);
        continue;
      }

      const category = await Category.create({
        ...categoryData,
        isActive: true,
      });

      console.log(`✅ Created category: ${category.name.fr} (${category.slug})`);
    }

    console.log('\n📊 Summary:');
    const totalCategories = await Category.countDocuments();
    console.log(`   Total categories in database: ${totalCategories}`);

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Exécuter le seeding
seedCategories();
