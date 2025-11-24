import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

// GET /api/sellers/[id] - Get public seller profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Find seller
    const seller = await User.findById(params.id)
      .select('name email sellerInfo createdAt')
      .lean();

    if (!seller || seller.sellerInfo?.status !== 'approved') {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Get seller statistics
    const totalProducts = await Product.countDocuments({
      seller: params.id,
      isActive: true,
    });

    // Get total orders (items sold by this seller)
    const orders = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.seller': seller._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: '$items.price' },
        },
      },
    ]);

    const stats = orders[0] || { totalOrders: 0, totalSales: 0 };

    // Calculate average rating from products
    const ratingAgg = await Product.aggregate([
      { $match: { seller: seller._id, isActive: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' },
        },
      },
    ]);

    const ratingStats = ratingAgg[0] || { avgRating: 0, totalReviews: 0 };

    // Get recent products
    const recentProducts = await Product.find({
      seller: params.id,
      isActive: true,
    })
      .select('name slug images price compareAtPrice rating reviewCount')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.sellerInfo?.storeName,
        description: seller.sellerInfo?.description,
        logo: seller.sellerInfo?.logo,
        banner: seller.sellerInfo?.banner,
        phone: seller.sellerInfo?.phone,
        address: seller.sellerInfo?.address,
        memberSince: seller.createdAt,
      },
      stats: {
        totalProducts,
        totalOrders: stats.totalOrders,
        totalSales: stats.totalSales,
        averageRating: ratingStats.avgRating || 0,
        totalReviews: ratingStats.totalReviews || 0,
      },
      recentProducts,
    });
  } catch (error: any) {
    console.error('Error fetching seller profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller profile' },
      { status: 500 }
    );
  }
}
