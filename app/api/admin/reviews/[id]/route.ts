import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

// PUT - Moderate a review (approve/reject)
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

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Update moderation fields
    if (data.status) {
      review.status = data.status;
      review.moderatedBy = session.user.id;
      review.moderatedAt = new Date();
    }

    if (data.moderationNote !== undefined) {
      review.moderationNote = data.moderationNote;
    }

    if (data.isFlagged !== undefined) {
      review.isFlagged = data.isFlagged;
    }

    if (data.flagReason !== undefined) {
      review.flagReason = data.flagReason;
    }

    await review.save();

    const updatedReview = await Review.findById(id)
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .populate('moderatedBy', 'name email')
      .lean();

    return NextResponse.json(
      { message: 'Review updated successfully', review: updatedReview },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
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

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review', details: error.message },
      { status: 500 }
    );
  }
}
