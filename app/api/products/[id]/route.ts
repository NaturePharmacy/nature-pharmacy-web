import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Category, User } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id)
      .populate('seller', 'name email avatar sellerInfo')
      .populate('category', 'name slug icon');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (seller/admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user is the seller or admin
    if (
      session.user.role !== 'admin' &&
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only update your own products.' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate('seller', 'name email sellerInfo')
      .populate('category', 'name slug');

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (seller/admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user is the seller or admin
    if (
      session.user.role !== 'admin' &&
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own products.' },
        { status: 403 }
      );
    }

    // Soft delete by setting isActive to false
    await Product.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
