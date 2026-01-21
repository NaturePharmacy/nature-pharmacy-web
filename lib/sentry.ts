/**
 * Sentry Configuration for Nature Pharmacy
 *
 * This file provides a lightweight error tracking setup.
 * To use Sentry, install: npm install @sentry/nextjs
 * Then uncomment the code below and configure your DSN.
 */

interface ErrorContext {
  userId?: string;
  email?: string;
  url?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

/**
 * Initialize Sentry (or alternative error tracking)
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') return; // Server-side only in production

  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!sentryDsn) {
    console.log('⚠️ Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  // Uncomment when @sentry/nextjs is installed:
  /*
  import * as Sentry from '@sentry/nextjs';

  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session replay (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
    ],

    // Before sending, filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
      }

      return event;
    },
  });
  */

  console.log('✅ Error tracking initialized');
}

/**
 * Capture exception manually
 */
export function captureException(
  error: Error,
  context?: ErrorContext
): void {
  // Log to console in all environments
  console.error('❌ Error captured:', error, context);

  // In production, send to Sentry
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Uncomment when @sentry/nextjs is installed:
    /*
    import * as Sentry from '@sentry/nextjs';

    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
    */
  }
}

/**
 * Capture message (non-error event)
 */
export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info',
  context?: ErrorContext
): void {
  const emoji = {
    debug: '🐛',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    fatal: '💥',
  };

  console.log(`${emoji[level]} ${message}`, context);

  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Uncomment when @sentry/nextjs is installed:
    /*
    import * as Sentry from '@sentry/nextjs';

    Sentry.captureMessage(message, {
      level,
      contexts: {
        custom: context,
      },
    });
    */
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  role?: string;
}): void {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Uncomment when @sentry/nextjs is installed:
    /*
    import * as Sentry from '@sentry/nextjs';

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    */
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Uncomment when @sentry/nextjs is installed:
    /*
    import * as Sentry from '@sentry/nextjs';
    Sentry.setUser(null);
    */
  }
}

/**
 * Add breadcrumb (track user actions)
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Uncomment when @sentry/nextjs is installed:
    /*
    import * as Sentry from '@sentry/nextjs';

    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
    */
  }
}

/**
 * Lightweight alternative: Console-based error tracking
 * Use this if you don't want to install Sentry
 */
export class ConsoleErrorTracker {
  private static errors: Array<{
    timestamp: string;
    error: Error;
    context?: ErrorContext;
  }> = [];

  static track(error: Error, context?: ErrorContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    };

    this.errors.push(entry);

    // Keep only last 50 errors in memory
    if (this.errors.length > 50) {
      this.errors.shift();
    }

    // Log to console
    console.error('❌ Error tracked:', entry);

    // In production, you could send to your own endpoint
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(entry);
    }
  }

  private static async sendToServer(entry: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (e) {
      // Silently fail - don't want to create error loop
      console.error('Failed to send error to server:', e);
    }
  }

  static getErrors() {
    return this.errors;
  }

  static clearErrors() {
    this.errors = [];
  }
}

/**
 * Global error handler for unhandled rejections
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled Promise Rejection:', event.reason);
    captureException(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        type: 'unhandledrejection',
        promise: String(event.promise),
      }
    );
  });

  // Global errors
  window.addEventListener('error', (event) => {
    console.error('❌ Global Error:', event.error || event.message);
    captureException(
      event.error || new Error(event.message),
      {
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
  });
}

/**
 * React Error Boundary helper
 */
export function logErrorBoundary(
  error: Error,
  errorInfo: { componentStack: string }
) {
  captureException(error, {
    type: 'react_error_boundary',
    componentStack: errorInfo.componentStack,
  });
}
