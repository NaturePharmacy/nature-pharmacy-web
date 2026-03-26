import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

// GET - Retrieve store settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get the first (and should be only) settings document
    let settings = await Settings.findOne().lean();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({});
      settings = await Settings.findById(settings._id).lean();
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const data = await request.json();

    // Get the first settings document or create if doesn't exist
    let settings = await Settings.findOne();

    // Whitelist des champs modifiables (prévient prototype pollution / injection)
    const ALLOWED_FIELDS = [
      'storeName', 'storeDescription', 'contactEmail', 'contactPhone',
      'supportEmail', 'address', 'defaultCurrency', 'currencySymbol',
      'currencyPosition', 'defaultLanguage', 'taxEnabled', 'taxRate',
      'taxLabel', 'pricesIncludeTax', 'freeShippingThreshold',
      'freeShippingEnabled', 'paymentMethods', 'emailNotifications',
      'orderSettings', 'maintenanceMode', 'commissionRate',
      'socialLinks', 'seoSettings', 'logo', 'favicon',
    ];
    const safeData: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in data) safeData[field] = data[field];
    }

    if (!settings) {
      settings = await Settings.create(safeData);
    } else {
      Object.assign(settings, safeData);
      await settings.save();
    }

    return NextResponse.json(
      { message: 'Settings updated successfully', settings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
