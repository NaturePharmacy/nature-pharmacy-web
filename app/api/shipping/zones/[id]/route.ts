import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ShippingZone from '@/models/ShippingZone';

// GET /api/shipping/zones/[id] - Get single shipping zone
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
await connectDB();

    const zone = await ShippingZone.findById(id).lean();

    if (!zone) {
      return NextResponse.json(
        { error: 'Shipping zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ zone });
  } catch (error: any) {
    console.error('Error fetching shipping zone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping zone' },
      { status: 500 }
    );
  }
}

// PUT /api/shipping/zones/[id] - Update shipping zone (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();

    const zone = await ShippingZone.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!zone) {
      return NextResponse.json(
        { error: 'Shipping zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Shipping zone updated successfully',
      zone,
    });
  } catch (error: any) {
    console.error('Error updating shipping zone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update shipping zone' },
      { status: 500 }
    );
  }
}

// DELETE /api/shipping/zones/[id] - Delete shipping zone (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const zone = await ShippingZone.findByIdAndDelete(id);

    if (!zone) {
      return NextResponse.json(
        { error: 'Shipping zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Shipping zone deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting shipping zone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete shipping zone' },
      { status: 500 }
    );
  }
}
