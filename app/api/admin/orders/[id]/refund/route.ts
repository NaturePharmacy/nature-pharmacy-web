import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { logActivity } from '@/lib/activityLog';

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { amount, reason } = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod !== 'paypal') {
      return NextResponse.json(
        { error: 'Refund only supported for PayPal orders' },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Order is not paid — cannot refund' },
        { status: 400 }
      );
    }

    const captureId = order.paymentDetails?.paypalCaptureId;
    if (!captureId) {
      return NextResponse.json(
        { error: 'PayPal capture ID not found on this order' },
        { status: 400 }
      );
    }

    const refundAmount = amount
      ? parseFloat(amount)
      : order.totalPrice;

    const accessToken = await getAccessToken();

    const refundRes = await fetch(
      `${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            value: refundAmount.toFixed(2),
            currency_code: order.paymentDetails?.currency || 'USD',
          },
          note_to_payer: reason || 'Refund from Nature Pharmacy',
        }),
      }
    );

    const refundData = await refundRes.json();

    if (!refundRes.ok || refundData.status === 'FAILED') {
      console.error('PayPal refund failed:', refundData);
      return NextResponse.json(
        { error: 'PayPal refund failed', details: refundData },
        { status: 400 }
      );
    }

    // Update order
    const isFullRefund = refundAmount >= order.totalPrice;
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.paymentDetails = {
      ...order.paymentDetails,
      refundedAt: new Date(),
      refundAmount: refundAmount,
      pendingReason: reason,
    };
    await order.save();

    await logActivity({
      adminId: (session.user as any).id,
      adminEmail: session.user.email!,
      adminName: session.user.name || 'Admin',
      action: isFullRefund ? 'order.refund_full' : 'order.refund_partial',
      resourceType: 'order',
      resourceId: order._id.toString(),
      resourceLabel: order.orderNumber,
      meta: {
        refundAmount,
        currency: order.paymentDetails?.currency || 'USD',
        reason,
        paypalRefundId: refundData.id,
        paypalStatus: refundData.status,
      },
    });

    return NextResponse.json({
      success: true,
      refundId: refundData.id,
      status: refundData.status,
      refundAmount,
    });
  } catch (error: any) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
