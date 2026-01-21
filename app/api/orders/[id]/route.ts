import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createNotification, NotificationTemplates } from '@/lib/notifications';
import { sendOrderShippedEmail, sendOrderDeliveredEmail, sendOrderCancelledEmail } from '@/lib/email';

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id)
      .populate('buyer', 'name email phone avatar')
      .populate('items.product', 'name slug images')
      .populate('items.seller', 'name email sellerInfo');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isBuyer = order.buyer._id.toString() === session.user.id;
    const isSeller = order.items.some((item: any) => item.seller._id.toString() === session.user.id);
    const isAdmin = session.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. You cannot view this order.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentId } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isSeller = order.items.some((item: any) => item.seller.toString() === session.user.id);
    const isAdmin = session.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Only sellers or admins can update order status.' },
        { status: 403 }
      );
    }

    // Update allowed fields
    if (status) {
      const oldStatus = order.status;
      order.status = status;
      if (status === 'delivered') {
        order.deliveredAt = new Date();
      } else if (status === 'cancelled') {
        order.cancelledAt = new Date();

        // Restore stock for cancelled orders
        for (const item of order.items) {
          await connectDB();
          const Product = (await import('@/models/Product')).default;
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }

      // Send notification to buyer on status change
      if (oldStatus !== status) {
        // Get buyer info for email
        const User = (await import('@/models/User')).default;
        const buyer = await User.findById(order.buyer);
        const locale = (buyer?.preferredLanguage || 'fr') as 'fr' | 'en' | 'es';

        let notification;
        if (status === 'processing') {
          notification = NotificationTemplates.orderProcessing(order._id.toString());
        } else if (status === 'shipped') {
          notification = NotificationTemplates.orderShipped(order._id.toString());
          // Send shipped email
          if (buyer) {
            await sendOrderShippedEmail(
              buyer.email,
              buyer.name,
              order._id.toString(),
              order.trackingNumber,
              locale
            );
          }
        } else if (status === 'delivered') {
          notification = NotificationTemplates.orderDelivered(order._id.toString());
          // Send delivered email
          if (buyer) {
            await sendOrderDeliveredEmail(
              buyer.email,
              buyer.name,
              order._id.toString(),
              locale
            );
          }
        }

        if (notification) {
          await createNotification({
            userId: order.buyer.toString(),
            ...notification,
          });
        }
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (paymentId) {
      order.paymentId = paymentId;
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('buyer', 'name email')
      .populate('items.product', 'name slug images')
      .populate('items.seller', 'name email sellerInfo');

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Cancel an order (buyer only, before processing)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only buyer can cancel their own order
    if (order.buyer.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. You can only cancel your own orders.' },
        { status: 403 }
      );
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only cancel pending orders. Please contact support.' },
        { status: 400 }
      );
    }

    // Update status to cancelled and restore stock
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await connectDB();
      const Product = (await import('@/models/Product')).default;
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Send cancellation email
    const User = (await import('@/models/User')).default;
    const buyer = await User.findById(order.buyer);
    if (buyer) {
      const locale = (buyer.preferredLanguage || 'fr') as 'fr' | 'en' | 'es';
      await sendOrderCancelledEmail(
        buyer.email,
        buyer.name,
        order._id.toString(),
        'Cancelled by customer',
        locale
      );
    }

    return NextResponse.json({
      message: 'Order cancelled successfully',
    });
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
