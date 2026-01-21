import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimitPresets } from '@/lib/rateLimit';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

/**
 * Error Log Schema
 * Store errors in MongoDB for analysis
 */
const ErrorLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  environment: {
    type: String,
    enum: ['development', 'production', 'test'],
    default: process.env.NODE_ENV,
  },
  error: {
    name: String,
    message: String,
    stack: String,
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
  },
  userAgent: String,
  ip: String,
  url: String,
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: Date,
  notes: String,
}, {
  timestamps: true,
});

// Create TTL index to auto-delete old errors (after 90 days)
ErrorLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ErrorLog = mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);

/**
 * POST /api/errors
 *
 * Receive and log client-side errors
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (prevent error spam)
    const rateLimitResult = await rateLimit(request, {
      limit: 10, // Max 10 errors per minute per IP
      window: 60,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many error reports' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Extract error details
    const { timestamp, error, context } = body;

    if (!error) {
      return NextResponse.json(
        { error: 'Error object is required' },
        { status: 400 }
      );
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.ip ||
               'unknown';
    const referer = request.headers.get('referer') || 'unknown';

    // Log to console
    console.error('❌ Client Error Received:', {
      timestamp,
      error: {
        name: error.name,
        message: error.message,
      },
      context,
      userAgent: userAgent.substring(0, 50),
      ip: ip.substring(0, 10) + '...',
    });

    // Save to database in production
    if (process.env.NODE_ENV === 'production') {
      try {
        await connectDB();

        await ErrorLog.create({
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          error: {
            name: error.name || 'Error',
            message: error.message || 'Unknown error',
            stack: error.stack,
          },
          context,
          userAgent: userAgent.substring(0, 200),
          ip: ip.substring(0, 50),
          url: referer,
        });

        console.log('✅ Error logged to database');
      } catch (dbError) {
        console.error('Failed to save error to database:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
    });
  } catch (error: any) {
    console.error('❌ Failed to process error log:', error);

    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/errors
 *
 * Retrieve error logs (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if admin (you should use proper authentication here)
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const resolved = searchParams.get('resolved');

    const query: any = {};

    if (resolved !== null) {
      query.resolved = resolved === 'true';
    }

    const skip = (page - 1) * limit;

    const [errors, total] = await Promise.all([
      ErrorLog.find(query)
        .sort('-timestamp')
        .skip(skip)
        .limit(limit)
        .lean(),
      ErrorLog.countDocuments(query),
    ]);

    return NextResponse.json({
      errors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Failed to fetch error logs:', error);

    return NextResponse.json(
      { error: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/errors/:id
 *
 * Mark error as resolved (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { errorId, resolved, notes } = body;

    if (!errorId) {
      return NextResponse.json(
        { error: 'Error ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const error = await ErrorLog.findByIdAndUpdate(
      errorId,
      {
        resolved: resolved !== undefined ? resolved : true,
        resolvedAt: resolved ? new Date() : undefined,
        notes,
      },
      { new: true }
    );

    if (!error) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      error,
    });
  } catch (error: any) {
    console.error('❌ Failed to update error:', error);

    return NextResponse.json(
      { error: 'Failed to update error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/errors
 *
 * Delete old resolved errors (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const olderThan = searchParams.get('olderThan'); // days

    await connectDB();

    const query: any = { resolved: true };

    if (olderThan) {
      const days = parseInt(olderThan);
      const date = new Date();
      date.setDate(date.getDate() - days);
      query.resolvedAt = { $lt: date };
    }

    const result = await ErrorLog.deleteMany(query);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('❌ Failed to delete errors:', error);

    return NextResponse.json(
      { error: 'Failed to delete errors' },
      { status: 500 }
    );
  }
}
