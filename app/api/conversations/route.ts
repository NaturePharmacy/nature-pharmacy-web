import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

// GET /api/conversations - Get user's conversations
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

    const conversations = await Conversation.find({
      participants: session.user.id,
    })
      .populate('participants', 'name email avatar')
      .populate('product', 'name slug images')
      .sort('-updatedAt')
      .lean();

    // Calculate unread count for current user
    const conversationsWithUnread = conversations.map((conv: any) => ({
      ...conv,
      unreadCount: conv.unreadCount?.get?.(session.user.id) || conv.unreadCount?.[session.user.id] || 0,
      otherParticipant: conv.participants.find((p: any) => p._id.toString() !== session.user.id),
    }));

    return NextResponse.json({ conversations: conversationsWithUnread });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create or get existing conversation
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

    const { recipientId, productId, message } = await request.json();

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient is required' },
        { status: 400 }
      );
    }

    if (recipientId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot message yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, recipientId] },
      ...(productId && { product: productId }),
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [session.user.id, recipientId],
        product: productId || undefined,
        messages: [],
        unreadCount: new Map(),
      });
    }

    // Add initial message if provided
    if (message) {
      conversation.messages.push({
        sender: session.user.id,
        content: message,
        read: false,
        createdAt: new Date(),
      });

      conversation.lastMessage = {
        content: message,
        sender: session.user.id,
        createdAt: new Date(),
      };

      // Increment unread count for recipient
      const currentUnread = conversation.unreadCount.get(recipientId) || 0;
      conversation.unreadCount.set(recipientId, currentUnread + 1);

      await conversation.save();
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email avatar')
      .populate('product', 'name slug images');

    return NextResponse.json({
      conversation: populatedConversation,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
