import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ShippingZone = mongoose.model('ShippingZone', new mongoose.Schema({
  name: { fr: String, en: String, es: String },
  countries: [String],
  shippingCost: Number,
  freeShippingThreshold: Number,
  estimatedDeliveryDays: { min: Number, max: Number },
  isActive: Boolean,
}));

async function checkShippingZones() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const zones = await ShippingZone.find({});

    console.log(`\nFound ${zones.length} shipping zones:\n`);

    zones.forEach((zone: any) => {
      console.log(`📦 ${zone.name.fr || zone.name.en}`);
      console.log(`   Countries: ${zone.countries.join(', ')}`);
      console.log(`   Shipping Cost: $${zone.shippingCost}`);
      console.log(`   Free Shipping Threshold: ${zone.freeShippingThreshold ? '$' + zone.freeShippingThreshold : 'None'}`);
      console.log(`   Delivery: ${zone.estimatedDeliveryDays.min}-${zone.estimatedDeliveryDays.max} days`);
      console.log(`   Active: ${zone.isActive ? 'Yes' : 'No'}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkShippingZones();
