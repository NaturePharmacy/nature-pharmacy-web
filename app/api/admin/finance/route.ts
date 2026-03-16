import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const period = parseInt(searchParams.get('period') || '30', 10);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - period);

    // 1. Total commissions earned (paid orders in period)
    const totalCommissionsResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$items.commission', '$items.quantity'] } },
        },
      },
    ]);
    const totalCommissions = totalCommissionsResult[0]?.total || 0;

    // 2. Pending commissions (processing or shipped — not yet delivered/confirmed)
    const pendingCommissionsResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ['processing', 'shipped'] },
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$items.commission', '$items.quantity'] } },
        },
      },
    ]);
    const pendingCommissions = pendingCommissionsResult[0]?.total || 0;

    // 3. Seller payouts: per-seller aggregation
    const sellerPayouts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'users',
          localField: 'items.seller',
          foreignField: '_id',
          as: 'sellerInfo',
        },
      },
      { $unwind: { path: '$sellerInfo', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: '$items.seller',
          sellerName: { $first: '$sellerInfo.name' },
          sellerEmail: { $first: '$sellerInfo.email' },
          totalEarned: {
            $sum: {
              $multiply: ['$items.basePrice', '$items.quantity'],
            },
          },
          totalCommission: {
            $sum: {
              $multiply: ['$items.commission', '$items.quantity'],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [
                { $in: ['$status', ['processing', 'shipped']] },
                { $multiply: ['$items.basePrice', '$items.quantity'] },
                0,
              ],
            },
          },
          ordersCount: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          sellerId: '$_id',
          sellerName: 1,
          sellerEmail: 1,
          totalEarned: 1,
          totalCommission: 1,
          pendingAmount: 1,
          ordersCount: { $size: '$ordersCount' },
        },
      },
      { $sort: { totalEarned: -1 } },
    ]);

    // 4. Revenue by day for chart
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Recent refunds (last 10)
    const recentRefunds = await Order.find({ paymentStatus: 'refunded' })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('orderNumber totalPrice paymentDetails.refundedAt updatedAt buyer')
      .populate('buyer', 'name email')
      .lean();

    // Gross revenue (all paid orders in period)
    const grossRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);
    const grossRevenue = grossRevenueResult[0]?.total || 0;

    // Total refunded amount in period
    const totalRefundsResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'refunded',
          updatedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);
    const totalRefunds = totalRefundsResult[0]?.total || 0;
    const refundsCount = totalRefundsResult[0]?.count || 0;

    return NextResponse.json({
      totalCommissions,
      pendingCommissions,
      grossRevenue,
      totalRefunds,
      refundsCount,
      sellerPayouts,
      revenueByDay,
      recentRefunds,
    });
  } catch (error: any) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch finance data' },
      { status: 500 }
    );
  }
}
