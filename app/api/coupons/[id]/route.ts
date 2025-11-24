import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

// GET /api/coupons/[id] - Get single coupon (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const coupon = await Coupon.findById(params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

// PUT /api/coupons/[id] - Update coupon (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    // Don't allow changing usage count manually
    delete data.usageCount;

    const coupon = await Coupon.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE /api/coupons/[id] - Delete coupon (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const coupon = await Coupon.findByIdAndDelete(params.id);

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
