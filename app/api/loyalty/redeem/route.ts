import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import LoyaltyPoints from '@/models/LoyaltyPoints';

// POST /api/loyalty/redeem - Redeem loyalty points for discount
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { points } = await request.json();

    if (!points || points <= 0) {
      return NextResponse.json(
        { error: 'Invalid points amount' },
        { status: 400 }
      );
    }

    // Get user's loyalty points
    const loyalty = await LoyaltyPoints.findOne({ user: session.user.id });

    if (!loyalty) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    // Check if user has enough points
    if (loyalty.totalPoints < points) {
      return NextResponse.json(
        { error: 'Insufficient loyalty points' },
        { status: 400 }
      );
    }

    // Calculate discount (1 point = 1 CFA)
    const discount = points;

    return NextResponse.json({
      valid: true,
      pointsToRedeem: points,
      discount,
      remainingPoints: loyalty.totalPoints - points,
      message: `${points} points will be redeemed for ${discount.toLocaleString()} CFA discount`,
    });
  } catch (error: any) {
    console.error('Error redeeming loyalty points:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to redeem loyalty points' },
      { status: 500 }
    );
  }
}
