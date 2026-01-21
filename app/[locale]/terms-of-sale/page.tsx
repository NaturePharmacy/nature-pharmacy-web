import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsOfSale' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsOfSalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsOfSale' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale)}</p>
          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-gray-700">{t('intro')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* Article 1: Objet */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article1.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article1.content1')}</p>
              <p className="text-gray-700">{t('article1.content2')}</p>
            </div>
          </section>

          {/* Article 2: Produits et Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article2.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article2.content1')}</p>
              <p className="text-gray-700">{t('article2.content2')}</p>
              <p className="text-gray-700">{t('article2.content3')}</p>
            </div>
          </section>

          {/* Article 3: Prix */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article3.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article3.content1')}</p>
              <p className="text-gray-700">{t('article3.content2')}</p>
              <p className="text-gray-700">{t('article3.content3')}</p>
            </div>
          </section>

          {/* Article 4: Commandes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article4.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article4.content1')}</p>
              <p className="text-gray-700">{t('article4.content2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-gray-700">{t('article4.step1')}</li>
                <li className="text-gray-700">{t('article4.step2')}</li>
                <li className="text-gray-700">{t('article4.step3')}</li>
                <li className="text-gray-700">{t('article4.step4')}</li>
                <li className="text-gray-700">{t('article4.step5')}</li>
              </ul>
              <p className="text-gray-700">{t('article4.content3')}</p>
            </div>
          </section>

          {/* Article 5: Paiement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article5.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article5.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">{t('article5.methodsTitle')}</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li className="text-gray-700">{t('article5.method1')}</li>
                  <li className="text-gray-700">{t('article5.method2')}</li>
                  <li className="text-gray-700">{t('article5.method3')}</li>
                </ul>
              </div>
              <p className="text-gray-700">{t('article5.content2')}</p>
            </div>
          </section>

          {/* Article 6: Livraison */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article6.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article6.content1')}</p>
              <p className="text-gray-700">{t('article6.content2')}</p>
              <p className="text-gray-700">{t('article6.content3')}</p>
              <p className="text-gray-700">{t('article6.content4')}</p>
              <p className="text-gray-700">
                {t('article6.content5')} <Link href={`/${locale}/shipping`} className="text-green-600 hover:underline font-medium">{t('article6.shippingLink')}</Link>.
              </p>
            </div>
          </section>

          {/* Article 7: Droit de rétractation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article7.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-gray-900">{t('article7.highlight')}</p>
              </div>
              <p className="text-gray-700">{t('article7.content1')}</p>
              <p className="text-gray-700">{t('article7.content2')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">{t('article7.exceptionsTitle')}</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li className="text-gray-700">{t('article7.exception1')}</li>
                  <li className="text-gray-700">{t('article7.exception2')}</li>
                  <li className="text-gray-700">{t('article7.exception3')}</li>
                </ul>
              </div>
              <p className="text-gray-700">{t('article7.content3')}</p>
            </div>
          </section>

          {/* Article 8: Garanties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article8.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article8.content1')}</p>
              <div className="grid md:grid-cols-2 gap-4 my-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('article8.conformityTitle')}</h4>
                  <p className="text-sm text-gray-700">{t('article8.conformityDesc')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('article8.defectsTitle')}</h4>
                  <p className="text-sm text-gray-700">{t('article8.defectsDesc')}</p>
                </div>
              </div>
              <p className="text-gray-700">{t('article8.content2')}</p>
            </div>
          </section>

          {/* Article 9: Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article9.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article9.content1')}</p>
              <p className="text-gray-700">{t('article9.content2')}</p>
              <p className="text-gray-700">{t('article9.content3')}</p>
            </div>
          </section>

          {/* Article 10: Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article10.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article10.content1')}</p>
              <p className="text-gray-700">
                {t('article10.content2')} <Link href={`/${locale}/privacy`} className="text-green-600 hover:underline font-medium">{t('article10.privacyLink')}</Link>.
              </p>
            </div>
          </section>

          {/* Article 11: Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article11.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article11.content1')}</p>
              <p className="text-gray-700">{t('article11.content2')}</p>
            </div>
          </section>

          {/* Article 12: Force majeure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article12.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article12.content1')}</p>
              <p className="text-gray-700">{t('article12.content2')}</p>
            </div>
          </section>

          {/* Article 13: Modification des CGV */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article13.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article13.content1')}</p>
            </div>
          </section>

          {/* Article 14: Droit applicable et juridiction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article14.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article14.content1')}</p>
              <p className="text-gray-700">{t('article14.content2')}</p>
            </div>
          </section>

          {/* Article 15: Médiation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article15.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article15.content1')}</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>{t('article15.mediatorLabel')}:</strong> {t('article15.mediatorName')}<br/>
                  <strong>{t('article15.websiteLabel')}:</strong> <a href="https://www.mediateur-conso.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.mediateur-conso.fr</a>
                </p>
              </div>
            </div>
          </section>

          {/* Article 16: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('article16.title')}</h2>
            <div className="prose prose-gray max-w-none space-y-3">
              <p className="text-gray-700">{t('article16.content1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>{t('article16.emailLabel')}:</strong> contact@nature-pharmacy.com<br/>
                  <strong>{t('article16.phoneLabel')}:</strong> [À COMPLÉTER]<br/>
                  <strong>{t('article16.addressLabel')}:</strong> [À COMPLÉTER]
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
            <Link href={`/${locale}/shipping`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('shippingLink')}
            </Link>
            <Link href={`/${locale}/contact`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('contactLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
