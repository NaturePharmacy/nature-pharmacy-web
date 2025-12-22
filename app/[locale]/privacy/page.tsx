'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function PrivacyPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 1er décembre 2025',
      intro: 'Nature Pharmacy s\'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.',
      sections: [
        {
          title: '1. Informations que nous collectons',
          subsections: [
            {
              title: 'Informations fournies par vous',
              items: [
                'Nom complet et coordonnées (email, téléphone)',
                'Adresse de livraison et de facturation',
                'Informations de paiement (traitées par nos partenaires sécurisés)',
                'Historique d\'achats et préférences',
                'Communications avec notre service client',
              ],
            },
            {
              title: 'Informations collectées automatiquement',
              items: [
                'Adresse IP et données de localisation',
                'Type de navigateur et appareil utilisé',
                'Pages visitées et temps passé sur le site',
                'Cookies et technologies similaires',
              ],
            },
          ],
        },
        {
          title: '2. Comment nous utilisons vos informations',
          items: [
            'Traiter et livrer vos commandes',
            'Communiquer avec vous concernant vos achats',
            'Améliorer nos services et l\'expérience utilisateur',
            'Envoyer des offres promotionnelles (avec votre consentement)',
            'Prévenir la fraude et assurer la sécurité',
            'Respecter nos obligations légales',
          ],
        },
        {
          title: '3. Partage de vos informations',
          content: 'Nous ne vendons jamais vos informations personnelles. Nous partageons vos données uniquement avec :',
          items: [
            'Les vendeurs pour le traitement de vos commandes',
            'Les partenaires de paiement pour traiter les transactions',
            'Les transporteurs pour la livraison',
            'Les prestataires de services techniques (hébergement, analytics)',
            'Les autorités légales si requis par la loi',
          ],
        },
        {
          title: '4. Protection de vos données',
          items: [
            'Chiffrement SSL/TLS pour toutes les transmissions',
            'Accès restreint aux données personnelles',
            'Stockage sécurisé sur des serveurs protégés',
            'Audits de sécurité réguliers',
            'Formation du personnel sur la protection des données',
          ],
        },
        {
          title: '5. Vos droits',
          content: 'Conformément au RGPD et aux lois locales, vous avez le droit de :',
          items: [
            'Accéder à vos données personnelles',
            'Rectifier des informations inexactes',
            'Supprimer vos données (droit à l\'oubli)',
            'Limiter le traitement de vos données',
            'Vous opposer au traitement',
            'Recevoir vos données dans un format portable',
            'Retirer votre consentement à tout moment',
          ],
        },
        {
          title: '6. Cookies',
          content: 'Nous utilisons des cookies pour améliorer votre expérience. Types de cookies :',
          items: [
            'Cookies essentiels : nécessaires au fonctionnement du site',
            'Cookies de performance : analyse de l\'utilisation du site',
            'Cookies de fonctionnalité : mémorisation de vos préférences',
            'Cookies publicitaires : personnalisation des annonces',
          ],
          link: 'Consultez notre politique sur les cookies pour plus de détails.',
        },
        {
          title: '7. Conservation des données',
          items: [
            'Données de compte : tant que votre compte est actif',
            'Historique d\'achats : 10 ans (obligations fiscales)',
            'Données marketing : jusqu\'à retrait du consentement',
            'Données de navigation : 13 mois maximum',
          ],
        },
        {
          title: '8. Transferts internationaux',
          content: 'Vos données peuvent être transférées et stockées dans d\'autres pays. Nous assurons un niveau de protection adéquat conformément aux réglementations applicables.',
        },
        {
          title: '9. Mineurs',
          content: 'Notre service n\'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment d\'informations auprès de mineurs.',
        },
        {
          title: '10. Modifications de cette politique',
          content: 'Nous pouvons mettre à jour cette politique occasionnellement. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.',
        },
        {
          title: '11. Contact',
          content: 'Pour toute question concernant cette politique ou pour exercer vos droits :',
          contact: {
            email: 'privacy@naturepharmacy.sn',
            phone: '+221 XX XXX XX XX',
            address: 'Délégué à la Protection des Données, Nature Pharmacy, Dakar, Sénégal',
          },
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: December 1, 2025',
      intro: 'Nature Pharmacy is committed to protecting your privacy. This policy explains how we collect, use and protect your personal information.',
      sections: [
        {
          title: '1. Information we collect',
          subsections: [
            {
              title: 'Information provided by you',
              items: [
                'Full name and contact details (email, phone)',
                'Delivery and billing address',
                'Payment information (processed by our secure partners)',
                'Purchase history and preferences',
                'Communications with our customer service',
              ],
            },
            {
              title: 'Information collected automatically',
              items: [
                'IP address and location data',
                'Browser type and device used',
                'Pages visited and time spent on site',
                'Cookies and similar technologies',
              ],
            },
          ],
        },
        {
          title: '2. How we use your information',
          items: [
            'Process and deliver your orders',
            'Communicate with you regarding your purchases',
            'Improve our services and user experience',
            'Send promotional offers (with your consent)',
            'Prevent fraud and ensure security',
            'Comply with our legal obligations',
          ],
        },
        {
          title: '3. Sharing your information',
          content: 'We never sell your personal information. We share your data only with:',
          items: [
            'Sellers to process your orders',
            'Payment partners to process transactions',
            'Carriers for delivery',
            'Technical service providers (hosting, analytics)',
            'Legal authorities if required by law',
          ],
        },
        {
          title: '4. Data protection',
          items: [
            'SSL/TLS encryption for all transmissions',
            'Restricted access to personal data',
            'Secure storage on protected servers',
            'Regular security audits',
            'Staff training on data protection',
          ],
        },
        {
          title: '5. Your rights',
          content: 'In accordance with GDPR and local laws, you have the right to:',
          items: [
            'Access your personal data',
            'Rectify inaccurate information',
            'Delete your data (right to be forgotten)',
            'Limit data processing',
            'Object to processing',
            'Receive your data in a portable format',
            'Withdraw your consent at any time',
          ],
        },
        {
          title: '6. Cookies',
          content: 'We use cookies to improve your experience. Types of cookies:',
          items: [
            'Essential cookies: necessary for site operation',
            'Performance cookies: site usage analysis',
            'Functionality cookies: memorization of preferences',
            'Advertising cookies: ad personalization',
          ],
          link: 'See our cookie policy for more details.',
        },
        {
          title: '7. Data retention',
          items: [
            'Account data: as long as your account is active',
            'Purchase history: 10 years (tax obligations)',
            'Marketing data: until consent withdrawal',
            'Browsing data: 13 months maximum',
          ],
        },
        {
          title: '8. International transfers',
          content: 'Your data may be transferred and stored in other countries. We ensure an adequate level of protection in accordance with applicable regulations.',
        },
        {
          title: '9. Minors',
          content: 'Our service is not intended for persons under 18 years of age. We do not knowingly collect information from minors.',
        },
        {
          title: '10. Changes to this policy',
          content: 'We may update this policy occasionally. Changes will be posted on this page with a new update date.',
        },
        {
          title: '11. Contact',
          content: 'For any questions regarding this policy or to exercise your rights:',
          contact: {
            email: 'privacy@naturepharmacy.sn',
            phone: '+221 XX XXX XX XX',
            address: 'Data Protection Officer, Nature Pharmacy, Dakar, Senegal',
          },
        },
      ],
    },
    es: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última actualización: 1 de diciembre de 2025',
      intro: 'Nature Pharmacy se compromete a proteger su privacidad. Esta política explica cómo recopilamos, usamos y protegemos su información personal.',
      sections: [
        {
          title: '1. Información que recopilamos',
          subsections: [
            {
              title: 'Información proporcionada por usted',
              items: [
                'Nombre completo y datos de contacto (correo, teléfono)',
                'Dirección de entrega y facturación',
                'Información de pago (procesada por nuestros socios seguros)',
                'Historial de compras y preferencias',
                'Comunicaciones con nuestro servicio al cliente',
              ],
            },
            {
              title: 'Información recopilada automáticamente',
              items: [
                'Dirección IP y datos de ubicación',
                'Tipo de navegador y dispositivo usado',
                'Páginas visitadas y tiempo en el sitio',
                'Cookies y tecnologías similares',
              ],
            },
          ],
        },
        {
          title: '2. Cómo usamos su información',
          items: [
            'Procesar y entregar sus pedidos',
            'Comunicarnos con usted sobre sus compras',
            'Mejorar nuestros servicios y experiencia de usuario',
            'Enviar ofertas promocionales (con su consentimiento)',
            'Prevenir fraude y garantizar seguridad',
            'Cumplir con nuestras obligaciones legales',
          ],
        },
        {
          title: '3. Compartir su información',
          content: 'Nunca vendemos su información personal. Compartimos sus datos solo con:',
          items: [
            'Vendedores para procesar sus pedidos',
            'Socios de pago para procesar transacciones',
            'Transportistas para la entrega',
            'Proveedores de servicios técnicos (alojamiento, análisis)',
            'Autoridades legales si lo requiere la ley',
          ],
        },
        {
          title: '4. Protección de datos',
          items: [
            'Cifrado SSL/TLS para todas las transmisiones',
            'Acceso restringido a datos personales',
            'Almacenamiento seguro en servidores protegidos',
            'Auditorías de seguridad regulares',
            'Capacitación del personal en protección de datos',
          ],
        },
        {
          title: '5. Sus derechos',
          content: 'De acuerdo con el RGPD y las leyes locales, tiene derecho a:',
          items: [
            'Acceder a sus datos personales',
            'Rectificar información inexacta',
            'Eliminar sus datos (derecho al olvido)',
            'Limitar el procesamiento de datos',
            'Oponerse al procesamiento',
            'Recibir sus datos en formato portátil',
            'Retirar su consentimiento en cualquier momento',
          ],
        },
        {
          title: '6. Cookies',
          content: 'Usamos cookies para mejorar su experiencia. Tipos de cookies:',
          items: [
            'Cookies esenciales: necesarias para el funcionamiento del sitio',
            'Cookies de rendimiento: análisis del uso del sitio',
            'Cookies de funcionalidad: memorización de preferencias',
            'Cookies publicitarias: personalización de anuncios',
          ],
          link: 'Consulte nuestra política de cookies para más detalles.',
        },
        {
          title: '7. Retención de datos',
          items: [
            'Datos de cuenta: mientras su cuenta esté activa',
            'Historial de compras: 10 años (obligaciones fiscales)',
            'Datos de marketing: hasta el retiro del consentimiento',
            'Datos de navegación: 13 meses máximo',
          ],
        },
        {
          title: '8. Transferencias internacionales',
          content: 'Sus datos pueden transferirse y almacenarse en otros países. Aseguramos un nivel adecuado de protección de acuerdo con las regulaciones aplicables.',
        },
        {
          title: '9. Menores',
          content: 'Nuestro servicio no está destinado a personas menores de 18 años. No recopilamos información de menores a sabiendas.',
        },
        {
          title: '10. Cambios en esta política',
          content: 'Podemos actualizar esta política ocasionalmente. Los cambios se publicarán en esta página con una nueva fecha de actualización.',
        },
        {
          title: '11. Contacto',
          content: 'Para cualquier pregunta sobre esta política o para ejercer sus derechos:',
          contact: {
            email: 'privacy@naturepharmacy.sn',
            phone: '+221 XX XXX XX XX',
            address: 'Oficial de Protección de Datos, Nature Pharmacy, Dakar, Senegal',
          },
        },
      ],
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

          {/* Sections */}
          <div className="space-y-6">
            {t.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>

                {section.content && (
                  <p className="text-gray-700 mb-3">{section.content}</p>
                )}

                {section.subsections ? (
                  <div className="space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {subsection.title}
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : section.items ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.link && (
                  <p className="text-gray-700 mt-3">
                    <Link href={`/${locale}/cookies`} className="text-green-600 hover:text-green-700 underline">
                      {section.link}
                    </Link>
                  </p>
                )}

                {section.contact && (
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span> {section.contact.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">{locale === 'fr' ? 'Téléphone' : locale === 'en' ? 'Phone' : 'Teléfono'}:</span> {section.contact.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">{locale === 'fr' ? 'Adresse' : locale === 'en' ? 'Address' : 'Dirección'}:</span> {section.contact.address}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              {locale === 'fr' && 'Des questions sur notre politique de confidentialité ?'}
              {locale === 'en' && 'Questions about our privacy policy?'}
              {locale === 'es' && '¿Preguntas sobre nuestra política de privacidad?'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {locale === 'fr' && 'Contactez-nous'}
              {locale === 'en' && 'Contact us'}
              {locale === 'es' && 'Contáctenos'}
            </Link>
          </div>
        </div>
      </main>

          </div>
  );
}
