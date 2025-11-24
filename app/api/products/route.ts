import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products - Get all products with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isOrganic = searchParams.get('isOrganic');
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query
    const query: any = { isActive: true };

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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (isOrganic === 'true') {
      query.isOrganic = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with field selection for better performance
    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name slug images price compareAtPrice stock rating reviewCount isOrganic category seller')
        .populate('seller', 'name sellerInfo.storeName')
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (sellers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Only sellers can create products.' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      description,
      slug,
      category,
      images,
      price,
      compareAtPrice,
      stock,
      sku,
      weight,
      dimensions,
      isOrganic,
      isFeatured,
      tags,
    } = body;

    // Validation
    if (!name?.fr || !name?.en || !name?.es) {
      return NextResponse.json(
        { error: 'Product name in all languages (FR, EN, ES) is required' },
        { status: 400 }
      );
    }

    if (!description?.fr || !description?.en || !description?.es) {
      return NextResponse.json(
        { error: 'Product description in all languages (FR, EN, ES) is required' },
        { status: 400 }
      );
    }

    if (!category || !images || images.length === 0 || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Category, at least one image, price, and stock are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (slug) {
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      slug: slug || name.en.toLowerCase().replace(/\s+/g, '-'),
      seller: session.user.id,
      category,
      images,
      price,
      compareAtPrice,
      stock,
      sku,
      weight,
      dimensions,
      isOrganic: isOrganic || false,
      isFeatured: isFeatured || false,
      tags: tags || [],
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'name email sellerInfo')
      .populate('category', 'name slug');

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: populatedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
