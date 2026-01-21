import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe-connect
 * Handle Stripe Connect events (account updates, payouts, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('❌ STRIPE_CONNECT_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('🔔 Stripe Connect webhook received:', event.type);

    await connectDB();

    // Handle different event types
    switch (event.type) {
      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      case 'account.application.authorized':
        await handleAccountAuthorized(event.data.object as Stripe.Account);
        break;

      case 'account.application.deauthorized':
        await handleAccountDeauthorized(event.data.object as Stripe.Account);
        break;

      case 'capability.updated':
        await handleCapabilityUpdated(event.data.object as Stripe.Capability);
        break;

      case 'payout.paid':
        await handlePayoutPaid(event.data.object as Stripe.Payout);
        break;

      case 'payout.failed':
        await handlePayoutFailed(event.data.object as Stripe.Payout);
        break;

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Stripe Connect webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle account.updated event
 */
async function handleAccountUpdated(account: Stripe.Account) {
  console.log('🔄 Account updated:', account.id);

  const user = await User.findOne({
    'sellerInfo.stripeAccountId': account.id,
  });

  if (!user) {
    console.error('❌ User not found for Stripe account:', account.id);
    return;
  }

  if (!user.sellerInfo) {
    console.error('❌ User has no sellerInfo:', user._id);
    return;
  }

  // Update account capabilities
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

  console.log('✅ User account status updated:', {
    userId: user._id,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    onboardingComplete: user.sellerInfo.stripeOnboardingComplete,
  });
}

/**
 * Handle account.application.authorized event
 */
async function handleAccountAuthorized(account: Stripe.Account) {
  console.log('✅ Account authorized:', account.id);

  const user = await User.findOne({
    'sellerInfo.stripeAccountId': account.id,
  });

  if (user && user.sellerInfo) {
    user.sellerInfo.stripeOnboardingComplete = true;
    await user.save();
    console.log('✅ User onboarding marked complete:', user._id);
  }
}

/**
 * Handle account.application.deauthorized event
 */
async function handleAccountDeauthorized(account: Stripe.Account) {
  console.log('⚠️ Account deauthorized:', account.id);

  const user = await User.findOne({
    'sellerInfo.stripeAccountId': account.id,
  });

  if (user && user.sellerInfo) {
    // Reset Stripe Connect fields
    user.sellerInfo.stripeAccountId = undefined;
    user.sellerInfo.stripeOnboardingComplete = false;
    user.sellerInfo.stripeChargesEnabled = false;
    user.sellerInfo.stripePayoutsEnabled = false;
    user.sellerInfo.stripeDetailsSubmitted = false;
    user.sellerInfo.stripeBankAccountAdded = false;

    await user.save();
    console.log('✅ User Stripe Connect access removed:', user._id);
  }
}

/**
 * Handle capability.updated event
 */
async function handleCapabilityUpdated(capability: Stripe.Capability) {
  console.log('🔄 Capability updated:', capability.account, capability.id);

  const user = await User.findOne({
    'sellerInfo.stripeAccountId': capability.account,
  });

  if (!user || !user.sellerInfo) {
    return;
  }

  // Fetch latest account status
  const account = await stripe.accounts.retrieve(capability.account as string);

  user.sellerInfo.stripeChargesEnabled = account.charges_enabled;
  user.sellerInfo.stripePayoutsEnabled = account.payouts_enabled;
  user.sellerInfo.stripeDetailsSubmitted = account.details_submitted;
  user.sellerInfo.stripeOnboardingComplete =
    account.charges_enabled &&
    account.payouts_enabled &&
    account.details_submitted;

  await user.save();

  console.log('✅ User capabilities updated:', {
    userId: user._id,
    capability: capability.id,
    status: capability.status,
  });
}

/**
 * Handle payout.paid event
 */
async function handlePayoutPaid(payout: Stripe.Payout) {
  console.log('💰 Payout paid:', {
    id: payout.id,
    amount: payout.amount / 100,
    currency: payout.currency,
  });

  // You can log this or send notification to seller
  // For now, just log it
}

/**
 * Handle payout.failed event
 */
async function handlePayoutFailed(payout: Stripe.Payout) {
  console.error('❌ Payout failed:', {
    id: payout.id,
    amount: payout.amount / 100,
    currency: payout.currency,
    failureCode: payout.failure_code,
    failureMessage: payout.failure_message,
  });

  // You should notify the seller about the failed payout
  // For now, just log it
}
