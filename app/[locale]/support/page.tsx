'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  lastResponseAt?: string;
}

export default function SupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    subject: '',
    category: 'other',
    priority: 'medium',
    message: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user) {
      fetchTickets();
    }
  }, [session, status, router, locale, filterStatus]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/support/${data.ticket._id}`);
      } else {
        const data = await res.json();
        alert(data.error || 'Error creating ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket');
    } finally {
      setLoading(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">Get help with your questions and issues</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ New Ticket'}
            </button>
          </div>

          {/* Create Ticket Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="order">Order Issue</option>
                      <option value="product">Product Question</option>
                      <option value="payment">Payment Issue</option>
                      <option value="shipping">Shipping Issue</option>
                      <option value="account">Account Issue</option>
                      <option value="technical">Technical Problem</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority *</label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Ticket'}
                </button>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === ''
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('open')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'open'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'in_progress'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'resolved'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  href={`/${locale}/support/${ticket._id}`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-gray-500">
                          #{ticket.ticketNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="capitalize">📁 {ticket.category}</span>
                        <span>🕐 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.lastResponseAt && (
                          <span>💬 Last response: {new Date(ticket.lastResponseAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">No tickets found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Your First Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
