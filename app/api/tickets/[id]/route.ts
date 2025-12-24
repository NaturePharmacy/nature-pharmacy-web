import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { createNotification } from '@/lib/notifications';

// GET /api/tickets/[id] - Get ticket details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const ticket = await Ticket.findById(id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedProduct', 'name slug')
      .populate('messages.sender', 'name email')
      .lean();

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this ticket
    if (
      session.user.role !== 'admin' &&
      ticket.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id] - Update ticket (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    const updateData: any = {};

    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
    if (data.tags) updateData.tags = data.tags;

    // Handle status-specific timestamps
    if (data.status === 'resolved' && !data.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    if (data.status === 'closed' && !data.closedAt) {
      updateData.closedAt = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// POST /api/tickets/[id] - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this ticket
    if (
      session.user.role !== 'admin' &&
      ticket.user.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();

    if (!data.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Add message
    ticket.messages.push({
      sender: session.user.id,
      senderType: session.user.role === 'admin' ? 'admin' : 'user',
      message: data.message,
      attachments: data.attachments || [],
      createdAt: new Date(),
    });

    // Update status if needed
    if (session.user.role === 'admin' && ticket.status === 'open') {
      ticket.status = 'in_progress';
    } else if (session.user.role !== 'admin' && ticket.status === 'waiting_user') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    // Notify the other party about the new message
    if (session.user.role === 'admin') {
      // Admin replied, notify the user
      await createNotification({
        userId: ticket.user.toString(),
        type: 'ticket',
        title: 'New Reply to Your Ticket',
        message: `Support team replied to your ticket: ${ticket.subject}`,
        link: `/support/${ticket._id}`,
      });
    } else {
      // User replied, notify admins (if ticket is assigned, only notify assigned admin)
      if (ticket.assignedTo) {
        await createNotification({
          userId: ticket.assignedTo.toString(),
          type: 'ticket',
          title: 'New Reply from Customer',
          message: `${session.user.name} replied to ticket: ${ticket.subject}`,
          link: `/admin/tickets/${ticket._id}`,
        });
      }
    }

    return NextResponse.json({
      message: 'Message added successfully',
      ticket,
    });
  } catch (error: any) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add message' },
      { status: 500 }
    );
  }
}
