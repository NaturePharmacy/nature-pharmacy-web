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
 * POST /api/stripe-connect/dashboard
 * Create a login link to Stripe Express Dashboard
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
        { error: 'No Stripe Connect account found. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    // Create login link
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);

    console.log('✅ Dashboard login link created for:', stripeAccountId);

    return NextResponse.json({
      success: true,
      url: loginLink.url,
    });
  } catch (error: any) {
    console.error('❌ Stripe dashboard link error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create dashboard link',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePost, RateLimitPresets.STANDARD);
