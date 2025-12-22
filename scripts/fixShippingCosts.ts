import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import ShippingZone from '../models/ShippingZone';

/**
 * Script pour corriger les frais de livraison
 *
 * Tarifs raisonnables proposés (en USD):
 * - Dakar Express (1-2 jours): 3 USD → Gratuit à partir de 50 USD
 * - Sénégal autres (3-7 jours): 5 USD → Gratuit à partir de 75 USD
 * - France (5-10 jours): 12 USD → Gratuit à partir de 100 USD
 * - Europe (7-14 jours): 15 USD → Gratuit à partir de 120 USD
 * - UK (7-14 jours): 15 USD → Gratuit à partir de 120 USD
 * - Amérique du Nord (10-20 jours): 25 USD → Gratuit à partir de 150 USD
 */

async function fixShippingCosts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📦 Current Shipping Zones:\n');

    const zones = await ShippingZone.find({});
    zones.forEach((zone: any) => {
      console.log(`❌ ${zone.name.fr}`);
      console.log(`   Shipping Cost: $${zone.shippingCost} (TOO HIGH!)`);
      console.log(`   Free Threshold: $${zone.freeShippingThreshold} (TOO HIGH!)`);
      console.log('');
    });

    console.log('\n🔧 Applying reasonable shipping costs...\n');

    // Dakar Express
    const dakarZone = await ShippingZone.findOne({ countries: 'SN', 'name.fr': /Dakar/i });
    if (dakarZone) {
      dakarZone.shippingCost = 3;
      dakarZone.freeShippingThreshold = 50;
      await dakarZone.save();
      console.log('✅ Dakar Express: 3 USD (free at 50 USD)');
    }

    // Sénégal autres régions
    const senegalZone = await ShippingZone.findOne({ countries: 'SN', 'name.fr': /Autres/i });
    if (senegalZone) {
      senegalZone.shippingCost = 5;
      senegalZone.freeShippingThreshold = 75;
      await senegalZone.save();
      console.log('✅ Sénégal Autres: 5 USD (free at 75 USD)');
    }

    // France
    const franceZone = await ShippingZone.findOne({ countries: 'FR' });
    if (franceZone) {
      franceZone.shippingCost = 12;
      franceZone.freeShippingThreshold = 100;
      await franceZone.save();
      console.log('✅ France: 12 USD (free at 100 USD)');
    }

    // Europe
    const europeZone = await ShippingZone.findOne({ countries: { $in: ['BE', 'DE', 'ES', 'IT'] } });
    if (europeZone) {
      europeZone.shippingCost = 15;
      europeZone.freeShippingThreshold = 120;
      await europeZone.save();
      console.log('✅ Europe: 15 USD (free at 120 USD)');
    }

    // Royaume-Uni
    const ukZone = await ShippingZone.findOne({ countries: 'GB' });
    if (ukZone) {
      ukZone.shippingCost = 15;
      ukZone.freeShippingThreshold = 120;
      await ukZone.save();
      console.log('✅ UK: 15 USD (free at 120 USD)');
    }

    // Amérique du Nord
    const naZone = await ShippingZone.findOne({ countries: { $in: ['US', 'CA'] } });
    if (naZone) {
      naZone.shippingCost = 25;
      naZone.freeShippingThreshold = 150;
      await naZone.save();
      console.log('✅ North America: 25 USD (free at 150 USD)');
    }

    console.log('\n✅ All shipping costs updated successfully!');
    console.log('\n📦 New Shipping Zones:\n');

    const updatedZones = await ShippingZone.find({});
    updatedZones.forEach((zone: any) => {
      console.log(`✅ ${zone.name.fr}`);
      console.log(`   Countries: ${zone.countries.join(', ')}`);
      console.log(`   Shipping Cost: $${zone.shippingCost}`);
      console.log(`   Free Threshold: $${zone.freeShippingThreshold}`);
      console.log(`   Delivery: ${zone.estimatedDeliveryDays.min}-${zone.estimatedDeliveryDays.max} days`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixShippingCosts();
