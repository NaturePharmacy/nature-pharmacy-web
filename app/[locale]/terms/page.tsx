'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const content = {
    fr: {
      title: 'Conditions Générales d\'Utilisation',
      lastUpdated: 'Dernière mise à jour : 1er décembre 2025',
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
            'Nature Pharmacy est une marketplace en ligne qui met en relation des vendeurs de produits naturels et des acheteurs.',
            'Nous fournissons la plateforme technologique pour faciliter les transactions, mais nous ne sommes pas partie aux transactions entre vendeurs et acheteurs.',
            'Les vendeurs sont responsables de la qualité, de la légalité et de la conformité de leurs produits.',
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
            'Respecter les délais de retour et les conditions de remboursement.',
            'Ne pas utiliser la plateforme à des fins frauduleuses ou illégales.',
          ],
        },
        {
          title: '5. Obligations des vendeurs',
          content: [
            'Vendre uniquement des produits légaux, authentiques et conformes aux normes.',
            'Fournir des descriptions exactes et des photos représentatives de vos produits.',
            'Expédier les commandes dans les délais indiqués.',
            'Honorer la politique de retour et de remboursement.',
            'Maintenir un service client réactif et professionnel.',
            'Payer les commissions de 10% sur chaque vente.',
          ],
        },
        {
          title: '6. Prix et paiement',
          content: [
            'Les prix sont affichés en Francs CFA (FCFA) et incluent toutes les taxes applicables.',
            'Les paiements sont traités de manière sécurisée via nos partenaires de paiement.',
            'Nature Pharmacy prélève une commission de 10% sur chaque vente.',
            'Les vendeurs reçoivent leurs paiements tous les 15 jours.',
          ],
        },
        {
          title: '7. Livraison',
          content: [
            'Les vendeurs sont responsables de l\'expédition des produits.',
            'Les délais de livraison indiqués sont estimatifs et non garantis.',
            'Les frais de livraison sont clairement indiqués avant la finalisation de la commande.',
            'Livraison gratuite pour les commandes supérieures à 50 000 FCFA.',
          ],
        },
        {
          title: '8. Retours et remboursements',
          content: [
            'Les acheteurs disposent de 14 jours pour retourner un produit non ouvert.',
            'Les produits doivent être dans leur état d\'origine avec emballage intact.',
            'Les frais de retour sont à la charge de l\'acheteur sauf en cas de produit défectueux.',
            'Le remboursement est effectué sous 5-7 jours ouvrables après validation du retour.',
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
            'Nature Pharmacy n\'est pas responsable de la qualité, de la sécurité ou de la légalité des produits vendus par les vendeurs.',
            'Nous ne garantissons pas l\'exactitude des descriptions de produits fournies par les vendeurs.',
            'Nature Pharmacy ne peut être tenu responsable des retards de livraison ou des pertes de colis.',
            'Notre responsabilité totale envers vous est limitée au montant que vous avez payé pour votre commande.',
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
          title: '13. Droit applicable et juridiction',
          content: [
            'Ces conditions sont régies par les lois du Sénégal.',
            'Tout litige sera soumis à la juridiction exclusive des tribunaux de Dakar.',
          ],
        },
        {
          title: '14. Contact',
          content: [
            'Pour toute question concernant ces conditions, veuillez nous contacter :',
            'Email : legal@naturepharmacy.sn',
            'Téléphone : +221 XX XXX XX XX',
            'Adresse : Dakar, Sénégal',
          ],
        },
      ],
    },
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: December 1, 2025',
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
            'Nature Pharmacy is an online marketplace that connects sellers of natural products with buyers.',
            'We provide the technology platform to facilitate transactions, but we are not party to transactions between sellers and buyers.',
            'Sellers are responsible for the quality, legality and compliance of their products.',
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
            'Respect return deadlines and refund conditions.',
            'Do not use the platform for fraudulent or illegal purposes.',
          ],
        },
        {
          title: '5. Seller obligations',
          content: [
            'Sell only legal, authentic products that meet standards.',
            'Provide accurate descriptions and representative photos of your products.',
            'Ship orders within the indicated timeframes.',
            'Honor the return and refund policy.',
            'Maintain responsive and professional customer service.',
            'Pay 10% commission on each sale.',
          ],
        },
        {
          title: '6. Pricing and payment',
          content: [
            'Prices are displayed in CFA Francs (FCFA) and include all applicable taxes.',
            'Payments are processed securely through our payment partners.',
            'Nature Pharmacy charges a 10% commission on each sale.',
            'Sellers receive their payments every 15 days.',
          ],
        },
        {
          title: '7. Delivery',
          content: [
            'Sellers are responsible for shipping products.',
            'Indicated delivery times are estimates and not guaranteed.',
            'Shipping fees are clearly indicated before order completion.',
            'Free delivery for orders over 50,000 FCFA.',
          ],
        },
        {
          title: '8. Returns and refunds',
          content: [
            'Buyers have 14 days to return an unopened product.',
            'Products must be in their original condition with intact packaging.',
            'Return fees are the buyer\'s responsibility except for defective products.',
            'Refund is made within 5-7 business days after return validation.',
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
            'Nature Pharmacy is not responsible for the quality, safety or legality of products sold by sellers.',
            'We do not guarantee the accuracy of product descriptions provided by sellers.',
            'Nature Pharmacy cannot be held responsible for delivery delays or lost packages.',
            'Our total liability to you is limited to the amount you paid for your order.',
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
          title: '13. Applicable law and jurisdiction',
          content: [
            'These terms are governed by the laws of Senegal.',
            'Any dispute will be subject to the exclusive jurisdiction of the courts of Dakar.',
          ],
        },
        {
          title: '14. Contact',
          content: [
            'For any questions regarding these terms, please contact us:',
            'Email: legal@naturepharmacy.sn',
            'Phone: +221 XX XXX XX XX',
            'Address: Dakar, Senegal',
          ],
        },
      ],
    },
    es: {
      title: 'Términos y Condiciones',
      lastUpdated: 'Última actualización: 1 de diciembre de 2025',
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
            'Nature Pharmacy es un marketplace en línea que conecta a vendedores de productos naturales con compradores.',
            'Proporcionamos la plataforma tecnológica para facilitar transacciones, pero no somos parte de las transacciones entre vendedores y compradores.',
            'Los vendedores son responsables de la calidad, legalidad y cumplimiento de sus productos.',
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
            'Respetar los plazos de devolución y las condiciones de reembolso.',
            'No usar la plataforma con fines fraudulentos o ilegales.',
          ],
        },
        {
          title: '5. Obligaciones del vendedor',
          content: [
            'Vender solo productos legales, auténticos y que cumplan con los estándares.',
            'Proporcionar descripciones precisas y fotos representativas de sus productos.',
            'Enviar pedidos dentro de los plazos indicados.',
            'Honrar la política de devolución y reembolso.',
            'Mantener un servicio al cliente receptivo y profesional.',
            'Pagar una comisión del 10% en cada venta.',
          ],
        },
        {
          title: '6. Precios y pago',
          content: [
            'Los precios se muestran en Francos CFA (FCFA) e incluyen todos los impuestos aplicables.',
            'Los pagos se procesan de forma segura a través de nuestros socios de pago.',
            'Nature Pharmacy cobra una comisión del 10% en cada venta.',
            'Los vendedores reciben sus pagos cada 15 días.',
          ],
        },
        {
          title: '7. Entrega',
          content: [
            'Los vendedores son responsables del envío de productos.',
            'Los tiempos de entrega indicados son estimaciones y no garantías.',
            'Las tarifas de envío se indican claramente antes de completar el pedido.',
            'Envío gratuito para pedidos superiores a 50,000 FCFA.',
          ],
        },
        {
          title: '8. Devoluciones y reembolsos',
          content: [
            'Los compradores tienen 14 días para devolver un producto sin abrir.',
            'Los productos deben estar en su estado original con embalaje intacto.',
            'Las tarifas de devolución son responsabilidad del comprador excepto para productos defectuosos.',
            'El reembolso se realiza en 5-7 días hábiles después de la validación de la devolución.',
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
            'Nature Pharmacy no es responsable de la calidad, seguridad o legalidad de los productos vendidos por los vendedores.',
            'No garantizamos la precisión de las descripciones de productos proporcionadas por los vendedores.',
            'Nature Pharmacy no puede ser responsable de retrasos en la entrega o paquetes perdidos.',
            'Nuestra responsabilidad total hacia usted se limita al monto que pagó por su pedido.',
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
          title: '13. Ley aplicable y jurisdicción',
          content: [
            'Estos términos se rigen por las leyes de Senegal.',
            'Cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de Dakar.',
          ],
        },
        {
          title: '14. Contacto',
          content: [
            'Para cualquier pregunta sobre estos términos, contáctenos:',
            'Email: legal@naturepharmacy.sn',
            'Teléfono: +221 XX XXX XX XX',
            'Dirección: Dakar, Senegal',
          ],
        },
      ],
    },
  };

  const t = content[locale] || content.fr;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

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

      <Footer />
    </div>
  );
}
