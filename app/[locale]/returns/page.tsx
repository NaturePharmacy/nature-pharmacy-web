'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ReturnsPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Retours et Remboursements',
      subtitle: 'Notre politique de retour simple et transparente',
      intro: {
        title: 'Satisfait ou remboursé',
        description: 'Votre satisfaction est notre priorité. Si vous n\'êtes pas satisfait de votre achat, nous acceptons les retours dans les 14 jours suivant la réception.',
      },
      conditions: {
        title: 'Conditions de retour',
        eligible: {
          title: 'Produits éligibles au retour',
          items: [
            'Produits non ouverts et dans leur emballage d\'origine',
            'Produits non utilisés et en parfait état',
            'Étiquettes et scellés de sécurité intacts',
            'Emballage d\'origine non endommagé',
            'Retour demandé dans les 14 jours suivant la réception',
          ],
        },
        nonEligible: {
          title: 'Produits non éligibles au retour',
          items: [
            'Produits ouverts ou utilisés',
            'Produits sans emballage d\'origine',
            'Produits périssables (sauf défaut)',
            'Produits personnalisés ou sur mesure',
            'Articles en promotion soldés à plus de 50%',
          ],
        },
      },
      process: {
        title: 'Comment retourner un produit',
        steps: [
          {
            number: '1',
            title: 'Demande de retour',
            description: 'Connectez-vous à votre compte et initiez une demande de retour depuis "Mes commandes".',
          },
          {
            number: '2',
            title: 'Confirmation',
            description: 'Notre équipe examine votre demande et vous envoie une confirmation par email (24-48h).',
          },
          {
            number: '3',
            title: 'Renvoi du produit',
            description: 'Emballez soigneusement le produit et renvoyez-le à l\'adresse indiquée dans l\'email.',
          },
          {
            number: '4',
            title: 'Inspection',
            description: 'Nous inspectons le produit à réception pour vérifier qu\'il respecte les conditions.',
          },
          {
            number: '5',
            title: 'Remboursement',
            description: 'Si approuvé, le remboursement est effectué sous 5-7 jours ouvrables.',
          },
        ],
      },
      refunds: {
        title: 'Modalités de remboursement',
        items: [
          {
            title: 'Méthode de remboursement',
            description: 'Le remboursement est effectué sur le même moyen de paiement utilisé lors de l\'achat.',
          },
          {
            title: 'Délai de remboursement',
            description: '5-7 jours ouvrables après validation du retour. Délai bancaire supplémentaire possible.',
          },
          {
            title: 'Montant remboursé',
            description: 'Prix du produit remboursé intégralement. Frais de livraison initiaux non remboursés sauf en cas de défaut.',
          },
          {
            title: 'Frais de retour',
            description: 'À la charge du client sauf si le produit est défectueux ou si l\'erreur provient de notre part.',
          },
        ],
      },
      defective: {
        title: 'Produits défectueux ou endommagés',
        description: 'Si vous recevez un produit défectueux, endommagé ou non conforme :',
        steps: [
          'Contactez-nous immédiatement via le support',
          'Fournissez des photos du produit et de l\'emballage',
          'Nous organisons la collecte du produit à nos frais',
          'Remplacement ou remboursement intégral (y compris frais de livraison)',
        ],
      },
      exchange: {
        title: 'Échanges',
        description: 'Nous n\'effectuons pas d\'échanges directs. Pour obtenir un article différent :',
        steps: [
          '1. Retournez l\'article original',
          '2. Recevez votre remboursement',
          '3. Passez une nouvelle commande pour l\'article souhaité',
        ],
      },
      contact: {
        title: 'Besoin d\'aide ?',
        description: 'Notre équipe est là pour vous aider avec votre retour',
        cta: 'Contacter le support',
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Combien de temps ai-je pour retourner un produit ?',
            a: 'Vous disposez de 14 jours à compter de la réception de votre commande pour demander un retour.',
          },
          {
            q: 'Qui paie les frais de retour ?',
            a: 'Les frais de retour sont à votre charge, sauf si le produit est défectueux ou si nous avons commis une erreur.',
          },
          {
            q: 'Puis-je retourner un produit ouvert ?',
            a: 'Non, pour des raisons d\'hygiène et de sécurité, nous n\'acceptons que les produits non ouverts dans leur emballage d\'origine.',
          },
          {
            q: 'Quand vais-je recevoir mon remboursement ?',
            a: 'Le remboursement est traité sous 5-7 jours ouvrables après validation du retour. Le délai bancaire peut varier.',
          },
          {
            q: 'Puis-je échanger un produit contre un autre ?',
            a: 'Nous ne faisons pas d\'échanges directs. Retournez le produit pour un remboursement et passez une nouvelle commande.',
          },
        ],
      },
    },
    en: {
      title: 'Returns and Refunds',
      subtitle: 'Our simple and transparent return policy',
      intro: {
        title: 'Satisfied or refunded',
        description: 'Your satisfaction is our priority. If you are not satisfied with your purchase, we accept returns within 14 days of receipt.',
      },
      conditions: {
        title: 'Return conditions',
        eligible: {
          title: 'Products eligible for return',
          items: [
            'Unopened products in their original packaging',
            'Unused products in perfect condition',
            'Labels and security seals intact',
            'Undamaged original packaging',
            'Return requested within 14 days of receipt',
          ],
        },
        nonEligible: {
          title: 'Products not eligible for return',
          items: [
            'Opened or used products',
            'Products without original packaging',
            'Perishable products (except defects)',
            'Personalized or custom products',
            'Promotional items discounted by more than 50%',
          ],
        },
      },
      process: {
        title: 'How to return a product',
        steps: [
          {
            number: '1',
            title: 'Return request',
            description: 'Log in to your account and initiate a return request from "My Orders".',
          },
          {
            number: '2',
            title: 'Confirmation',
            description: 'Our team reviews your request and sends you a confirmation email (24-48h).',
          },
          {
            number: '3',
            title: 'Return the product',
            description: 'Carefully package the product and return it to the address indicated in the email.',
          },
          {
            number: '4',
            title: 'Inspection',
            description: 'We inspect the product upon receipt to verify that it meets the conditions.',
          },
          {
            number: '5',
            title: 'Refund',
            description: 'If approved, the refund is processed within 5-7 business days.',
          },
        ],
      },
      refunds: {
        title: 'Refund terms',
        items: [
          {
            title: 'Refund method',
            description: 'The refund is made to the same payment method used during purchase.',
          },
          {
            title: 'Refund period',
            description: '5-7 business days after return validation. Additional bank processing time possible.',
          },
          {
            title: 'Amount refunded',
            description: 'Product price refunded in full. Initial shipping fees not refunded except in case of defect.',
          },
          {
            title: 'Return costs',
            description: 'Borne by the customer unless the product is defective or the error comes from our side.',
          },
        ],
      },
      defective: {
        title: 'Defective or damaged products',
        description: 'If you receive a defective, damaged or non-conforming product:',
        steps: [
          'Contact us immediately via support',
          'Provide photos of the product and packaging',
          'We arrange product collection at our expense',
          'Replacement or full refund (including shipping fees)',
        ],
      },
      exchange: {
        title: 'Exchanges',
        description: 'We do not make direct exchanges. To get a different item:',
        steps: [
          '1. Return the original item',
          '2. Receive your refund',
          '3. Place a new order for the desired item',
        ],
      },
      contact: {
        title: 'Need help?',
        description: 'Our team is here to help with your return',
        cta: 'Contact support',
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How long do I have to return a product?',
            a: 'You have 14 days from receipt of your order to request a return.',
          },
          {
            q: 'Who pays the return fees?',
            a: 'Return fees are your responsibility, unless the product is defective or we made an error.',
          },
          {
            q: 'Can I return an opened product?',
            a: 'No, for hygiene and safety reasons, we only accept unopened products in their original packaging.',
          },
          {
            q: 'When will I receive my refund?',
            a: 'The refund is processed within 5-7 business days after return validation. Bank processing time may vary.',
          },
          {
            q: 'Can I exchange a product for another?',
            a: 'We do not make direct exchanges. Return the product for a refund and place a new order.',
          },
        ],
      },
    },
    es: {
      title: 'Devoluciones y Reembolsos',
      subtitle: 'Nuestra política de devolución simple y transparente',
      intro: {
        title: 'Satisfecho o reembolsado',
        description: 'Tu satisfacción es nuestra prioridad. Si no estás satisfecho con tu compra, aceptamos devoluciones dentro de los 14 días posteriores a la recepción.',
      },
      conditions: {
        title: 'Condiciones de devolución',
        eligible: {
          title: 'Productos elegibles para devolución',
          items: [
            'Productos sin abrir en su embalaje original',
            'Productos sin usar y en perfecto estado',
            'Etiquetas y sellos de seguridad intactos',
            'Embalaje original sin daños',
            'Devolución solicitada dentro de los 14 días posteriores a la recepción',
          ],
        },
        nonEligible: {
          title: 'Productos no elegibles para devolución',
          items: [
            'Productos abiertos o usados',
            'Productos sin embalaje original',
            'Productos perecederos (excepto defectos)',
            'Productos personalizados o hechos a medida',
            'Artículos en promoción con descuento superior al 50%',
          ],
        },
      },
      process: {
        title: 'Cómo devolver un producto',
        steps: [
          {
            number: '1',
            title: 'Solicitud de devolución',
            description: 'Inicia sesión en tu cuenta e inicia una solicitud de devolución desde "Mis Pedidos".',
          },
          {
            number: '2',
            title: 'Confirmación',
            description: 'Nuestro equipo revisa tu solicitud y te envía un correo de confirmación (24-48h).',
          },
          {
            number: '3',
            title: 'Devolver el producto',
            description: 'Empaqueta cuidadosamente el producto y devuélvelo a la dirección indicada en el correo.',
          },
          {
            number: '4',
            title: 'Inspección',
            description: 'Inspeccionamos el producto al recibirlo para verificar que cumple las condiciones.',
          },
          {
            number: '5',
            title: 'Reembolso',
            description: 'Si se aprueba, el reembolso se procesa en 5-7 días hábiles.',
          },
        ],
      },
      refunds: {
        title: 'Términos de reembolso',
        items: [
          {
            title: 'Método de reembolso',
            description: 'El reembolso se realiza al mismo método de pago utilizado durante la compra.',
          },
          {
            title: 'Plazo de reembolso',
            description: '5-7 días hábiles después de la validación de la devolución. Posible tiempo adicional de procesamiento bancario.',
          },
          {
            title: 'Monto reembolsado',
            description: 'Precio del producto reembolsado en su totalidad. Gastos de envío iniciales no reembolsados excepto en caso de defecto.',
          },
          {
            title: 'Costos de devolución',
            description: 'A cargo del cliente a menos que el producto sea defectuoso o el error provenga de nuestra parte.',
          },
        ],
      },
      defective: {
        title: 'Productos defectuosos o dañados',
        description: 'Si recibes un producto defectuoso, dañado o no conforme:',
        steps: [
          'Contáctanos inmediatamente a través del soporte',
          'Proporciona fotos del producto y el embalaje',
          'Organizamos la recogida del producto a nuestro cargo',
          'Reemplazo o reembolso completo (incluidos gastos de envío)',
        ],
      },
      exchange: {
        title: 'Intercambios',
        description: 'No realizamos intercambios directos. Para obtener un artículo diferente:',
        steps: [
          '1. Devuelve el artículo original',
          '2. Recibe tu reembolso',
          '3. Realiza un nuevo pedido para el artículo deseado',
        ],
      },
      contact: {
        title: '¿Necesitas ayuda?',
        description: 'Nuestro equipo está aquí para ayudarte con tu devolución',
        cta: 'Contactar soporte',
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Cuánto tiempo tengo para devolver un producto?',
            a: 'Tienes 14 días desde la recepción de tu pedido para solicitar una devolución.',
          },
          {
            q: '¿Quién paga los gastos de devolución?',
            a: 'Los gastos de devolución son tu responsabilidad, a menos que el producto sea defectuoso o hayamos cometido un error.',
          },
          {
            q: '¿Puedo devolver un producto abierto?',
            a: 'No, por razones de higiene y seguridad, solo aceptamos productos sin abrir en su embalaje original.',
          },
          {
            q: '¿Cuándo recibiré mi reembolso?',
            a: 'El reembolso se procesa en 5-7 días hábiles después de la validación de la devolución. El tiempo de procesamiento bancario puede variar.',
          },
          {
            q: '¿Puedo intercambiar un producto por otro?',
            a: 'No realizamos intercambios directos. Devuelve el producto para un reembolso y realiza un nuevo pedido.',
          },
        ],
      },
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* Intro */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t.intro.title}</h2>
              <p className="text-lg text-green-50">{t.intro.description}</p>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t.conditions.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Eligible */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.conditions.eligible.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.conditions.eligible.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-eligible */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.conditions.nonEligible.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.conditions.nonEligible.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t.process.title}
            </h2>
            <div className="space-y-4">
              {t.process.steps.map((step, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refunds */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {t.refunds.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.refunds.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Defective Products */}
          <div className="mb-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-900 mb-4">
                {t.defective.title}
              </h2>
              <p className="text-red-800 mb-4">{t.defective.description}</p>
              <ul className="space-y-2">
                {t.defective.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exchanges */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.exchange.title}
              </h2>
              <p className="text-gray-600 mb-4">{t.exchange.description}</p>
              <div className="bg-gray-50 rounded-lg p-6">
                {t.exchange.steps.map((step, index) => (
                  <p key={index} className="text-gray-700 mb-2 last:mb-0">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">{t.contact.title}</h2>
              <p className="text-lg text-green-50 mb-6">{t.contact.description}</p>
              <Link
                href={`/${locale}/support`}
                className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                {t.contact.cta}
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
