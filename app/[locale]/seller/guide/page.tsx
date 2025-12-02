'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SellerGuidePage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Guide du Vendeur',
      subtitle: 'Tout ce que vous devez savoir pour réussir sur Nature Pharmacy',
      hero: {
        title: 'Devenez vendeur sur Nature Pharmacy',
        description: 'Rejoignez notre marketplace et vendez vos produits naturels à des milliers de clients.',
        cta: 'Créer un compte vendeur',
      },
      steps: {
        title: 'Comment démarrer',
        items: [
          {
            step: '1',
            title: 'Créer votre compte',
            description: 'Inscrivez-vous en tant que vendeur et complétez votre profil avec vos informations commerciales.',
          },
          {
            step: '2',
            title: 'Ajouter vos produits',
            description: 'Créez vos fiches produits avec des descriptions détaillées, photos de qualité et prix compétitifs.',
          },
          {
            step: '3',
            title: 'Gérer vos commandes',
            description: 'Recevez des notifications pour chaque commande et gérez le traitement depuis votre tableau de bord.',
          },
          {
            step: '4',
            title: 'Expédier et suivre',
            description: 'Préparez vos colis, générez les étiquettes d\'expédition et suivez les livraisons.',
          },
        ],
      },
      benefits: {
        title: 'Avantages pour les vendeurs',
        items: [
          {
            icon: 'users',
            title: 'Large audience',
            description: 'Accédez à des milliers de clients intéressés par les produits naturels',
          },
          {
            icon: 'chart',
            title: 'Outils de gestion',
            description: 'Dashboard complet pour gérer vos produits, commandes et statistiques',
          },
          {
            icon: 'shield',
            title: 'Paiements sécurisés',
            description: 'Recevez vos paiements de manière sécurisée et transparente',
          },
          {
            icon: 'support',
            title: 'Support dédié',
            description: 'Équipe de support disponible pour vous aider à réussir',
          },
        ],
      },
      fees: {
        title: 'Tarifs et commissions',
        description: 'Nous prélevons une commission sur chaque vente réalisée :',
        commission: '10% de commission sur chaque vente',
        details: [
          'Pas de frais d\'inscription',
          'Pas de frais mensuels',
          'Commission prélevée uniquement sur les ventes',
          'Paiements versés tous les 15 jours',
        ],
      },
      requirements: {
        title: 'Conditions requises',
        items: [
          'Produits naturels authentiques et de qualité',
          'Photos de haute qualité de vos produits',
          'Descriptions détaillées et précises',
          'Capacité à expédier dans les délais',
          'Service client réactif',
          'Respect des normes de qualité et sécurité',
        ],
      },
      tips: {
        title: 'Conseils pour réussir',
        items: [
          {
            title: 'Photos professionnelles',
            description: 'Utilisez des photos claires, bien éclairées et montrant le produit sous différents angles.',
          },
          {
            title: 'Descriptions détaillées',
            description: 'Incluez toutes les informations importantes : ingrédients, bienfaits, utilisation, précautions.',
          },
          {
            title: 'Prix compétitifs',
            description: 'Recherchez les prix du marché et proposez des tarifs attractifs.',
          },
          {
            title: 'Réponse rapide',
            description: 'Répondez rapidement aux questions des clients et traitez les commandes sans délai.',
          },
          {
            title: 'Stock à jour',
            description: 'Maintenez votre stock à jour pour éviter les ruptures et déceptions.',
          },
          {
            title: 'Avis clients',
            description: 'Encouragez vos clients à laisser des avis pour renforcer votre crédibilité.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Comment recevoir mes paiements ?',
            a: 'Les paiements sont versés automatiquement tous les 15 jours sur votre compte bancaire enregistré.',
          },
          {
            q: 'Qui gère la livraison ?',
            a: 'Vous êtes responsable de l\'expédition de vos produits. Nous vous fournissons des outils pour faciliter la gestion.',
          },
          {
            q: 'Puis-je vendre des produits importés ?',
            a: 'Oui, à condition qu\'ils soient conformes aux réglementations locales et clairement étiquetés.',
          },
          {
            q: 'Comment gérer les retours ?',
            a: 'Notre politique de retour s\'applique. Vous devez accepter les retours dans les 14 jours et rembourser le client.',
          },
        ],
      },
      cta: {
        title: 'Prêt à commencer ?',
        description: 'Créez votre compte vendeur dès aujourd\'hui et commencez à vendre vos produits naturels.',
        button: 'S\'inscrire maintenant',
        contact: 'Besoin d\'aide ? Contactez-nous',
      },
    },
    en: {
      title: 'Seller Guide',
      subtitle: 'Everything you need to know to succeed on Nature Pharmacy',
      hero: {
        title: 'Become a seller on Nature Pharmacy',
        description: 'Join our marketplace and sell your natural products to thousands of customers.',
        cta: 'Create seller account',
      },
      steps: {
        title: 'How to get started',
        items: [
          {
            step: '1',
            title: 'Create your account',
            description: 'Sign up as a seller and complete your profile with your business information.',
          },
          {
            step: '2',
            title: 'Add your products',
            description: 'Create product listings with detailed descriptions, quality photos and competitive prices.',
          },
          {
            step: '3',
            title: 'Manage your orders',
            description: 'Receive notifications for each order and manage processing from your dashboard.',
          },
          {
            step: '4',
            title: 'Ship and track',
            description: 'Prepare your packages, generate shipping labels and track deliveries.',
          },
        ],
      },
      benefits: {
        title: 'Seller benefits',
        items: [
          {
            icon: 'users',
            title: 'Large audience',
            description: 'Access thousands of customers interested in natural products',
          },
          {
            icon: 'chart',
            title: 'Management tools',
            description: 'Complete dashboard to manage your products, orders and statistics',
          },
          {
            icon: 'shield',
            title: 'Secure payments',
            description: 'Receive your payments securely and transparently',
          },
          {
            icon: 'support',
            title: 'Dedicated support',
            description: 'Support team available to help you succeed',
          },
        ],
      },
      fees: {
        title: 'Fees and commissions',
        description: 'We charge a commission on each sale made:',
        commission: '10% commission on each sale',
        details: [
          'No registration fees',
          'No monthly fees',
          'Commission charged only on sales',
          'Payments made every 15 days',
        ],
      },
      requirements: {
        title: 'Requirements',
        items: [
          'Authentic and quality natural products',
          'High-quality photos of your products',
          'Detailed and accurate descriptions',
          'Ability to ship on time',
          'Responsive customer service',
          'Compliance with quality and safety standards',
        ],
      },
      tips: {
        title: 'Tips for success',
        items: [
          {
            title: 'Professional photos',
            description: 'Use clear, well-lit photos showing the product from different angles.',
          },
          {
            title: 'Detailed descriptions',
            description: 'Include all important information: ingredients, benefits, usage, precautions.',
          },
          {
            title: 'Competitive prices',
            description: 'Research market prices and offer attractive rates.',
          },
          {
            title: 'Quick response',
            description: 'Respond quickly to customer questions and process orders promptly.',
          },
          {
            title: 'Updated stock',
            description: 'Keep your stock updated to avoid shortages and disappointments.',
          },
          {
            title: 'Customer reviews',
            description: 'Encourage your customers to leave reviews to strengthen your credibility.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How do I receive my payments?',
            a: 'Payments are automatically transferred every 15 days to your registered bank account.',
          },
          {
            q: 'Who handles delivery?',
            a: 'You are responsible for shipping your products. We provide tools to facilitate management.',
          },
          {
            q: 'Can I sell imported products?',
            a: 'Yes, provided they comply with local regulations and are clearly labeled.',
          },
          {
            q: 'How to handle returns?',
            a: 'Our return policy applies. You must accept returns within 14 days and refund the customer.',
          },
        ],
      },
      cta: {
        title: 'Ready to start?',
        description: 'Create your seller account today and start selling your natural products.',
        button: 'Sign up now',
        contact: 'Need help? Contact us',
      },
    },
    es: {
      title: 'Guía del Vendedor',
      subtitle: 'Todo lo que necesitas saber para tener éxito en Nature Pharmacy',
      hero: {
        title: 'Conviértete en vendedor en Nature Pharmacy',
        description: 'Únete a nuestro marketplace y vende tus productos naturales a miles de clientes.',
        cta: 'Crear cuenta de vendedor',
      },
      steps: {
        title: 'Cómo empezar',
        items: [
          {
            step: '1',
            title: 'Crea tu cuenta',
            description: 'Regístrate como vendedor y completa tu perfil con tu información comercial.',
          },
          {
            step: '2',
            title: 'Añade tus productos',
            description: 'Crea fichas de productos con descripciones detalladas, fotos de calidad y precios competitivos.',
          },
          {
            step: '3',
            title: 'Gestiona tus pedidos',
            description: 'Recibe notificaciones para cada pedido y gestiona el procesamiento desde tu panel.',
          },
          {
            step: '4',
            title: 'Envía y rastrea',
            description: 'Prepara tus paquetes, genera etiquetas de envío y rastrea las entregas.',
          },
        ],
      },
      benefits: {
        title: 'Beneficios para vendedores',
        items: [
          {
            icon: 'users',
            title: 'Gran audiencia',
            description: 'Accede a miles de clientes interesados en productos naturales',
          },
          {
            icon: 'chart',
            title: 'Herramientas de gestión',
            description: 'Panel completo para gestionar tus productos, pedidos y estadísticas',
          },
          {
            icon: 'shield',
            title: 'Pagos seguros',
            description: 'Recibe tus pagos de forma segura y transparente',
          },
          {
            icon: 'support',
            title: 'Soporte dedicado',
            description: 'Equipo de soporte disponible para ayudarte a tener éxito',
          },
        ],
      },
      fees: {
        title: 'Tarifas y comisiones',
        description: 'Cobramos una comisión en cada venta realizada:',
        commission: '10% de comisión en cada venta',
        details: [
          'Sin tasas de registro',
          'Sin tarifas mensuales',
          'Comisión cobrada solo en ventas',
          'Pagos realizados cada 15 días',
        ],
      },
      requirements: {
        title: 'Requisitos',
        items: [
          'Productos naturales auténticos y de calidad',
          'Fotos de alta calidad de tus productos',
          'Descripciones detalladas y precisas',
          'Capacidad para enviar a tiempo',
          'Servicio al cliente receptivo',
          'Cumplimiento de estándares de calidad y seguridad',
        ],
      },
      tips: {
        title: 'Consejos para el éxito',
        items: [
          {
            title: 'Fotos profesionales',
            description: 'Usa fotos claras, bien iluminadas y que muestren el producto desde diferentes ángulos.',
          },
          {
            title: 'Descripciones detalladas',
            description: 'Incluye toda la información importante: ingredientes, beneficios, uso, precauciones.',
          },
          {
            title: 'Precios competitivos',
            description: 'Investiga los precios del mercado y ofrece tarifas atractivas.',
          },
          {
            title: 'Respuesta rápida',
            description: 'Responde rápidamente a las preguntas de los clientes y procesa los pedidos sin demora.',
          },
          {
            title: 'Stock actualizado',
            description: 'Mantén tu stock actualizado para evitar roturas y decepciones.',
          },
          {
            title: 'Reseñas de clientes',
            description: 'Anima a tus clientes a dejar reseñas para fortalecer tu credibilidad.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Cómo recibo mis pagos?',
            a: 'Los pagos se transfieren automáticamente cada 15 días a tu cuenta bancaria registrada.',
          },
          {
            q: '¿Quién gestiona la entrega?',
            a: 'Eres responsable del envío de tus productos. Te proporcionamos herramientas para facilitar la gestión.',
          },
          {
            q: '¿Puedo vender productos importados?',
            a: 'Sí, siempre que cumplan con las regulaciones locales y estén claramente etiquetados.',
          },
          {
            q: '¿Cómo gestionar las devoluciones?',
            a: 'Se aplica nuestra política de devoluciones. Debes aceptar devoluciones dentro de 14 días y reembolsar al cliente.',
          },
        ],
      },
      cta: {
        title: '¿Listo para empezar?',
        description: 'Crea tu cuenta de vendedor hoy y comienza a vender tus productos naturales.',
        button: 'Registrarse ahora',
        contact: '¿Necesitas ayuda? Contáctanos',
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.hero.title}</h1>
            <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
              {t.hero.description}
            </p>
            <Link
              href={`/${locale}/register?role=seller`}
              className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-lg"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.steps.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.steps.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.benefits.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.benefits.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.fees.title}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600 mb-4">{t.fees.description}</p>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-green-600 text-center">
                  {t.fees.commission}
                </p>
              </div>
              <ul className="space-y-3">
                {t.fees.details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.requirements.title}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {t.requirements.items.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.tips.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.tips.items.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t.faq.title}
            </h2>
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

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
            <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/register?role=seller`}
                className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                {t.cta.button}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="px-8 py-3 bg-green-700 border-2 border-white text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {t.cta.contact}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
