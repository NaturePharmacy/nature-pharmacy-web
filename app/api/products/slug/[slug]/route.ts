import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';

// GET /api/products/slug/[slug] - Récupérer un produit par son slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .populate('seller', 'name sellerInfo.storeName sellerInfo.rating sellerInfo.verified');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Récupérer les produits similaires (même catégorie)
    const similarProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug price compareAtPrice images rating reviewCount isOrganic');

    return NextResponse.json({
      product,
      similarProducts,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
