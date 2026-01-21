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
 * GET /api/stripe-connect/status
 * Get Stripe Connect account status for current seller
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
      return NextResponse.json({
        hasAccount: false,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      });
    }

    // Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(stripeAccountId);

    // Update user with latest status
    if (user.sellerInfo) {
      user.sellerInfo.stripeChargesEnabled = account.charges_enabled;
      user.sellerInfo.stripePayoutsEnabled = account.payouts_enabled;
      user.sellerInfo.stripeDetailsSubmitted = account.details_submitted;
      user.sellerInfo.stripeOnboardingComplete =
        account.charges_enabled &&
        account.payouts_enabled &&
        account.details_submitted;
      user.sellerInfo.stripeBankAccountAdded =
        account.external_accounts?.data?.length > 0;

      await user.save();
    }

    console.log('✅ Stripe account status retrieved:', {
      accountId: stripeAccountId,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });

    return NextResponse.json({
      hasAccount: true,
      accountId: stripeAccountId,
      onboardingComplete: user.sellerInfo?.stripeOnboardingComplete,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      bankAccountAdded: user.sellerInfo?.stripeBankAccountAdded,
      country: account.country,
      currency: account.default_currency,
      email: account.email,
      requiresAction: !account.charges_enabled || !account.payouts_enabled,
    });
  } catch (error: any) {
    console.error('❌ Stripe Connect status error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve account status',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
