import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Settings from '@/models/Settings';

// POST /api/admin/seed - Create initial admin account and settings
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with special key
    const authKey = request.headers.get('x-seed-key');
    const expectedKey = process.env.SEED_ADMIN_KEY;

    if (!expectedKey || authKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid seed key.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin account already exists.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name = 'Admin',
      email = 'admin@naturepharmacy.com',
      password = 'Admin@123',
    } = body;

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create admin user
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isEmailVerified: true, // Admin is pre-verified
    });

    // Initialize default settings if not exist
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        commissionRate: 10,
        storeName: {
          fr: 'Nature Pharmacy',
          en: 'Nature Pharmacy',
          es: 'Nature Pharmacy',
        },
        storeDescription: {
          fr: 'Votre pharmacie naturelle en ligne',
          en: 'Your online natural pharmacy',
          es: 'Tu farmacia natural en línea',
        },
        contactEmail: email,
        contactPhone: '+237 000 000 000',
        supportEmail: email,
        address: {
          street: '',
          city: 'Douala',
          state: 'Littoral',
          country: 'Cameroun',
          postalCode: '',
        },
        defaultCurrency: 'FCFA',
        currencySymbol: 'FCFA',
        currencyPosition: 'after',
        defaultLanguage: 'fr',
        taxEnabled: true,
        taxRate: 19.25,
        taxLabel: {
          fr: 'TVA',
          en: 'VAT',
          es: 'IVA',
        },
        pricesIncludeTax: false,
        freeShippingThreshold: 50000,
        freeShippingEnabled: true,
        paymentMethods: {
          stripe: { enabled: false },
          paypal: { enabled: false },
          cashOnDelivery: { enabled: true },
          bankTransfer: { enabled: true },
        },
        emailNotifications: {
          orderConfirmation: true,
          orderShipped: true,
          orderDelivered: true,
          orderCancelled: true,
          newUserWelcome: true,
          passwordReset: true,
        },
        orderSettings: {
          autoConfirmOrders: false,
          orderIdPrefix: 'NP',
          allowGuestCheckout: false,
          enableReviews: true,
          requireEmailVerification: true,
        },
        maintenanceMode: {
          enabled: false,
          message: {
            fr: 'Site en maintenance',
            en: 'Site under maintenance',
            es: 'Sitio en mantenimiento',
          },
        },
      });
    }

    // Remove password from response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isEmailVerified: admin.isEmailVerified,
      createdAt: admin.createdAt,
    };

    return NextResponse.json(
      {
        message: 'Admin account and settings created successfully',
        admin: adminResponse,
        settings: {
          commissionRate: settings.commissionRate,
          storeName: settings.storeName,
          defaultCurrency: settings.defaultCurrency,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error seeding admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed admin account' },
      { status: 500 }
    );
  }
}
