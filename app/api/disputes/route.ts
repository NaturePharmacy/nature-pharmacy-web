import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { orderId, reason, description, evidence } = body;

    // Validate required fields
    if (!orderId || !reason || !description) {
      return NextResponse.json(
        { error: 'orderId, reason, and description are required.' },
        { status: 400 }
      );
    }

    const validReasons = ['not_received', 'not_as_described', 'defective', 'wrong_item', 'other'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason. Must be one of: ' + validReasons.join(', ') },
        { status: 400 }
      );
    }

    // Check order exists and belongs to buyer
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.buyer.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only open disputes for your own orders.' },
        { status: 403 }
      );
    }

    // Check order paymentStatus is 'paid' and status is not 'cancelled'
    if (order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'You can only open a dispute for paid orders.' },
        { status: 400 }
      );
    }

    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'You cannot open a dispute for a cancelled order.' },
        { status: 400 }
      );
    }

    // Check no existing open dispute for this order
    const existingDispute = await Dispute.findOne({
      order: orderId,
      status: { $in: ['open', 'under_review'] },
    });

    if (existingDispute) {
      return NextResponse.json(
        { error: 'An open dispute already exists for this order.' },
        { status: 409 }
      );
    }

    // Get seller from first item
    const sellerId = order.items?.[0]?.seller;
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Could not determine seller from order.' },
        { status: 400 }
      );
    }

    const dispute = await Dispute.create({
      order: orderId,
      buyer: session.user.id,
      seller: sellerId,
      reason,
      description,
      evidence: Array.isArray(evidence) ? evidence : [],
      status: 'open',
    });

    return NextResponse.json({ dispute }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dispute:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create dispute' },
      { status: 500 }
    );
  }
}
