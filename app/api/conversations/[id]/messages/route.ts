import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
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
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Message cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

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

    // Add new message
    const newMessage = {
      sender: session.user.id,
      content: content.trim(),
      read: false,
      createdAt: new Date(),
    };

    conversation.messages.push(newMessage);

    // Update last message
    conversation.lastMessage = {
      content: content.trim(),
      sender: session.user.id,
      createdAt: new Date(),
    };

    // Increment unread count for other participants
    conversation.participants.forEach((participantId: any) => {
      if (participantId.toString() !== session.user.id) {
        const currentUnread = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentUnread + 1);
      }
    });

    await conversation.save();

    // Return the new message with sender info
    const populatedConversation = await Conversation.findById(id)
      .populate('messages.sender', 'name avatar')
      .select('messages');

    const lastMessage = populatedConversation?.messages[populatedConversation.messages.length - 1];

    return NextResponse.json({
      message: lastMessage,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
