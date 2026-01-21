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

export default function CookiePreferencesPage() {
  const t = useTranslations('cookiePreferences');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [saved, setSaved] = useState(false);
  const [consentDate, setConsentDate] = useState<string | null>(null);

  useEffect(() => {
    // Load current preferences
    const consent = localStorage.getItem('cookie_consent');
    const date = localStorage.getItem('cookie_consent_date');

    if (consent) {
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }

    if (date) {
      setConsentDate(date);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setConsentDate(new Date().toISOString());
    setSaved(true);

    // Apply preferences
    if (preferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    if (preferences.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }

    setTimeout(() => setSaved(false), 3000);
  };

  const enableAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const disableAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  };

  const enableMarketing = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  };

  const disableMarketing = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  };

  const resetPreferences = () => {
    localStorage.removeItem('cookie_consent');
    localStorage.removeItem('cookie_consent_date');
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
    setConsentDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-4">
            <svg
              className="w-10 h-10 text-green-600 mr-4"
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
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('subtitle')}</p>
            </div>
          </div>

          {consentDate && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-gray-700">
                <strong>{t('lastUpdated')}:</strong>{' '}
                {new Date(consentDate).toLocaleString()}
              </p>
            </div>
          )}

          {saved && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded animate-fade-in">
              <p className="text-sm text-green-800 font-medium">
                ✓ {t('saved')}
              </p>
            </div>
          )}
        </div>

        {/* Cookie Categories */}
        <div className="space-y-6 mb-8">
          {/* Necessary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-900">{t('necessary')}</h2>
                  <span className="ml-3 px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    {t('alwaysActive')}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{t('necessaryDesc')}</p>
                <div className="text-sm text-gray-600">
                  <strong>{t('examples')}:</strong>
                  <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                    <li>{t('necessaryExample1')}</li>
                    <li>{t('necessaryExample2')}</li>
                    <li>{t('necessaryExample3')}</li>
                  </ul>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0">
                <div className="relative inline-block w-14 h-8 rounded-full bg-green-500 opacity-50 cursor-not-allowed">
                  <div className="absolute top-1 right-1 bg-white w-6 h-6 rounded-full shadow transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t('analytics')}</h2>
                <p className="text-gray-700 mb-3">{t('analyticsDesc')}</p>
                <div className="text-sm text-gray-600">
                  <strong>{t('examples')}:</strong>
                  <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                    <li>{t('analyticsExample1')}</li>
                    <li>{t('analyticsExample2')}</li>
                    <li>{t('analyticsExample3')}</li>
                  </ul>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0">
                <button
                  onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                  className={`relative inline-block w-14 h-8 rounded-full transition-colors ${
                    preferences.analytics ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow transition-transform ${
                      preferences.analytics ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t('marketing')}</h2>
                <p className="text-gray-700 mb-3">{t('marketingDesc')}</p>
                <div className="text-sm text-gray-600">
                  <strong>{t('examples')}:</strong>
                  <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                    <li>{t('marketingExample1')}</li>
                    <li>{t('marketingExample2')}</li>
                    <li>{t('marketingExample3')}</li>
                  </ul>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0">
                <button
                  onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                  className={`relative inline-block w-14 h-8 rounded-full transition-colors ${
                    preferences.marketing ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow transition-transform ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t('preferences')}</h2>
                <p className="text-gray-700 mb-3">{t('preferencesDesc')}</p>
                <div className="text-sm text-gray-600">
                  <strong>{t('examples')}:</strong>
                  <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                    <li>{t('preferencesExample1')}</li>
                    <li>{t('preferencesExample2')}</li>
                    <li>{t('preferencesExample3')}</li>
                  </ul>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0">
                <button
                  onClick={() => setPreferences({ ...preferences, preferences: !preferences.preferences })}
                  className={`relative inline-block w-14 h-8 rounded-full transition-colors ${
                    preferences.preferences ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow transition-transform ${
                      preferences.preferences ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={savePreferences}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              {t('save')}
            </button>
            <button
              onClick={resetPreferences}
              className="flex-1 px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              {t('reset')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{t('infoTitle')}</h3>
          <p className="text-sm text-gray-700 mb-3">{t('infoText')}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cookies"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {t('cookiePolicy')} →
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {t('privacyPolicy')} →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
