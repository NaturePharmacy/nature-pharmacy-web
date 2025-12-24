'use client';

import { useLocale } from 'next-intl';

export default function ShippingPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Livraison et Expédition',
      subtitle: 'Tout ce que vous devez savoir sur nos services de livraison',
      zones: {
        title: 'Zones de livraison',
        description: 'Nature Pharmacy connecte des vendeurs du monde entier. Les frais et délais de livraison varient selon la localisation du vendeur et votre adresse de livraison.',
        items: [
          {
            title: 'Livraison locale',
            time: '1-3 jours',
            cost: 'Variable',
            details: 'Lorsque le vendeur est dans votre pays',
          },
          {
            title: 'Livraison régionale',
            time: '5-10 jours',
            cost: 'Variable',
            details: 'Livraison dans la même région (Afrique, Europe, Asie, etc.)',
          },
          {
            title: 'Livraison internationale',
            time: '10-21 jours',
            cost: 'Variable',
            details: 'Livraison entre continents',
          },
        ],
        note: 'Les frais de livraison sont calculés automatiquement selon la localisation du vendeur et votre adresse. Consultez chaque vendeur pour ses options de livraison gratuite.',
      },
      process: {
        title: 'Processus de livraison',
        steps: [
          {
            title: 'Confirmation de commande',
            description: 'Vous recevez un email de confirmation avec le numéro de suivi',
          },
          {
            title: 'Préparation',
            description: 'Le vendeur prépare votre colis (24-48h)',
          },
          {
            title: 'Expédition',
            description: 'Votre colis est remis au transporteur',
          },
          {
            title: 'Livraison',
            description: 'Vous recevez votre commande à l\'adresse indiquée',
          },
        ],
      },
      tracking: {
        title: 'Suivi de commande',
        description: 'Suivez votre colis en temps réel depuis votre compte',
        features: [
          'Numéro de suivi fourni dès l\'expédition',
          'Notifications par email et SMS',
          'Suivi en temps réel sur votre compte',
          'Historique complet des étapes',
        ],
      },
      packaging: {
        title: 'Emballage et Expédition',
        description: 'Chaque vendeur est responsable de l\'emballage et de l\'expédition de ses produits',
        features: [
          'Les vendeurs emballent vos commandes avec soin',
          'Protection adaptée selon le type de produit',
          'Expédition directe du vendeur vers vous',
          'Chaque vendeur choisit ses transporteurs de confiance',
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Puis-je modifier l\'adresse de livraison après avoir passé commande ?',
            a: 'Oui, vous pouvez modifier l\'adresse avant l\'expédition du colis. ',
          },
          {
            q: 'Que se passe-t-il si je suis absent lors de la livraison ?',
            a: 'Le livreur tentera une deuxième livraison. Vous pouvez aussi choisir un point relais lors de la commande.',
          },
          {
            q: 'Comment suivre ma commande ?',
            a: 'Connectez-vous à votre compte et consultez la section "Mes commandes" pour voir le statut en temps réel.',
          },
          {
            q: 'Les frais de livraison sont-ils remboursables ?',
            a: 'Les frais de livraison ne sont remboursés que si l\'erreur provient du transporteur.',
          },
          {
            q: 'Livrez-vous à l\'international ?',
            a: 'Oui,les délais et tarifs varient selon la destination.',
          },
        ],
      },
    },
    en: {
      title: 'Shipping and Delivery',
      subtitle: 'Everything you need to know about our delivery services',
      zones: {
        title: 'Delivery zones',
        description: 'Nature Pharmacy connects sellers from around the world. Shipping costs and delivery times vary depending on the seller\'s location and your delivery address.',
        items: [
          {
            title: 'Local delivery',
            time: '1-3 days',
            cost: 'Variable',
            details: 'When the seller is in your country',
          },
          {
            title: 'Regional delivery',
            time: '5-10 days',
            cost: 'Variable',
            details: 'Delivery within the same region (Africa, Europe, Asia, etc.)',
          },
          {
            title: 'International delivery',
            time: '10-21 days',
            cost: 'Variable',
            details: 'Delivery between continents',
          },
        ],
        note: 'Shipping costs are automatically calculated based on the seller\'s location and your address. Check each seller for their free shipping options.',
      },
      process: {
        title: 'Delivery process',
        steps: [
          {
            title: 'Order confirmation',
            description: 'You receive a confirmation email with the tracking number',
          },
          {
            title: 'Preparation',
            description: 'The seller prepares your package (24-48h)',
          },
          {
            title: 'Shipping',
            description: 'Your package is handed to the carrier',
          },
          {
            title: 'Delivery',
            description: 'You receive your order at the specified address',
          },
        ],
      },
      tracking: {
        title: 'Order tracking',
        description: 'Track your package in real-time from your account',
        features: [
          'Tracking number provided upon shipping',
          'Email and SMS notifications',
          'Real-time tracking on your account',
          'Complete history of steps',
        ],
      },
      packaging: {
        title: 'Packaging and Shipping',
        description: 'Each seller is responsible for packaging and shipping their products',
        features: [
          'Sellers carefully package your orders',
          'Protection adapted to product type',
          'Direct shipping from seller to you',
          'Each seller chooses their trusted carriers',
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'Can I change the delivery address after placing an order?',
            a: 'Yes, you can change the address before the package is shipped. Contact us quickly via support.',
          },
          {
            q: 'What happens if I\'m not present during delivery?',
            a: 'The delivery person will attempt a second delivery. You can also choose a pickup point when ordering.',
          },
          {
            q: 'How do I track my order?',
            a: 'Log in to your account and check the "My Orders" section to see the real-time status.',
          },
          {
            q: 'Are shipping fees refundable?',
            a: 'Shipping fees are only refunded if the error comes from us or the carrier.',
          },
          {
            q: 'Do you deliver internationally?',
            a: 'Yes, we deliver to several West African countries. Delivery times and rates vary by destination.',
          },
        ],
      },
    },
    es: {
      title: 'Envío y Entrega',
      subtitle: 'Todo lo que necesitas saber sobre nuestros servicios de entrega',
      zones: {
        title: 'Zonas de entrega',
        description: 'Nature Pharmacy conecta vendedores de todo el mundo. Los costos de envío y tiempos de entrega varían según la ubicación del vendedor y tu dirección de entrega.',
        items: [
          {
            title: 'Entrega local',
            time: '1-3 días',
            cost: 'Variable',
            details: 'Cuando el vendedor está en tu país',
          },
          {
            title: 'Entrega regional',
            time: '5-10 días',
            cost: 'Variable',
            details: 'Entrega dentro de la misma región (África, Europa, Asia, etc.)',
          },
          {
            title: 'Entrega internacional',
            time: '10-21 días',
            cost: 'Variable',
            details: 'Entrega entre continentes',
          },
        ],
        note: 'Los costos de envío se calculan automáticamente según la ubicación del vendedor y tu dirección. Consulta cada vendedor para sus opciones de envío gratuito.',
      },
      process: {
        title: 'Proceso de entrega',
        steps: [
          {
            title: 'Confirmación de pedido',
            description: 'Recibes un correo de confirmación con el número de seguimiento',
          },
          {
            title: 'Preparación',
            description: 'El vendedor prepara tu paquete (24-48h)',
          },
          {
            title: 'Envío',
            description: 'Tu paquete se entrega al transportista',
          },
          {
            title: 'Entrega',
            description: 'Recibes tu pedido en la dirección indicada',
          },
        ],
      },
      tracking: {
        title: 'Seguimiento de pedido',
        description: 'Rastrea tu paquete en tiempo real desde tu cuenta',
        features: [
          'Número de seguimiento proporcionado al enviar',
          'Notificaciones por correo y SMS',
          'Seguimiento en tiempo real en tu cuenta',
          'Historial completo de pasos',
        ],
      },
      packaging: {
        title: 'Embalaje y Envío',
        description: 'Cada vendedor es responsable del embalaje y envío de sus productos',
        features: [
          'Los vendedores embalan tus pedidos con cuidado',
          'Protección adaptada al tipo de producto',
          'Envío directo del vendedor a ti',
          'Cada vendedor elige sus transportistas de confianza',
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Puedo cambiar la dirección de entrega después de realizar un pedido?',
            a: 'Sí, puedes cambiar la dirección antes de que se envíe el paquete. Contáctanos rápidamente a través del soporte.',
          },
          {
            q: '¿Qué sucede si no estoy presente durante la entrega?',
            a: 'El repartidor intentará una segunda entrega. También puedes elegir un punto de recogida al hacer el pedido.',
          },
          {
            q: '¿Cómo rastro mi pedido?',
            a: 'Inicia sesión en tu cuenta y consulta la sección "Mis Pedidos" para ver el estado en tiempo real.',
          },
          {
            q: '¿Los gastos de envío son reembolsables?',
            a: 'Los gastos de envío solo se reembolsan si el error proviene de nosotros o del transportista.',
          },
          {
            q: '¿Entregan internacionalmente?',
            a: 'Sí, entregamos en varios países de África Occidental. Los plazos y tarifas varían según el destino.',
          },
        ],
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* Delivery Zones */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.zones.title}</h2>
            <p className="text-gray-600 mb-6">{t.zones.description}</p>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {t.zones.items.map((zone, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {zone.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{zone.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 font-semibold">{zone.cost}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{zone.details}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-800 text-sm">{t.zones.note}</p>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.process.title}</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {t.process.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index < t.process.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tracking */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {t.tracking.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{t.tracking.description}</p>
                  <ul className="space-y-2">
                    {t.tracking.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {t.packaging.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{t.packaging.description}</p>
                  <ul className="space-y-2">
                    {t.packaging.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.faq.title}</h2>
            <div className="space-y-4">
              {t.faq.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.q}
                  </h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

          </div>
  );
}
