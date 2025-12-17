/**
 * Script pour créer des utilisateurs de test
 * Utilisation: npx tsx scripts/createTestUsers.ts
 */

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const testUsers = [
  {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    phone: '+221771234567',
    address: {
      street: '123 Rue Test',
      city: 'Dakar',
      country: 'Sénégal',
      postalCode: '12000',
    },
    isEmailVerified: true,
  },
  {
    name: 'Vendeur Test',
    email: 'seller@test.com',
    password: 'password123',
    role: 'seller',
    phone: '+221772234567',
    address: {
      street: '456 Avenue Commerce',
      city: 'Dakar',
      country: 'Sénégal',
      postalCode: '12000',
    },
    isEmailVerified: true,
  },
  {
    name: 'Acheteur Test',
    email: 'buyer@test.com',
    password: 'password123',
    role: 'buyer',
    phone: '+221773234567',
    address: {
      street: '789 Boulevard Liberté',
      city: 'Dakar',
      country: 'Sénégal',
      postalCode: '12000',
    },
    isEmailVerified: true,
  },
];

async function createTestUsers() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await connectDB();

    console.log('🧹 Suppression des utilisateurs de test existants...');
    await User.deleteMany({
      email: { $in: testUsers.map((u) => u.email) },
    });

    console.log('👥 Création des utilisateurs de test...');

    for (const userData of testUsers) {
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(
        `✅ Utilisateur créé: ${user.name} (${user.email}) - Rôle: ${user.role}`
      );
    }

    console.log('\n🎉 Tous les utilisateurs de test ont été créés !');
    console.log('\n📋 Credentials de connexion:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach((user) => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
    process.exit(1);
  }
}

createTestUsers();
