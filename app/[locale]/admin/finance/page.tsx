'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SellerPayout {
  _id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  totalEarned: number;
  totalCommission: number;
  pendingAmount: number;
  ordersCount: number;
}

interface RevenueDay {
  _id: string;
  revenue: number;
  ordersCount: number;
}

interface RecentRefund {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  updatedAt: string;
  buyer?: { name: string; email: string };
}

interface FinanceData {
  totalCommissions: number;
  pendingCommissions: number;
  grossRevenue: number;
  totalRefunds: number;
  refundsCount: number;
  sellerPayouts: SellerPayout[];
  revenueByDay: RevenueDay[];
  recentRefunds: RecentRefund[];
}

export default function AdminFinancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { formatPrice } = useCurrency();

  const [finance, setFinance] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  const fetchFinance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance?period=${period}`);
      const data = await res.json();
      if (res.ok) {
        setFinance(data);
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchFinance();
    }
  }, [session, fetchFinance]);

  const exportCSV = () => {
    if (!finance?.sellerPayouts?.length) return;

    const headers = ['Vendeur', 'Email', 'CA Brut (USD)', 'Commission (USD)', 'Solde disponible (USD)', 'Commandes'];
    const rows = finance.sellerPayouts.map((s) => [
      s.sellerName || 'N/A',
      s.sellerEmail || 'N/A',
      s.totalEarned.toFixed(2),
      s.totalCommission.toFixed(2),
      (s.totalEarned - s.pendingAmount).toFixed(2),
      String(s.ordersCount),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-payouts-${period}j-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-500 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Accès non autorisé</h1>
          <p className="text-gray-500 mt-2">Vous n&apos;avez pas les permissions requises.</p>
        </div>
      </div>
    );
  }

  const statCards = finance
    ? [
        {
          label: 'Total Commissions',
          value: formatPrice(finance.totalCommissions),
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-100',
        },
        {
          label: 'Commissions en attente',
          value: formatPrice(finance.pendingCommissions),
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100',
        },
        {
          label: 'CA Brut',
          value: formatPrice(finance.grossRevenue),
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-100',
        },
        {
          label: 'Remboursements',
          value: formatPrice(finance.totalRefunds),
          sub: `${finance.refundsCount} commande${finance.refundsCount !== 1 ? 's' : ''}`,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-100',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au tableau de bord
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Finance</h1>
            <p className="text-sm text-gray-500 mt-1">Commissions, payouts vendeurs et remboursements</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
            </select>
            {/* Export CSV */}
            <button
              onClick={exportCSV}
              disabled={!finance?.sellerPayouts?.length}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {finance && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`bg-white rounded-xl shadow-sm border ${card.border} p-5`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.bg} mb-3`}>
                  <div className={`w-2 h-2 rounded-full ${card.color.replace('text-', 'bg-')}`} />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                {card.sub && (
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Revenue Chart */}
        {finance && finance.revenueByDay.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Revenu journalier</h2>
            <div className="flex items-end gap-1 h-40">
              {finance.revenueByDay.map((day, i) => {
                const maxRev = Math.max(...finance.revenueByDay.map((d) => d.revenue), 1);
                const heightPct = (day.revenue / maxRev) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full">
                      <div
                        className="w-full bg-green-400 rounded-t hover:bg-green-500 transition-colors cursor-default"
                        style={{ height: `${Math.max(heightPct, 2)}px`, marginTop: `${100 - Math.max(heightPct, 2)}px` }}
                        title={`${day._id}: ${formatPrice(day.revenue)}`}
                      />
                    </div>
                    {finance.revenueByDay.length <= 15 && (
                      <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                        {new Date(day._id).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Seller Payouts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Payouts Vendeurs</h2>
            <span className="text-xs text-gray-400">
              {finance?.sellerPayouts?.length ?? 0} vendeur{(finance?.sellerPayouts?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vendeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    CA Brut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Commission plateforme
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Solde disponible
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finance?.sellerPayouts && finance.sellerPayouts.length > 0 ? (
                  finance.sellerPayouts.map((seller) => {
                    const available = seller.totalEarned - seller.pendingAmount;
                    return (
                      <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {seller.sellerName || <span className="text-gray-400 italic">Inconnu</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {seller.sellerEmail || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          {formatPrice(seller.totalEarned)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                          {formatPrice(seller.totalCommission)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-blue-600">
                          {formatPrice(available)}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-500">
                          {seller.ordersCount}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/${locale}/admin/orders?seller=${seller.sellerId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Voir commandes
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                      Aucune donnée vendeur pour cette période.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Refunds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Remboursements récents</h2>
            <span className="text-xs text-gray-400">
              {finance?.recentRefunds?.length ?? 0} entrée{(finance?.recentRefunds?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {finance?.recentRefunds && finance.recentRefunds.length > 0 ? (
              finance.recentRefunds.map((refund) => (
                <div key={refund._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{refund.orderNumber}</p>
                      {refund.buyer && (
                        <p className="text-xs text-gray-400">{refund.buyer.name} — {refund.buyer.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{formatPrice(refund.totalPrice)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(refund.updatedAt).toLocaleDateString(locale, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-gray-400">
                Aucun remboursement récent.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
