import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Referral from '@/models/Referral';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createNotification, NotificationTemplates } from '@/lib/notifications';
import { sendOrderConfirmationEmail } from '@/lib/email';

// GET /api/orders - Get user's orders or all orders (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let query: any = {};

    // Admin can see all orders, sellers see orders with their products, buyers see their own
    if (session.user.role === 'admin') {
      if (status) query.status = status;
    } else if (session.user.role === 'seller') {
      query['items.seller'] = session.user.id;
      if (status) query.status = status;
    } else {
      query.buyer = session.user.id;
      if (status) query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name email')
        .populate('items.product', 'name slug images')
        .populate('items.seller', 'name email sellerInfo')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, notes } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street || !shippingAddress.city) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Validate products and calculate prices
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product ${product.name.en} is no longer available` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name.en}. Only ${product.stock} available.` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      orderItems.push({
        product: product._id,
        productName: product.name.en,
        productImage: product.images[0] || '',
        seller: product.seller,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping and tax (simplified - you can customize this)
    const shippingPrice = itemsPrice > 50 ? 0 : 9.99;
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
      buyer: session.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate('items.product', 'name slug images')
      .populate('items.seller', 'name email sellerInfo');

    // Send notification to buyer
    const buyerNotification = NotificationTemplates.orderPlaced(order._id.toString());
    await createNotification({
      userId: session.user.id,
      ...buyerNotification,
    });

    // Send order confirmation email
    const buyer = await User.findById(session.user.id);
    if (buyer) {
      const locale = 'fr' as 'fr' | 'en' | 'es';
      await sendOrderConfirmationEmail(
        buyer.email,
        buyer.name,
        order._id.toString(),
        totalPrice,
        locale
      );
    }

    // Send notification to each seller
    const sellers = new Set(orderItems.map(item => item.seller.toString()));
    for (const sellerId of sellers) {
      const sellerNotification = NotificationTemplates.newOrder(
        order._id.toString(),
        (populatedOrder as any).buyer.name
      );
      await createNotification({
        userId: sellerId,
        ...sellerNotification,
      });
    }

    // Handle referral rewards if this is user's first purchase
    if (buyer?.referredBy) {
      // Check if this is the first completed order
      const previousOrders = await Order.countDocuments({
        buyer: session.user.id,
        status: { $in: ['completed', 'delivered'] },
      });

      // If this is the first order, add referral reward
      if (previousOrders === 0) {
        const referral = await Referral.findOne({ referrer: buyer.referredBy });
        if (referral) {
          // Calculate reward (5% of order total as an example)
          const rewardAmount = totalPrice * 0.05;

          referral.rewards.push({
            referredUser: buyer._id as any,
            order: order._id as any,
            amount: rewardAmount,
            status: 'pending',
            createdAt: new Date(),
          });
          referral.stats.totalEarned += rewardAmount;
          referral.stats.conversions += 1;
          await referral.save();

          // Notify the referrer
          await createNotification({
            userId: buyer.referredBy.toString(),
            type: 'system',
            title: {
              fr: 'Récompense de parrainage!',
              en: 'Referral Reward Earned!',
              es: '¡Recompensa de referido!'
            },
            message: {
              fr: `Vous avez gagné ${rewardAmount.toFixed(2)} FCFA grâce au premier achat de votre filleul!`,
              en: `You earned ${rewardAmount.toFixed(2)} FCFA from your referral's first purchase!`,
              es: `¡Ganaste ${rewardAmount.toFixed(2)} FCFA de la primera compra de tu referido!`
            },
            link: '/referral',
          });
        }
      }
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: populatedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
