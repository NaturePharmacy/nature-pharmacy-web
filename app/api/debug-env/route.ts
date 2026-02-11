import { NextResponse } from 'next/server';

// Temporary diagnostic endpoint - DELETE after debugging
export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return NextResponse.json({
    hasBlobToken: !!token,
    tokenLength: token?.length || 0,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasSmtpHost: !!process.env.SMTP_HOST,
  });
}
