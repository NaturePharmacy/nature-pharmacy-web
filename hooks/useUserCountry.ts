import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const COUNTRY_NAMES = {
  SN: { fr: 'Sénégal', en: 'Senegal', es: 'Senegal' },
  FR: { fr: 'France', en: 'France', es: 'Francia' },
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos' },
  CI: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast', es: 'Costa de Marfil' },
  ML: { fr: 'Mali', en: 'Mali', es: 'Malí' },
  BF: { fr: 'Burkina Faso', en: 'Burkina Faso', es: 'Burkina Faso' },
  // Ajouter plus de pays selon vos besoins
};

export function useUserCountry(locale: 'fr' | 'en' | 'es' = 'fr') {
  const { data: session } = useSession();
  const [country, setCountry] = useState<string>('SN'); // Par défaut Sénégal

  useEffect(() => {
    // Essayer de récupérer le pays depuis le localStorage
    const savedCountry = localStorage.getItem('userCountry');
    if (savedCountry) {
      setCountry(savedCountry);
      return;
    }

    // Si l'utilisateur est connecté, récupérer depuis ses infos
    if (session?.user) {
      // Vous pouvez récupérer le pays depuis le profil utilisateur
      // Pour l'instant on utilise le localStorage ou la valeur par défaut
    }
  }, [session]);

  const setUserCountry = (countryCode: string) => {
    setCountry(countryCode);
    localStorage.setItem('userCountry', countryCode);
  };

  const countryName = COUNTRY_NAMES[country as keyof typeof COUNTRY_NAMES]?.[locale] ||
                      COUNTRY_NAMES['SN'][locale];

  return {
    country,
    countryName,
    setUserCountry,
  };
}
