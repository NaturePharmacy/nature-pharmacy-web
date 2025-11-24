import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { createNotification } from '@/lib/notifications';

// GET /api/tickets - Get user's tickets (or all for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query: any = {};

    // If not admin, only show user's tickets
    if (session.user.role !== 'admin') {
      query.user = session.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.subject || !data.category || !data.message) {
      return NextResponse.json(
        { error: 'Subject, category, and message are required' },
        { status: 400 }
      );
    }

    // Create ticket with initial message
    const ticket = await Ticket.create({
      user: session.user.id,
      subject: data.subject,
      category: data.category,
      priority: data.priority || 'medium',
      messages: [
        {
          sender: session.user.id,
          senderType: 'user',
          message: data.message,
          attachments: data.attachments || [],
        },
      ],
      relatedOrder: data.relatedOrder,
      relatedProduct: data.relatedProduct,
      tags: data.tags || [],
    });

    // Notify all admins about new support ticket
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification({
        userId: admin._id.toString(),
        type: 'ticket',
        title: 'New Support Ticket',
        message: `New ${data.priority} priority ticket: ${data.subject}`,
        link: `/admin/tickets/${ticket._id}`,
      });
    }

    return NextResponse.json(
      {
        message: 'Ticket created successfully',
        ticket,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
