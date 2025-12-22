'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

interface Conversation {
  _id: string;
  otherParticipant: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  product?: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
    images: string[];
  };
  lastMessage?: {
    content: string;
    sender: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    fr: {
      title: 'Messages',
      noMessages: 'Aucune conversation',
      noMessagesDesc: 'Commencez à discuter avec un vendeur depuis une page produit.',
      browseProducts: 'Parcourir les produits',
      you: 'Vous',
      about: 'À propos de',
      unread: 'non lu(s)',
    },
    en: {
      title: 'Messages',
      noMessages: 'No conversations',
      noMessagesDesc: 'Start a conversation with a seller from a product page.',
      browseProducts: 'Browse products',
      you: 'You',
      about: 'About',
      unread: 'unread',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();

      if (res.ok) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return locale === 'fr' ? 'Hier' : 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString(locale, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.title}</h1>

          {conversations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{tr.noMessages}</h2>
              <p className="text-gray-500 mb-6">{tr.noMessagesDesc}</p>
              <Link
                href={`/${locale}/products`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                {tr.browseProducts}
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y">
              {conversations.map((conversation) => (
                <Link
                  key={conversation._id}
                  href={`/${locale}/messages/${conversation._id}`}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition ${
                    conversation.unreadCount > 0 ? 'bg-green-50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      {conversation.otherParticipant?.avatar ? (
                        <Image
                          src={conversation.otherParticipant.avatar}
                          alt={conversation.otherParticipant.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-green-600 font-bold text-xl">
                          {conversation.otherParticipant?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conversation.otherParticipant?.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>

                    {conversation.product && (
                      <p className="text-xs text-green-600 mb-1 truncate">
                        {tr.about}: {conversation.product.name[locale]}
                      </p>
                    )}

                    {conversation.lastMessage && (
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conversation.lastMessage.sender === session?.user?.id && (
                          <span className="text-gray-400">{tr.you}: </span>
                        )}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Product thumbnail */}
                  {conversation.product?.images?.[0] && (
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={conversation.product.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

          </div>
  );
}
