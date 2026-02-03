import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { applySecurityHeaders } from './lib/security';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Apply intl middleware first for locale handling
  let response = intlMiddleware(request);

  // Only apply password protection if SITE_PASSWORD is configured
  const sitePassword = process.env.SITE_PASSWORD;

  // If site password is set, check authentication
  if (sitePassword) {
    // Allow access to the client-access page
    if (pathname.includes('/client-access')) {
      response = applySecurityHeaders(response, { csp: false });
      return response;
    }

    // Check if the user has the client_access cookie
    const clientAccessCookie = request.cookies.get('client_access');

    if (clientAccessCookie?.value !== 'verified') {
      // User is not authenticated, redirect to client-access page
      const localeMatch = pathname.match(/^\/(fr|en|es)(\/|$)/);
      const locale = localeMatch ? localeMatch[1] : 'fr';

      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/client-access`;

      response = NextResponse.redirect(url);
    }
  }

  // Apply security headers to all responses
  response = applySecurityHeaders(response, { csp: false });

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
