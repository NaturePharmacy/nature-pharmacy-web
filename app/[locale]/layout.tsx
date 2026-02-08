import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import SessionProvider from '@/components/providers/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import FloatingCart from '@/components/cart/FloatingCart';
import CookieConsent from '@/components/CookieConsent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    icons: {
      icon: '/logo-fr.jpg',
      apple: '/logo-fr.jpg',
    },
    metadataBase: new URL(baseUrl),
    keywords: locale === 'fr'
      ? 'plantes médicinales, phytothérapie, huiles essentielles, cosmétiques naturels, bio, herboristerie, remèdes naturels'
      : locale === 'es'
      ? 'plantas medicinales, fitoterapia, aceites esenciales, cosméticos naturales, orgánico, herbolaria, remedios naturales'
      : 'medicinal plants, phytotherapy, essential oils, natural cosmetics, organic, herbalism, natural remedies',
    authors: [{ name: 'Nature Pharmacy' }],
    openGraph: {
      type: 'website',
      locale: locale,
      url: baseUrl,
      siteName: 'Nature Pharmacy',
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <CurrencyProvider>
              <CartProvider>
                <Header />
                <main>
                  {children}
                </main>
                <Footer />
                <FloatingCart />
                <CookieConsent />
              </CartProvider>
            </CurrencyProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
