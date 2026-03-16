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
  paymentMethod: string;
  paymentDetails?: { paypalCaptureId?: string; currency?: string };
  createdAt: string;
}

interface RefundModal {
  open: boolean;
  order: Order | null;
  amount: string;
  reason: string;
  loading: boolean;
  error: string;
  success: string;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '', paymentStatus: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [refundModal, setRefundModal] = useState<RefundModal>({
    open: false,
    order: null,
    amount: '',
    reason: '',
    loading: false,
    error: '',
    success: '',
  });
  const [toast, setToast] = useState('');

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentStatusColors: Record<string, string> = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    refunded: 'text-orange-600',
    failed: 'text-red-600',
    cancelled: 'text-gray-500',
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`);
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push(`/${locale}`);
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') fetchOrders();
  }, [session, filter, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page.toString(), limit: '15' });
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);
      if (filter.paymentStatus) params.append('paymentStatus', filter.paymentStatus);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  const openRefund = (order: Order) => {
    setRefundModal({
      open: true,
      order,
      amount: order.totalPrice.toFixed(2),
      reason: '',
      loading: false,
      error: '',
      success: '',
    });
  };

  const closeRefund = () =>
    setRefundModal({ open: false, order: null, amount: '', reason: '', loading: false, error: '', success: '' });

  const handleRefund = async () => {
    if (!refundModal.order) return;
    setRefundModal((m) => ({ ...m, loading: true, error: '', success: '' }));

    const res = await fetch(`/api/admin/orders/${refundModal.order._id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: refundModal.amount, reason: refundModal.reason }),
    });
    const data = await res.json();

    if (res.ok) {
      setRefundModal((m) => ({ ...m, loading: false, success: `Remboursement effectué (ID: ${data.refundId})` }));
      showToast('Remboursement effectué avec succès');
      fetchOrders();
      setTimeout(closeRefund, 2500);
    } else {
      setRefundModal((m) => ({ ...m, loading: false, error: data.error || 'Erreur lors du remboursement' }));
    }
  };

  const exportCSV = () => {
    const rows = [
      ['N° Commande', 'Client', 'Email', 'Total (USD)', 'Statut', 'Paiement', 'Date'],
      ...orders.map((o) => [
        o.orderNumber,
        o.buyer?.name || '',
        o.buyer?.email || '',
        o.totalPrice.toFixed(2),
        o.status,
        o.paymentStatus,
        new Date(o.createdAt).toLocaleDateString('fr'),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium animate-fade-in">
          {toast}
        </div>
      )}

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-1 inline-flex items-center gap-1">
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
              <p className="text-gray-500 text-sm">{pagination.total} commandes</p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter CSV
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Rechercher par N° commande..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
            <select
              value={filter.paymentStatus}
              onChange={(e) => setFilter({ ...filter, paymentStatus: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Tous paiements</option>
              <option value="paid">Payée</option>
              <option value="pending">En attente</option>
              <option value="refunded">Remboursée</option>
              <option value="failed">Échouée</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commande</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paiement</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-400">Aucune commande trouvée</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-gray-400">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800 text-sm">{order.buyer?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{order.buyer?.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-green-600">{formatPrice(order.totalPrice)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                          >
                            <option value="pending">En attente</option>
                            <option value="processing">En cours</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium capitalize ${paymentStatusColors[order.paymentStatus] || 'text-gray-500'}`}>
                            {order.paymentStatus === 'paid' ? 'Payée' :
                             order.paymentStatus === 'pending' ? 'En attente' :
                             order.paymentStatus === 'refunded' ? 'Remboursée' :
                             order.paymentStatus === 'failed' ? 'Échouée' :
                             order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr')}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.paymentStatus === 'paid' && order.paymentMethod === 'paypal' && (
                              <button
                                onClick={() => openRefund(order)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors font-medium"
                              >
                                Rembourser
                              </button>
                            )}
                            <Link
                              href={`/${locale}/orders/${order._id}`}
                              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                            >
                              Voir →
                            </Link>
                          </div>
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
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  ← Préc.
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                  const p = pagination.pages <= 7 ? i + 1 :
                    pagination.page <= 4 ? i + 1 :
                    pagination.page >= pagination.pages - 3 ? pagination.pages - 6 + i :
                    pagination.page - 3 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPagination({ ...pagination, page: p })}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  Suiv. →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Refund Modal */}
      {refundModal.open && refundModal.order && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">Rembourser la commande</h2>
              <p className="text-sm text-gray-500 mt-1">{refundModal.order.orderNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              {refundModal.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {refundModal.error}
                </div>
              )}
              {refundModal.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  {refundModal.success}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant à rembourser (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={refundModal.order.totalPrice}
                  value={refundModal.amount}
                  onChange={(e) => setRefundModal((m) => ({ ...m, amount: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Total payé : {formatPrice(refundModal.order.totalPrice)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison (visible par le client)
                </label>
                <textarea
                  rows={3}
                  value={refundModal.reason}
                  onChange={(e) => setRefundModal((m) => ({ ...m, reason: e.target.value }))}
                  placeholder="Ex: Produit non conforme à la description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Cette action déclenchera un remboursement PayPal irréversible et mettra la commande au statut "Annulée".
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={closeRefund}
                disabled={refundModal.loading}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRefund}
                disabled={refundModal.loading || !!refundModal.success}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {refundModal.loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Confirmer le remboursement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
