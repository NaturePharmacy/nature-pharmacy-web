import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const Category = mongoose.model('Category', new mongoose.Schema({
  name: { fr: String, en: String, es: String },
  slug: String,
}));

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const cats = await Category.find({});
    console.log(`\nFound ${cats.length} categories:\n`);
    cats.forEach((c: any) => {
      console.log(`  - Slug: "${c.slug}"`);
      console.log(`    Name (FR): "${c.name.fr}"`);
      console.log('');
    });
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();
