import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ShippingZone from '@/models/ShippingZone';

// GET /api/shipping/zones - Get all shipping zones (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query: any = {};

    if (activeOnly) {
      query.isActive = true;
    }

    if (country) {
      query.countries = country;
    }

    const zones = await ShippingZone.find(query)
      .sort({ priority: 1, shippingCost: 1 })
      .lean();

    return NextResponse.json({ zones });
  } catch (error: any) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping zones' },
      { status: 500 }
    );
  }
}

// POST /api/shipping/zones - Create new shipping zone (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.name?.fr || !data.name?.en || !data.name?.es) {
      return NextResponse.json(
        { error: 'Name is required in all languages' },
        { status: 400 }
      );
    }

    if (!data.countries || data.countries.length === 0) {
      return NextResponse.json(
        { error: 'At least one country is required' },
        { status: 400 }
      );
    }

    if (data.shippingCost === undefined || data.shippingCost < 0) {
      return NextResponse.json(
        { error: 'Valid shipping cost is required' },
        { status: 400 }
      );
    }

    if (!data.estimatedDeliveryDays?.min || !data.estimatedDeliveryDays?.max) {
      return NextResponse.json(
        { error: 'Estimated delivery days are required' },
        { status: 400 }
      );
    }

    const zone = await ShippingZone.create(data);

    return NextResponse.json({
      message: 'Shipping zone created successfully',
      zone,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating shipping zone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create shipping zone' },
      { status: 500 }
    );
  }
}
