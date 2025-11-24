import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

// GET /api/coupons - Get all coupons (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query: any = {};
    if (activeOnly) {
      query.isActive = true;
      query.validUntil = { $gte: new Date() };
    }

    const coupons = await Coupon.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Create new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.code || !data.type || data.value === undefined) {
      return NextResponse.json(
        { error: 'Code, type, and value are required' },
        { status: 400 }
      );
    }

    // Validate percentage value
    if (data.type === 'percentage' && (data.value < 0 || data.value > 100)) {
      return NextResponse.json(
        { error: 'Percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Create coupon
    const coupon = await Coupon.create({
      ...data,
      code: data.code.toUpperCase(),
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        message: 'Coupon created successfully',
        coupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
