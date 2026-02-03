import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const COUNTRY_NAMES = {
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos' },
  FR: { fr: 'France', en: 'France', es: 'Francia' },
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'España' },
  SN: { fr: 'Sénégal', en: 'Senegal', es: 'Senegal' },
  CI: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast', es: 'Costa de Marfil' },
  ML: { fr: 'Mali', en: 'Mali', es: 'Malí' },
  BF: { fr: 'Burkina Faso', en: 'Burkina Faso', es: 'Burkina Faso' },
  CA: { fr: 'Canada', en: 'Canada', es: 'Canadá' },
  BR: { fr: 'Brésil', en: 'Brazil', es: 'Brasil' },
  MX: { fr: 'Mexique', en: 'Mexico', es: 'México' },
  JP: { fr: 'Japon', en: 'Japan', es: 'Japón' },
  CN: { fr: 'Chine', en: 'China', es: 'China' },
  IN: { fr: 'Inde', en: 'India', es: 'India' },
  AU: { fr: 'Australie', en: 'Australia', es: 'Australia' },
  // Ajouter plus de pays selon vos besoins
};

export function useUserCountry(locale: 'fr' | 'en' | 'es' = 'fr') {
  const { data: session } = useSession();
  const [country, setCountry] = useState<string>(''); // Pas de défaut fixe

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

    // Tenter de détecter le pays via l'API de géolocalisation ou laisser vide
    // L'utilisateur choisira son pays lors de la première visite
  }, [session]);

  const setUserCountry = (countryCode: string) => {
    setCountry(countryCode);
    localStorage.setItem('userCountry', countryCode);
  };

  const countryName = country && COUNTRY_NAMES[country as keyof typeof COUNTRY_NAMES]?.[locale] || '';

  return {
    country,
    countryName,
    setUserCountry,
  };
}
