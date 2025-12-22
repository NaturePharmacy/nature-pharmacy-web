import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Category } from '@/lib/models';

// GET /api/products/seller/[sellerId] - Get all products from a specific seller
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    await connectDB();
    const { sellerId } = await params;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || '-createdAt';

    const query: any = { seller: sellerId, isActive: true };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

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
