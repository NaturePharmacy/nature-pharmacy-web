'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const translations = {
    fr: {
      title: 'Réinitialiser le mot de passe',
      subtitle: 'Entrez votre nouveau mot de passe',
      password: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Réinitialiser',
      resetting: 'Réinitialisation...',
      success: 'Mot de passe réinitialisé !',
      successMessage: 'Votre mot de passe a été modifié avec succès.',
      login: 'Se connecter',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      invalidToken: 'Le lien de réinitialisation est invalide ou a expiré.',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      show: 'Afficher',
      hide: 'Masquer',
    },
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your new password',
      password: 'New password',
      confirmPassword: 'Confirm password',
      submit: 'Reset password',
      resetting: 'Resetting...',
      success: 'Password reset!',
      successMessage: 'Your password has been changed successfully.',
      login: 'Log in',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      invalidToken: 'The reset link is invalid or has expired.',
      error: 'An error occurred. Please try again.',
      show: 'Show',
      hide: 'Hide',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.fr;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t.invalidToken);
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage(t.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage(t.passwordTooShort);
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(t.successMessage);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 3000);
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href={`/${locale}/login`}
                className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition text-center"
              >
                {t.login}
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'fr' ? 'Lien invalide' : 'Invalid link'}</h1>
              <p className="text-gray-600 mb-6">{t.invalidToken}</p>
              <Link
                href={`/${locale}/forgot-password`}
                className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition text-center"
              >
                {locale === 'fr' ? 'Demander un nouveau lien' : 'Request new link'}
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                      {showPassword ? t.hide : t.show}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.confirmPassword}
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
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
                      {t.resetting}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
