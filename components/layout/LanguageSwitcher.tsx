'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return; // Don't change if same locale

    // Extract the path without locale prefix
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.slice(1).join('/'); // Remove first segment (locale)

    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;

    // Use startTransition for smoother navigation
    startTransition(() => {
      router.push(newPath);
      router.refresh(); // Force refresh to reload translations
    });
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
