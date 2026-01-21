import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { createNotification, NotificationTemplates } from '@/lib/notifications';
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature found in headers');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log('✅ Stripe webhook event received:', event.type);

    await connectDB();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Payment succeeded:', paymentIntent.id);

  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('⚠️ No orderId in payment intent metadata');
    return;
  }

  try {
    const order = await Order.findById(orderId)
      .populate('buyer', 'name email preferredLanguage')
      .populate('items.seller', 'name email');

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      paidAt: new Date(),
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
    };

    // If order status is still 'pending', move it to 'processing'
    if (order.status === 'pending') {
      order.status = 'processing';
    }

    await order.save();

    console.log(`✅ Order ${orderId} marked as paid`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.paymentConfirmed(orderId);
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    // Send notification to sellers
    const sellers = new Set(order.items.map((item: any) => item.seller._id.toString()));
    for (const sellerId of sellers) {
      const sellerNotification = NotificationTemplates.orderPaid(
        orderId,
        buyer.name
      );
      await createNotification({
        userId: sellerId,
        ...sellerNotification,
      });
    }

    console.log('✅ Notifications sent for order:', orderId);

    // If order is delivered, transfer funds to sellers
    if (order.status === 'delivered') {
      await transferFundsToSellers(order);
    }
  } catch (error: any) {
    console.error('❌ Error handling payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('⚠️ No orderId in payment intent metadata');
    return;
  }

  try {
    const order = await Order.findById(orderId).populate('buyer', 'name email');

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'failed';
    order.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
    };

    await order.save();

    console.log(`✅ Order ${orderId} marked as payment failed`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.paymentFailed(orderId);
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    console.log('✅ Failure notification sent for order:', orderId);
  } catch (error: any) {
    console.error('❌ Error handling payment failure:', error);
  }
}

// Handle charge refunded
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('💰 Charge refunded:', charge.id);

  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.error('⚠️ No payment intent ID in charge');
    return;
  }

  try {
    const order = await Order.findOne({
      'paymentDetails.paymentIntentId': paymentIntentId,
    }).populate('buyer', 'name email');

    if (!order) {
      console.error('❌ Order not found for payment intent:', paymentIntentId);
      return;
    }

    // Update order
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    if (order.paymentDetails) {
      order.paymentDetails.refundedAt = new Date();
      order.paymentDetails.refundAmount = charge.amount_refunded / 100;
    }

    await order.save();

    console.log(`✅ Order ${order._id} marked as refunded`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.orderRefunded(order._id.toString());
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    console.log('✅ Refund notification sent for order:', order._id);
  } catch (error: any) {
    console.error('❌ Error handling refund:', error);
  }
}

// Handle checkout session completed
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout session completed:', session.id);

  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error('⚠️ No orderId in checkout session metadata');
    return;
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order with session details
    order.paymentDetails = {
      ...order.paymentDetails,
      sessionId: session.id,
      paymentIntentId: session.payment_intent as string,
    };

    await order.save();

    console.log(`✅ Order ${orderId} updated with checkout session`);
  } catch (error: any) {
    console.error('❌ Error handling checkout session:', error);
  }
}

// Handle payment intent canceled
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('🚫 Payment canceled:', paymentIntent.id);

  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('⚠️ No orderId in payment intent metadata');
    return;
  }

  try {
    const order = await Order.findById(orderId).populate('buyer', 'name email');

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'cancelled';
    order.status = 'cancelled';

    await order.save();

    console.log(`✅ Order ${orderId} marked as cancelled`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.orderCancelled(orderId);
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    console.log('✅ Cancellation notification sent for order:', orderId);
  } catch (error: any) {
    console.error('❌ Error handling payment cancellation:', error);
  }
}

/**
 * Transfer funds to sellers using Stripe Connect
 * Called when order is delivered and payment is completed
 */
async function transferFundsToSellers(order: any) {
  console.log('💸 Initiating fund transfers for order:', order._id);

  try {
    // Group items by seller
    const sellerItems = new Map<string, any[]>();
    for (const item of order.items) {
      const sellerId = item.seller._id.toString();
      if (!sellerItems.has(sellerId)) {
        sellerItems.set(sellerId, []);
      }
      sellerItems.get(sellerId)!.push(item);
    }

    // Transfer to each seller
    for (const [sellerId, items] of sellerItems.entries()) {
      const seller = await User.findById(sellerId);

      if (!seller || !seller.sellerInfo?.stripeAccountId) {
        console.error('❌ Seller has no Stripe Connect account:', sellerId);
        continue;
      }

      if (!seller.sellerInfo.stripeChargesEnabled || !seller.sellerInfo.stripePayoutsEnabled) {
        console.error('❌ Seller Stripe account not fully activated:', sellerId);
        continue;
      }

      // Calculate total amount for this seller (subtotal + tax, minus commission)
      let sellerTotal = 0;
      for (const item of items) {
        sellerTotal += item.price * item.quantity;
      }

      // Apply platform commission (e.g., 10%)
      const platformCommission = 0.10;
      const sellerAmount = sellerTotal * (1 - platformCommission);
      const commissionAmount = sellerTotal * platformCommission;

      // Convert to cents
      const sellerAmountCents = Math.round(sellerAmount * 100);
      const commissionAmountCents = Math.round(commissionAmount * 100);

      if (sellerAmountCents <= 0) {
        console.log('⚠️ Seller amount is 0 or negative, skipping transfer');
        continue;
      }

      try {
        // Create transfer to seller's Stripe Connect account
        const transfer = await stripe.transfers.create({
          amount: sellerAmountCents,
          currency: order.totalAmount?.currency || 'usd',
          destination: seller.sellerInfo.stripeAccountId,
          description: `Order #${order._id} - ${items.length} item(s)`,
          metadata: {
            orderId: order._id.toString(),
            sellerId: sellerId,
            itemCount: items.length.toString(),
            platformCommission: commissionAmountCents.toString(),
          },
        });

        console.log('✅ Transfer created:', {
          transferId: transfer.id,
          sellerId,
          amount: sellerAmount,
          commission: commissionAmount,
        });

        // Send notification to seller
        await createNotification({
          userId: sellerId,
          type: 'info',
          title: 'Payment Received',
          message: `You received $${sellerAmount.toFixed(2)} for order #${order._id}`,
          link: `/seller/dashboard/earnings`,
        });
      } catch (transferError: any) {
        console.error('❌ Failed to create transfer for seller:', sellerId, transferError.message);

        // Send notification about failed transfer
        await createNotification({
          userId: sellerId,
          type: 'error',
          title: 'Payment Transfer Failed',
          message: `Failed to transfer payment for order #${order._id}. Please contact support.`,
          link: `/seller/dashboard/earnings`,
        });
      }
    }

    console.log('✅ All transfers completed for order:', order._id);
  } catch (error: any) {
    console.error('❌ Error transferring funds to sellers:', error);
  }
}
