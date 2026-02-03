'use client';

import { useLocale } from 'next-intl';

export default function TermsPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Conditions Générales d\'Utilisation',
      lastUpdated: 'Dernière mise à jour : 1er février 2026',
      sections: [
        {
          title: '1. Acceptation des conditions',
          content: [
            'En accédant et en utilisant la plateforme Nature Pharmacy, vous acceptez d\'être lié par les présentes conditions générales d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.',
            'Ces conditions s\'appliquent à tous les utilisateurs de la plateforme, y compris les acheteurs, les vendeurs et les visiteurs.',
          ],
        },
        {
          title: '2. Description du service',
          content: [
            'Nature Pharmacy est une marketplace internationale en ligne qui met en relation des vendeurs de produits naturels et des acheteurs du monde entier.',
            'Nous fournissons la plateforme technologique pour faciliter les transactions, mais nous ne sommes pas partie aux transactions entre vendeurs et acheteurs.',
            'Les vendeurs sont entièrement responsables de la qualité, de la légalité, de la conformité et de l\'expédition de leurs produits.',
            'Nature Pharmacy ne vend pas de produits directement, ne vérifie pas les produits et ne gère pas la livraison.',
          ],
        },
        {
          title: '3. Inscription et compte utilisateur',
          content: [
            'Pour effectuer des achats ou vendre sur la plateforme, vous devez créer un compte.',
            'Vous devez fournir des informations exactes, complètes et à jour lors de l\'inscription.',
            'Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
            'Vous devez avoir au moins 18 ans pour créer un compte.',
            'Nous nous réservons le droit de suspendre ou de supprimer tout compte en cas de violation des présentes conditions.',
          ],
        },
        {
          title: '4. Obligations des acheteurs',
          content: [
            'Fournir des informations de paiement et de livraison exactes.',
            'Payer pour les produits commandés conformément aux prix affichés.',
            'Respecter les délais de retour et les conditions de remboursement du vendeur.',
            'Ne pas utiliser la plateforme à des fins frauduleuses ou illégales.',
            'Comprendre que la livraison est gérée par le vendeur, non par Nature Pharmacy.',
          ],
        },
        {
          title: '5. Obligations des vendeurs',
          content: [
            'Vendre uniquement des produits légaux, authentiques et conformes aux normes de leur pays.',
            'Fournir des descriptions exactes et des photos représentatives de vos produits.',
            'Expédier les commandes dans les délais indiqués.',
            'Gérer intégralement la livraison et l\'expédition des produits.',
            'Honorer votre propre politique de retour et de remboursement.',
            'Maintenir un service client réactif et professionnel.',
            'Payer les commissions de 10% sur chaque vente.',
            'Respecter les lois locales et internationales applicables.',
          ],
        },
        {
          title: '6. Prix et paiement',
          content: [
            'Les prix sont affichés dans la devise du vendeur ou convertis selon la localisation de l\'acheteur.',
            'Les paiements sont traités de manière sécurisée via nos partenaires de paiement (Stripe, PayPal).',
            'Nature Pharmacy prélève une commission de 10% sur chaque vente.',
            'Les vendeurs reçoivent leurs paiements tous les 15 jours via Stripe Connect.',
          ],
        },
        {
          title: '7. Livraison',
          content: [
            'Les vendeurs sont entièrement responsables de l\'expédition des produits.',
            'Nature Pharmacy ne gère pas, ne vérifie pas et n\'est pas responsable de la livraison.',
            'Les délais et frais de livraison sont définis par chaque vendeur.',
            'Les acheteurs doivent contacter directement le vendeur pour toute question de livraison.',
            'Les conditions de livraison gratuite sont définies individuellement par chaque vendeur.',
          ],
        },
        {
          title: '8. Retours et remboursements',
          content: [
            'Chaque vendeur définit sa propre politique de retour.',
            'Les acheteurs doivent contacter le vendeur directement pour initier un retour.',
            'Les frais de retour sont généralement à la charge de l\'acheteur sauf accord contraire du vendeur.',
            'Nature Pharmacy peut intervenir en médiation en cas de litige non résolu.',
          ],
        },
        {
          title: '9. Propriété intellectuelle',
          content: [
            'Tous les contenus de la plateforme (logo, design, textes, etc.) sont la propriété de Nature Pharmacy.',
            'Les vendeurs conservent les droits sur leurs contenus (photos, descriptions) mais accordent à Nature Pharmacy une licence pour les afficher sur la plateforme.',
            'Toute utilisation non autorisée du contenu de la plateforme est strictement interdite.',
          ],
        },
        {
          title: '10. Limitation de responsabilité',
          content: [
            'Nature Pharmacy est une plateforme de mise en relation et n\'est pas responsable des produits vendus.',
            'Nous ne garantissons pas la qualité, la sécurité, la légalité ou l\'authenticité des produits.',
            'Nous ne vérifions pas les produits avant leur mise en vente.',
            'Nature Pharmacy ne peut être tenu responsable des retards de livraison ou des pertes de colis.',
            'Les litiges concernant les produits doivent être résolus entre l\'acheteur et le vendeur.',
          ],
        },
        {
          title: '11. Résiliation',
          content: [
            'Vous pouvez fermer votre compte à tout moment en nous contactant.',
            'Nous pouvons suspendre ou fermer votre compte en cas de violation des présentes conditions.',
            'En cas de fermeture de compte, les obligations de paiement restent dues.',
          ],
        },
        {
          title: '12. Modifications des conditions',
          content: [
            'Nous nous réservons le droit de modifier ces conditions à tout moment.',
            'Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.',
            'Votre utilisation continue de la plateforme après les modifications constitue votre acceptation des nouvelles conditions.',
          ],
        },
        {
          title: '13. Droit applicable et litiges',
          content: [
            'Ces conditions sont régies par les principes généraux du droit international du commerce électronique.',
            'En cas de litige, les parties s\'engagent à rechercher une solution amiable par médiation.',
            'À défaut de résolution amiable, le litige pourra être soumis à un arbitrage international.',
          ],
        },
        {
          title: '14. Contact',
          content: [
            'Pour toute question concernant ces conditions, veuillez nous contacter :',
            'Email : legal@nature-pharmacy.com',
            'Support : contact@nature-pharmacy.com',
          ],
        },
      ],
    },
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: February 1, 2026',
      sections: [
        {
          title: '1. Acceptance of terms',
          content: [
            'By accessing and using the Nature Pharmacy platform, you agree to be bound by these terms and conditions of use. If you do not accept these terms, please do not use our platform.',
            'These terms apply to all users of the platform, including buyers, sellers and visitors.',
          ],
        },
        {
          title: '2. Service description',
          content: [
            'Nature Pharmacy is an international online marketplace that connects sellers of natural products with buyers worldwide.',
            'We provide the technology platform to facilitate transactions, but we are not party to transactions between sellers and buyers.',
            'Sellers are fully responsible for the quality, legality, compliance and shipping of their products.',
            'Nature Pharmacy does not sell products directly, does not verify products and does not manage delivery.',
          ],
        },
        {
          title: '3. Registration and user account',
          content: [
            'To make purchases or sell on the platform, you must create an account.',
            'You must provide accurate, complete and up-to-date information during registration.',
            'You are responsible for the confidentiality of your login credentials.',
            'You must be at least 18 years old to create an account.',
            'We reserve the right to suspend or delete any account in case of violation of these terms.',
          ],
        },
        {
          title: '4. Buyer obligations',
          content: [
            'Provide accurate payment and delivery information.',
            'Pay for ordered products according to displayed prices.',
            'Respect the seller\'s return deadlines and refund conditions.',
            'Do not use the platform for fraudulent or illegal purposes.',
            'Understand that delivery is managed by the seller, not by Nature Pharmacy.',
          ],
        },
        {
          title: '5. Seller obligations',
          content: [
            'Sell only legal, authentic products that meet the standards of your country.',
            'Provide accurate descriptions and representative photos of your products.',
            'Ship orders within the indicated timeframes.',
            'Fully manage the delivery and shipping of products.',
            'Honor your own return and refund policy.',
            'Maintain responsive and professional customer service.',
            'Pay 10% commission on each sale.',
            'Comply with applicable local and international laws.',
          ],
        },
        {
          title: '6. Pricing and payment',
          content: [
            'Prices are displayed in the seller\'s currency or converted based on the buyer\'s location.',
            'Payments are processed securely through our payment partners (Stripe, PayPal).',
            'Nature Pharmacy charges a 10% commission on each sale.',
            'Sellers receive their payments every 15 days via Stripe Connect.',
          ],
        },
        {
          title: '7. Delivery',
          content: [
            'Sellers are fully responsible for shipping products.',
            'Nature Pharmacy does not manage, verify or take responsibility for delivery.',
            'Delivery times and fees are set by each seller.',
            'Buyers should contact the seller directly for any delivery questions.',
            'Free shipping conditions are defined individually by each seller.',
          ],
        },
        {
          title: '8. Returns and refunds',
          content: [
            'Each seller defines their own return policy.',
            'Buyers should contact the seller directly to initiate a return.',
            'Return fees are generally the buyer\'s responsibility unless otherwise agreed by the seller.',
            'Nature Pharmacy may intervene as a mediator in unresolved disputes.',
          ],
        },
        {
          title: '9. Intellectual property',
          content: [
            'All platform content (logo, design, texts, etc.) is the property of Nature Pharmacy.',
            'Sellers retain rights to their content (photos, descriptions) but grant Nature Pharmacy a license to display them on the platform.',
            'Any unauthorized use of platform content is strictly prohibited.',
          ],
        },
        {
          title: '10. Limitation of liability',
          content: [
            'Nature Pharmacy is a connection platform and is not responsible for products sold.',
            'We do not guarantee the quality, safety, legality or authenticity of products.',
            'We do not verify products before they are listed.',
            'Nature Pharmacy cannot be held responsible for delivery delays or lost packages.',
            'Disputes concerning products must be resolved between the buyer and the seller.',
          ],
        },
        {
          title: '11. Termination',
          content: [
            'You can close your account at any time by contacting us.',
            'We may suspend or close your account in case of violation of these terms.',
            'In case of account closure, payment obligations remain due.',
          ],
        },
        {
          title: '12. Changes to terms',
          content: [
            'We reserve the right to modify these terms at any time.',
            'Changes will be posted on this page with a new update date.',
            'Your continued use of the platform after changes constitutes your acceptance of the new terms.',
          ],
        },
        {
          title: '13. Applicable law and disputes',
          content: [
            'These terms are governed by general principles of international e-commerce law.',
            'In case of dispute, parties agree to seek an amicable solution through mediation.',
            'Failing an amicable resolution, the dispute may be submitted to international arbitration.',
          ],
        },
        {
          title: '14. Contact',
          content: [
            'For any questions regarding these terms, please contact us:',
            'Email: legal@nature-pharmacy.com',
            'Support: contact@nature-pharmacy.com',
          ],
        },
      ],
    },
    es: {
      title: 'Términos y Condiciones',
      lastUpdated: 'Última actualización: 1 de febrero de 2026',
      sections: [
        {
          title: '1. Aceptación de términos',
          content: [
            'Al acceder y usar la plataforma Nature Pharmacy, acepta estar obligado por estos términos y condiciones de uso. Si no acepta estos términos, no use nuestra plataforma.',
            'Estos términos se aplican a todos los usuarios de la plataforma, incluidos compradores, vendedores y visitantes.',
          ],
        },
        {
          title: '2. Descripción del servicio',
          content: [
            'Nature Pharmacy es un marketplace internacional en línea que conecta a vendedores de productos naturales con compradores de todo el mundo.',
            'Proporcionamos la plataforma tecnológica para facilitar transacciones, pero no somos parte de las transacciones entre vendedores y compradores.',
            'Los vendedores son totalmente responsables de la calidad, legalidad, cumplimiento y envío de sus productos.',
            'Nature Pharmacy no vende productos directamente, no verifica productos y no gestiona la entrega.',
          ],
        },
        {
          title: '3. Registro y cuenta de usuario',
          content: [
            'Para realizar compras o vender en la plataforma, debe crear una cuenta.',
            'Debe proporcionar información precisa, completa y actualizada durante el registro.',
            'Es responsable de la confidencialidad de sus credenciales de inicio de sesión.',
            'Debe tener al menos 18 años para crear una cuenta.',
            'Nos reservamos el derecho de suspender o eliminar cualquier cuenta en caso de violación de estos términos.',
          ],
        },
        {
          title: '4. Obligaciones del comprador',
          content: [
            'Proporcionar información de pago y entrega precisa.',
            'Pagar por los productos pedidos según los precios mostrados.',
            'Respetar los plazos de devolución y las condiciones de reembolso del vendedor.',
            'No usar la plataforma con fines fraudulentos o ilegales.',
            'Entender que la entrega es gestionada por el vendedor, no por Nature Pharmacy.',
          ],
        },
        {
          title: '5. Obligaciones del vendedor',
          content: [
            'Vender solo productos legales, auténticos y que cumplan con los estándares de su país.',
            'Proporcionar descripciones precisas y fotos representativas de sus productos.',
            'Enviar pedidos dentro de los plazos indicados.',
            'Gestionar completamente la entrega y el envío de productos.',
            'Honrar su propia política de devolución y reembolso.',
            'Mantener un servicio al cliente receptivo y profesional.',
            'Pagar una comisión del 10% en cada venta.',
            'Cumplir con las leyes locales e internacionales aplicables.',
          ],
        },
        {
          title: '6. Precios y pago',
          content: [
            'Los precios se muestran en la moneda del vendedor o se convierten según la ubicación del comprador.',
            'Los pagos se procesan de forma segura a través de nuestros socios de pago (Stripe, PayPal).',
            'Nature Pharmacy cobra una comisión del 10% en cada venta.',
            'Los vendedores reciben sus pagos cada 15 días a través de Stripe Connect.',
          ],
        },
        {
          title: '7. Entrega',
          content: [
            'Los vendedores son totalmente responsables del envío de productos.',
            'Nature Pharmacy no gestiona, no verifica y no es responsable de la entrega.',
            'Los tiempos y costos de entrega son definidos por cada vendedor.',
            'Los compradores deben contactar directamente al vendedor para cualquier pregunta sobre la entrega.',
            'Las condiciones de envío gratuito son definidas individualmente por cada vendedor.',
          ],
        },
        {
          title: '8. Devoluciones y reembolsos',
          content: [
            'Cada vendedor define su propia política de devolución.',
            'Los compradores deben contactar directamente al vendedor para iniciar una devolución.',
            'Los gastos de devolución son generalmente responsabilidad del comprador salvo acuerdo contrario del vendedor.',
            'Nature Pharmacy puede intervenir como mediador en disputas no resueltas.',
          ],
        },
        {
          title: '9. Propiedad intelectual',
          content: [
            'Todo el contenido de la plataforma (logotipo, diseño, textos, etc.) es propiedad de Nature Pharmacy.',
            'Los vendedores conservan los derechos sobre su contenido (fotos, descripciones) pero otorgan a Nature Pharmacy una licencia para mostrarlos en la plataforma.',
            'Cualquier uso no autorizado del contenido de la plataforma está estrictamente prohibido.',
          ],
        },
        {
          title: '10. Limitación de responsabilidad',
          content: [
            'Nature Pharmacy es una plataforma de conexión y no es responsable de los productos vendidos.',
            'No garantizamos la calidad, seguridad, legalidad o autenticidad de los productos.',
            'No verificamos los productos antes de que se pongan a la venta.',
            'Nature Pharmacy no puede ser responsable de retrasos en la entrega o paquetes perdidos.',
            'Las disputas sobre productos deben resolverse entre el comprador y el vendedor.',
          ],
        },
        {
          title: '11. Terminación',
          content: [
            'Puede cerrar su cuenta en cualquier momento contactándonos.',
            'Podemos suspender o cerrar su cuenta en caso de violación de estos términos.',
            'En caso de cierre de cuenta, las obligaciones de pago permanecen debidas.',
          ],
        },
        {
          title: '12. Cambios en los términos',
          content: [
            'Nos reservamos el derecho de modificar estos términos en cualquier momento.',
            'Los cambios se publicarán en esta página con una nueva fecha de actualización.',
            'Su uso continuo de la plataforma después de los cambios constituye su aceptación de los nuevos términos.',
          ],
        },
        {
          title: '13. Ley aplicable y disputas',
          content: [
            'Estos términos se rigen por los principios generales del derecho internacional del comercio electrónico.',
            'En caso de disputa, las partes se comprometen a buscar una solución amistosa mediante mediación.',
            'A falta de resolución amistosa, la disputa podrá someterse a arbitraje internacional.',
          ],
        },
        {
          title: '14. Contacto',
          content: [
            'Para cualquier pregunta sobre estos términos, contáctenos:',
            'Email: legal@nature-pharmacy.com',
            'Soporte: contact@nature-pharmacy.com',
          ],
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
            <p className="text-sm text-gray-500">{t.lastUpdated}</p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

          </div>
  );
}
