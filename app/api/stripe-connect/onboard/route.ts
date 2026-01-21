import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withRateLimit } from '@/lib/apiHelpers';
import { RateLimitPresets } from '@/lib/rateLimit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * POST /api/stripe-connect/onboard
 * Create a Stripe Connect account and return onboarding link
 */
async function handlePost(request: NextRequest) {
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

    // Get user and verify they're a seller
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Only sellers can create a Stripe Connect account' },
        { status: 403 }
      );
    }

    // Check if seller already has a Stripe account
    let stripeAccountId = user.sellerInfo?.stripeAccountId;

    if (!stripeAccountId) {
      // Create new Stripe Connect account
      console.log('🔵 Creating Stripe Connect account for seller:', user.email);

      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          userId: user._id.toString(),
          userEmail: user.email,
          storeName: user.sellerInfo?.storeName || '',
        },
      });

      stripeAccountId = account.id;

      // Save Stripe account ID to user
      user.sellerInfo = user.sellerInfo || {
        verified: false,
        rating: 0,
        totalSales: 0,
        stripeOnboardingComplete: false,
        stripeChargesEnabled: false,
        stripePayoutsEnabled: false,
        stripeDetailsSubmitted: false,
        stripeBankAccountAdded: false,
      };
      user.sellerInfo.stripeAccountId = stripeAccountId;
      await user.save();

      console.log('✅ Stripe Connect account created:', stripeAccountId);
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/dashboard/payout?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seller/dashboard/payout?success=true`,
      type: 'account_onboarding',
    });

    console.log('✅ Onboarding link created for:', stripeAccountId);

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      accountId: stripeAccountId,
    });
  } catch (error: any) {
    console.error('❌ Stripe Connect onboarding error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create onboarding link',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePost, RateLimitPresets.STANDARD);
