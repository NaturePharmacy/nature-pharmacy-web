import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToBluehost } from '@/lib/bluehost-upload';
import sharp from 'sharp';

// POST /api/upload - Upload image to Bluehost
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image with sharp (resize, compress, convert to WebP)
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate optimized filename
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const optimizedFilename = `${originalName}.webp`;

    // Upload to Bluehost via SFTP
    const result = await uploadToBluehost(optimizedBuffer, optimizedFilename, folder);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload image to Bluehost' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.url,
      publicId: result.url, // Use URL as publicId for consistency
      width: 1200,
      height: 1200,
      format: 'webp',
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Bluehost
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('publicId'); // Now using URL instead of publicId

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Delete from Bluehost
    const { deleteFromBluehost } = await import('@/lib/bluehost-upload');
    const success = await deleteFromBluehost(imageUrl);

    if (success) {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
