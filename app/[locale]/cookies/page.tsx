'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CookiesPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Politique sur les Cookies',
      lastUpdated: 'Dernière mise à jour : 1er décembre 2025',
      intro: 'Cette politique explique comment Nature Pharmacy utilise les cookies et technologies similaires sur notre site web.',
      whatAre: {
        title: 'Qu\'est-ce qu\'un cookie ?',
        description: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de mémoriser vos actions et préférences sur une période donnée.',
      },
      types: {
        title: 'Types de cookies que nous utilisons',
        categories: [
          {
            name: 'Cookies essentiels',
            necessary: true,
            description: 'Ces cookies sont nécessaires au fonctionnement du site. Ils permettent des fonctions de base comme la navigation entre les pages et l\'accès aux zones sécurisées.',
            examples: [
              'Authentification de session',
              'Panier d\'achat',
              'Préférences de langue',
              'Sécurité du site',
            ],
            canDisable: false,
          },
          {
            name: 'Cookies de performance',
            necessary: false,
            description: 'Ces cookies collectent des informations sur la façon dont les visiteurs utilisent notre site, comme les pages les plus visitées et les messages d\'erreur.',
            examples: [
              'Google Analytics',
              'Temps de chargement des pages',
              'Taux de rebond',
              'Parcours utilisateur',
            ],
            canDisable: true,
          },
          {
            name: 'Cookies de fonctionnalité',
            necessary: false,
            description: 'Ces cookies permettent au site de se souvenir de vos choix pour offrir une expérience personnalisée.',
            examples: [
              'Préférences d\'affichage',
              'Localisation',
              'Taille de police',
              'Historique de navigation',
            ],
            canDisable: true,
          },
          {
            name: 'Cookies publicitaires',
            necessary: false,
            description: 'Ces cookies sont utilisés pour afficher des publicités pertinentes et personnalisées en fonction de vos intérêts.',
            examples: [
              'Publicités ciblées',
              'Remarketing',
              'Suivi des conversions',
              'Analyse publicitaire',
            ],
            canDisable: true,
          },
        ],
      },
      thirdParty: {
        title: 'Cookies tiers',
        description: 'Nous utilisons des services tiers qui peuvent également définir des cookies :',
        services: [
          {
            name: 'Google Analytics',
            purpose: 'Analyse du trafic et comportement des visiteurs',
            link: 'https://policies.google.com/privacy',
          },
          {
            name: 'Réseaux sociaux',
            purpose: 'Partage de contenu sur les réseaux sociaux',
            link: null,
          },
          {
            name: 'Partenaires de paiement',
            purpose: 'Traitement sécurisé des paiements',
            link: null,
          },
        ],
      },
      duration: {
        title: 'Durée de conservation',
        types: [
          {
            type: 'Cookies de session',
            duration: 'Supprimés lorsque vous fermez votre navigateur',
          },
          {
            type: 'Cookies persistants',
            duration: 'Conservés pour une durée déterminée (généralement 1-24 mois)',
          },
        ],
      },
      manage: {
        title: 'Comment gérer vos cookies',
        description: 'Vous pouvez contrôler et gérer les cookies de plusieurs façons :',
        methods: [
          {
            title: 'Paramètres du navigateur',
            description: 'La plupart des navigateurs vous permettent de refuser ou d\'accepter les cookies. Consultez l\'aide de votre navigateur pour plus d\'informations.',
            browsers: [
              'Chrome : Paramètres > Confidentialité et sécurité > Cookies',
              'Firefox : Options > Vie privée et sécurité > Cookies',
              'Safari : Préférences > Confidentialité > Cookies',
              'Edge : Paramètres > Confidentialité > Cookies',
            ],
          },
          {
            title: 'Outils de gestion des cookies',
            description: 'Utilisez des extensions de navigateur ou des outils de gestion des cookies pour un contrôle plus fin.',
          },
          {
            title: 'Nos préférences',
            description: 'Utilisez notre bannière de cookies pour accepter ou refuser certaines catégories de cookies.',
          },
        ],
      },
      impact: {
        title: 'Impact du refus des cookies',
        description: 'Si vous désactivez certains cookies :',
        consequences: [
          'Vous devrez peut-être vous reconnecter à chaque visite',
          'Certaines fonctionnalités du site peuvent ne pas fonctionner correctement',
          'Votre expérience utilisateur peut être moins personnalisée',
          'Le panier d\'achat peut ne pas fonctionner',
        ],
      },
      updates: {
        title: 'Mises à jour de cette politique',
        description: 'Nous pouvons mettre à jour cette politique occasionnellement. La date de dernière mise à jour sera indiquée en haut de cette page.',
      },
      contact: {
        title: 'Contact',
        description: 'Pour toute question concernant notre utilisation des cookies :',
        email: 'privacy@naturepharmacy.sn',
        privacy: 'Consultez notre Politique de Confidentialité',
      },
    },
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'Last updated: December 1, 2025',
      intro: 'This policy explains how Nature Pharmacy uses cookies and similar technologies on our website.',
      whatAre: {
        title: 'What is a cookie?',
        description: 'Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences over a period of time.',
      },
      types: {
        title: 'Types of cookies we use',
        categories: [
          {
            name: 'Essential cookies',
            necessary: true,
            description: 'These cookies are necessary for the site to function. They enable basic functions like page navigation and access to secure areas.',
            examples: [
              'Session authentication',
              'Shopping cart',
              'Language preferences',
              'Site security',
            ],
            canDisable: false,
          },
          {
            name: 'Performance cookies',
            necessary: false,
            description: 'These cookies collect information about how visitors use our site, such as most visited pages and error messages.',
            examples: [
              'Google Analytics',
              'Page load times',
              'Bounce rate',
              'User journey',
            ],
            canDisable: true,
          },
          {
            name: 'Functionality cookies',
            necessary: false,
            description: 'These cookies allow the site to remember your choices to provide a personalized experience.',
            examples: [
              'Display preferences',
              'Location',
              'Font size',
              'Browsing history',
            ],
            canDisable: true,
          },
          {
            name: 'Advertising cookies',
            necessary: false,
            description: 'These cookies are used to display relevant and personalized ads based on your interests.',
            examples: [
              'Targeted ads',
              'Remarketing',
              'Conversion tracking',
              'Ad analytics',
            ],
            canDisable: true,
          },
        ],
      },
      thirdParty: {
        title: 'Third-party cookies',
        description: 'We use third-party services that may also set cookies:',
        services: [
          {
            name: 'Google Analytics',
            purpose: 'Traffic analysis and visitor behavior',
            link: 'https://policies.google.com/privacy',
          },
          {
            name: 'Social networks',
            purpose: 'Content sharing on social networks',
            link: null,
          },
          {
            name: 'Payment partners',
            purpose: 'Secure payment processing',
            link: null,
          },
        ],
      },
      duration: {
        title: 'Retention period',
        types: [
          {
            type: 'Session cookies',
            duration: 'Deleted when you close your browser',
          },
          {
            type: 'Persistent cookies',
            duration: 'Retained for a specific period (typically 1-24 months)',
          },
        ],
      },
      manage: {
        title: 'How to manage your cookies',
        description: 'You can control and manage cookies in several ways:',
        methods: [
          {
            title: 'Browser settings',
            description: 'Most browsers allow you to refuse or accept cookies. Check your browser help for more information.',
            browsers: [
              'Chrome: Settings > Privacy and security > Cookies',
              'Firefox: Options > Privacy and security > Cookies',
              'Safari: Preferences > Privacy > Cookies',
              'Edge: Settings > Privacy > Cookies',
            ],
          },
          {
            title: 'Cookie management tools',
            description: 'Use browser extensions or cookie management tools for finer control.',
          },
          {
            title: 'Our preferences',
            description: 'Use our cookie banner to accept or refuse certain cookie categories.',
          },
        ],
      },
      impact: {
        title: 'Impact of refusing cookies',
        description: 'If you disable certain cookies:',
        consequences: [
          'You may need to log in again on each visit',
          'Some site features may not work properly',
          'Your user experience may be less personalized',
          'The shopping cart may not work',
        ],
      },
      updates: {
        title: 'Updates to this policy',
        description: 'We may update this policy occasionally. The last update date will be shown at the top of this page.',
      },
      contact: {
        title: 'Contact',
        description: 'For any questions regarding our use of cookies:',
        email: 'privacy@naturepharmacy.sn',
        privacy: 'See our Privacy Policy',
      },
    },
    es: {
      title: 'Política de Cookies',
      lastUpdated: 'Última actualización: 1 de diciembre de 2025',
      intro: 'Esta política explica cómo Nature Pharmacy utiliza cookies y tecnologías similares en nuestro sitio web.',
      whatAre: {
        title: '¿Qué es una cookie?',
        description: 'Las cookies son pequeños archivos de texto almacenados en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo.',
      },
      types: {
        title: 'Tipos de cookies que utilizamos',
        categories: [
          {
            name: 'Cookies esenciales',
            necessary: true,
            description: 'Estas cookies son necesarias para que el sitio funcione. Permiten funciones básicas como navegación entre páginas y acceso a áreas seguras.',
            examples: [
              'Autenticación de sesión',
              'Carrito de compras',
              'Preferencias de idioma',
              'Seguridad del sitio',
            ],
            canDisable: false,
          },
          {
            name: 'Cookies de rendimiento',
            necessary: false,
            description: 'Estas cookies recopilan información sobre cómo los visitantes usan nuestro sitio, como las páginas más visitadas y los mensajes de error.',
            examples: [
              'Google Analytics',
              'Tiempos de carga de página',
              'Tasa de rebote',
              'Recorrido del usuario',
            ],
            canDisable: true,
          },
          {
            name: 'Cookies de funcionalidad',
            necessary: false,
            description: 'Estas cookies permiten que el sitio recuerde sus elecciones para ofrecer una experiencia personalizada.',
            examples: [
              'Preferencias de visualización',
              'Ubicación',
              'Tamaño de fuente',
              'Historial de navegación',
            ],
            canDisable: true,
          },
          {
            name: 'Cookies publicitarias',
            necessary: false,
            description: 'Estas cookies se utilizan para mostrar anuncios relevantes y personalizados según sus intereses.',
            examples: [
              'Anuncios dirigidos',
              'Remarketing',
              'Seguimiento de conversiones',
              'Análisis publicitario',
            ],
            canDisable: true,
          },
        ],
      },
      thirdParty: {
        title: 'Cookies de terceros',
        description: 'Utilizamos servicios de terceros que también pueden establecer cookies:',
        services: [
          {
            name: 'Google Analytics',
            purpose: 'Análisis de tráfico y comportamiento de visitantes',
            link: 'https://policies.google.com/privacy',
          },
          {
            name: 'Redes sociales',
            purpose: 'Compartir contenido en redes sociales',
            link: null,
          },
          {
            name: 'Socios de pago',
            purpose: 'Procesamiento seguro de pagos',
            link: null,
          },
        ],
      },
      duration: {
        title: 'Período de retención',
        types: [
          {
            type: 'Cookies de sesión',
            duration: 'Eliminadas cuando cierra su navegador',
          },
          {
            type: 'Cookies persistentes',
            duration: 'Retenidas por un período específico (típicamente 1-24 meses)',
          },
        ],
      },
      manage: {
        title: 'Cómo gestionar sus cookies',
        description: 'Puede controlar y gestionar cookies de varias maneras:',
        methods: [
          {
            title: 'Configuración del navegador',
            description: 'La mayoría de los navegadores le permiten rechazar o aceptar cookies. Consulte la ayuda de su navegador para más información.',
            browsers: [
              'Chrome: Configuración > Privacidad y seguridad > Cookies',
              'Firefox: Opciones > Privacidad y seguridad > Cookies',
              'Safari: Preferencias > Privacidad > Cookies',
              'Edge: Configuración > Privacidad > Cookies',
            ],
          },
          {
            title: 'Herramientas de gestión de cookies',
            description: 'Use extensiones de navegador o herramientas de gestión de cookies para un control más fino.',
          },
          {
            title: 'Nuestras preferencias',
            description: 'Use nuestro banner de cookies para aceptar o rechazar ciertas categorías de cookies.',
          },
        ],
      },
      impact: {
        title: 'Impacto del rechazo de cookies',
        description: 'Si deshabilita ciertas cookies:',
        consequences: [
          'Puede que deba iniciar sesión nuevamente en cada visita',
          'Algunas funciones del sitio pueden no funcionar correctamente',
          'Su experiencia de usuario puede ser menos personalizada',
          'El carrito de compras puede no funcionar',
        ],
      },
      updates: {
        title: 'Actualizaciones de esta política',
        description: 'Podemos actualizar esta política ocasionalmente. La fecha de última actualización se mostrará en la parte superior de esta página.',
      },
      contact: {
        title: 'Contacto',
        description: 'Para cualquier pregunta sobre nuestro uso de cookies:',
        email: 'privacy@naturepharmacy.sn',
        privacy: 'Consulte nuestra Política de Privacidad',
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
            <p className="text-sm text-gray-500 mb-4">{t.lastUpdated}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{t.intro}</p>
          </div>

          {/* What are cookies */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t.whatAre.title}
            </h2>
            <p className="text-gray-700">{t.whatAre.description}</p>
          </div>

          {/* Types of cookies */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.types.title}
            </h2>
            <div className="space-y-4">
              {t.types.categories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    {category.necessary ? (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {locale === 'fr' && 'Nécessaire'}
                        {locale === 'en' && 'Necessary'}
                        {locale === 'es' && 'Necesario'}
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {locale === 'fr' && 'Optionnel'}
                        {locale === 'en' && 'Optional'}
                        {locale === 'es' && 'Opcional'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{category.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {locale === 'fr' && 'Exemples :'}
                      {locale === 'en' && 'Examples:'}
                      {locale === 'es' && 'Ejemplos:'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {category.examples.map((example, exIndex) => (
                        <li key={exIndex}>{example}</li>
                      ))}
                    </ul>
                  </div>
                  {!category.canDisable && (
                    <p className="text-sm text-gray-600 mt-3">
                      {locale === 'fr' && '⚠️ Ces cookies ne peuvent pas être désactivés car ils sont essentiels au fonctionnement du site.'}
                      {locale === 'en' && '⚠️ These cookies cannot be disabled as they are essential to the site operation.'}
                      {locale === 'es' && '⚠️ Estas cookies no se pueden deshabilitar ya que son esenciales para el funcionamiento del sitio.'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Third-party cookies */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t.thirdParty.title}
            </h2>
            <p className="text-gray-700 mb-4">{t.thirdParty.description}</p>
            <div className="space-y-3">
              {t.thirdParty.services.map((service, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.purpose}</p>
                    {service.link && (
                      <a href={service.link} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700 underline">
                        {locale === 'fr' && 'Politique de confidentialité'}
                        {locale === 'en' && 'Privacy policy'}
                        {locale === 'es' && 'Política de privacidad'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.duration.title}
            </h2>
            <div className="space-y-3">
              {t.duration.types.map((type, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{type.type}</p>
                    <p className="text-gray-700">{type.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to manage */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t.manage.title}
            </h2>
            <p className="text-gray-700 mb-4">{t.manage.description}</p>
            <div className="space-y-4">
              {t.manage.methods.map((method, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{method.description}</p>
                  {method.browsers && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                      {method.browsers.map((browser, bIndex) => (
                        <li key={bIndex}>{browser}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Impact of refusing */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-900 mb-3">
              {t.impact.title}
            </h2>
            <p className="text-yellow-800 mb-3">{t.impact.description}</p>
            <ul className="list-disc list-inside space-y-2 text-yellow-800">
              {t.impact.consequences.map((consequence, index) => (
                <li key={index}>{consequence}</li>
              ))}
            </ul>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t.updates.title}
            </h2>
            <p className="text-gray-700">{t.updates.description}</p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-2xl font-bold mb-3">{t.contact.title}</h2>
            <p className="text-green-50 mb-3">{t.contact.description}</p>
            <p className="mb-4">
              <span className="font-semibold">Email:</span> {t.contact.email}
            </p>
            <Link
              href={`/${locale}/privacy`}
              className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              {t.contact.privacy}
            </Link>
          </div>
        </div>
      </main>

          </div>
  );
}
