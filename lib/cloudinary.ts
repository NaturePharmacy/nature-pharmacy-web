import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to delete image from Cloudinary
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Helper function to extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}
