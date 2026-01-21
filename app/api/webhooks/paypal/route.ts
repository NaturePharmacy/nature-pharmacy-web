import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { createNotification, NotificationTemplates } from '@/lib/notifications';

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY!;
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();

    // Get PayPal headers for verification
    const transmissionId = headersList.get('paypal-transmission-id');
    const transmissionTime = headersList.get('paypal-transmission-time');
    const transmissionSig = headersList.get('paypal-transmission-sig');
    const certUrl = headersList.get('paypal-cert-url');
    const authAlgo = headersList.get('paypal-auth-algo');

    if (!transmissionId || !transmissionTime || !transmissionSig) {
      console.error('❌ Missing PayPal webhook headers');
      return NextResponse.json(
        { error: 'Missing required PayPal headers' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook({
      transmissionId,
      transmissionTime,
      transmissionSig,
      certUrl: certUrl || '',
      authAlgo: authAlgo || 'SHA256withRSA',
      webhookId: PAYPAL_WEBHOOK_ID,
      body,
    });

    if (!isValid) {
      console.error('❌ Invalid PayPal webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log('✅ PayPal webhook event received:', event.event_type);

    await connectDB();

    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(event);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(event);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentCaptureRefunded(event);
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        await handleCheckoutOrderApproved(event);
        break;

      case 'PAYMENT.CAPTURE.PENDING':
        await handlePaymentCapturePending(event);
        break;

      default:
        console.log(`ℹ️ Unhandled PayPal event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true, type: event.event_type });
  } catch (error: any) {
    console.error('❌ PayPal webhook handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify PayPal webhook signature
async function verifyPayPalWebhook(params: {
  transmissionId: string;
  transmissionTime: string;
  transmissionSig: string;
  certUrl: string;
  authAlgo: string;
  webhookId: string;
  body: string;
}): Promise<boolean> {
  try {
    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString('base64');

    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Verify webhook signature via PayPal API
    const verifyResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transmission_id: params.transmissionId,
          transmission_time: params.transmissionTime,
          cert_url: params.certUrl,
          auth_algo: params.authAlgo,
          transmission_sig: params.transmissionSig,
          webhook_id: params.webhookId,
          webhook_event: JSON.parse(params.body),
        }),
      }
    );

    const verifyData = await verifyResponse.json();
    return verifyData.verification_status === 'SUCCESS';
  } catch (error: any) {
    console.error('❌ Error verifying PayPal webhook:', error);
    return false;
  }
}

// Handle payment capture completed
async function handlePaymentCaptureCompleted(event: any) {
  console.log('💳 PayPal payment captured:', event.resource.id);

  const orderId = event.resource.custom_id || event.resource.invoice_id;

  if (!orderId) {
    console.error('⚠️ No orderId in PayPal payment');
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
      paypalCaptureId: event.resource.id,
      paypalOrderId: event.resource.supplementary_data?.related_ids?.order_id,
      paidAt: new Date(event.resource.create_time),
      amount: parseFloat(event.resource.amount.value),
      currency: event.resource.amount.currency_code,
    };

    // If order status is still 'pending', move it to 'processing'
    if (order.status === 'pending') {
      order.status = 'processing';
    }

    await order.save();

    console.log(`✅ Order ${orderId} marked as paid (PayPal)`);

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

    console.log('✅ Notifications sent for PayPal order:', orderId);
  } catch (error: any) {
    console.error('❌ Error handling PayPal payment:', error);
  }
}

// Handle payment capture denied
async function handlePaymentCaptureDenied(event: any) {
  console.log('❌ PayPal payment denied:', event.resource.id);

  const orderId = event.resource.custom_id || event.resource.invoice_id;

  if (!orderId) {
    console.error('⚠️ No orderId in PayPal payment');
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
      paypalCaptureId: event.resource.id,
      failureReason: event.resource.status_details?.reason || 'Payment denied',
    };

    await order.save();

    console.log(`✅ Order ${orderId} marked as payment failed (PayPal)`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.paymentFailed(orderId);
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    console.log('✅ Failure notification sent for PayPal order:', orderId);
  } catch (error: any) {
    console.error('❌ Error handling PayPal payment failure:', error);
  }
}

// Handle payment capture refunded
async function handlePaymentCaptureRefunded(event: any) {
  console.log('💰 PayPal payment refunded:', event.resource.id);

  const captureId = event.resource.links?.find((link: any) =>
    link.rel === 'up'
  )?.href?.split('/').pop();

  if (!captureId) {
    console.error('⚠️ No capture ID in PayPal refund');
    return;
  }

  try {
    const order = await Order.findOne({
      'paymentDetails.paypalCaptureId': captureId,
    }).populate('buyer', 'name email');

    if (!order) {
      console.error('❌ Order not found for PayPal capture:', captureId);
      return;
    }

    // Update order
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    if (order.paymentDetails) {
      order.paymentDetails.refundedAt = new Date(event.resource.create_time);
      order.paymentDetails.refundAmount = parseFloat(event.resource.amount.value);
    }

    await order.save();

    console.log(`✅ Order ${order._id} marked as refunded (PayPal)`);

    // Send notification to buyer
    const buyer = order.buyer as any;
    const buyerNotification = NotificationTemplates.orderRefunded(order._id.toString());
    await createNotification({
      userId: buyer._id.toString(),
      ...buyerNotification,
    });

    console.log('✅ Refund notification sent for PayPal order:', order._id);
  } catch (error: any) {
    console.error('❌ Error handling PayPal refund:', error);
  }
}

// Handle checkout order approved
async function handleCheckoutOrderApproved(event: any) {
  console.log('✅ PayPal checkout approved:', event.resource.id);

  const orderId = event.resource.purchase_units?.[0]?.custom_id ||
                  event.resource.purchase_units?.[0]?.invoice_id;

  if (!orderId) {
    console.error('⚠️ No orderId in PayPal checkout');
    return;
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order with PayPal order ID
    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }
    order.paymentDetails.paypalOrderId = event.resource.id;

    await order.save();

    console.log(`✅ Order ${orderId} updated with PayPal order ID`);
  } catch (error: any) {
    console.error('❌ Error handling PayPal checkout approval:', error);
  }
}

// Handle payment capture pending
async function handlePaymentCapturePending(event: any) {
  console.log('⏳ PayPal payment pending:', event.resource.id);

  const orderId = event.resource.custom_id || event.resource.invoice_id;

  if (!orderId) {
    console.error('⚠️ No orderId in PayPal payment');
    return;
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'pending';
    order.paymentDetails = {
      paypalCaptureId: event.resource.id,
      pendingReason: event.resource.status_details?.reason || 'Payment pending',
    };

    await order.save();

    console.log(`✅ Order ${orderId} marked as payment pending (PayPal)`);
  } catch (error: any) {
    console.error('❌ Error handling PayPal payment pending:', error);
  }
}
