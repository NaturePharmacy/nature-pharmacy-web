import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * GET /api/stripe-connect/balance
 * Get current balance for seller's Stripe Connect account
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Only sellers can access this endpoint' },
        { status: 403 }
      );
    }

    // Check if seller has Stripe account
    const stripeAccountId = user.sellerInfo?.stripeAccountId;
    if (!stripeAccountId) {
      return NextResponse.json(
        { error: 'No Stripe Connect account found' },
        { status: 400 }
      );
    }

    // Retrieve balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });

    // Get recent payouts
    const payouts = await stripe.payouts.list(
      {
        limit: 10,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    // Format balance data
    const availableBalance = balance.available.reduce((total, bal) => {
      return total + bal.amount;
    }, 0);

    const pendingBalance = balance.pending.reduce((total, bal) => {
      return total + bal.amount;
    }, 0);

    console.log('✅ Balance retrieved for:', stripeAccountId, {
      available: availableBalance,
      pending: pendingBalance,
    });

    return NextResponse.json({
      success: true,
      balance: {
        available: availableBalance / 100, // Convert from cents to currency
        pending: pendingBalance / 100,
        currency: balance.available[0]?.currency || 'usd',
      },
      payouts: payouts.data.map((payout) => ({
        id: payout.id,
        amount: payout.amount / 100,
        currency: payout.currency,
        status: payout.status,
        arrivalDate: payout.arrival_date,
        created: payout.created,
        method: payout.method,
        type: payout.type,
      })),
    });
  } catch (error: any) {
    console.error('❌ Balance retrieval error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve balance',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
