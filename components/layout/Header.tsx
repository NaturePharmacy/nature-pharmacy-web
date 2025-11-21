'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('header');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>🌿 Nature Pharmacy</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'}
              alt="Nature Pharmacy"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-green-600 rounded-lg focus:outline-none focus:border-green-700"
              />
              <button className="absolute right-0 top-0 h-full px-6 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/login`} className="text-gray-700 hover:text-green-600 transition">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">{t('login')}</span>
              </div>
            </Link>

            <Link href={`/${locale}/cart`} className="text-gray-700 hover:text-green-600 transition relative">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs">{t('cart')}</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3 text-sm">
            <li>
              <Link href={`/${locale}`} className="text-gray-700 hover:text-green-600 font-medium transition">
                {tNav('home')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/products`} className="text-gray-700 hover:text-green-600 transition">
                {tNav('products')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/categories`} className="text-gray-700 hover:text-green-600 transition">
                {tNav('categories')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/sellers`} className="text-gray-700 hover:text-green-600 transition">
                {tNav('sellers')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/deals`} className="text-gray-700 hover:text-green-600 transition">
                {tNav('deals')}
              </Link>
            </li>
            <li className="ml-auto">
              <Link href={`/${locale}/seller/dashboard`} className="text-green-600 hover:text-green-700 font-medium transition">
                {t('becomeASeller')}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
