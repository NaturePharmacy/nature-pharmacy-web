'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalItems: number;
    avgOrderValue: number;
    revenueGrowth: number;
    ordersGrowth: number;
  };
  ordersByStatus: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  dailyRevenue: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    _id: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
    images: string[];
    stock: number;
  }>;
  outOfStockCount: number;
  period: number;
}

export default function SellerAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user?.role !== 'seller') {
      router.push(`/${locale}`);
    } else {
      fetchAnalytics();
    }
  }, [session, status, router, locale, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/analytics?period=${period}`);
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} CFA`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your sales performance</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(data.overview.totalRevenue)}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  data.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.overview.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(data.overview.revenueGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Orders</p>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {data.overview.totalOrders}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  data.overview.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.overview.ordersGrowth >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(data.overview.ordersGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs previous period</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(data.overview.avgOrderValue)}
            </p>
            <p className="text-sm text-gray-500">
              {data.overview.totalItems} items sold
            </p>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Stock Alerts</p>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {data.lowStockProducts.length}
            </p>
            <p className="text-sm text-gray-500">
              {data.outOfStockCount} out of stock
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="space-y-2">
              {data.dailyRevenue.length > 0 ? (
                <>
                  <div className="flex items-end justify-between h-48 gap-1">
                    {data.dailyRevenue.map((day, index) => {
                      const maxRevenue = Math.max(
                        ...data.dailyRevenue.map((d) => d.revenue)
                      );
                      const height = (day.revenue / maxRevenue) * 100;
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-green-600 rounded-t hover:bg-green-700 transition-colors cursor-pointer relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            <p className="font-bold">{formatCurrency(day.revenue)}</p>
                            <p>{day.orders} orders</p>
                            <p className="text-gray-300">
                              {new Date(day._id).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>
                      {new Date(data.dailyRevenue[0]._id).toLocaleDateString()}
                    </span>
                    <span>
                      {new Date(
                        data.dailyRevenue[data.dailyRevenue.length - 1]._id
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No data available for this period
                </div>
              )}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {data.ordersByStatus.map((status) => (
                <div key={status._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                        status._id
                      )}`}
                    >
                      {status._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{status.count}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(status.revenue)}
                    </p>
                  </div>
                </div>
              ))}
              {data.ordersByStatus.length === 0 && (
                <p className="text-center text-gray-500 py-4">No orders yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {data.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.productName}</p>
                    <p className="text-sm text-gray-500">
                      {product.totalSold} sold
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No sales yet</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/${locale}/seller/products/${product._id}/edit`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale]}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.name[locale]}
                    </p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    Low
                  </span>
                </Link>
              ))}
              {data.lowStockProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  All products have sufficient stock
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
