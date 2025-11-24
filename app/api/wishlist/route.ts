import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({ user: session.user.id }).populate({
      path: 'products',
      select: 'name slug images price compareAtPrice stock rating reviewCount isOrganic category seller',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'seller', select: 'name sellerInfo.storeName' },
      ],
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: session.user.id,
        products: [],
      });
    }

    return NextResponse.json({
      wishlist,
      count: wishlist.products.length,
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    let wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      // Create new wishlist
      wishlist = await Wishlist.create({
        user: session.user.id,
        products: [productId],
      });
    } else {
      // Check if product already in wishlist
      if (wishlist.products.includes(productId)) {
        return NextResponse.json(
          { error: 'Product already in wishlist' },
          { status: 400 }
        );
      }

      // Add product to wishlist
      wishlist.products.push(productId);
      await wishlist.save();
    }

    return NextResponse.json({
      message: 'Product added to wishlist',
      count: wishlist.products.length,
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    return NextResponse.json({
      message: 'Product removed from wishlist',
      count: wishlist.products.length,
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
