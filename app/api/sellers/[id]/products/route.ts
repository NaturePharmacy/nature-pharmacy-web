import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

// GET /api/sellers/[id]/products - Get seller's products
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify seller exists and is approved
    const seller = await User.findById(params.id);
    if (!seller || seller.sellerInfo?.status !== 'approved') {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sort') || 'createdAt';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query: any = {
      seller: params.id,
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.es': { $regex: search, $options: 'i' } },
        { 'description.fr': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.es': { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    const sortOptions: { [key: string]: any } = {
      createdAt: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { rating: -1 },
      popular: { reviewCount: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.createdAt;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller products' },
      { status: 500 }
    );
  }
}
