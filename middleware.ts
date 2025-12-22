import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply password protection if SITE_PASSWORD is configured
  const sitePassword = process.env.SITE_PASSWORD;

  // If no site password is set, allow all traffic (password protection disabled)
  if (!sitePassword) {
    return NextResponse.next();
  }

  // Get the pathname
  const { pathname } = request.nextUrl;

  // Allow access to the client-access page and API route
  if (
    pathname.includes('/client-access') ||
    pathname.startsWith('/api/auth/client-verify') ||
    pathname.startsWith('/_next') || // Allow Next.js assets
    pathname.startsWith('/favicon.ico') || // Allow favicon
    pathname.startsWith('/images/') // Allow images
  ) {
    return NextResponse.next();
  }

  // Check if the user has the client_access cookie
  const clientAccessCookie = request.cookies.get('client_access');

  if (clientAccessCookie?.value === 'verified') {
    // User is authenticated, allow access
    return NextResponse.next();
  }

  // User is not authenticated, redirect to client-access page
  // Extract locale from pathname if present
  const localeMatch = pathname.match(/^\/(fr|en|es)\//);
  const locale = localeMatch ? localeMatch[1] : 'fr';

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/client-access`;

  return NextResponse.redirect(url);
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
