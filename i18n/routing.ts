import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // Liste des locales supportées
  locales: ['fr', 'en', 'es'],

  // Locale par défaut utilisée quand aucune locale n'est spécifiée
  defaultLocale: 'fr'
});

// Export des helpers de navigation
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
