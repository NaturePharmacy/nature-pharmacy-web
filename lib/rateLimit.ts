import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import mongoose from 'mongoose';

// ── MongoDB-backed store (works on Vercel serverless multi-instance) ─────────
const rateLimitSchema = new mongoose.Schema({
  key:     { type: String, required: true, unique: true },
  count:   { type: Number, default: 0 },
  resetAt: { type: Date,   required: true },
});
rateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup

const RateLimitModel =
  mongoose.models.RateLimit ||
  mongoose.model('RateLimit', rateLimitSchema);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;

  /**
   * Time window in seconds
   */
  window: number;

  /**
   * Custom identifier function (default: IP address)
   */
  keyGenerator?: (request: NextRequest) => string;

  /**
   * Skip rate limiting for certain conditions
   */
  skip?: (request: NextRequest) => boolean;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers for IP (in order of preference)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    request.headers.get('x-client-ip') ||
    request.ip ||
    'unknown';

  return ip;
}

/**
 * Rate limiting middleware
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     limit: 5,
 *     window: 60, // 5 requests per minute
 *   });
 *
 *   if (!rateLimitResult.success) {
 *     return NextResponse.json(
 *       { error: 'Too many requests' },
 *       { status: 429 }
 *     );
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const {
    limit,
    window,
    keyGenerator = getClientIp,
    skip,
  } = config;

  if (skip && skip(request)) {
    return { success: true, limit, remaining: limit, reset: Date.now() + window * 1000 };
  }

  const key = keyGenerator(request);
  const now = new Date();
  const windowMs = window * 1000;
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    await connectDB();

    const doc = await RateLimitModel.findOneAndUpdate(
      { key, resetAt: { $gt: now } },
      { $inc: { count: 1 }, $setOnInsert: { resetAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ) as { count: number; resetAt: Date } | null;

    const count   = doc?.count ?? 1;
    const docReset = doc?.resetAt ?? resetAt;
    const remaining = Math.max(0, limit - count);
    const success   = count <= limit;

    return { success, limit, remaining, reset: docReset.getTime() };
  } catch {
    // Fail open en cas d'erreur DB (ne pas bloquer les utilisateurs légitimes)
    return { success: true, limit, remaining: limit, reset: resetAt.getTime() };
  }
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict: 10 requests per minute
   * Use for: Authentication, password reset
   */
  STRICT: {
    limit: 10,
    window: 60,
  },

  /**
   * Standard: 30 requests per minute
   * Use for: General API endpoints
   */
  STANDARD: {
    limit: 30,
    window: 60,
  },

  /**
   * Generous: 100 requests per minute
   * Use for: Read-only endpoints, public data
   */
  GENEROUS: {
    limit: 100,
    window: 60,
  },

  /**
   * Authentication: 5 login attempts per 15 minutes
   * Use for: Login endpoint specifically
   */
  AUTH: {
    limit: 5,
    window: 15 * 60,
  },

  /**
   * Email: 3 emails per hour
   * Use for: Email sending endpoints
   */
  EMAIL: {
    limit: 3,
    window: 60 * 60,
  },

  /**
   * Upload: 10 uploads per hour
   * Use for: File upload endpoints
   */
  UPLOAD: {
    limit: 10,
    window: 60 * 60,
  },
};

/**
 * Create a rate limiter with preset configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<RateLimitResult> => {
    return rateLimit(request, config);
  };
}

/**
 * Rate limit par clé directe (sans NextRequest) — utile dans NextAuth authorize()
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; reset: number }> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    await connectDB();

    const doc = await RateLimitModel.findOneAndUpdate(
      { key, resetAt: { $gt: now } },
      { $inc: { count: 1 }, $setOnInsert: { resetAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ) as { count: number; resetAt: Date } | null;

    const count = doc?.count ?? 1;
    const docReset = doc?.resetAt ?? resetAt;

    return { success: count <= limit, reset: docReset.getTime() };
  } catch {
    return { success: true, reset: resetAt.getTime() };
  }
}

/**
 * Format rate limit info for response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
  };
}

/**
 * Check if request is from a trusted source (admin, webhook, etc.)
 */
export function isTrustedSource(request: NextRequest): boolean {
  // Check for admin authentication token
  const authHeader = request.headers.get('authorization');
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (adminToken && authHeader === `Bearer ${adminToken}`) {
    return true;
  }

  // Check for webhook signatures (already authenticated)
  const stripeSignature = request.headers.get('stripe-signature');
  const paypalTransmissionId = request.headers.get('paypal-transmission-id');

  if (stripeSignature || paypalTransmissionId) {
    return true;
  }

  return false;
}

/**
 * Rate limit by user ID instead of IP
 */
export function createUserRateLimiter(getUserId: (request: NextRequest) => string | null) {
  return (config: RateLimitConfig) => {
    return createRateLimiter({
      ...config,
      keyGenerator: (request) => {
        const userId = getUserId(request);
        return userId ? `user:${userId}` : `ip:${getClientIp(request)}`;
      },
    });
  };
}

/**
 * Combined rate limit by both IP and user
 */
export async function rateLimitByIpAndUser(
  request: NextRequest,
  userId: string | null,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Check IP-based rate limit
  const ipResult = await rateLimit(request, {
    ...config,
    keyGenerator: () => `ip:${getClientIp(request)}`,
  });

  if (!ipResult.success) {
    return ipResult;
  }

  // If user is authenticated, also check user-based rate limit
  if (userId) {
    const userResult = await rateLimit(request, {
      ...config,
      keyGenerator: () => `user:${userId}`,
    });

    if (!userResult.success) {
      return userResult;
    }
  }

  return ipResult;
}
