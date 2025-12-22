import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function deleteAllProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Count products before deletion
    const countBefore = await Product.countDocuments();
    console.log(`\n📊 Found ${countBefore} products in database`);

    if (countBefore === 0) {
      console.log('ℹ️  No products to delete');
      await mongoose.disconnect();
      return;
    }

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete ALL products from the database!');
    console.log('This action cannot be undone.\n');

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`\n✅ Successfully deleted ${result.deletedCount} products`);

    // Verify deletion
    const countAfter = await Product.countDocuments();
    console.log(`📊 Products remaining: ${countAfter}`);

    console.log('\n🎉 Product deletion completed!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
deleteAllProducts();
