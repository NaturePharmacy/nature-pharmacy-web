import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimitConfig, getRateLimitHeaders } from './rateLimit';
import { Sanitizer, Validator, AttackDetector, logSecurityEvent } from './security';

/**
 * Wrapper for API routes with rate limiting and security
 *
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   async (request: NextRequest) => {
 *     // Your handler code
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     limit: 10,
 *     window: 60,
 *   }
 * );
 * ```
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Apply rate limiting
      const rateLimitResult = await rateLimit(request, config);

      if (!rateLimitResult.success) {
        const headers = getRateLimitHeaders(rateLimitResult);

        logSecurityEvent('rate_limit_exceeded', {
          limit: config.limit,
          window: config.window,
        }, request);

        return NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers,
          }
        );
      }

      // Execute handler
      const response = await handler(request);

      // Add rate limit headers to response
      const headers = getRateLimitHeaders(rateLimitResult);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error: any) {
      console.error('❌ API Error:', error);

      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate request body against schema
 */
export function validateBody<T>(
  body: any,
  schema: {
    [K in keyof T]: {
      type: 'string' | 'number' | 'boolean' | 'email' | 'objectId' | 'phone' | 'price' | 'array';
      required?: boolean;
      min?: number;
      max?: number;
      pattern?: RegExp;
      sanitize?: boolean;
      custom?: (value: any) => boolean | string;
    };
  }
): { valid: boolean; errors: string[]; data?: T } {
  const errors: string[] = [];
  const data: any = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }

    // Skip if not required and not provided
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${key} must be a string`);
        } else {
          let sanitized = value;

          if (rules.sanitize) {
            sanitized = Sanitizer.sanitizeHtml(value);
          }

          if (rules.min && sanitized.length < rules.min) {
            errors.push(`${key} must be at least ${rules.min} characters`);
          }

          if (rules.max && sanitized.length > rules.max) {
            errors.push(`${key} must be at most ${rules.max} characters`);
          }

          if (rules.pattern && !rules.pattern.test(sanitized)) {
            errors.push(`${key} format is invalid`);
          }

          data[key] = sanitized;
        }
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${key} must be a number`);
        } else {
          if (rules.min !== undefined && num < rules.min) {
            errors.push(`${key} must be at least ${rules.min}`);
          }

          if (rules.max !== undefined && num > rules.max) {
            errors.push(`${key} must be at most ${rules.max}`);
          }

          data[key] = num;
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${key} must be a boolean`);
        } else {
          data[key] = value;
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !Validator.isValidEmail(value)) {
          errors.push(`${key} must be a valid email address`);
        } else {
          data[key] = Sanitizer.sanitizeEmail(value);
        }
        break;

      case 'objectId':
        if (typeof value !== 'string' || !Validator.isValidObjectId(value)) {
          errors.push(`${key} must be a valid ObjectId`);
        } else {
          data[key] = value;
        }
        break;

      case 'phone':
        if (typeof value !== 'string' || !Validator.isValidPhone(value)) {
          errors.push(`${key} must be a valid phone number`);
        } else {
          data[key] = value;
        }
        break;

      case 'price':
        const price = Number(value);
        if (isNaN(price) || !Validator.isValidPrice(price)) {
          errors.push(`${key} must be a valid price`);
        } else {
          data[key] = price;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${key} must be an array`);
        } else {
          if (rules.min && value.length < rules.min) {
            errors.push(`${key} must contain at least ${rules.min} items`);
          }

          if (rules.max && value.length > rules.max) {
            errors.push(`${key} must contain at most ${rules.max} items`);
          }

          data[key] = value;
        }
        break;
    }

    // Custom validation
    if (rules.custom && data[key] !== undefined) {
      const customResult = rules.custom(data[key]);
      if (customResult !== true) {
        errors.push(typeof customResult === 'string' ? customResult : `${key} validation failed`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (data as T) : undefined,
  };
}

/**
 * Check for malicious input in request body
 */
export function detectMaliciousInput(body: any, request: NextRequest): boolean {
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      const result = AttackDetector.isSuspicious(value);
      if (result.suspicious) {
        logSecurityEvent('malicious_input_detected', {
          reason: result.reason,
          value: value.substring(0, 100),
        }, request);
        return true;
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (checkValue(value[key])) {
          return true;
        }
      }
    }

    return false;
  };

  return checkValue(body);
}

/**
 * Safe JSON parsing with error handling
 */
export async function safeJsonParse<T = any>(
  request: NextRequest
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const text = await request.text();

    if (!text || text.trim() === '') {
      return {
        success: false,
        error: 'Request body is empty',
      };
    }

    const data = JSON.parse(text);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Invalid JSON format',
    };
  }
}

/**
 * Create standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create standardized success response
 */
export function successResponse<T = any>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
