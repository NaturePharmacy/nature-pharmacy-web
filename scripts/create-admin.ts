/**
 * Script to create an admin account
 * Usage: npm run create-admin
 * or: ts-node scripts/create-admin.ts
 */

import * as readline from 'readline';
import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

// Import User model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Add password hashing middleware
import bcrypt from 'bcryptjs';

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n🌿 Nature Pharmacy - Admin Account Creation\n');

    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  An admin account already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}\n`);

      const overwrite = await question('Do you want to create another admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('\n❌ Admin creation cancelled.');
        process.exit(0);
      }
    }

    // Get admin details
    const name = await question('Admin name (default: Admin): ') || 'Admin';
    const email = await question('Admin email (default: admin@naturepharmacy.com): ') || 'admin@naturepharmacy.com';

    let password = await question('Admin password (min 6 characters): ');
    while (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      password = await question('Admin password (min 6 characters): ');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('\n❌ A user with this email already exists.');
      process.exit(1);
    }

    // Create admin
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isEmailVerified: true,
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('Admin Details:');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Email Verified: ${admin.isEmailVerified}`);
    console.log('\n🎉 You can now login with these credentials.\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();
