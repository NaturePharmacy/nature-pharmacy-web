'use client';

/**
 * Locale-level Error Boundary
 * Catches errors within locale routes with proper i18n support
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console
    console.error('Locale error:', error);

    // TODO: Log to error tracking service
    // logErrorToService(error, { level: 'locale' });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur s'est produite
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          Désolé, une erreur inattendue s'est produite. Notre équipe a été notifiée et travaille sur une solution.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <p className="text-xs font-semibold text-gray-700 mb-1">Error Details:</p>
            <p className="text-sm font-mono text-red-600 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                  Stack Trace
                </summary>
                <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Retour à l'accueil
          </a>
        </div>

        {/* Support Link */}
        <p className="text-sm text-gray-500 mt-6">
          Besoin d'aide?{' '}
          <a href="/contact" className="text-green-600 hover:underline">
            Contactez le support
          </a>
        </p>

        {/* Error Code (if available) */}
        {error.digest && (
          <p className="text-xs text-gray-400 mt-4">
            Code d'erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
