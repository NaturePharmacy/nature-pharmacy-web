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

    // Ensure User model is loaded (required for populate)
    await User.init();

    let referral = await Referral.findOne({ referrer: session.user.id })
      .populate({
        path: 'referred',
        select: 'name email createdAt',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'rewards.referredUser',
        select: 'name email',
        options: { strictPopulate: false }
      })
      .lean();

    // Create referral if it doesn't exist
    if (!referral) {
      const newReferral = await Referral.create({
        referrer: session.user.id,
        referred: [],
        stats: {
          totalReferred: 0,
          totalEarned: 0,
          conversions: 0,
        },
        rewards: [],
      });

      // Re-fetch with populate
      referral = await Referral.findById(newReferral._id)
        .populate({
          path: 'referred',
          select: 'name email createdAt',
          options: { strictPopulate: false }
        })
        .populate({
          path: 'rewards.referredUser',
          select: 'name email',
          options: { strictPopulate: false }
        })
        .lean();
    }

    // Safely handle rewards array
    const rewards = referral?.rewards || [];

    // Calculate pending rewards
    const pendingRewards = rewards
      .filter((r: any) => r.status === 'pending')
      .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    // Calculate paid rewards
    const paidRewards = rewards
      .filter((r: any) => r.status === 'paid')
      .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    return NextResponse.json({
      referral,
      summary: {
        referralCode: referral?.referralCode || '',
        totalReferred: referral?.stats?.totalReferred || 0,
        totalEarned: referral?.stats?.totalEarned || 0,
        conversions: referral?.stats?.conversions || 0,
        pendingRewards,
        paidRewards,
        conversionRate:
          (referral?.stats?.totalReferred || 0) > 0
            ? ((referral?.stats?.conversions || 0) / (referral?.stats?.totalReferred || 1)) * 100
            : 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching referral data:', error);
    console.error('Error stack:', error.stack);
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
