/**
 * Bluehost SFTP Upload Utility
 * Handles image uploads to Bluehost hosting via SFTP
 */

import SftpClient from 'ssh2-sftp-client';
import { Buffer } from 'buffer';

// SFTP Configuration from environment variables
const SFTP_CONFIG = {
  host: process.env.BLUEHOST_SFTP_HOST || '',
  port: parseInt(process.env.BLUEHOST_SFTP_PORT || '22'),
  username: process.env.BLUEHOST_SFTP_USERNAME || '',
  password: process.env.BLUEHOST_SFTP_PASSWORD || '',
};

// Base URL where images will be publicly accessible
const PUBLIC_BASE_URL = process.env.BLUEHOST_PUBLIC_URL || '';

// Remote directory on Bluehost where images are stored
const REMOTE_UPLOAD_DIR = process.env.BLUEHOST_UPLOAD_DIR || '/public_html/uploads';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a single image to Bluehost via SFTP
 */
export async function uploadToBluehost(
  buffer: Buffer,
  filename: string,
  folder: string = 'products'
): Promise<UploadResult> {
  const sftp = new SftpClient();

  try {
    // Validate configuration
    if (!SFTP_CONFIG.host || !SFTP_CONFIG.username || !SFTP_CONFIG.password) {
      throw new Error('Bluehost SFTP credentials are not configured. Please check your .env.local file.');
    }

    if (!PUBLIC_BASE_URL) {
      throw new Error('BLUEHOST_PUBLIC_URL is not configured. Please check your .env.local file.');
    }

    // Connect to SFTP
    await sftp.connect(SFTP_CONFIG);

    // Create directory structure if it doesn't exist
    const remoteFolderPath = `${REMOTE_UPLOAD_DIR}/${folder}`;
    await sftp.mkdir(remoteFolderPath, true);

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
    const remotePath = `${remoteFolderPath}/${uniqueFilename}`;

    // Upload the file
    await sftp.put(buffer, remotePath);

    // Construct public URL
    const publicUrl = `${PUBLIC_BASE_URL}/uploads/${folder}/${uniqueFilename}`;

    await sftp.end();

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Bluehost upload error:', error);

    // Attempt to close connection if still open
    try {
      await sftp.end();
    } catch (closeError) {
      // Ignore close errors
    }

    return {
      success: false,
      error: error.message || 'Failed to upload to Bluehost',
    };
  }
}

/**
 * Upload multiple images to Bluehost
 */
export async function uploadMultipleToBluehost(
  files: Array<{ buffer: Buffer; filename: string }>,
  folder: string = 'products'
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadToBluehost(file.buffer, file.filename, folder);
    results.push(result);
  }

  return results;
}

/**
 * Delete an image from Bluehost
 */
export async function deleteFromBluehost(imageUrl: string): Promise<boolean> {
  const sftp = new SftpClient();

  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/uploads/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid image URL format');
    }

    const remotePath = `${REMOTE_UPLOAD_DIR}/${urlParts[1]}`;

    // Connect and delete
    await sftp.connect(SFTP_CONFIG);
    await sftp.delete(remotePath);
    await sftp.end();

    return true;
  } catch (error: any) {
    console.error('Bluehost delete error:', error);

    try {
      await sftp.end();
    } catch (closeError) {
      // Ignore close errors
    }

    return false;
  }
}

/**
 * Test SFTP connection to Bluehost
 */
export async function testBluehostConnection(): Promise<{ success: boolean; message: string }> {
  const sftp = new SftpClient();

  try {
    await sftp.connect(SFTP_CONFIG);
    await sftp.end();

    return {
      success: true,
      message: 'Successfully connected to Bluehost SFTP',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to connect to Bluehost',
    };
  }
}
