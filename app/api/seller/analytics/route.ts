import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

// GET /api/seller/analytics - Get seller analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all orders with items from this seller
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.seller': session.user.id,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: '$items.quantity' },
        },
      },
    ]);

    const stats = orders[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      totalItems: 0,
    };

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.seller': session.user.id,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
    ]);

    // Get daily revenue for chart
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.seller': session.user.id,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.seller': session.user.id,
        },
      },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.productName' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Get products with low stock
    const lowStockProducts = await Product.find({
      seller: session.user.id,
      isActive: true,
      stock: { $lte: 10, $gt: 0 },
    })
      .select('name slug images stock')
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    // Get out of stock products
    const outOfStockCount = await Product.countDocuments({
      seller: session.user.id,
      isActive: true,
      stock: 0,
    });

    // Calculate average order value
    const avgOrderValue =
      stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

    // Get previous period stats for comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(
      previousStartDate.getDate() - parseInt(period) * 2
    );
    const previousEndDate = startDate;

    const previousOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lt: previousEndDate },
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.seller': session.user.id,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const previousStats = previousOrders[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    };

    // Calculate growth percentages
    const revenueGrowth =
      previousStats.totalRevenue > 0
        ? ((stats.totalRevenue - previousStats.totalRevenue) /
            previousStats.totalRevenue) *
          100
        : 0;

    const ordersGrowth =
      previousStats.totalOrders > 0
        ? ((stats.totalOrders - previousStats.totalOrders) /
            previousStats.totalOrders) *
          100
        : 0;

    return NextResponse.json({
      overview: {
        totalRevenue: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        totalItems: stats.totalItems,
        avgOrderValue,
        revenueGrowth,
        ordersGrowth,
      },
      ordersByStatus,
      dailyRevenue,
      topProducts,
      lowStockProducts,
      outOfStockCount,
      period: parseInt(period),
    });
  } catch (error: any) {
    console.error('Error fetching seller analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
