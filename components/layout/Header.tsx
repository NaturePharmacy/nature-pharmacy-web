'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('header');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { getCartCount } = useCart();

  const categories = [
    { key: 'herbs', icon: '🌿' },
    { key: 'oils', icon: '💧' },
    { key: 'cosmetics', icon: '✨' },
    { key: 'foods', icon: '🥗' },
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
                width={140}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Delivery Location */}
            <div className="hidden lg:flex items-center gap-1 text-gray-700 hover:text-green-600 cursor-pointer transition-colors px-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-xs">
                <p className="text-gray-500">{t('deliverTo')}</p>
                <p className="font-semibold text-gray-900">Sénégal</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="flex">
                {/* Category Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="h-10 px-3 bg-gray-100 hover:bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    {t('allCategories')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {categoryOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50">
                      {categories.map((cat) => (
                        <Link
                          key={cat.key}
                          href={`/${locale}/products?category=${cat.key}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => setCategoryOpen(false)}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span>{tNav(`categories.${cat.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 px-4 text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:rounded-none rounded-l-lg text-sm"
                />

                {/* Search Button */}
                <button className="h-10 w-11 bg-green-600 hover:bg-green-700 rounded-r-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Account */}
            <Link
              href={session ? `/${locale}/account` : `/${locale}/login`}
              className="hidden md:flex flex-col text-gray-700 hover:text-green-600 px-2 transition-colors"
            >
              <span className="text-xs text-gray-500">
                {session ? t('hello') : t('signIn')}
              </span>
              <span className="text-sm font-semibold flex items-center gap-1">
                {session ? session.user?.name?.split(' ')[0] : t('account')}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </Link>

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
            {/* All Categories Button */}
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {tNav('allCategories')}
            </button>

            <Link href={`/${locale}/deals`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('deals')}
            </Link>
            <Link href={`/${locale}/products?featured=true`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('bestSellers')}
            </Link>
            <Link href={`/${locale}/products?new=true`} className="px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
              {tNav('newArrivals')}
            </Link>
            <Link href={`/${locale}/products?organic=true`} className="px-3 py-1.5 text-green-600 font-medium hover:bg-green-50 rounded-lg transition-all whitespace-nowrap">
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
              <Link href={`/${locale}/register?role=seller`} className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium whitespace-nowrap">
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
              <Link href={session ? `/${locale}/account` : `/${locale}/login`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-700 font-medium">{session ? session.user?.name : t('signIn')}</span>
              </Link>
              {session && (
                <Link href={`/${locale}/messages`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Messages</span>
                </Link>
              )}
              <Link href={`/${locale}/orders`} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-700 font-medium">{t('orders')}</span>
              </Link>
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
