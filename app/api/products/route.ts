import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Category, User } from '@/lib/models';
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
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sort') || 'newest';

    // Nouveaux filtres médecine traditionnelle
    const therapeuticCategory = searchParams.get('therapeuticCategory');
    const form = searchParams.get('form');
    const indication = searchParams.get('indication');
    const certifications = searchParams.get('certifications');
    const safePregnancy = searchParams.get('safePregnancy');
    const safeChildren = searchParams.get('safeChildren');

    // Map sort options to MongoDB sort
    const sortOptions: { [key: string]: any } = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating': { rating: -1, reviewCount: -1 },
      'popular': { reviewCount: -1, rating: -1 },
      'name-asc': { 'name.en': 1 },
      'name-desc': { 'name.en': -1 },
    };
    const sort = sortOptions[sortBy] || sortOptions.newest;

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

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Filtres médecine traditionnelle
    if (therapeuticCategory) {
      query.therapeuticCategory = therapeuticCategory;
    }

    if (form) {
      query.form = form;
    }

    if (indication) {
      // Recherche dans les indications dans toutes les langues
      query.$or = query.$or || [];
      query.$or.push(
        { 'indications.fr': { $regex: indication, $options: 'i' } },
        { 'indications.en': { $regex: indication, $options: 'i' } },
        { 'indications.es': { $regex: indication, $options: 'i' } }
      );
    }

    if (certifications) {
      const certArray = certifications.split(',');
      query.certifications = { $all: certArray };
    }

    if (safePregnancy === 'true') {
      query['warnings.pregnancy'] = { $ne: true };
    }

    if (safeChildren === 'true') {
      query['warnings.children'] = { $ne: true };
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
      basePrice,
      compareAtPrice,
      stock,
      sku,
      weight,
      dimensions,
      isOrganic,
      isFeatured,
      tags,
      // Nouveaux champs médecine traditionnelle
      therapeuticCategory,
      indications,
      traditionalUses,
      contraindications,
      dosage,
      preparationMethod,
      activeIngredients,
      origin,
      harvestMethod,
      certifications,
      form,
      concentration,
      warnings,
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

    // Calculate basePrice and commission if not provided
    const { calculatePriceWithCommission } = await import('@/lib/commission');
    let finalPrice = price;
    let finalBasePrice = basePrice;
    let commission = 0;

    if (basePrice && !price) {
      // Si basePrice fourni mais pas price, calculer le prix avec commission
      const calculated = calculatePriceWithCommission(basePrice);
      finalPrice = calculated.price;
      commission = calculated.commission;
      finalBasePrice = basePrice;
    } else if (price && !basePrice) {
      // Si price fourni mais pas basePrice, c'est l'ancien système
      // On considère que price est le prix final
      finalPrice = price;
      finalBasePrice = price; // Temporaire, à ajuster
      commission = 0;
    } else if (price && basePrice) {
      // Les deux fournis, on les utilise
      finalPrice = price;
      finalBasePrice = basePrice;
      commission = price - basePrice;
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      slug: slug || name.en.toLowerCase().replace(/\s+/g, '-'),
      seller: session.user.id,
      category,
      images,
      basePrice: finalBasePrice,
      price: finalPrice,
      commission,
      compareAtPrice,
      stock,
      sku,
      weight,
      dimensions,
      isOrganic: isOrganic || false,
      isFeatured: isFeatured || false,
      tags: tags || [],
      // Champs médecine traditionnelle
      therapeuticCategory,
      indications,
      traditionalUses,
      contraindications,
      dosage,
      preparationMethod,
      activeIngredients,
      origin,
      harvestMethod,
      certifications: certifications || [],
      form,
      concentration,
      warnings: warnings || {
        pregnancy: false,
        breastfeeding: false,
        children: false,
        prescriptionRequired: false,
      },
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
