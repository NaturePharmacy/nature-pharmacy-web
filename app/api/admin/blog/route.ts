import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/admin/blog - Get all blog articles
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
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isPublished = searchParams.get('isPublished');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};

    if (search) {
      query.$or = [
        { 'title.fr': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.es': { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (isPublished !== null && isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching blog articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog articles', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create a new blog article
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

    // Validation
    if (!data.title?.fr || !data.title?.en || !data.title?.es) {
      return NextResponse.json(
        { error: 'Title in all languages is required' },
        { status: 400 }
      );
    }

    if (!data.slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    if (!data.content?.fr || !data.content?.en || !data.content?.es) {
      return NextResponse.json(
        { error: 'Content in all languages is required' },
        { status: 400 }
      );
    }

    if (!data.featuredImage) {
      return NextResponse.json(
        { error: 'Featured image is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await Blog.findOne({ slug: data.slug });
    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    // Set author to current user
    data.author = session.user.id;

    // Set publishedAt if publishing
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const article = await Blog.create(data);

    const populatedArticle = await Blog.findById(article._id).populate(
      'author',
      'name email avatar'
    );

    return NextResponse.json(
      { message: 'Blog article created successfully', article: populatedArticle },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating blog article:', error);
    return NextResponse.json(
      { error: 'Failed to create blog article', details: error.message },
      { status: 500 }
    );
  }
}
