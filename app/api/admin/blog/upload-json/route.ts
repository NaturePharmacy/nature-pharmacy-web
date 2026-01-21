import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// POST /api/admin/blog/upload-json - Upload blog article from JSON
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

    const formData = await request.formData();
    const jsonFile = formData.get('json') as File;
    const imageFile = formData.get('image') as File | null;

    if (!jsonFile) {
      return NextResponse.json(
        { error: 'JSON file is required' },
        { status: 400 }
      );
    }

    // Read and parse JSON file
    const jsonText = await jsonFile.text();
    let articleData;

    try {
      articleData = JSON.parse(jsonText);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      );
    }

    // Validation
    if (!articleData.title?.fr || !articleData.title?.en || !articleData.title?.es) {
      return NextResponse.json(
        { error: 'Title in all languages is required in JSON' },
        { status: 400 }
      );
    }

    if (!articleData.slug) {
      return NextResponse.json(
        { error: 'Slug is required in JSON' },
        { status: 400 }
      );
    }

    if (!articleData.content?.fr || !articleData.content?.en || !articleData.content?.es) {
      return NextResponse.json(
        { error: 'Content in all languages is required in JSON' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await Blog.findOne({ slug: articleData.slug });
    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imageUrl = articleData.featuredImage || '';

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      uploadFormData.append('folder', 'nature-pharmacy/blog');

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Featured image is required (either in JSON or as file upload)' },
        { status: 400 }
      );
    }

    // Set author to current user
    articleData.author = session.user.id;
    articleData.featuredImage = imageUrl;

    // Set publishedAt if publishing
    if (articleData.isPublished && !articleData.publishedAt) {
      articleData.publishedAt = new Date();
    }

    // Create default SEO metadata if not provided
    if (!articleData.seo) {
      articleData.seo = {
        metaTitle: articleData.title,
        metaDescription: articleData.excerpt || {
          fr: articleData.content.fr.substring(0, 160),
          en: articleData.content.en.substring(0, 160),
          es: articleData.content.es.substring(0, 160),
        },
        metaKeywords: articleData.tags || [],
        ogImage: imageUrl,
      };
    }

    const article = await Blog.create(articleData);

    const populatedArticle = await Blog.findById(article._id).populate(
      'author',
      'name email avatar'
    );

    return NextResponse.json(
      {
        message: 'Blog article uploaded successfully from JSON',
        article: populatedArticle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error uploading blog article from JSON:', error);
    return NextResponse.json(
      { error: 'Failed to upload blog article', details: error.message },
      { status: 500 }
    );
  }
}
