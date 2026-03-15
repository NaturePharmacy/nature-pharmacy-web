import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live'
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

    const { orderData } = await request.json();
    const { items, shippingAddress, shippingCost, shippingZone, notes } = orderData;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    // Validate products and compute prices
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
      }
      if (!product.isActive) {
        return NextResponse.json({ error: `Product ${product.name.en} is unavailable` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name.en}` },
          { status: 400 }
        );
      }

      itemsPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        productName: product.name.en,
        productImage: product.images[0] || '',
        seller: product.seller,
        quantity: item.quantity,
        price: product.price,
        basePrice: product.price,
        commission: 0,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const shippingPrice = shippingCost ?? (itemsPrice > 50 ? 0 : 9.99);
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create DB order (pending, will be confirmed after PayPal capture)
    const order = await Order.create({
      buyer: session.user.id,
      items: orderItems,
      shippingAddress,
      shippingZone: shippingZone || undefined,
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes,
    });

    // Create PayPal order
    const accessToken = await getAccessToken();

    const paypalRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: order._id.toString(),
            amount: {
              currency_code: 'USD',
              value: totalPrice.toFixed(2),
            },
            description: `Nature Pharmacy Order #${order._id}`,
          },
        ],
      }),
    });

    const paypalData = await paypalRes.json();

    if (!paypalRes.ok) {
      // Rollback DB order
      await Order.findByIdAndDelete(order._id);
      console.error('PayPal order creation failed:', paypalData);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    // Store PayPal order ID in our order
    order.paymentDetails = { ...(order.paymentDetails || {}), paypalOrderId: paypalData.id };
    await order.save();

    return NextResponse.json({ paypalOrderId: paypalData.id, orderId: order._id.toString() });
  } catch (error) {
    console.error('PayPal create-order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
