import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import LoyaltyPoints from '@/models/LoyaltyPoints';

// GET /api/loyalty - Get user's loyalty points
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let loyalty = await LoyaltyPoints.findOne({ user: session.user.id }).lean();

    // Create loyalty account if it doesn't exist
    if (!loyalty) {
      loyalty = await LoyaltyPoints.create({
        user: session.user.id,
        totalPoints: 0,
        lifetimePoints: 0,
        transactions: [],
        tier: 'bronze',
      });
    }

    return NextResponse.json({
      loyalty,
      tierBenefits: getTierBenefits(loyalty.tier),
      nextTier: getNextTier(loyalty.tier, loyalty.lifetimePoints),
    });
  } catch (error: any) {
    console.error('Error fetching loyalty points:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch loyalty points' },
      { status: 500 }
    );
  }
}

// Helper function to get tier benefits
function getTierBenefits(tier: string) {
  const benefits = {
    bronze: {
      multiplier: 1.0,
      pointsPerCFA: 1,
      benefits: ['Earn 1 point per 1 CFA spent', 'Redeem points for discounts'],
    },
    silver: {
      multiplier: 1.25,
      pointsPerCFA: 1.25,
      benefits: [
        'Earn 1.25 points per 1 CFA spent',
        'Redeem points for discounts',
        'Priority customer support',
        'Birthday bonus points',
      ],
    },
    gold: {
      multiplier: 1.5,
      pointsPerCFA: 1.5,
      benefits: [
        'Earn 1.5 points per 1 CFA spent',
        'Redeem points for discounts',
        'Priority customer support',
        'Birthday bonus points',
        'Free shipping on all orders',
        'Early access to sales',
      ],
    },
    platinum: {
      multiplier: 2.0,
      pointsPerCFA: 2,
      benefits: [
        'Earn 2 points per 1 CFA spent',
        'Redeem points for discounts',
        'Priority customer support',
        'Birthday bonus points',
        'Free shipping on all orders',
        'Early access to sales',
        'Exclusive products access',
        'Personal shopping assistant',
      ],
    },
  };

  return benefits[tier as keyof typeof benefits] || benefits.bronze;
}

// Helper function to get next tier info
function getNextTier(currentTier: string, lifetimePoints: number) {
  const tiers = [
    { name: 'silver', threshold: 20000 },
    { name: 'gold', threshold: 50000 },
    { name: 'platinum', threshold: 100000 },
  ];

  for (const tier of tiers) {
    if (lifetimePoints < tier.threshold) {
      return {
        name: tier.name,
        threshold: tier.threshold,
        pointsNeeded: tier.threshold - lifetimePoints,
      };
    }
  }

  return null; // Already at highest tier
}
