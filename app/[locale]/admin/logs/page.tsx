'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Log {
  _id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceLabel?: string;
  meta?: Record<string, any>;
  createdAt: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  'product.approve': { label: 'Produit approuvé', color: 'bg-green-100 text-green-700' },
  'product.reject': { label: 'Produit refusé', color: 'bg-red-100 text-red-700' },
  'order.refund_full': { label: 'Remboursement total', color: 'bg-orange-100 text-orange-700' },
  'order.refund_partial': { label: 'Remboursement partiel', color: 'bg-amber-100 text-amber-700' },
  'user.role_change': { label: 'Rôle modifié', color: 'bg-blue-100 text-blue-700' },
  'user.delete': { label: 'Utilisateur supprimé', color: 'bg-red-100 text-red-800' },
  'review.moderate': { label: 'Avis modéré', color: 'bg-purple-100 text-purple-700' },
  'ticket.reply': { label: 'Réponse ticket', color: 'bg-blue-100 text-blue-600' },
};

const RESOURCE_ICONS: Record<string, string> = {
  order: '🛒',
  product: '📦',
  user: '👤',
  ticket: '🎫',
  review: '⭐',
  coupon: '🏷️',
  settings: '⚙️',
};

export default function AdminLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ action: '', resourceType: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`);
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push(`/${locale}`);
  }, [status, session, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') fetchLogs();
  }, [session, filter, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page.toString(), limit: '50' });
      if (filter.action) params.append('action', filter.action);
      if (filter.resourceType) params.append('resourceType', filter.resourceType);
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatMeta = (meta?: Record<string, any>) => {
    if (!meta) return null;
    const parts: string[] = [];
    if (meta.refundAmount) parts.push(`${meta.refundAmount} ${meta.currency || 'USD'}`);
    if (meta.reason) parts.push(`"${meta.reason}"`);
    if (meta.roleBefore) parts.push(`${meta.roleBefore} → ${meta.roleAfter}`);
    return parts.join(' · ') || null;
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
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-1 inline-flex items-center gap-1">
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Logs d'activité</h1>
              <p className="text-gray-500 text-sm">{pagination.total} entrées</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <select
              value={filter.resourceType}
              onChange={(e) => setFilter({ ...filter, resourceType: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Toutes les ressources</option>
              <option value="order">Commandes</option>
              <option value="product">Produits</option>
              <option value="user">Utilisateurs</option>
              <option value="ticket">Tickets</option>
              <option value="review">Avis</option>
            </select>
            <select
              value={filter.action}
              onChange={(e) => setFilter({ ...filter, action: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Toutes les actions</option>
              <option value="product.approve">Approbation produit</option>
              <option value="product.reject">Refus produit</option>
              <option value="order.refund">Remboursement</option>
              <option value="user.role_change">Changement rôle</option>
            </select>
          </div>

          {/* Logs Timeline */}
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                Aucune activité enregistrée
              </div>
            ) : (
              logs.map((log) => {
                const actionInfo = ACTION_LABELS[log.action];
                const icon = RESOURCE_ICONS[log.resourceType] || '🔧';
                const metaStr = formatMeta(log.meta);
                return (
                  <div key={log._id} className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        {actionInfo ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionInfo.color}`}>
                            {actionInfo.label}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {log.action}
                          </span>
                        )}
                        {log.resourceLabel && (
                          <span className="text-sm font-medium text-gray-800 truncate">{log.resourceLabel}</span>
                        )}
                        {metaStr && <span className="text-xs text-gray-500">{metaStr}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        par <span className="font-medium text-gray-600">{log.adminName}</span>
                        <span className="mx-1">·</span>
                        {new Date(log.createdAt).toLocaleString('fr')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">← Préc.</button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {pagination.page} / {pagination.pages}</span>
              <button disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">Suiv. →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
