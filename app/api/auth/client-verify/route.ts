import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Get the site password from environment variables
    const sitePassword = process.env.SITE_PASSWORD;

    // If no site password is configured, allow access (production mode disabled)
    if (!sitePassword) {
      return NextResponse.json({ success: true });
    }

    // Verify the password
    if (password === sitePassword) {
      // Create response with success
      const response = NextResponse.json({ success: true });

      // Set a cookie to remember authentication
      // Cookie expires in 7 days
      response.cookies.set('client_access', 'verified', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Invalid password
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Client verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
