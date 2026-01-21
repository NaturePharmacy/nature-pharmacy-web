import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale)}</p>
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-gray-700">{t('intro')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* Section 1: Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section1.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('section1.companyName')}:</strong> Nature Pharmacy
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section1.siret')}:</strong> [À COMPLÉTER - 14 chiffres]
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section1.address')}:</strong> [À COMPLÉTER - Adresse complète]
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section1.email')}:</strong> contact@nature-pharmacy.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section1.dpo')}:</strong> [À COMPLÉTER - Nom du DPO]
                </p>
                <p className="text-gray-700">
                  <strong>{t('section1.dpoEmail')}:</strong> dpo@nature-pharmacy.com
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">{t('section2.content1')}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryIdentity')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.identityItems')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryContact')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.contactItems')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryOrder')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.orderItems')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryPayment')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.paymentItems')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryConnection')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.connectionItems')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section2.categoryTechnical')}</h4>
                  <p className="text-sm text-gray-700">{t('section2.technicalItems')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Finalités du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section3.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section3.purpose1')}</li>
                <li className="text-gray-700">{t('section3.purpose2')}</li>
                <li className="text-gray-700">{t('section3.purpose3')}</li>
                <li className="text-gray-700">{t('section3.purpose4')}</li>
                <li className="text-gray-700">{t('section3.purpose5')}</li>
                <li className="text-gray-700">{t('section3.purpose6')}</li>
                <li className="text-gray-700">{t('section3.purpose7')}</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Base légale du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">{t('section4.content1')}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section4.basis1Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section4.basis1Desc')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section4.basis2Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section4.basis2Desc')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section4.basis3Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section4.basis3Desc')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('section4.basis4Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section4.basis4Desc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Destinataires des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section5.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section5.recipient1')}</li>
                <li className="text-gray-700">{t('section5.recipient2')}</li>
                <li className="text-gray-700">{t('section5.recipient3')}</li>
                <li className="text-gray-700">{t('section5.recipient4')}</li>
                <li className="text-gray-700">{t('section5.recipient5')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section5.content2')}</p>
            </div>
          </section>

          {/* Section 6: Durée de conservation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section6.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li className="text-gray-700">{t('section6.retention1')}</li>
                  <li className="text-gray-700">{t('section6.retention2')}</li>
                  <li className="text-gray-700">{t('section6.retention3')}</li>
                  <li className="text-gray-700">{t('section6.retention4')}</li>
                  <li className="text-gray-700">{t('section6.retention5')}</li>
                  <li className="text-gray-700">{t('section6.retention6')}</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-3">{t('section6.content2')}</p>
            </div>
          </section>

          {/* Section 7: Vos droits RGPD */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section7.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">{t('section7.content1')}</p>
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right1Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right1Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right2Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right2Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right3Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right3Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right4Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right4Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right5Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right5Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right6Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right6Desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('section7.right7Title')}</h4>
                  <p className="text-sm text-gray-700">{t('section7.right7Desc')}</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">{t('section7.content2')}</p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-3">
                <p className="text-gray-700">{t('section7.content3')}</p>
              </div>
            </div>
          </section>

          {/* Section 8: Sécurité des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section8.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section8.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section8.measure1')}</li>
                <li className="text-gray-700">{t('section8.measure2')}</li>
                <li className="text-gray-700">{t('section8.measure3')}</li>
                <li className="text-gray-700">{t('section8.measure4')}</li>
                <li className="text-gray-700">{t('section8.measure5')}</li>
                <li className="text-gray-700">{t('section8.measure6')}</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section9.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section9.content1')}</p>
              <p className="text-gray-700">
                {t('section9.content2')} <Link href={`/${locale}/cookies`} className="text-green-600 hover:underline font-medium">{t('section9.cookieLink')}</Link>.
              </p>
            </div>
          </section>

          {/* Section 10: Transferts internationaux */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section10.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">{t('section10.content1')}</p>
            </div>
          </section>

          {/* Section 11: Données des mineurs */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section11.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">{t('section11.content1')}</p>
            </div>
          </section>

          {/* Section 12: Modifications de la politique */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section12.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section12.content1')}</p>
              <p className="text-gray-700">{t('section12.content2')}</p>
            </div>
          </section>

          {/* Section 13: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section13.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section13.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('section13.emailLabel')}:</strong> contact@nature-pharmacy.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section13.dpoEmailLabel')}:</strong> dpo@nature-pharmacy.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section13.phoneLabel')}:</strong> [À COMPLÉTER]
                </p>
                <p className="text-gray-700">
                  <strong>{t('section13.addressLabel')}:</strong> [À COMPLÉTER]
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('relatedPages')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href={`/${locale}/legal`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('legalLink')}
            </Link>
            <Link href={`/${locale}/terms-of-use`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('termsLink')}
            </Link>
            <Link href={`/${locale}/cookies`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cookieLink')}
            </Link>
            <Link href={`/${locale}/terms-of-sale`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cgvLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
