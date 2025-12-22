import 'dotenv/config';
import connectDB from '../lib/mongodb';
import ShippingZone from '../models/ShippingZone';

const shippingZones = [
  {
    name: {
      fr: 'Dakar - Livraison Express',
      en: 'Dakar - Express Delivery',
      es: 'Dakar - Entrega Rápida',
    },
    description: {
      fr: 'Livraison rapide dans la région de Dakar',
      en: 'Fast delivery in Dakar region',
      es: 'Entrega rápida en la región de Dakar',
    },
    countries: ['SN'],
    regions: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
    shippingCost: 2000,
    freeShippingThreshold: 50000,
    estimatedDeliveryDays: {
      min: 1,
      max: 2,
    },
    isActive: true,
    priority: 1,
  },
  {
    name: {
      fr: 'Sénégal - Autres Régions',
      en: 'Senegal - Other Regions',
      es: 'Senegal - Otras Regiones',
    },
    description: {
      fr: 'Livraison dans les autres régions du Sénégal',
      en: 'Delivery to other regions of Senegal',
      es: 'Entrega a otras regiones de Senegal',
    },
    countries: ['SN'],
    shippingCost: 5000,
    freeShippingThreshold: 75000,
    estimatedDeliveryDays: {
      min: 3,
      max: 7,
    },
    isActive: true,
    priority: 2,
  },
  {
    name: {
      fr: 'France Métropolitaine',
      en: 'Metropolitan France',
      es: 'Francia Metropolitana',
    },
    description: {
      fr: 'Livraison en France métropolitaine',
      en: 'Delivery to metropolitan France',
      es: 'Entrega a Francia metropolitana',
    },
    countries: ['FR'],
    shippingCost: 15000,
    freeShippingThreshold: 100000,
    estimatedDeliveryDays: {
      min: 5,
      max: 10,
    },
    isActive: true,
    priority: 0,
  },
  {
    name: {
      fr: 'Europe',
      en: 'Europe',
      es: 'Europa',
    },
    description: {
      fr: 'Livraison en Europe',
      en: 'Delivery to Europe',
      es: 'Entrega a Europa',
    },
    countries: ['BE', 'DE', 'ES', 'IT', 'PT', 'NL', 'LU', 'CH'],
    shippingCost: 20000,
    freeShippingThreshold: 150000,
    estimatedDeliveryDays: {
      min: 7,
      max: 14,
    },
    isActive: true,
    priority: 0,
  },
  {
    name: {
      fr: 'Amérique du Nord',
      en: 'North America',
      es: 'América del Norte',
    },
    description: {
      fr: 'Livraison en Amérique du Nord',
      en: 'Delivery to North America',
      es: 'Entrega a América del Norte',
    },
    countries: ['US', 'CA'],
    shippingCost: 30000,
    freeShippingThreshold: 200000,
    estimatedDeliveryDays: {
      min: 10,
      max: 20,
    },
    isActive: true,
    priority: 0,
  },
  {
    name: {
      fr: 'Royaume-Uni',
      en: 'United Kingdom',
      es: 'Reino Unido',
    },
    description: {
      fr: 'Livraison au Royaume-Uni',
      en: 'Delivery to United Kingdom',
      es: 'Entrega al Reino Unido',
    },
    countries: ['GB'],
    shippingCost: 18000,
    freeShippingThreshold: 120000,
    estimatedDeliveryDays: {
      min: 7,
      max: 14,
    },
    isActive: true,
    priority: 0,
  },
];

async function seedShippingZones() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing shipping zones...');
    await ShippingZone.deleteMany({});

    console.log('Creating shipping zones...');
    const zones = await ShippingZone.insertMany(shippingZones);

    console.log(`✓ Successfully created ${zones.length} shipping zones`);
    console.log('\nShipping zones:');
    zones.forEach((zone) => {
      console.log(`- ${zone.name.en}: ${zone.countries.join(', ')} - ${zone.shippingCost} CFA`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding shipping zones:', error);
    process.exit(1);
  }
}

seedShippingZones();
