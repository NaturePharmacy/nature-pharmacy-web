'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const translations = {
    fr: {
      verifying: 'Vérification de votre email...',
      success: 'Email vérifié avec succès !',
      successMessage: 'Votre compte est maintenant actif. Vous pouvez vous connecter.',
      error: 'Échec de la vérification',
      errorMessage: 'Le lien de vérification est invalide ou a expiré.',
      login: 'Se connecter',
      resend: 'Renvoyer l\'email de vérification',
      noToken: 'Token de vérification manquant',
    },
    en: {
      verifying: 'Verifying your email...',
      success: 'Email verified successfully!',
      successMessage: 'Your account is now active. You can now log in.',
      error: 'Verification failed',
      errorMessage: 'The verification link is invalid or has expired.',
      login: 'Log in',
      resend: 'Resend verification email',
      noToken: 'Verification token missing',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.fr;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t.noToken);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(t.successMessage);
        } else {
          setStatus('error');
          setMessage(data.error || t.errorMessage);
        }
      } catch {
        setStatus('error');
        setMessage(t.errorMessage);
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <Image
              src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'}
              alt="Nature Pharmacy"
              width={200}
              height={60}
              className="mx-auto h-12 w-auto"
            />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <svg className="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{t.verifying}</h1>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href={`/${locale}/login`}
                className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {t.login}
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.error}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href={`/${locale}/login`}
                  className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {t.login}
                </Link>
                <Link
                  href={`/${locale}/resend-verification`}
                  className="inline-block w-full border border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                  {t.resend}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
