'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-gray-200">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-sm font-medium transition-colors"
      >
        {locale === 'fr' ? 'Retour en haut' : locale === 'es' ? 'Volver arriba' : 'Back to top'}
      </button>

      {/* Main Footer */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="text-gray-900 font-bold text-sm mb-4">
                {locale === 'fr' ? 'Mieux nous connaître' : locale === 'es' ? 'Conócenos' : 'Get to Know Us'}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href={`/${locale}/about`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('aboutUs')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('contactUs')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/careers`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Carrières' : locale === 'es' ? 'Empleo' : 'Careers'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sell with Us */}
            <div>
              <h3 className="text-gray-900 font-bold text-sm mb-4">{t('forSellers')}</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href={`/${locale}/become-seller`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('becomeSeller')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/seller`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('sellerDashboard')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/seller/guide`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('sellerGuide')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-gray-900 font-bold text-sm mb-4">{t('help')}</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href={`/${locale}/account`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Votre compte' : locale === 'es' ? 'Tu cuenta' : 'Your Account'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/orders`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Vos commandes' : locale === 'es' ? 'Tus pedidos' : 'Your Orders'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/shipping`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Livraison' : locale === 'es' ? 'Envío' : 'Shipping'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/returns`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Retours' : locale === 'es' ? 'Devoluciones' : 'Returns'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-gray-900 font-bold text-sm mb-4">
                {locale === 'fr' ? 'Mentions légales' : locale === 'es' ? 'Legal' : 'Legal'}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href={`/${locale}/terms`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('termsOfService')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/privacy`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {t('privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/cookies`} className="text-gray-600 hover:text-green-600 transition-colors">
                    {locale === 'fr' ? 'Cookies' : locale === 'es' ? 'Cookies' : 'Cookies'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <Image
                src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'}
                alt="Nature Pharmacy"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm hidden sm:block">{t('followUs')}</span>
              <div className="flex gap-2">
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center md:text-right">
              {t('copyright')}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs text-center mt-4 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </div>
    </footer>
  );
}
