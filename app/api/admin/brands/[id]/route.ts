import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Brand from '@/models/Brand';

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

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    if (data.slug && data.slug !== brand.slug) {
      const existingBrand = await Brand.findOne({ slug: data.slug });
      if (existingBrand) {
        return NextResponse.json(
          { error: 'A brand with this slug already exists' },
          { status: 400 }
        );
      }
    }

    if (data.name && data.name !== brand.name) {
      const existingBrand = await Brand.findOne({ name: data.name });
      if (existingBrand) {
        return NextResponse.json(
          { error: 'A brand with this name already exists' },
          { status: 400 }
        );
      }
    }

    Object.assign(brand, data);
    await brand.save();

    return NextResponse.json(
      { message: 'Brand updated successfully', brand },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand', details: error.message },
      { status: 500 }
    );
  }
}

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

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    await Brand.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Brand deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand', details: error.message },
      { status: 500 }
    );
  }
}
