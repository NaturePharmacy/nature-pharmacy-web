import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VendorShippingSettings from '@/models/VendorShippingSettings';

// GET /api/vendor/shipping — get current seller's shipping settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !['seller', 'admin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const settings = await VendorShippingSettings.findOne({
    seller: session.user.id,
  }).lean();

  if (!settings) {
    // Return empty defaults so the frontend can show the form pre-filled
    return NextResponse.json({
      seller: session.user.id,
      defaultShippingCost: 0,
      freeShippingThreshold: null,
      countryRules: [],
      globalFreeShipping: false,
      isActive: true,
    });
  }

  return NextResponse.json(settings);
}

// PUT /api/vendor/shipping — create or update seller's shipping settings
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !['seller', 'admin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const body = await request.json();
  const {
    defaultShippingCost,
    freeShippingThreshold,
    countryRules,
    globalFreeShipping,
    isActive,
  } = body;

  // Validate
  if (typeof defaultShippingCost !== 'number' || defaultShippingCost < 0) {
    return NextResponse.json(
      { error: 'defaultShippingCost must be a non-negative number' },
      { status: 400 }
    );
  }

  if (Array.isArray(countryRules)) {
    for (const rule of countryRules) {
      if (!rule.country || typeof rule.country !== 'string') {
        return NextResponse.json(
          { error: 'Each country rule must have a valid country code' },
          { status: 400 }
        );
      }
      if (typeof rule.shippingCost !== 'number' || rule.shippingCost < 0) {
        return NextResponse.json(
          { error: `Invalid shippingCost for country ${rule.country}` },
          { status: 400 }
        );
      }
    }
  }

  const updated = await VendorShippingSettings.findOneAndUpdate(
    { seller: session.user.id },
    {
      $set: {
        seller: session.user.id,
        defaultShippingCost,
        freeShippingThreshold: freeShippingThreshold ?? undefined,
        countryRules: countryRules ?? [],
        globalFreeShipping: globalFreeShipping ?? false,
        isActive: isActive !== false,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  return NextResponse.json(updated);
}
