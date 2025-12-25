'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return; // Don't change if same locale

    // Extract the path without locale prefix
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.slice(1).join('/'); // Remove first segment (locale)

    // Preserve query strings
    const queryString = searchParams.toString();
    const queryPart = queryString ? `?${queryString}` : '';

    // Build new path with new locale and query strings
    const newPath = `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}${queryPart}`;

    // Use startTransition for smoother navigation
    // Note: router.refresh() removed - next-intl handles translation updates automatically
    startTransition(() => {
      router.push(newPath);
    });

    // Set cookie to remember language preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('fr')}
        disabled={isPending}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          locale === 'fr' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      >
        FR
      </button>
      <button
        onClick={() => handleChange('en')}
        disabled={isPending}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          locale === 'en' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => handleChange('es')}
        disabled={isPending}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          locale === 'es' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      >
        ES
      </button>
    </div>
  );
}
