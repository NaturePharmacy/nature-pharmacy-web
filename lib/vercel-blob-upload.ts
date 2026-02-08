/**
 * Vercel Blob Storage Upload Utility
 * Used for production deployment on Vercel
 */

import { put, del } from '@vercel/blob';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a single image to Vercel Blob Storage
 */
export async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string,
  folder: string = 'products'
): Promise<UploadResult> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${folder}/${timestamp}-${sanitizedFilename}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      success: true,
      url: blob.url,
    };
  } catch (error: any) {
    console.error('Vercel Blob upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload to Vercel Blob',
    };
  }
}

/**
 * Delete an image from Vercel Blob Storage
 */
export async function deleteFromVercelBlob(imageUrl: string): Promise<boolean> {
  try {
    await del(imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return true;
  } catch (error: any) {
    console.error('Vercel Blob delete error:', error);
    return false;
  }
}
