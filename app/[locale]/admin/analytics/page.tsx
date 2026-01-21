'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface Analytics {
  summary: {
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
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

export default function AdminAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  const t = {
    fr: {
      title: 'Tableau de bord Analytique',
      period: 'Période',
      last7days: 'Les 7 derniers jours',
      last30days: 'Les 30 derniers jours',
      last90days: 'Les 90 derniers jours',
      summary: 'Résumé',
      totalOrders: 'Commandes totales',
      completedOrders: 'Commandes complétées',
      totalRevenue: 'Revenu total',
      avgOrderValue: 'Valeur moyenne de commande',
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
    },
    en: {
      title: 'Analytics Dashboard',
      period: 'Period',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      last90days: 'Last 90 days',
      summary: 'Summary',
      totalOrders: 'Total Orders',
      completedOrders: 'Completed Orders',
      totalRevenue: 'Total Revenue',
      avgOrderValue: 'Avg Order Value',
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
  }, [session, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{tr.title}</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="7">{tr.last7days}</option>
          <option value="30">{tr.last30days}</option>
          <option value="90">{tr.last90days}</option>
        </select>
      </div>

      {analytics ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">{tr.totalOrders}</div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.summary.totalOrders}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">{tr.completedOrders}</div>
              <div className="text-3xl font-bold text-green-600">
                {analytics.summary.completedOrders}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">{tr.totalRevenue}</div>
              <div className="text-3xl font-bold text-blue-600">
                {analytics.summary.totalRevenue.toLocaleString()} CFA
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">{tr.avgOrderValue}</div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(analytics.summary.avgOrderValue).toLocaleString()} CFA
              </div>
            </div>
          </div>

          {/* Sales Over Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{tr.salesOverTime}</h2>
            <div className="overflow-x-auto">
              {analytics.salesByDay.length > 0 ? (
                <div className="flex items-end gap-2 h-64">
                  {analytics.salesByDay.map((day, index) => {
                    const maxSales = Math.max(...analytics.salesByDay.map((d) => d.totalSales));
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

          {/* Top Products and Category Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{tr.topProducts}</h2>
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {index + 1}. {product.name[locale]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.totalSold} {tr.sold} • {product.revenue.toLocaleString()} CFA
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{tr.topSellers}</h2>
              <div className="space-y-3">
                {analytics.topSellers.slice(0, 5).map((seller, index) => (
                  <div key={seller._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {index + 1}. {seller.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {seller.totalSales.toLocaleString()} CFA • {seller.orderCount} {tr.orders}
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
          <div className="bg-white rounded-lg shadow-md p-6">
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
                      <td className="px-4 py-3 text-gray-900">{category.name[locale]}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {category.itemsSold}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {category.totalSales.toLocaleString()} CFA
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
  );
}
