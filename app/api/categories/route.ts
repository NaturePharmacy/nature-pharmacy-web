import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const parentOnly = searchParams.get('parentOnly') === 'true';

    let query: any = { isActive: true };

    if (parentOnly) {
      query.parent = null;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort('name.en')
      .lean();

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create categories.' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, slug, description, image, icon, parent } = body;

    // Validation
    if (!name?.fr || !name?.en || !name?.es) {
      return NextResponse.json(
        { error: 'Category name in all languages (FR, EN, ES) is required' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    // Create category
    const category = await Category.create({
      name,
      slug,
      description,
      image,
      icon,
      parent: parent || null,
    });

    const populatedCategory = await Category.findById(category._id).populate(
      'parent',
      'name slug'
    );

    return NextResponse.json(
      {
        message: 'Category created successfully',
        category: populatedCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
