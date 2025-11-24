import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

// GET /api/conversations/[id] - Get a single conversation with messages
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

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email avatar role sellerInfo')
      .populate('product', 'name slug images price')
      .populate('messages.sender', 'name avatar');

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === session.user.id
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not part of this conversation' },
        { status: 403 }
      );
    }

    // Mark messages as read for current user
    let hasUnread = false;
    conversation.messages.forEach((msg: any) => {
      if (msg.sender._id.toString() !== session.user.id && !msg.read) {
        msg.read = true;
        hasUnread = true;
      }
    });

    if (hasUnread) {
      conversation.unreadCount.set(session.user.id, 0);
      await conversation.save();
    }

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
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

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p: any) => p.toString() === session.user.id
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not part of this conversation' },
        { status: 403 }
      );
    }

    await Conversation.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Conversation deleted' });
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
