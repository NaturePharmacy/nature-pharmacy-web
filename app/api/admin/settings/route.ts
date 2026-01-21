import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

// GET - Retrieve store settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get the first (and should be only) settings document
    let settings = await Settings.findOne().lean();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({});
      settings = await Settings.findById(settings._id).lean();
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const data = await request.json();

    // Get the first settings document or create if doesn't exist
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(data);
    } else {
      // Update existing settings
      Object.assign(settings, data);
      await settings.save();
    }

    return NextResponse.json(
      { message: 'Settings updated successfully', settings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
}
