'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface TicketMessage {
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  senderType: 'user' | 'admin';
  message: string;
  attachments?: string[];
  createdAt: string;
}

interface TicketData {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: TicketMessage[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user) {
      fetchTicket();
    }
  }, [session, status, router, locale, ticketId]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
      } else if (res.status === 404) {
        router.push(`/${locale}/support`);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (res.ok) {
        setMessageText('');
        await fetchTicket();
      } else {
        const data = await res.json();
        alert(data.error || 'Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'waiting_user':
        return 'bg-orange-100 text-orange-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
            <Link
              href={`/${locale}/support`}
              className="text-green-600 hover:text-green-700"
            >
              Back to Support Center
            </Link>
          </div>
        </main>
              </div>
    );
  }

  const canReply = ticket.status !== 'closed' && ticket.status !== 'resolved';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href={`/${locale}/support`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Support Center
          </Link>

          {/* Ticket Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    #{ticket.ticketNumber}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {ticket.subject}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize">📁 {ticket.category}</span>
                  <span>⚡ {ticket.priority}</span>
                  <span>🕐 {new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {ticket.assignedTo && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Assigned to: <span className="font-medium text-gray-900">{ticket.assignedTo.name}</span>
                </p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-6">
            {ticket.messages.map((message, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  message.senderType === 'admin' ? 'border-l-4 border-green-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        message.senderType === 'admin' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                    >
                      {message.sender.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {message.sender.name}
                        {message.senderType === 'admin' && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Support Team
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.attachments.map((attachment, i) => (
                      <a
                        key={i}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                      >
                        📎 Attachment {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reply Form */}
          {canReply ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Reply</h2>
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">
                This ticket is {ticket.status}. You cannot add new messages.
              </p>
            </div>
          )}
        </div>
      </main>

          </div>
  );
}
