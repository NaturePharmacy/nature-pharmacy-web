import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Referral from '@/models/Referral';
import User from '@/models/User';

// GET /api/referral - Get user's referral data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let referral = await Referral.findOne({ referrer: session.user.id })
      .populate('referred', 'name email createdAt')
      .populate('rewards.referredUser', 'name email')
      .lean();

    // Create referral if it doesn't exist
    if (!referral) {
      referral = await Referral.create({
        referrer: session.user.id,
        referred: [],
        stats: {
          totalReferred: 0,
          totalEarned: 0,
          conversions: 0,
        },
        rewards: [],
      });
    }

    // Calculate pending rewards
    const pendingRewards = referral.rewards
      .filter((r: any) => r.status === 'pending')
      .reduce((sum: number, r: any) => sum + r.amount, 0);

    // Calculate paid rewards
    const paidRewards = referral.rewards
      .filter((r: any) => r.status === 'paid')
      .reduce((sum: number, r: any) => sum + r.amount, 0);

    return NextResponse.json({
      referral,
      summary: {
        referralCode: referral.referralCode,
        totalReferred: referral.stats.totalReferred,
        totalEarned: referral.stats.totalEarned,
        conversions: referral.stats.conversions,
        pendingRewards,
        paidRewards,
        conversionRate:
          referral.stats.totalReferred > 0
            ? (referral.stats.conversions / referral.stats.totalReferred) * 100
            : 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}

// POST /api/referral/validate - Validate referral code
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    const referral = await Referral.findOne({
      referralCode: code.toUpperCase(),
      isActive: true,
    });

    if (!referral) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: referral.referralCode,
    });
  } catch (error: any) {
    console.error('Error validating referral code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate referral code' },
      { status: 500 }
    );
  }
}
