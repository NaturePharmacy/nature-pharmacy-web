import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';

// GET /api/products/[id]/reviews - Récupérer les avis d'un produit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'recent'; // recent, helpful, highest, lowest

    const skip = (page - 1) * limit;

    // Définir le tri
    let sortOption: any = { createdAt: -1 };
    if (sort === 'helpful') sortOption = { helpfulCount: -1, createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };

    const [reviews, total] = await Promise.all([
      Review.find({ product: id })
        .populate('user', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ product: id })
    ]);

    // Calculer les statistiques des avis
    const stats = await Review.aggregate([
      { $match: { product: new (require('mongoose').Types.ObjectId)(id) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        }
      }
    ]);

    const reviewStats = stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      rating5: 0,
      rating4: 0,
      rating3: 0,
      rating2: 0,
      rating1: 0,
    };

    return NextResponse.json({
      reviews,
      stats: reviewStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Ajouter un avis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id: productId } = await params;
    const { rating, title, comment, images } = await request.json();

    // Validation
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await Review.findOne({
      product: productId,
      user: session.user.id
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a acheté le produit (achat vérifié)
    const hasOrdered = await Order.findOne({
      user: session.user.id,
      'items.product': productId,
      status: { $in: ['delivered', 'shipped'] }
    });

    // Trouver une commande pour associer l'avis (optionnel si pas d'achat)
    let orderId = null;
    if (hasOrdered) {
      orderId = hasOrdered._id;
    }

    // Créer l'avis
    const review = await Review.create({
      product: productId,
      user: session.user.id,
      order: orderId,
      rating,
      title: title || '',
      comment,
      images: images || [],
      isVerifiedPurchase: !!hasOrdered,
    });

    // Mettre à jour la note moyenne du produit
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    // Récupérer l'avis avec les infos utilisateur
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    return NextResponse.json({
      message: 'Review added successfully',
      review: populatedReview
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
