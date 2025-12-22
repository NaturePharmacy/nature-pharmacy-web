import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Check if user is already a seller
    if (session.user.role === 'seller') {
      return NextResponse.json(
        { error: 'You are already a seller.' },
        { status: 400 }
      );
    }

    await connectDB();

    const { storeName, storeDescription, phone, address } = await request.json();

    // Validate required fields
    if (!storeName || !storeDescription || !phone) {
      return NextResponse.json(
        { error: 'Store name, description, and phone are required.' },
        { status: 400 }
      );
    }

    if (!address || !address.street || !address.city || !address.country) {
      return NextResponse.json(
        { error: 'Complete address is required (street, city, country).' },
        { status: 400 }
      );
    }

    // Update user to seller role with seller info
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        role: 'seller',
        phone,
        address: {
          street: address.street,
          city: address.city,
          state: address.state || '',
          country: address.country,
          postalCode: address.postalCode || '',
        },
        sellerInfo: {
          storeName,
          storeDescription,
          verified: false,
          rating: 0,
          totalSales: 0,
        },
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Successfully upgraded to seller account!',
      user: updatedUser,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error upgrading to seller:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade to seller' },
      { status: 500 }
    );
  }
}
