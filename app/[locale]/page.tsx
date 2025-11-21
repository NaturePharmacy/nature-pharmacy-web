import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tProduct = await getTranslations('product');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl mb-8">
                {t('hero.subtitle')}
              </p>
              <Link
                href={`/${locale}/products`}
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
              >
                {t('hero.shopNow')}
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">{t('categories.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'herbs', icon: '🌿' },
              { key: 'oils', icon: '💧' },
              { key: 'cosmetics', icon: '✨' },
              { key: 'foods', icon: '🥗' }
            ].map((category) => (
              <Link
                key={category.key}
                href={`/${locale}/category/${category.key}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold">{t(`categories.${category.key}`)}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">{t('featured.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{t('featured.productName')} {item}</h3>
                    <p className="text-gray-600 text-sm mb-2">{t('featured.description')}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-bold text-lg">$29.99</span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm">
                        {tProduct('addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('whyUs.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.trustedTitle')}</h3>
              <p className="text-gray-600">{t('whyUs.trustedDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.deliveryTitle')}</h3>
              <p className="text-gray-600">{t('whyUs.deliveryDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.qualityTitle')}</h3>
              <p className="text-gray-600">{t('whyUs.qualityDesc')}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
