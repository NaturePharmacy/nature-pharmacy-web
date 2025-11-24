import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

const categories = [
  {
    name: { fr: 'Herbes Médicinales', en: 'Medicinal Herbs', es: 'Hierbas Medicinales' },
    slug: 'herbes-medicinales',
    description: {
      fr: 'Herbes naturelles pour la santé et le bien-être',
      en: 'Natural herbs for health and wellness',
      es: 'Hierbas naturales para la salud y el bienestar'
    },
    icon: '🌿',
  },
  {
    name: { fr: 'Huiles Essentielles', en: 'Essential Oils', es: 'Aceites Esenciales' },
    slug: 'huiles-essentielles',
    description: {
      fr: 'Huiles essentielles pures et naturelles',
      en: 'Pure and natural essential oils',
      es: 'Aceites esenciales puros y naturales'
    },
    icon: '💧',
  },
  {
    name: { fr: 'Cosmétiques Naturels', en: 'Natural Cosmetics', es: 'Cosméticos Naturales' },
    slug: 'cosmetiques-naturels',
    description: {
      fr: 'Produits de beauté naturels et biologiques',
      en: 'Natural and organic beauty products',
      es: 'Productos de belleza naturales y orgánicos'
    },
    icon: '✨',
  },
  {
    name: { fr: 'Aliments Bio', en: 'Organic Foods', es: 'Alimentos Orgánicos' },
    slug: 'aliments-bio',
    description: {
      fr: 'Aliments biologiques et sains',
      en: 'Organic and healthy foods',
      es: 'Alimentos orgánicos y saludables'
    },
    icon: '🥗',
  },
];

const sampleProducts = [
  {
    name: { fr: 'Moringa Bio', en: 'Organic Moringa', es: 'Moringa Orgánica' },
    slug: 'moringa-bio',
    description: {
      fr: 'Poudre de moringa 100% naturelle, riche en vitamines et minéraux',
      en: '100% natural moringa powder, rich in vitamins and minerals',
      es: 'Polvo de moringa 100% natural, rico en vitaminas y minerales'
    },
    price: 15.99,
    compareAtPrice: 19.99,
    categorySlug: 'herbes-medicinales',
    isOrganic: true,
    isFeatured: true,
    stock: 50,
    weight: '250g',
    ingredients: {
      fr: 'Feuilles de moringa séchées et broyées',
      en: 'Dried and ground moringa leaves',
      es: 'Hojas de moringa secas y molidas'
    },
    usage: {
      fr: '1 cuillère à café par jour dans de l\'eau ou un smoothie',
      en: '1 teaspoon per day in water or smoothie',
      es: '1 cucharadita por día en agua o batido'
    },
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  },
  {
    name: { fr: 'Huile d\'Argan', en: 'Argan Oil', es: 'Aceite de Argán' },
    slug: 'huile-argan',
    description: {
      fr: 'Huile d\'argan pure du Maroc, parfaite pour la peau et les cheveux',
      en: 'Pure Moroccan argan oil, perfect for skin and hair',
      es: 'Aceite de argán puro de Marruecos, perfecto para piel y cabello'
    },
    price: 24.99,
    categorySlug: 'huiles-essentielles',
    isOrganic: true,
    isFeatured: true,
    stock: 30,
    weight: '100ml',
    usage: {
      fr: 'Appliquer quelques gouttes sur la peau ou les cheveux',
      en: 'Apply a few drops to skin or hair',
      es: 'Aplicar unas gotas en la piel o el cabello'
    },
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  },
  {
    name: { fr: 'Savon au Karité', en: 'Shea Butter Soap', es: 'Jabón de Karité' },
    slug: 'savon-karite',
    description: {
      fr: 'Savon artisanal au beurre de karité, hydratant et nourrissant',
      en: 'Handmade shea butter soap, moisturizing and nourishing',
      es: 'Jabón artesanal de manteca de karité, hidratante y nutritivo'
    },
    price: 8.99,
    compareAtPrice: 12.99,
    categorySlug: 'cosmetiques-naturels',
    isOrganic: true,
    stock: 100,
    weight: '125g',
    ingredients: {
      fr: 'Beurre de karité, huile de coco, huile d\'olive',
      en: 'Shea butter, coconut oil, olive oil',
      es: 'Manteca de karité, aceite de coco, aceite de oliva'
    },
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  },
  {
    name: { fr: 'Miel de Baobab', en: 'Baobab Honey', es: 'Miel de Baobab' },
    slug: 'miel-baobab',
    description: {
      fr: 'Miel pur de fleurs de baobab, récolté au Sénégal',
      en: 'Pure baobab flower honey, harvested in Senegal',
      es: 'Miel pura de flores de baobab, cosechada en Senegal'
    },
    price: 12.99,
    categorySlug: 'aliments-bio',
    isOrganic: true,
    stock: 45,
    weight: '500g',
    usage: {
      fr: '1 cuillère à soupe par jour, seul ou dans du thé',
      en: '1 tablespoon per day, alone or in tea',
      es: '1 cucharada por día, sola o en té'
    },
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  },
  {
    name: { fr: 'Thé Vert Kinkeliba', en: 'Kinkeliba Green Tea', es: 'Té Verde Kinkeliba' },
    slug: 'the-kinkeliba',
    description: {
      fr: 'Thé africain aux propriétés détoxifiantes',
      en: 'African tea with detoxifying properties',
      es: 'Té africano con propiedades desintoxicantes'
    },
    price: 6.99,
    categorySlug: 'herbes-medicinales',
    isOrganic: true,
    stock: 75,
    weight: '100g',
    usage: {
      fr: 'Infuser 1 sachet dans de l\'eau chaude pendant 5 minutes',
      en: 'Steep 1 bag in hot water for 5 minutes',
      es: 'Infusionar 1 bolsita en agua caliente durante 5 minutos'
    },
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();

    // Find an admin or seller user to assign products to
    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      seller = await User.findOne({ role: 'admin' });
    }

    if (!seller) {
      console.error('❌ No seller or admin user found. Please create a user first.');
      process.exit(1);
    }

    console.log(`✅ Using seller: ${seller.name} (${seller.email})`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing categories and products');

    // Create categories
    const createdCategories: any[] = [];
    for (const cat of categories) {
      const category = await Category.create(cat);
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name.en}`);
    }

    // Create products
    for (const prod of sampleProducts) {
      const category = createdCategories.find(c => c.slug === prod.categorySlug);

      if (!category) {
        console.error(`❌ Category not found for slug: ${prod.categorySlug}`);
        continue;
      }

      const product = await Product.create({
        ...prod,
        category: category._id,
        seller: seller._id,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        reviewCount: Math.floor(Math.random() * 50), // Random review count
      });

      console.log(`✅ Created product: ${product.name.en}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
