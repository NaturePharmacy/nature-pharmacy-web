'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import CountrySwitcher from '@/components/common/CountrySwitcher';
import NotificationBell from '@/components/notifications/NotificationBell';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const t = useTranslations('header');
  const tNav = useTranslations('nav');
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  const categories = [
    { key: 'medicinal-plants', icon: '🌿' },
    { key: 'essential-oils', icon: '💧' },
    { key: 'traditional-remedies', icon: '🏺' },
    { key: 'herbal-teas', icon: '🍵' },
    { key: 'supplements', icon: '💊' },
    { key: 'natural-cosmetics', icon: '✨' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Main Header Bar - White background */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-2">
              <Image
                src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'}
                alt="Nature Pharmacy"
                width={200}
                height={64}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Country Switcher (includes delivery location and currency) */}
            <CountrySwitcher />

            {/* Search Bar */}
            <SearchBar placeholder={t('search')} />

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Account - with dropdown menu */}
            <div className="hidden md:block relative">
              {session ? (
                <>
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex flex-col text-gray-700 hover:text-green-600 px-2 transition-colors"
                  >
                    <span className="text-xs text-gray-500">{t('hello')}</span>
                    <span className="text-sm font-semibold flex items-center gap-1">
                      {session.user?.name?.split(' ')[0]}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {accountMenuOpen && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountMenuOpen(false)}
                      ></div>

                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                        </div>

                        <Link
                          href={`/${locale}/account`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">Mon compte</span>
                        </Link>

                        <Link
                          href={`/${locale}/orders`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-sm">Mes commandes</span>
                        </Link>

                        <Link
                          href={`/${locale}/wishlist`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">Ma liste de souhaits</span>
                        </Link>

                        <Link
                          href={`/${locale}/loyalty`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Points de fidélité</span>
                        </Link>

                        {session.user?.role === 'seller' && (
                          <Link
                            href={`/${locale}/seller`}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm">Tableau de bord vendeur</span>
                          </Link>
                        )}

                        {session.user?.role === 'admin' && (
                          <Link
                            href={`/${locale}/admin`}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">Administration</span>
                          </Link>
                        )}

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm font-medium">Se déconnecter</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="flex flex-col text-gray-700 hover:text-green-600 px-2 transition-colors"
                >
                  <span className="text-xs text-gray-500">{t('signIn')}</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    {t('account')}
                  </span>
                </Link>
              )}
            </div>

            {/* Notifications */}
            {session && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}

            {/* Messages */}
            {session && (
              <Link
                href={`/${locale}/messages`}
                className="hidden md:flex items-center text-gray-700 hover:text-green-600 px-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            )}

            {/* Wishlist */}
            {session && (
              <Link
                href={`/${locale}/wishlist`}
                className="hidden md:flex items-center text-gray-700 hover:text-green-600 px-2 transition-colors"
                title="Wishlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}

            {/* Referral */}
            {session && (
              <Link
                href={`/${locale}/referral`}
                className="hidden md:flex items-center text-gray-700 hover:text-green-600 px-2 transition-colors"
                title="Referral Program"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            )}

            {/* Orders */}
            <Link
              href={`/${locale}/orders`}
              className="hidden md:flex flex-col text-gray-700 hover:text-green-600 px-2 transition-colors"
            >
              <span className="text-xs text-gray-500">{t('returns')}</span>
              <span className="text-sm font-semibold">{t('orders')}</span>
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="flex items-center text-gray-700 hover:text-green-600 px-2 transition-colors relative"
            >
              <div className="relative">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>
              <span className="font-semibold text-sm hidden sm:block ml-1">{t('cart')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Light gray with green accents */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-10 gap-1 text-sm overflow-x-auto scrollbar-hide">
            {/* All Categories Link */}
            <Link
              href={`/${locale}/products`}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-800 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-semibold whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {tNav('allCategories')}
            </Link>

            <Link href={`/${locale}/deals`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('deals')}
            </Link>
            <Link href={`/${locale}/products?featured=true`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('bestSellers')}
            </Link>
            <Link href={`/${locale}/products?new=true`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('newArrivals')}
            </Link>
            <Link href={`/${locale}/products?certifications=traditional`} className="px-3 py-1.5 text-green-600 font-medium hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              🏺 {locale === 'fr' ? 'Remèdes Traditionnels' : locale === 'es' ? 'Remedios Tradicionales' : 'Traditional Remedies'}
            </Link>
            <Link href={`/${locale}/products?certifications=organic`} className="px-3 py-1.5 text-green-600 font-medium hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              🌱 {tNav('organic')}
            </Link>

            <div className="flex-1"></div>

            {/* Admin Link */}
            {session?.user?.role === 'admin' && (
              <Link href={`/${locale}/admin`} className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all font-medium whitespace-nowrap">
                Admin
              </Link>
            )}

            {/* Seller Link */}
            {session?.user?.role === 'seller' ? (
              <Link href={`/${locale}/seller`} className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all font-medium whitespace-nowrap">
                {t('sellerDashboard')}
              </Link>
            ) : session?.user?.role !== 'admin' && (
              <Link href={`/${locale}/become-seller`} className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium whitespace-nowrap">
                {t('becomeASeller')}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                className="w-full h-10 px-4 pr-10 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile Links */}
            <div className="space-y-1">
              {session ? (
                <>
                  <Link href={`/${locale}/account`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700 font-medium">{session.user?.name}</span>
                  </Link>
                  <Link href={`/${locale}/messages`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Messages</span>
                  </Link>
                  <Link href={`/${locale}/orders`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-gray-700 font-medium">{t('orders')}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-red-600 font-medium">Se déconnecter</span>
                  </button>
                </>
              ) : (
                <Link href={`/${locale}/login`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-gray-700 font-medium">{t('signIn')}</span>
                </Link>
              )}
            </div>

            {/* Mobile Categories */}
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{tNav('categories.title')}</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.key}
                    href={`/${locale}/products?category=${cat.key}`}
                    className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm text-gray-700">{tNav(`categories.${cat.key}`)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="border-t pt-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
