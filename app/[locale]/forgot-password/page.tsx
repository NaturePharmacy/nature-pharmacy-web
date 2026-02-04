'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const translations = {
    fr: {
      title: 'Mot de passe oublié',
      subtitle: 'Entrez votre email pour recevoir un lien de réinitialisation',
      email: 'Adresse email',
      submit: 'Envoyer le lien',
      sending: 'Envoi en cours...',
      success: 'Email envoyé !',
      successMessage: 'Un email avec les instructions de réinitialisation a été envoyé à votre adresse.',
      backToLogin: 'Retour à la connexion',
      error: 'Une erreur est survenue. Veuillez réessayer.',
    },
    en: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to receive a reset link',
      email: 'Email address',
      submit: 'Send reset link',
      sending: 'Sending...',
      success: 'Email sent!',
      successMessage: 'An email with reset instructions has been sent to your address.',
      backToLogin: 'Back to login',
      error: 'An error occurred. Please try again.',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(t.successMessage);
      } else {
        setStatus('error');
        setMessage(data.error || t.error);
      }
    } catch {
      setStatus('error');
      setMessage(t.error);
    }
  };

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

        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href={`/${locale}/login`}
                className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition text-center"
              >
                {t.backToLogin}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="exemple@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.sending}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href={`/${locale}/login`}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    {t.backToLogin}
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
