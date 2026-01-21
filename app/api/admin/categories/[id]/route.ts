import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

// GET - Get a single category by ID
export async function GET(
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

    const category = await Category.findById(id).populate('parent', 'name slug').lean();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a category
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

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // If updating slug, check if new slug is unique
    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug: data.slug });
      if (existingCategory) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // If updating parent, verify it exists and prevent circular references
    if (data.parent) {
      if (data.parent === id) {
        return NextResponse.json(
          { error: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }

      const parentCategory = await Category.findById(data.parent);
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 400 }
        );
      }

      // Check if the new parent is a descendant of this category
      let currentParent = parentCategory.parent;
      while (currentParent) {
        if (currentParent.toString() === id) {
          return NextResponse.json(
            { error: 'Cannot set a descendant category as parent (circular reference)' },
            { status: 400 }
          );
        }
        const parent = await Category.findById(currentParent);
        currentParent = parent?.parent;
      }
    }

    // Update category
    Object.assign(category, data);
    await category.save();

    const updatedCategory = await Category.findById(id).populate('parent', 'name slug').lean();

    return NextResponse.json(
      { message: 'Category updated successfully', category: updatedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
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

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parent: id });
    if (subcategories > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.' },
        { status: 400 }
      );
    }

    // Check if category has products
    const products = await Product.countDocuments({ category: id });
    if (products > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${products} product(s). Please reassign or delete products first.` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    );
  }
}
