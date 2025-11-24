'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Ticket {
  _id: string;
  ticketNumber: string;
  user: {
    name: string;
    email: string;
  };
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    } else {
      fetchTickets();
    }
  }, [session, status, router, locale, filterStatus, filterCategory]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Manage customer support tickets</p>
          </div>
          <Link
            href={`/${locale}/admin`}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_user">Waiting User</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All</option>
              <option value="order">Order Issue</option>
              <option value="product">Product Question</option>
              <option value="payment">Payment Issue</option>
              <option value="shipping">Shipping Issue</option>
              <option value="account">Account Issue</option>
              <option value="technical">Technical Problem</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ticket #</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{ticket.ticketNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{ticket.user.name}</p>
                        <p className="text-sm text-gray-500">{ticket.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">{ticket.subject}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-sm">{ticket.category.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/${locale}/support/${ticket._id}`}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
