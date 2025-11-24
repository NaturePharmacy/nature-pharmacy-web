import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET /api/search/suggestions - Get search suggestions
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (query.length < 2) {
      return NextResponse.json({ products: [], categories: [] });
    }

    // Search products
    const products = await Product.find({
      isActive: true,
      $or: [
        { 'name.fr': { $regex: query, $options: 'i' } },
        { 'name.en': { $regex: query, $options: 'i' } },
        { 'name.es': { $regex: query, $options: 'i' } },
      ],
    })
      .select('name slug images price')
      .limit(limit)
      .lean();

    // Search categories
    const categories = await Category.find({
      $or: [
        { 'name.fr': { $regex: query, $options: 'i' } },
        { 'name.en': { $regex: query, $options: 'i' } },
        { 'name.es': { $regex: query, $options: 'i' } },
      ],
    })
      .select('name slug')
      .limit(3)
      .lean();

    return NextResponse.json({
      products,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
