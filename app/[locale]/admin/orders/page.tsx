'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Order {
  _id: string;
  orderNumber: string;
  buyer: { _id: string; name: string; email: string };
  items: Array<{ productName: string; quantity: number; price: number }>;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const t = {
    fr: {
      title: 'Gestion des commandes',
      search: 'Rechercher par numéro...',
      allStatus: 'Tous les statuts',
      pending: 'En attente',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      order: 'Commande',
      customer: 'Client',
      total: 'Total',
      status: 'Statut',
      date: 'Date',
      actions: 'Actions',
      view: 'Voir',
      updateStatus: 'Mettre à jour',
      noOrders: 'Aucune commande trouvée',
      back: 'Retour',
      items: 'articles',
    },
    en: {
      title: 'Order Management',
      search: 'Search by order number...',
      allStatus: 'All statuses',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      order: 'Order',
      customer: 'Customer',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      view: 'View',
      updateStatus: 'Update',
      noOrders: 'No orders found',
      back: 'Back',
      items: 'items',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    }
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchOrders();
    }
  }, [session, filter, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
      });
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-2 inline-flex items-center">
                ← {tr.back}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{tr.title}</h1>
              <p className="text-gray-500 text-sm">{pagination.total} commandes</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={tr.search}
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{tr.allStatus}</option>
              <option value="pending">{tr.pending}</option>
              <option value="processing">{tr.processing}</option>
              <option value="shipped">{tr.shipped}</option>
              <option value="delivered">{tr.delivered}</option>
              <option value="cancelled">{tr.cancelled}</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.order}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.customer}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.total}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.status}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{tr.date}</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">{tr.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {tr.noOrders}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{order.items.length} {tr.items}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.buyer?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{order.buyer?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-green-600">{formatPrice(order.totalPrice)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                          >
                            <option value="pending">{tr.pending}</option>
                            <option value="processing">{tr.processing}</option>
                            <option value="shipped">{tr.shipped}</option>
                            <option value="delivered">{tr.delivered}</option>
                            <option value="cancelled">{tr.cancelled}</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString(locale)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/${locale}/orders/${order._id}`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            {tr.view} →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, page })}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pagination.page
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

          </div>
  );
}
