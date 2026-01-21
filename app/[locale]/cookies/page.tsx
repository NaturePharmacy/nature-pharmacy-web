import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cookies' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cookies' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale)}</p>
          <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p className="text-sm text-gray-700">{t('intro')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section1.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section1.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section1.item1')}</li>
                <li className="text-gray-700">{t('section1.item2')}</li>
                <li className="text-gray-700">{t('section1.item3')}</li>
                <li className="text-gray-700">{t('section1.item4')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section1.content3')}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2.title')}</h2>
            <p className="text-gray-700 mb-4">{t('section2.content1')}</p>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section2.category1Title')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section2.category1Desc')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category1Examples')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category1Duration')}</p>
                <p className="text-xs font-semibold text-green-700">{t('section2.category1Consent')}</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section2.category2Title')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section2.category2Desc')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category2Examples')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category2Duration')}</p>
                <p className="text-xs font-semibold text-blue-700">{t('section2.category2Consent')}</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section2.category3Title')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section2.category3Desc')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category3Examples')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category3Duration')}</p>
                <p className="text-xs font-semibold text-purple-700">{t('section2.category3Consent')}</p>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section2.category4Title')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section2.category4Desc')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category4Examples')}</p>
                <p className="text-xs text-gray-600 mb-1">{t('section2.category4Duration')}</p>
                <p className="text-xs font-semibold text-orange-700">{t('section2.category4Consent')}</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3.title')}</h2>
            <p className="text-gray-700 mb-4">{t('section3.content1')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section3.service1Name')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section3.service1Purpose')}</p>
                <p className="text-xs text-gray-600 mb-2">{t('section3.service1Cookies')}</p>
                <a href={t('section3.service1Link')} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  {locale === 'fr' ? 'Politique de confidentialité' : locale === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section3.service2Name')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section3.service2Purpose')}</p>
                <p className="text-xs text-gray-600 mb-2">{t('section3.service2Cookies')}</p>
                <a href={t('section3.service2Link')} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  {locale === 'fr' ? 'Politique de confidentialité' : locale === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{t('section3.service3Name')}</h4>
                <p className="text-sm text-gray-700 mb-2">{t('section3.service3Purpose')}</p>
                <p className="text-xs text-gray-600 mb-2">{t('section3.service3Cookies')}</p>
                <a href={t('section3.service3Link')} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  {locale === 'fr' ? 'Politique de confidentialité' : locale === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
                </a>
              </div>
            </div>
            <p className="text-gray-700 mt-4">{t('section3.content2')}</p>
          </section>

          {/* Section 4: Table */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4.title')}</h2>
            <p className="text-gray-700 mb-4">{t('section4.content1')}</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('section4.tableHeaders.name')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('section4.tableHeaders.purpose')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('section4.tableHeaders.type')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('section4.tableHeaders.duration')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie1Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie1Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie1Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie1Duration')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie2Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie2Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie2Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie2Duration')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie3Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie3Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie3Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie3Duration')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie4Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie4Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie4Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie4Duration')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie5Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie5Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie5Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie5Duration')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{t('section4.cookie6Name')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie6Purpose')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie6Type')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t('section4.cookie6Duration')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5.title')}</h2>
            <p className="text-gray-700 mb-4">{t('section5.content1')}</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section5.method1Title')}</h4>
                <p className="text-gray-700">{t('section5.method1Desc')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section5.method2Title')}</h4>
                <p className="text-gray-700 mb-2">{t('section5.method2Desc')}</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li>{t('section5.browser1')}</li>
                  <li>{t('section5.browser2')}</li>
                  <li>{t('section5.browser3')}</li>
                  <li>{t('section5.browser4')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('section5.method3Title')}</h4>
                <p className="text-gray-700">{t('section5.method3Desc')}</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
              <p className="text-gray-700">{t('section5.content2')}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section6.content1')}</p>
              <p className="text-gray-700">{t('section6.content2')}</p>
              <p className="text-gray-700">{t('section6.content3')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section6.right1')}</li>
                <li className="text-gray-700">{t('section6.right2')}</li>
                <li className="text-gray-700">{t('section6.right3')}</li>
                <li className="text-gray-700">{t('section6.right4')}</li>
                <li className="text-gray-700">{t('section6.right5')}</li>
              </ul>
              <p className="text-gray-700">
                {t('section6.content4')} <Link href={`/${locale}/privacy`} className="text-green-600 hover:underline font-medium">{t('section6.privacyLink')}</Link>.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section7.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section7.content1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('section7.item1')}</li>
                <li className="text-gray-700">{t('section7.item2')}</li>
                <li className="text-gray-700">{t('section7.item3')}</li>
              </ul>
              <p className="text-gray-700 mt-3">{t('section7.content2')}</p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section8.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('section8.content1')}</p>
              <p className="text-gray-700">{t('section8.content2')}</p>
              <p className="text-gray-700">{t('section8.content3')}</p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section9.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section9.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('section9.emailLabel')}:</strong> contact@nature-pharmacy.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('section9.phoneLabel')}:</strong> [À COMPLÉTER]
                </p>
                <p className="text-gray-700">
                  <strong>{t('section9.addressLabel')}:</strong> [À COMPLÉTER]
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
            <Link href={`/${locale}/terms-of-use`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('termsLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
