import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Brand from '@/models/Brand';

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

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const active = searchParams.get('active');

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (active !== null && active !== undefined) {
      query.isActive = active === 'true';
    }

    const brands = await Brand.find(query).sort('displayOrder name').lean();

    return NextResponse.json({ brands }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands', details: error.message },
      { status: 500 }
    );
  }
}

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

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    if (!data.slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const existingBrand = await Brand.findOne({ $or: [{ name: data.name }, { slug: data.slug }] });
    if (existingBrand) {
      return NextResponse.json(
        { error: 'A brand with this name or slug already exists' },
        { status: 400 }
      );
    }

    const brand = await Brand.create(data);

    return NextResponse.json(
      { message: 'Brand created successfully', brand },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand', details: error.message },
      { status: 500 }
    );
  }
}
