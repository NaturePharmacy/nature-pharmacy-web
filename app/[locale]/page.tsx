import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

async function getProducts() {
  try {
    await connectDB();
    const [featured, newest] = await Promise.all([
      Product.find({ isActive: true, isFeatured: true })
        .select('name slug price compareAtPrice images isOrganic rating reviewCount')
        .limit(8)
        .sort({ createdAt: -1 })
        .lean(),
      Product.find({ isActive: true })
        .select('name slug price images')
        .limit(8)
        .sort({ createdAt: -1 })
        .lean()
    ]);
    return {
      featured: JSON.parse(JSON.stringify(featured)),
      newest: JSON.parse(JSON.stringify(newest))
    };
  } catch {
    return { featured: [], newest: [] };
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const { featured: featuredProducts, newest: newProducts } = await getProducts();

  const categories = [
    { key: 'herbs', slug: 'herbs', icon: '🌿', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=300&fit=crop' },
    { key: 'oils', slug: 'oils', icon: '💧', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop' },
    { key: 'cosmetics', slug: 'cosmetics', icon: '✨', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop' },
    { key: 'foods', slug: 'foods', icon: '🥗', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=300&fit=crop' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Banner - Clean white design with green accent */}
        <div className="bg-gradient-to-r from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  🌿 {locale === 'fr' ? 'Produits 100% Naturels' : locale === 'es' ? 'Productos 100% Naturales' : '100% Natural Products'}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    {t('hero.shopNow')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href={`/${locale}/products?organic=true`}
                    className="inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    🌱 {locale === 'fr' ? 'Voir Bio' : locale === 'es' ? 'Ver Orgánico' : 'View Organic'}
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop"
                  alt="Nature Pharmacy"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{locale === 'fr' ? 'Livraison gratuite' : locale === 'es' ? 'Envío gratis' : 'Free shipping'}</p>
                      <p className="text-sm text-gray-500">{locale === 'fr' ? 'À partir de 50€' : locale === 'es' ? 'Desde 50€' : 'Orders over $50'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories - Clean cards */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t('categories.title')}</h2>
            <Link href={`/${locale}/products`} className="text-green-600 hover:text-green-700 font-medium text-sm">
              {t('seeAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/${locale}/products?category=${category.slug}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-green-200 transition-all group"
              >
                <div className="p-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3">
                    <Image
                      src={category.image}
                      alt={t(`categories.${category.key}`)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center group-hover:text-green-600 transition-colors">
                    {t(`categories.${category.key}`)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t('featured.title')}</h2>
              <Link href={`/${locale}/products?featured=true`} className="text-green-600 hover:text-green-700 font-medium text-sm">
                {t('seeAll')} →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 4).map((product: any) => (
                <Link
                  key={product._id}
                  href={`/${locale}/products/${product.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-square bg-gray-50">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-5xl">🌿</div>
                    )}
                    {product.isOrganic && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Bio
                      </span>
                    )}
                    {product.compareAtPrice && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                      {product.name[locale]}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                alt="Organic"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t('promo.organic')}</h3>
                <p className="text-green-100 mb-4">{t('promo.organicDesc')}</p>
                <Link href={`/${locale}/products?organic=true`} className="inline-flex items-center text-white font-semibold hover:underline">
                  {t('seeMore')} →
                </Link>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop"
                alt="Deals"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t('promo.deals')}</h3>
                <p className="text-amber-100 mb-4">{t('promo.dealsDesc')}</p>
                <Link href={`/${locale}/deals`} className="inline-flex items-center text-white font-semibold hover:underline">
                  {t('seeMore')} →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="bg-white py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t('newArrivals.title')}</h2>
              <Link href={`/${locale}/products?new=true`} className="text-green-600 hover:text-green-700 font-medium text-sm">
                {t('seeAll')} →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newProducts.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/${locale}/products/${product.slug}`}
                  className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-square bg-gray-50">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-4xl">🌿</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name[locale]}
                    </h3>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('whyUs.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-green-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('whyUs.trustedTitle')}</h3>
                <p className="text-gray-600 text-sm">{t('whyUs.trustedDesc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-green-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('whyUs.deliveryTitle')}</h3>
                <p className="text-gray-600 text-sm">{t('whyUs.deliveryDesc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-green-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('whyUs.qualityTitle')}</h3>
                <p className="text-gray-600 text-sm">{t('whyUs.qualityDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
