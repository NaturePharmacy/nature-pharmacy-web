'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Analytics {
  summary: {
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    commissions?: number;
  };
  salesByDay: Array<{ _id: string; totalSales: number; orderCount: number }>;
  revenueByStatus: Array<{ _id: string; total: number; count: number }>;
  topProducts: Array<{
    _id: string;
    name: { fr: string; en: string; es: string };
    totalSold: number;
    revenue: number;
  }>;
  topSellers: Array<{
    _id: string;
    name: string;
    email: string;
    totalSales: number;
    orderCount: number;
  }>;
  categoryPerformance: Array<{
    _id: string;
    name: { fr: string; en: string; es: string };
    totalSales: number;
    itemsSold: number;
  }>;
}

type TabOption = '7' | '30' | '90' | 'custom';

export default function AdminAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { formatPrice } = useCurrency();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabOption>('30');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const t = {
    fr: {
      title: 'Tableau de bord Analytique',
      summary: 'Résumé',
      totalOrders: 'Commandes totales',
      completedOrders: 'Commandes complétées',
      totalRevenue: 'Revenu total',
      avgOrderValue: 'Valeur moyenne de commande',
      commissions: 'Commissions',
      salesOverTime: 'Ventes dans le temps',
      revenueByStatus: 'Revenu par statut',
      topProducts: 'Produits les plus vendus',
      topSellers: 'Meilleurs vendeurs',
      categoryPerformance: 'Performance par catégorie',
      product: 'Produit',
      sold: 'Vendus',
      revenue: 'Revenu',
      seller: 'Vendeur',
      sales: 'Ventes',
      orders: 'Commandes',
      category: 'Catégorie',
      items: 'Articles',
      loading: 'Chargement...',
      noData: 'Aucune donnée disponible',
      noAccess: 'Accès non autorisé',
      exportCSV: 'Exporter CSV',
      from: 'Du',
      to: 'Au',
      custom: 'Personnalisé',
      backToAdmin: '← Admin',
    },
    en: {
      title: 'Analytics Dashboard',
      summary: 'Summary',
      totalOrders: 'Total Orders',
      completedOrders: 'Completed Orders',
      totalRevenue: 'Total Revenue',
      avgOrderValue: 'Avg Order Value',
      commissions: 'Commissions',
      salesOverTime: 'Sales Over Time',
      revenueByStatus: 'Revenue by Status',
      topProducts: 'Top Products',
      topSellers: 'Top Sellers',
      categoryPerformance: 'Category Performance',
      product: 'Product',
      sold: 'Sold',
      revenue: 'Revenue',
      seller: 'Seller',
      sales: 'Sales',
      orders: 'Orders',
      category: 'Category',
      items: 'Items',
      loading: 'Loading...',
      noData: 'No data available',
      noAccess: 'Access Denied',
      exportCSV: 'Export CSV',
      from: 'From',
      to: 'To',
      custom: 'Custom',
      backToAdmin: '← Admin',
    },
    es: {
      title: 'Panel de Análisis',
      summary: 'Resumen',
      totalOrders: 'Pedidos totales',
      completedOrders: 'Pedidos completados',
      totalRevenue: 'Ingresos totales',
      avgOrderValue: 'Valor medio de pedido',
      commissions: 'Comisiones',
      salesOverTime: 'Ventas en el tiempo',
      revenueByStatus: 'Ingresos por estado',
      topProducts: 'Productos más vendidos',
      topSellers: 'Mejores vendedores',
      categoryPerformance: 'Rendimiento por categoría',
      product: 'Producto',
      sold: 'Vendidos',
      revenue: 'Ingresos',
      seller: 'Vendedor',
      sales: 'Ventas',
      orders: 'Pedidos',
      category: 'Categoría',
      items: 'Artículos',
      loading: 'Cargando...',
      noData: 'No hay datos disponibles',
      noAccess: 'Acceso denegado',
      exportCSV: 'Exportar CSV',
      from: 'Desde',
      to: 'Hasta',
      custom: 'Personalizado',
      backToAdmin: '← Admin',
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeTab, dateFrom, dateTo]);

  const buildUrl = () => {
    if (activeTab === 'custom' && dateFrom && dateTo) {
      return `/api/admin/analytics?startDate=${dateFrom}&endDate=${dateTo}`;
    }
    return `/api/admin/analytics?period=${activeTab}`;
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl());
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Commandes', 'Ventes (USD)'],
      ...(analytics?.salesByDay || []).map((d) => [
        d._id,
        d.orderCount.toString(),
        d.totalSales.toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">{tr.loading}</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{tr.noAccess}</h1>
        </div>
      </div>
    );
  }

  const tabs: { key: TabOption; label: string }[] = [
    { key: '7', label: '7j' },
    { key: '30', label: '30j' },
    { key: '90', label: '90j' },
    { key: 'custom', label: tr.custom },
  ];

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href={`/${locale}/admin`}
              className="text-sm text-green-600 hover:text-green-700 mb-1 inline-block"
            >
              {tr.backToAdmin}
            </a>
            <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Period Tabs */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300 bg-white">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CSV Export */}
            <button
              onClick={exportCSV}
              disabled={!analytics || analytics.salesByDay.length === 0}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {tr.exportCSV}
            </button>
          </div>
        </div>

        {/* Custom date range inputs */}
        {activeTab === 'custom' && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              {tr.from}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="ml-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              {tr.to}
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="ml-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </label>
          </div>
        )}

        {analytics ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">{tr.totalOrders}</div>
                <div className="text-3xl font-bold text-gray-900">
                  {analytics.summary.totalOrders}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">{tr.completedOrders}</div>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.summary.completedOrders}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">{tr.totalRevenue}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(analytics.summary.totalRevenue)}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">{tr.avgOrderValue}</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPrice(analytics.summary.avgOrderValue)}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-1">{tr.commissions}</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatPrice(analytics.summary.commissions ?? 0)}
                </div>
              </div>
            </div>

            {/* Sales Over Time */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{tr.salesOverTime}</h2>
              <div className="overflow-x-auto">
                {analytics.salesByDay.length > 0 ? (
                  <div className="flex items-end gap-2 h-64">
                    {analytics.salesByDay.map((day, index) => {
                      const maxSales = Math.max(
                        ...analytics.salesByDay.map((d) => d.totalSales)
                      );
                      const height = (day.totalSales / maxSales) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-gray-600 mb-1">
                            {day.totalSales.toLocaleString()}
                          </div>
                          <div
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-xs text-gray-500 mt-1 whitespace-nowrap rotate-45 origin-top-left">
                            {new Date(day._id).toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">{tr.noData}</p>
                )}
              </div>
            </div>

            {/* Top Products and Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">{tr.topProducts}</h2>
                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {index + 1}. {product.name[locale]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.totalSold} {tr.sold} •{' '}
                          {formatPrice(product.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{tr.noData}</p>
                  )}
                </div>
              </div>

              {/* Top Sellers */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">{tr.topSellers}</h2>
                <div className="space-y-3">
                  {analytics.topSellers.slice(0, 5).map((seller, index) => (
                    <div key={seller._id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {index + 1}. {seller.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(seller.totalSales)} • {seller.orderCount} {tr.orders}
                        </div>
                      </div>
                    </div>
                  ))}
                  {analytics.topSellers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{tr.noData}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{tr.categoryPerformance}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {tr.category}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {tr.items} {tr.sold}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {tr.revenue}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.categoryPerformance.map((category) => (
                      <tr key={category._id}>
                        <td className="px-4 py-3 text-gray-900">
                          {category.name[locale]}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {category.itemsSold}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatPrice(category.totalSales)}
                        </td>
                      </tr>
                    ))}
                    {analytics.categoryPerformance.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                          {tr.noData}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">{tr.noData}</div>
        )}
      </div>
    </div>
  );
}
