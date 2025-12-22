import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import SessionProvider from '@/components/providers/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import FloatingCart from '@/components/cart/FloatingCart';
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

export const metadata: Metadata = {
  title: "Nature Pharmacy - Your Online Marketplace for Natural Products",
  description: "Discover and buy natural products from trusted sellers worldwide",
};

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
            <CartProvider>
              <Header />
              <main>
                {children}
              </main>
              <Footer />
              <FloatingCart />
            </CartProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
