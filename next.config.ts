import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during build (for production only)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default withNextIntl(nextConfig);
