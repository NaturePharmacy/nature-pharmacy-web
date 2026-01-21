import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsOfUse' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsOfUsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsOfUse' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale)}</p>
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-gray-700">{t('intro')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* Section 1: Acceptation des Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section1.content1')}</p>
              <p className="text-gray-700">{t('section1.content2')}</p>
              <p className="text-gray-700">{t('section1.content3')}</p>
            </div>
          </section>

          {/* Section 2: Description du Service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section2.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section2.item1')}</li>
                <li className="text-gray-700">{t('section2.item2')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section2.content2')}</p>
            </div>
          </section>

          {/* Section 3: Création de Compte */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section3.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section3.item1')}</li>
                <li className="text-gray-700">{t('section3.item2')}</li>
                <li className="text-gray-700">{t('section3.item3')}</li>
                <li className="text-gray-700">{t('section3.item4')}</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-3">
                <p className="text-gray-700">{t('section3.content2')}</p>
              </div>
            </div>
          </section>

          {/* Section 4: Utilisation Acceptable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section4.content1')}</p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li className="text-gray-700">{t('section4.prohibition1')}</li>
                  <li className="text-gray-700">{t('section4.prohibition2')}</li>
                  <li className="text-gray-700">{t('section4.prohibition3')}</li>
                  <li className="text-gray-700">{t('section4.prohibition4')}</li>
                  <li className="text-gray-700">{t('section4.prohibition5')}</li>
                  <li className="text-gray-700">{t('section4.prohibition6')}</li>
                  <li className="text-gray-700">{t('section4.prohibition7')}</li>
                  <li className="text-gray-700">{t('section4.prohibition8')}</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-3">{t('section4.content2')}</p>
            </div>
          </section>

          {/* Section 5: Contenu Utilisateur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section5.content1')}</p>
              <p className="text-gray-700">{t('section5.content2')}</p>
              <p className="text-gray-700">{t('section5.content3')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section5.item1')}</li>
                <li className="text-gray-700">{t('section5.item2')}</li>
                <li className="text-gray-700">{t('section5.item3')}</li>
              </ul>
              <p className="text-gray-700">{t('section5.content4')}</p>
            </div>
          </section>

          {/* Section 6: Propriété Intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section6.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section6.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section6.item1')}</li>
                <li className="text-gray-700">{t('section6.item2')}</li>
                <li className="text-gray-700">{t('section6.item3')}</li>
                <li className="text-gray-700">{t('section6.item4')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section6.content3')}</p>
              <p className="text-gray-700">{t('section6.content4')}</p>
            </div>
          </section>

          {/* Section 7: Transactions et Paiements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section7.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section7.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section7.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section7.item1')}</li>
                <li className="text-gray-700">{t('section7.item2')}</li>
                <li className="text-gray-700">{t('section7.item3')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section7.content3')}</p>
              <p className="text-gray-700">
                {t('section7.content4')} <Link href={`/${locale}/terms-of-sale`} className="text-green-600 hover:underline font-medium">{t('section7.cgvLink')}</Link>.
              </p>
            </div>
          </section>

          {/* Section 8: Limitation de Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section8.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section8.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section8.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section8.item1')}</li>
                <li className="text-gray-700">{t('section8.item2')}</li>
                <li className="text-gray-700">{t('section8.item3')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section8.content3')}</p>
              <p className="text-gray-700">{t('section8.content4')}</p>
            </div>
          </section>

          {/* Section 9: Indemnisation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section9.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section9.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section9.item1')}</li>
                <li className="text-gray-700">{t('section9.item2')}</li>
                <li className="text-gray-700">{t('section9.item3')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section9.content2')}</p>
            </div>
          </section>

          {/* Section 10: Liens Externes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section10.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section10.content1')}</p>
              <p className="text-gray-700">{t('section10.content2')}</p>
              <p className="text-gray-700">{t('section10.content3')}</p>
            </div>
          </section>

          {/* Section 11: Résiliation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section11.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section11.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section11.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section11.item1')}</li>
                <li className="text-gray-700">{t('section11.item2')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section11.content3')}</p>
            </div>
          </section>

          {/* Section 12: Droit Applicable et Juridiction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section12.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section12.content1')}</p>
              <p className="text-gray-700">{t('section12.content2')}</p>
              <p className="text-gray-700">{t('section12.content3')}</p>
            </div>
          </section>

          {/* Section 13: Dispositions Générales */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section13.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section13.subsection1Title')}</h4>
                <p className="text-gray-700">{t('section13.subsection1Content')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section13.subsection2Title')}</h4>
                <p className="text-gray-700">{t('section13.subsection2Content')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section13.subsection3Title')}</h4>
                <p className="text-gray-700">{t('section13.subsection3Content')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section13.subsection4Title')}</h4>
                <p className="text-gray-700">{t('section13.subsection4Content')}</p>
              </div>
            </div>
          </section>

          {/* Section 14: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section14.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section14.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('section14.emailLabel')}:</strong> contact@nature-pharmacy.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section14.phoneLabel')}:</strong> [À COMPLÉTER]
                </p>
                <p className="text-gray-700">
                  <strong>{t('section14.addressLabel')}:</strong> [À COMPLÉTER]
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
            <Link href={`/${locale}/privacy`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('privacyLink')}
            </Link>
            <Link href={`/${locale}/terms-of-sale`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cgvLink')}
            </Link>
            <Link href={`/${locale}/cookies`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cookieLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
