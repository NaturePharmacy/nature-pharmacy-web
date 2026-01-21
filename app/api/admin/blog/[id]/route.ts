import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/admin/blog/[id] - Get a single blog article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    const article = await Blog.findById(id).populate('author', 'name email avatar');

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error('Error fetching blog article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog article', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/[id] - Update a blog article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const data = await request.json();

    const article = await Blog.findById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it already exists
    if (data.slug && data.slug !== article.slug) {
      const existingArticle = await Blog.findOne({ slug: data.slug });
      if (existingArticle) {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Set publishedAt if publishing for the first time
    if (data.isPublished && !article.isPublished && !article.publishedAt) {
      data.publishedAt = new Date();
    }

    // Update article
    Object.assign(article, data);
    await article.save();

    const updatedArticle = await Blog.findById(id).populate(
      'author',
      'name email avatar'
    );

    return NextResponse.json({
      message: 'Blog article updated successfully',
      article: updatedArticle,
    });
  } catch (error: any) {
    console.error('Error updating blog article:', error);
    return NextResponse.json(
      { error: 'Failed to update blog article', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    const article = await Blog.findById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Blog article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog article:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog article', details: error.message },
      { status: 500 }
    );
  }
}
