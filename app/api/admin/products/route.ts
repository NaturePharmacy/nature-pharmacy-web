import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Settings from '@/models/Settings';

// GET - List all products with admin filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const seller = searchParams.get('seller');
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');

    const query: any = {};

    if (search) {
      query.$or = [
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.es': { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (seller) {
      query.seller = seller;
    }

    if (active !== null && active !== undefined) {
      query.isActive = active === 'true';
    }

    if (featured !== null && featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('seller', 'name email sellerInfo')
        .populate('category', 'name slug')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new product (admin can create for any seller)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const data = await request.json();

    // Validate required fields
    if (!data.name?.fr || !data.name?.en || !data.name?.es) {
      return NextResponse.json(
        { error: 'Name is required in all three languages (FR, EN, ES)' },
        { status: 400 }
      );
    }

    if (!data.description?.fr || !data.description?.en || !data.description?.es) {
      return NextResponse.json(
        { error: 'Description is required in all three languages (FR, EN, ES)' },
        { status: 400 }
      );
    }

    if (!data.seller) {
      return NextResponse.json(
        { error: 'Seller is required' },
        { status: 400 }
      );
    }

    if (!data.category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    if (!data.basePrice || data.basePrice <= 0) {
      return NextResponse.json(
        { error: 'Valid base price is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (data.slug) {
      const existingProduct = await Product.findOne({ slug: data.slug });
      if (existingProduct) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Calculate commission and final price
    const settings = await Settings.findOne();
    const commissionRate = settings?.commissionRate || 10;
    const commission = (data.basePrice * commissionRate) / 100;
    const finalPrice = data.basePrice + commission;

    // Create product with commission
    const productData = {
      ...data,
      commission,
      price: finalPrice,
    };

    const product = await Product.create(productData);

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
