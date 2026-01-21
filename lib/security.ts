import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Security headers for all responses
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (limit browser features)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',

  // Strict Transport Security (force HTTPS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

/**
 * Content Security Policy (CSP)
 * Protects against XSS and injection attacks
 */
export function getCSPHeader(nonce: string): string {
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.googletagmanager.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    `img-src 'self' data: https: blob:`,
    `connect-src 'self' https://api.stripe.com https://www.paypal.com https://www.google-analytics.com`,
    `frame-src 'self' https://js.stripe.com https://www.paypal.com`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return cspDirectives.join('; ');
}

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  options: {
    csp?: boolean;
    nonce?: string;
  } = {}
): NextResponse {
  // Apply standard security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply CSP if enabled
  if (options.csp) {
    const nonce = options.nonce || generateNonce();
    response.headers.set('Content-Security-Policy', getCSPHeader(nonce));
  }

  return response;
}

/**
 * Input sanitization
 */
export class Sanitizer {
  /**
   * Remove HTML tags and dangerous characters
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Sanitize email address
   */
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize MongoDB query to prevent NoSQL injection
   */
  static sanitizeMongoQuery(query: any): any {
    if (typeof query !== 'object' || query === null) {
      return query;
    }

    const sanitized: any = Array.isArray(query) ? [] : {};

    for (const key in query) {
      // Skip MongoDB operators that start with $
      if (key.startsWith('$')) {
        continue;
      }

      const value = query[key];

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMongoQuery(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Validate and sanitize URL
   */
  static sanitizeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);

      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null;
      }

      return parsed.toString();
    } catch {
      return null;
    }
  }

  /**
   * Sanitize filename
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255);
  }
}

/**
 * Validation helpers
 */
export class Validator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  static isValidPassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate MongoDB ObjectId
   */
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Validate phone number (international format)
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
  }

  /**
   * Validate price (positive number, max 2 decimals)
   */
  static isValidPrice(price: number): boolean {
    return (
      typeof price === 'number' &&
      price >= 0 &&
      Number.isFinite(price) &&
      /^\d+(\.\d{1,2})?$/.test(price.toString())
    );
  }
}

/**
 * CORS configuration
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ];

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Check if request is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value;

  return !!(authHeader || sessionToken);
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Hash sensitive data (for logging, comparison)
 */
export function hashData(data: string): string {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Mask sensitive data for logs
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }

  return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
): void {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  console.log('🔒 Security Event:', {
    event,
    timestamp: new Date().toISOString(),
    ip: maskSensitiveData(ip, 7),
    userAgent: userAgent.substring(0, 50),
    ...details,
  });
}

/**
 * Detect potential attack patterns
 */
export class AttackDetector {
  /**
   * Detect SQL injection patterns
   */
  static detectSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\bOR\b|\bAND\b).*?[=<>]/i,
      /UNION.*?SELECT/i,
      /DROP.*?TABLE/i,
      /INSERT.*?INTO/i,
      /DELETE.*?FROM/i,
      /--/,
      /;.*?--/,
      /\/\*.*?\*\//,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect XSS patterns
   */
  static detectXss(input: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<embed/i,
      /<object/i,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect path traversal
   */
  static detectPathTraversal(input: string): boolean {
    const pathPatterns = [
      /\.\.\//,
      /\.\.%2[fF]/,
      /\.\.\\/,
      /%2e%2e[/\\]/i,
    ];

    return pathPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect command injection
   */
  static detectCommandInjection(input: string): boolean {
    const commandPatterns = [
      /[;&|`$()]/,
      /\$\{.*?\}/,
      /\$\(.*?\)/,
    ];

    return commandPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check if input contains suspicious patterns
   */
  static isSuspicious(input: string): {
    suspicious: boolean;
    reason?: string;
  } {
    if (this.detectSqlInjection(input)) {
      return { suspicious: true, reason: 'SQL injection pattern detected' };
    }

    if (this.detectXss(input)) {
      return { suspicious: true, reason: 'XSS pattern detected' };
    }

    if (this.detectPathTraversal(input)) {
      return { suspicious: true, reason: 'Path traversal pattern detected' };
    }

    if (this.detectCommandInjection(input)) {
      return { suspicious: true, reason: 'Command injection pattern detected' };
    }

    return { suspicious: false };
  }
}
