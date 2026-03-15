import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { createNotification, NotificationTemplates } from '@/lib/notifications';
import { sendOrderConfirmationEmail } from '@/lib/email';

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE?.trim() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { paypalOrderId, orderId } = await request.json();

    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: 'Missing paypalOrderId or orderId' }, { status: 400 });
    }

    // Capture payment with PayPal
    const accessToken = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      console.error('PayPal capture failed:', captureData);
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 400 });
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

    // Update our order to paid
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    order.paymentDetails = {
      paypalOrderId,
      paypalCaptureId: capture?.id,
      paidAt: new Date(),
      amount: parseFloat(capture?.amount?.value || '0'),
      currency: capture?.amount?.currency_code || 'USD',
    };
    await order.save();

    // Decrement stock now that payment is confirmed
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send buyer notification and confirmation email
    const buyerNotification = NotificationTemplates.orderPlaced(order._id.toString());
    await createNotification({ userId: session.user.id, ...buyerNotification });

    const buyer = await User.findById(session.user.id);
    if (buyer) {
      await sendOrderConfirmationEmail(
        buyer.email,
        buyer.name,
        order._id.toString(),
        order.totalPrice,
        'fr'
      );
    }

    // Notify sellers
    const sellerIds = [...new Set(order.items.map((i: any) => i.seller?.toString()).filter(Boolean))];
    for (const sellerId of sellerIds) {
      const sellerNotification = NotificationTemplates.newOrder(
        order._id.toString(),
        buyer?.name || 'Client'
      );
      await createNotification({ userId: sellerId as string, ...sellerNotification });
    }

    return NextResponse.json({ orderId: order._id.toString(), status: 'paid' });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
