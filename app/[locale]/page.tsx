import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    return [];
  }
}

async function getNewProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    return [];
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tProduct = await getTranslations('product');

  const featuredProducts = await getFeaturedProducts();
  const newProducts = await getNewProducts();

  const categories = [
    { key: 'herbs', slug: 'herbs', icon: '🌿', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=300&fit=crop' },
    { key: 'oils', slug: 'oils', icon: '💧', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop' },
    { key: 'cosmetics', slug: 'cosmetics', icon: '✨', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop' },
    { key: 'foods', slug: 'foods', icon: '🥗', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=300&fit=crop' },
  ];

  const promoCards = [
    { title: t('promo.organic'), subtitle: t('promo.organicDesc'), link: `/${locale}/products?organic=true`, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' },
    { title: t('promo.newArrivals'), subtitle: t('promo.newArrivalsDesc'), link: `/${locale}/products?new=true`, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1">
        {/* Hero Banner with Carousel Effect */}
        <div className="relative">
          <div className="bg-gradient-to-b from-green-700 via-green-600 to-transparent h-[500px] md:h-[600px]">
            <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
              <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-transparent z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&h=600&fit=crop"
                  alt="Nature Pharmacy"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="max-w-xl px-8 md:px-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      {t('hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 mb-6">
                      {t('hero.subtitle')}
                    </p>
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      {t('hero.shopNow')}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Carousel Navigation Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Category Cards - Overlapping Hero (Amazon Style) */}
          <div className="max-w-7xl mx-auto px-4 -mt-32 md:-mt-40 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/${locale}/products?category=${category.slug}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-3">
                      {t(`categories.${category.key}`)}
                    </h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={category.image}
                        alt={t(`categories.${category.key}`)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-green-600 text-sm font-medium mt-3 group-hover:text-green-700">
                      {t('seeMore')} →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Sections - Amazon Style Cards */}
        <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Featured Products Card */}
            <div className="bg-white rounded-lg shadow-lg p-5 lg:col-span-2">
              <h2 className="font-bold text-xl text-gray-900 mb-4">{t('featured.title')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 4).map((product: any) => (
                  <Link
                    key={product._id}
                    href={`/${locale}/products/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name[locale]}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-4xl">🌿</span>
                        </div>
                      )}
                      {product.isOrganic && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          Bio
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-1 group-hover:text-green-600 transition-colors">
                      {product.name[locale]}
                    </p>
                  </Link>
                ))}
              </div>
              <Link href={`/${locale}/products?featured=true`} className="text-green-600 hover:text-green-700 text-sm font-medium mt-4 inline-block">
                {t('seeMore')} →
              </Link>
            </div>

            {/* Promo Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-5">
                <h2 className="font-bold text-xl text-gray-900 mb-2">{t('promo.organic')}</h2>
                <p className="text-gray-600 text-sm mb-4">{t('promo.organicDesc')}</p>
              </div>
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
                  alt="Organic"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <Link href={`/${locale}/products?organic=true`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                  {t('seeMore')} →
                </Link>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-5">
                <h2 className="font-bold text-xl text-gray-900 mb-2">{t('promo.deals')}</h2>
                <p className="text-gray-600 text-sm mb-4">{t('promo.dealsDesc')}</p>
              </div>
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop"
                  alt="Deals"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <Link href={`/${locale}/deals`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                  {t('seeMore')} →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* New Arrivals - Full Width Carousel Style */}
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl text-gray-900">{t('newArrivals.title')}</h2>
              <Link href={`/${locale}/products?new=true`} className="text-green-600 hover:text-green-700 font-medium">
                {t('seeAll')} →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newProducts.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/${locale}/products/${product.slug}`}
                  className="flex-shrink-0 w-48 group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-5xl">🌿</div>
                    )}
                    {product.compareAtPrice && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name[locale]}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us - Modern Cards */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-bold text-2xl text-gray-900 text-center mb-8">{t('whyUs.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('whyUs.trustedTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('whyUs.trustedDesc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('whyUs.deliveryTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('whyUs.deliveryDesc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('whyUs.qualityTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('whyUs.qualityDesc')}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
