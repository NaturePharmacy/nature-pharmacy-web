import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Order from '@/models/Order';

// POST /api/coupons/validate - Validate and apply coupon
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { code, orderTotal, items } = await request.json();

    if (!code || orderTotal === undefined) {
      return NextResponse.json(
        { error: 'Coupon code and order total are required' },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom) {
      return NextResponse.json(
        { error: 'This coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (now > coupon.validUntil) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check per-user limit
    if (coupon.perUserLimit) {
      const userUsageCount = await Order.countDocuments({
        buyer: session.user.id,
        'coupon.code': code.toUpperCase(),
      });

      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json(
          { error: 'You have already used this coupon the maximum number of times' },
          { status: 400 }
        );
      }
    }

    // Check first purchase only
    if (coupon.firstPurchaseOnly) {
      const previousOrders = await Order.countDocuments({
        buyer: session.user.id,
        status: { $ne: 'cancelled' },
      });

      if (previousOrders > 0) {
        return NextResponse.json(
          { error: 'This coupon is only valid for first-time purchases' },
          { status: 400 }
        );
      }
    }

    // Check minimum purchase
    if (coupon.minPurchase && orderTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `Minimum purchase of ${coupon.minPurchase.toLocaleString()} CFA is required for this coupon`,
        },
        { status: 400 }
      );
    }

    // Calculate discount (using the method from the model)
    const discount = coupon.calculateDiscount(orderTotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
      discount,
      message: `Coupon applied! You saved ${discount.toLocaleString()} CFA`,
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
