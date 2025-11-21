import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nature-pharmacy';

// Schémas (répliqués ici pour l'indépendance du script)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  sellerInfo: {
    storeName: String,
    storeDescription: String,
    verified: Boolean,
    rating: Number,
    totalSales: Number,
  },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: {
    fr: String,
    en: String,
    es: String,
  },
  slug: String,
  description: {
    fr: String,
    en: String,
    es: String,
  },
  icon: String,
  isActive: Boolean,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: {
    fr: String,
    en: String,
    es: String,
  },
  description: {
    fr: String,
    en: String,
    es: String,
  },
  slug: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  price: Number,
  compareAtPrice: Number,
  stock: Number,
  isOrganic: Boolean,
  isFeatured: Boolean,
  isActive: Boolean,
  rating: Number,
  reviewCount: Number,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Données de seed
const categories = [
  {
    name: {
      fr: 'Herbes et Suppléments',
      en: 'Herbs & Supplements',
      es: 'Hierbas y Suplementos',
    },
    slug: 'herbs',
    description: {
      fr: 'Herbes médicinales et suppléments naturels pour votre bien-être',
      en: 'Medicinal herbs and natural supplements for your wellbeing',
      es: 'Hierbas medicinales y suplementos naturales para tu bienestar',
    },
    icon: '🌿',
    isActive: true,
  },
  {
    name: {
      fr: 'Huiles Essentielles',
      en: 'Essential Oils',
      es: 'Aceites Esenciales',
    },
    slug: 'oils',
    description: {
      fr: 'Huiles essentielles pures et biologiques',
      en: 'Pure and organic essential oils',
      es: 'Aceites esenciales puros y orgánicos',
    },
    icon: '💧',
    isActive: true,
  },
  {
    name: {
      fr: 'Cosmétiques Naturels',
      en: 'Natural Cosmetics',
      es: 'Cosméticos Naturales',
    },
    slug: 'cosmetics',
    description: {
      fr: 'Produits cosmétiques naturels et bio',
      en: 'Natural and organic cosmetic products',
      es: 'Productos cosméticos naturales y orgánicos',
    },
    icon: '✨',
    isActive: true,
  },
  {
    name: {
      fr: 'Aliments Biologiques',
      en: 'Organic Foods',
      es: 'Alimentos Orgánicos',
    },
    slug: 'foods',
    description: {
      fr: 'Aliments biologiques et superaliments',
      en: 'Organic foods and superfoods',
      es: 'Alimentos orgánicos y superalimentos',
    },
    icon: '🥗',
    isActive: true,
  },
];

const users = [
  {
    name: 'Jean Dupont',
    email: 'vendeur1@test.com',
    password: 'password123',
    role: 'seller',
    sellerInfo: {
      storeName: 'Bio Nature',
      storeDescription: 'Votre boutique de produits naturels depuis 2010',
      verified: true,
      rating: 4.8,
      totalSales: 156,
    },
  },
  {
    name: 'Marie Martin',
    email: 'vendeur2@test.com',
    password: 'password123',
    role: 'seller',
    sellerInfo: {
      storeName: 'Green Life',
      storeDescription: 'Produits bio et écologiques',
      verified: true,
      rating: 4.9,
      totalSales: 203,
    },
  },
  {
    name: 'Test Acheteur',
    email: 'acheteur@test.com',
    password: 'password123',
    role: 'buyer',
  },
];

async function seed() {
  try {
    console.log('🌱 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Nettoyer la base de données
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Base de données nettoyée');

    // Créer les utilisateurs
    console.log('👥 Création des utilisateurs...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);

    const sellers = createdUsers.filter((u) => u.role === 'seller');

    // Créer les catégories
    console.log('📁 Création des catégories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} catégories créées`);

    // Créer les produits
    console.log('📦 Création des produits...');
    const products = [];

    // Catégorie: Herbes et Suppléments
    const herbsCategory = createdCategories.find((c) => c.slug === 'herbs');
    products.push(
      {
        name: {
          fr: 'Curcuma Bio en Poudre',
          en: 'Organic Turmeric Powder',
          es: 'Cúrcuma Orgánica en Polvo',
        },
        description: {
          fr: 'Curcuma bio en poudre, riche en curcumine. Parfait pour les smoothies et la cuisine.',
          en: 'Organic turmeric powder, rich in curcumin. Perfect for smoothies and cooking.',
          es: 'Cúrcuma orgánica en polvo, rica en curcumina. Perfecta para batidos y cocina.',
        },
        slug: 'curcuma-bio-poudre',
        seller: sellers[0]._id,
        category: herbsCategory._id,
        images: ['https://images.unsplash.com/photo-1615485500894-6ecab29a964f?w=500'],
        price: 12.99,
        compareAtPrice: 15.99,
        stock: 50,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 23,
      },
      {
        name: {
          fr: 'Spiruline Bio en Comprimés',
          en: 'Organic Spirulina Tablets',
          es: 'Espirulina Orgánica en Tabletas',
        },
        description: {
          fr: 'Spiruline bio riche en protéines, fer et vitamines. 100 comprimés.',
          en: 'Organic spirulina rich in proteins, iron and vitamins. 100 tablets.',
          es: 'Espirulina orgánica rica en proteínas, hierro y vitaminas. 100 tabletas.',
        },
        slug: 'spiruline-bio-comprimes',
        seller: sellers[1]._id,
        category: herbsCategory._id,
        images: ['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500'],
        price: 18.99,
        stock: 75,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 4.9,
        reviewCount: 45,
      },
      {
        name: {
          fr: 'Gingembre Séché Bio',
          en: 'Organic Dried Ginger',
          es: 'Jengibre Seco Orgánico',
        },
        description: {
          fr: 'Gingembre séché bio, idéal pour les infusions et la cuisine asiatique.',
          en: 'Organic dried ginger, ideal for teas and Asian cooking.',
          es: 'Jengibre seco orgánico, ideal para infusiones y cocina asiática.',
        },
        slug: 'gingembre-seche-bio',
        seller: sellers[0]._id,
        category: herbsCategory._id,
        images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=500'],
        price: 8.99,
        stock: 30,
        isOrganic: true,
        isFeatured: false,
        isActive: true,
        rating: 4.5,
        reviewCount: 12,
      }
    );

    // Catégorie: Huiles Essentielles
    const oilsCategory = createdCategories.find((c) => c.slug === 'oils');
    products.push(
      {
        name: {
          fr: 'Huile Essentielle de Lavande',
          en: 'Lavender Essential Oil',
          es: 'Aceite Esencial de Lavanda',
        },
        description: {
          fr: 'Huile essentielle de lavande 100% pure. Relaxante et apaisante. 10ml.',
          en: '100% pure lavender essential oil. Relaxing and soothing. 10ml.',
          es: 'Aceite esencial de lavanda 100% puro. Relajante y calmante. 10ml.',
        },
        slug: 'huile-lavande',
        seller: sellers[1]._id,
        category: oilsCategory._id,
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'],
        price: 14.99,
        compareAtPrice: 19.99,
        stock: 40,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 4.8,
        reviewCount: 67,
      },
      {
        name: {
          fr: 'Huile Essentielle de Menthe Poivrée',
          en: 'Peppermint Essential Oil',
          es: 'Aceite Esencial de Menta',
        },
        description: {
          fr: 'Huile essentielle de menthe poivrée. Rafraîchissante et énergisante. 10ml.',
          en: 'Peppermint essential oil. Refreshing and energizing. 10ml.',
          es: 'Aceite esencial de menta. Refrescante y energizante. 10ml.',
        },
        slug: 'huile-menthe-poivree',
        seller: sellers[0]._id,
        category: oilsCategory._id,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'],
        price: 12.99,
        stock: 35,
        isOrganic: true,
        isFeatured: false,
        isActive: true,
        rating: 4.6,
        reviewCount: 34,
      },
      {
        name: {
          fr: 'Huile Essentielle d\'Eucalyptus',
          en: 'Eucalyptus Essential Oil',
          es: 'Aceite Esencial de Eucalipto',
        },
        description: {
          fr: 'Huile essentielle d\'eucalyptus. Purifiante et respiratoire. 10ml.',
          en: 'Eucalyptus essential oil. Purifying and respiratory. 10ml.',
          es: 'Aceite esencial de eucalipto. Purificante y respiratorio. 10ml.',
        },
        slug: 'huile-eucalyptus',
        seller: sellers[1]._id,
        category: oilsCategory._id,
        images: ['https://images.unsplash.com/photo-1582650894617-a545d785293e?w=500'],
        price: 11.99,
        stock: 45,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 28,
      }
    );

    // Catégorie: Cosmétiques Naturels
    const cosmeticsCategory = createdCategories.find((c) => c.slug === 'cosmetics');
    products.push(
      {
        name: {
          fr: 'Crème Hydratante au Beurre de Karité',
          en: 'Shea Butter Moisturizing Cream',
          es: 'Crema Hidratante de Manteca de Karité',
        },
        description: {
          fr: 'Crème hydratante bio au beurre de karité. Nourrit et protège la peau. 50ml.',
          en: 'Organic moisturizing cream with shea butter. Nourishes and protects skin. 50ml.',
          es: 'Crema hidratante orgánica con manteca de karité. Nutre y protege la piel. 50ml.',
        },
        slug: 'creme-karite',
        seller: sellers[0]._id,
        category: cosmeticsCategory._id,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        price: 24.99,
        stock: 25,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 4.9,
        reviewCount: 89,
      },
      {
        name: {
          fr: 'Savon Naturel à l\'Huile d\'Olive',
          en: 'Natural Olive Oil Soap',
          es: 'Jabón Natural de Aceite de Oliva',
        },
        description: {
          fr: 'Savon artisanal à l\'huile d\'olive bio. Doux et hydratant. 100g.',
          en: 'Handmade soap with organic olive oil. Gentle and moisturizing. 100g.',
          es: 'Jabón artesanal con aceite de oliva orgánico. Suave e hidratante. 100g.',
        },
        slug: 'savon-olive',
        seller: sellers[1]._id,
        category: cosmeticsCategory._id,
        images: ['https://images.unsplash.com/photo-1600857544200-b6281a5c75ac?w=500'],
        price: 7.99,
        stock: 60,
        isOrganic: true,
        isFeatured: false,
        isActive: true,
        rating: 4.6,
        reviewCount: 42,
      }
    );

    // Catégorie: Aliments Biologiques
    const foodsCategory = createdCategories.find((c) => c.slug === 'foods');
    products.push(
      {
        name: {
          fr: 'Miel Bio de Lavande',
          en: 'Organic Lavender Honey',
          es: 'Miel Orgánica de Lavanda',
        },
        description: {
          fr: 'Miel de lavande bio de Provence. Saveur délicate et florale. 250g.',
          en: 'Organic lavender honey from Provence. Delicate floral flavor. 250g.',
          es: 'Miel de lavanda orgánica de Provenza. Sabor floral delicado. 250g.',
        },
        slug: 'miel-lavande',
        seller: sellers[0]._id,
        category: foodsCategory._id,
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784210?w=500'],
        price: 16.99,
        stock: 20,
        isOrganic: true,
        isFeatured: true,
        isActive: true,
        rating: 5.0,
        reviewCount: 15,
      },
      {
        name: {
          fr: 'Graines de Chia Bio',
          en: 'Organic Chia Seeds',
          es: 'Semillas de Chía Orgánicas',
        },
        description: {
          fr: 'Graines de chia bio riches en oméga-3. Parfaites pour les smoothies. 500g.',
          en: 'Organic chia seeds rich in omega-3. Perfect for smoothies. 500g.',
          es: 'Semillas de chía orgánicas ricas en omega-3. Perfectas para batidos. 500g.',
        },
        slug: 'graines-chia',
        seller: sellers[1]._id,
        category: foodsCategory._id,
        images: ['https://images.unsplash.com/photo-1623428187425-dd4f5296d30c?w=500'],
        price: 9.99,
        stock: 55,
        isOrganic: true,
        isFeatured: false,
        isActive: true,
        rating: 4.8,
        reviewCount: 31,
      },
      {
        name: {
          fr: 'Quinoa Bio Tricolore',
          en: 'Organic Tricolor Quinoa',
          es: 'Quinoa Orgánica Tricolor',
        },
        description: {
          fr: 'Quinoa bio tricolore. Source de protéines végétales. 500g.',
          en: 'Organic tricolor quinoa. Source of plant protein. 500g.',
          es: 'Quinoa orgánica tricolor. Fuente de proteína vegetal. 500g.',
        },
        slug: 'quinoa-tricolore',
        seller: sellers[0]._id,
        category: foodsCategory._id,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'],
        price: 13.99,
        stock: 0, // En rupture de stock pour test
        isOrganic: true,
        isFeatured: false,
        isActive: true,
        rating: 4.7,
        reviewCount: 19,
      }
    );

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} produits créés`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - ${createdUsers.length} utilisateurs`);
    console.log(`   - ${createdCategories.length} catégories`);
    console.log(`   - ${createdProducts.length} produits`);
    console.log('\n🔑 Comptes de test :');
    console.log('   Vendeur 1: vendeur1@test.com / password123');
    console.log('   Vendeur 2: vendeur2@test.com / password123');
    console.log('   Acheteur: acheteur@test.com / password123');

    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seed();
