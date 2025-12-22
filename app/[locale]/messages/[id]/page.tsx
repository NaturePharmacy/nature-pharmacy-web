'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    sellerInfo?: { storeName?: string };
  }>;
  product?: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
    images: string[];
    price: number;
  };
  messages: Message[];
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversationId, setConversationId] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const t = {
    fr: {
      back: 'Messages',
      placeholder: 'Écrivez votre message...',
      send: 'Envoyer',
      seller: 'Vendeur',
      viewProduct: 'Voir le produit',
      today: 'Aujourd\'hui',
      yesterday: 'Hier',
    },
    en: {
      back: 'Messages',
      placeholder: 'Write your message...',
      send: 'Send',
      seller: 'Seller',
      viewProduct: 'View product',
      today: 'Today',
      yesterday: 'Yesterday',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    params.then(({ id }) => setConversationId(id));
  }, [params]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session && conversationId) {
      fetchConversation();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchConversation, 5000);
      return () => clearInterval(interval);
    }
  }, [session, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();

      if (res.ok) {
        setConversation(data.conversation);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message.trim() }),
      });

      if (res.ok) {
        setMessage('');
        fetchConversation();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const otherParticipant = conversation?.participants.find(
    (p) => p._id !== session?.user?.id
  );

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return tr.today;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return tr.yesterday;
    } else {
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Conversation not found</p>
        </main>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/messages`}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                {otherParticipant?.avatar ? (
                  <Image
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-green-600 font-bold">
                    {otherParticipant?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{otherParticipant?.name}</h2>
                {otherParticipant?.role === 'seller' && (
                  <p className="text-xs text-green-600">
                    {otherParticipant.sellerInfo?.storeName || tr.seller}
                  </p>
                )}
              </div>
            </div>

            {/* Product info */}
            {conversation.product && (
              <Link
                href={`/${locale}/products/${conversation.product.slug}`}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="relative w-8 h-8 bg-gray-200 rounded overflow-hidden">
                  {conversation.product.images?.[0] && (
                    <Image
                      src={conversation.product.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  )}
                </div>
                <span className="text-sm text-gray-600 hidden sm:block max-w-[150px] truncate">
                  {conversation.product.name[locale]}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {Object.entries(messageGroups).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              {/* Date header */}
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                  {formatDateHeader(msgs[0].createdAt)}
                </span>
              </div>

              {/* Messages */}
              {msgs.map((msg, index) => {
                const isMe = msg.sender._id === session?.user?.id;
                const showAvatar = !isMe && (index === 0 || msgs[index - 1].sender._id !== msg.sender._id);

                return (
                  <div
                    key={msg._id}
                    className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && showAvatar && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">
                          {msg.sender.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {!isMe && !showAvatar && <div className="w-8 mr-2" />}

                    <div className={`max-w-[75%] ${isMe ? 'order-1' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-green-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tr.placeholder}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={!message.trim() || sending}
              className="w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {sending ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
