import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale)}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Section 1: Éditeur du site */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.companyName')}:</strong> Nature Pharmacy
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.legalForm')}:</strong> [À COMPLÉTER - ex: SARL, SAS, Auto-entrepreneur]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.capital')}:</strong> [À COMPLÉTER - ex: 10 000 €]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.siret')}:</strong> [À COMPLÉTER - 14 chiffres]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.vat')}:</strong> [À COMPLÉTER - Numéro TVA intracommunautaire]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.address')}:</strong><br />
                [À COMPLÉTER - Adresse complète]<br />
                [Code Postal] [Ville]<br />
                [Pays]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.phone')}:</strong> [À COMPLÉTER - ex: +33 X XX XX XX XX]
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.email')}:</strong> contact@nature-pharmacy.com
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section1.director')}:</strong> [À COMPLÉTER - Nom du directeur de publication]
              </p>
            </div>
          </section>

          {/* Section 2: Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">
                <strong>{t('section2.host')}:</strong> Vercel Inc.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section2.hostAddress')}:</strong><br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                United States
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section2.website')}:</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">https://vercel.com</a>
              </p>
            </div>
          </section>

          {/* Section 3: Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section3.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section3.content2')}</p>
              <p className="text-gray-700 mb-3">{t('section3.content3')}</p>
            </div>
          </section>

          {/* Section 4: Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section4.content1')}</p>
              <p className="text-gray-700 mb-3">
                {t('section4.content2')} <a href={`/${locale}/privacy`} className="text-green-600 hover:underline">{t('section4.privacyLink')}</a>.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section4.dpo')}:</strong> [À COMPLÉTER - Nom du DPO si applicable]<br />
                <strong>{t('section4.dpoEmail')}:</strong> dpo@nature-pharmacy.com
              </p>
            </div>
          </section>

          {/* Section 5: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section5.content1')}</p>
              <p className="text-gray-700 mb-3">
                {t('section5.content2')} <a href={`/${locale}/cookies`} className="text-green-600 hover:underline">{t('section5.cookieLink')}</a>.
              </p>
            </div>
          </section>

          {/* Section 6: Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section6.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section6.content2')}</p>
              <p className="text-gray-700 mb-3">{t('section6.content3')}</p>
            </div>
          </section>

          {/* Section 7: Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section7.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section7.content1')}</p>
              <p className="text-gray-700 mb-3">{t('section7.content2')}</p>
            </div>
          </section>

          {/* Section 8: Médiation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section8.title')}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-3">{t('section8.content1')}</p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section8.mediator')}:</strong><br />
                {t('section8.mediatorName')}<br />
                {t('section8.mediatorWebsite')}: <a href="https://www.mediateur-conso.fr" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">www.mediateur-conso.fr</a>
              </p>
              <p className="text-gray-700 mb-3">
                <strong>{t('section8.euPlatform')}:</strong><br />
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">https://ec.europa.eu/consumers/odr</a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('relatedPages')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href={`/${locale}/terms-of-sale`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cgvLink')}
            </a>
            <a href={`/${locale}/privacy`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('privacyLink')}
            </a>
            <a href={`/${locale}/terms-of-use`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('termsLink')}
            </a>
            <a href={`/${locale}/cookies`} className="text-green-600 hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('cookieLink')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
