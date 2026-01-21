import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/blog/[slug] - Get a single blog article by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const article = await Blog.findOne({ slug, isPublished: true }).populate(
      'author',
      'name avatar'
    );

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Increment views
    await article.incrementViews();

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error('Error fetching blog article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog article', details: error.message },
      { status: 500 }
    );
  }
}
