'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Remplacer la locale dans le pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('fr')}
        className={`px-2 py-1 rounded text-sm ${
          locale === 'fr' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-2 py-1 rounded text-sm ${
          locale === 'en' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleChange('es')}
        className={`px-2 py-1 rounded text-sm ${
          locale === 'es' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        ES
      </button>
    </div>
  );
}
