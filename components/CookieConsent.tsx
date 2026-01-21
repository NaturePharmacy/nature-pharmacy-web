'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a small delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);

    // Trigger analytics/marketing scripts based on consent
    if (prefs.analytics) {
      enableAnalytics();
    }
    if (prefs.marketing) {
      enableMarketing();
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  const enableAnalytics = () => {
    // Enable Google Analytics or other analytics tools
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const enableMarketing = () => {
    // Enable marketing/advertising cookies
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={() => !showDetails && setShowBanner(false)}
      />

      {/* Banner */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl pointer-events-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-green-600 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              </svg>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('description')}{' '}
            <Link href="/cookies" className="text-green-600 hover:underline font-medium">
              {t('learnMore')}
            </Link>
          </p>

          {/* Details Section */}
          {showDetails && (
            <div className="mb-6 space-y-4 border-t border-gray-200 pt-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">{t('necessary')}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
                      {t('required')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{t('necessaryDesc')}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">{t('analytics')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('analyticsDesc')}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">{t('marketing')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('marketingDesc')}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Preferences Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">{t('preferences')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('preferencesDesc')}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!showDetails ? (
              <>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  {t('acceptAll')}
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t('acceptNecessary')}
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  {t('customize')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={saveCustom}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  {t('savePreferences')}
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t('back')}
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            {t('footerText')}{' '}
            <Link href="/privacy" className="text-green-600 hover:underline">
              {t('privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
