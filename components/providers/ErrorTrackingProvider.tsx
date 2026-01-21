'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  initErrorTracking,
  setupGlobalErrorHandlers,
  setUserContext,
  clearUserContext,
} from '@/lib/sentry';

/**
 * Error Tracking Provider
 *
 * Initializes error tracking (Sentry) and sets up global error handlers
 * Also syncs user context when authentication state changes
 */
export default function ErrorTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  // Initialize error tracking on mount
  useEffect(() => {
    // Initialize Sentry or error tracking
    initErrorTracking();

    // Setup global error handlers
    setupGlobalErrorHandlers();

    console.log('✅ Error tracking initialized');
  }, []);

  // Sync user context when session changes
  useEffect(() => {
    if (session?.user) {
      setUserContext({
        id: session.user.id,
        email: session.user.email || undefined,
        username: session.user.name || undefined,
        role: session.user.role || undefined,
      });
    } else {
      clearUserContext();
    }
  }, [session]);

  return <>{children}</>;
}
