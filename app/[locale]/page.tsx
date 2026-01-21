import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductPrice from '@/components/ProductPrice';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const metadata: Record<string, any> = {
    fr: {
      title: 'Nature Pharmacy - Plantes Médicinales et Remèdes Naturels',
      description: 'Découvrez notre sélection de plantes médicinales, huiles essentielles et cosmétiques naturels certifiés bio. Médecine traditionnelle et bien-être naturel.',
      keywords: 'plantes médicinales, phytothérapie, huiles essentielles, cosmétiques naturels, remèdes traditionnels, bio, santé naturelle, herboristerie',
    },
    en: {
      title: 'Nature Pharmacy - Medicinal Plants and Natural Remedies',
      description: 'Discover our selection of medicinal plants, essential oils and certified organic natural cosmetics. Traditional medicine and natural wellness.',
      keywords: 'medicinal plants, phytotherapy, essential oils, natural cosmetics, traditional remedies, organic, natural health, herbalism',
    },
    es: {
      title: 'Nature Pharmacy - Plantas Medicinales y Remedios Naturales',
      description: 'Descubra nuestra selección de plantas medicinales, aceites esenciales y cosméticos naturales certificados orgánicos. Medicina tradicional y bienestar natural.',
      keywords: 'plantas medicinales, fitoterapia, aceites esenciales, cosméticos naturales, remedios tradicionales, orgánico, salud natural, herbolaria',
    },
  };

  const currentMeta = metadata[locale] || metadata.fr;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: 'Nature Pharmacy',
      images: [
        {
          url: `${baseUrl}/11.jpeg`,
          width: 1200,
          height: 630,
          alt: 'Nature Pharmacy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMeta.title,
      description: currentMeta.description,
      images: [`${baseUrl}/11.jpeg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'fr': `${baseUrl}/fr`,
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
    { key: 'medicinal-plants', slug: 'medicinal-plants', icon: '🌿', image: '/1.jpeg' },
    { key: 'essential-oils', slug: 'essential-oils', icon: '💧', image: '/2.jpeg' },
    { key: 'natural-cosmetics', slug: 'natural-cosmetics', icon: '✨', image: '/3.jpeg' },
    { key: 'herbal-teas', slug: 'herbal-teas', icon: '🍵', image: '/4.jpeg' },
    { key: 'traditional-remedies', slug: 'traditional-remedies', icon: '🏺', image: '/5.jpeg' },
    { key: 'supplements', slug: 'supplements', icon: '💊', image: '/6.jpeg' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // JSON-LD structured data for homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nature Pharmacy',
    description: locale === 'fr'
      ? 'Plantes médicinales et remèdes naturels certifiés bio'
      : locale === 'es'
      ? 'Plantas medicinales y remedios naturales certificados orgánicos'
      : 'Medicinal plants and certified organic natural remedies',
    url: `${baseUrl}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nature Pharmacy',
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/11.jpeg`,
    description: locale === 'fr'
      ? 'Boutique en ligne spécialisée dans les plantes médicinales, huiles essentielles et cosmétiques naturels certifiés bio'
      : locale === 'es'
      ? 'Tienda en línea especializada en plantas medicinales, aceites esenciales y cosméticos naturales certificados orgánicos'
      : 'Online store specializing in medicinal plants, essential oils and certified organic natural cosmetics',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero Banner - Clean white design with green accent */}
      <div className="bg-gradient-to-r from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  🏥 {locale === 'fr' ? 'Médecine Naturelle & Traditionnelle' : locale === 'es' ? 'Medicina Natural y Tradicional' : 'Natural & Traditional Medicine'}
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
                    href={`/${locale}/products?certifications=organic`}
                    className="inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    🌱 {locale === 'fr' ? 'Certifié Bio' : locale === 'es' ? 'Certificado Orgánico' : 'Certified Organic'}
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/11.jpeg"
                  alt="Nature Pharmacy"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
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

        {/* Find by Health Need - Therapeutic Categories */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {locale === 'fr' ? 'Trouvez le remède adapté à vos besoins' : locale === 'es' ? 'Encuentre el remedio adecuado para sus necesidades' : 'Find the right remedy for your needs'}
            </h2>
            <p className="text-gray-700 font-medium">
              {locale === 'fr' ? 'Recherchez par système de santé ou indication thérapeutique' : locale === 'es' ? 'Busque por sistema de salud o indicación terapéutica' : 'Search by health system or therapeutic indication'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link
              href={`/${locale}/products?therapeuticCategory=digestive`}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 transition-all group"
            >
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                {locale === 'fr' ? 'Système Digestif' : locale === 'es' ? 'Sistema Digestivo' : 'Digestive System'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Digestion, ballonnements' : locale === 'es' ? 'Digestión, hinchazón' : 'Digestion, bloating'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=respiratory`}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="text-4xl mb-3">🫁</div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {locale === 'fr' ? 'Système Respiratoire' : locale === 'es' ? 'Sistema Respiratorio' : 'Respiratory System'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Toux, rhume, bronches' : locale === 'es' ? 'Tos, resfriado, bronquios' : 'Cough, cold, bronchi'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=immune`}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all group"
            >
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                {locale === 'fr' ? 'Système Immunitaire' : locale === 'es' ? 'Sistema Inmunitario' : 'Immune System'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Défenses naturelles' : locale === 'es' ? 'Defensas naturales' : 'Natural defenses'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=nervous`}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all group"
            >
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                {locale === 'fr' ? 'Système Nerveux' : locale === 'es' ? 'Sistema Nervioso' : 'Nervous System'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Stress, sommeil, anxiété' : locale === 'es' ? 'Estrés, sueño, ansiedad' : 'Stress, sleep, anxiety'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=cardiovascular`}
              className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all group"
            >
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                {locale === 'fr' ? 'Système Cardiovasculaire' : locale === 'es' ? 'Sistema Cardiovascular' : 'Cardiovascular System'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Circulation, cœur' : locale === 'es' ? 'Circulación, corazón' : 'Circulation, heart'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=skin`}
              className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-6 hover:shadow-lg hover:border-pink-300 transition-all group"
            >
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                {locale === 'fr' ? 'Peau & Beauté' : locale === 'es' ? 'Piel y Belleza' : 'Skin & Beauty'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Peau, cheveux, ongles' : locale === 'es' ? 'Piel, cabello, uñas' : 'Skin, hair, nails'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=musculoskeletal`}
              className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all group"
            >
              <div className="text-4xl mb-3">🦴</div>
              <h3 className="font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                {locale === 'fr' ? 'Muscles & Os' : locale === 'es' ? 'Músculos y Huesos' : 'Muscles & Bones'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Douleurs, articulations' : locale === 'es' ? 'Dolores, articulaciones' : 'Pain, joints'}
              </p>
            </Link>
            <Link
              href={`/${locale}/products?therapeuticCategory=general`}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all group"
            >
              <div className="text-4xl mb-3">⚕️</div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {locale === 'fr' ? 'Bien-être Général' : locale === 'es' ? 'Bienestar General' : 'General Wellness'}
              </h3>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {locale === 'fr' ? 'Vitalité, énergie' : locale === 'es' ? 'Vitalidad, energía' : 'Vitality, energy'}
              </p>
            </Link>
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
                    <ProductPrice
                      price={product.price || 0}
                      compareAtPrice={product.compareAtPrice}
                    />
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
                src="/7.jpeg"
                alt="Traditional Medicine"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {locale === 'fr' ? 'Remèdes Traditionnels' : locale === 'es' ? 'Remedios Tradicionales' : 'Traditional Remedies'}
                </h3>
                <p className="text-green-100 mb-4">
                  {locale === 'fr' ? 'Sagesse ancestrale pour votre santé' : locale === 'es' ? 'Sabiduría ancestral para su salud' : 'Ancestral wisdom for your health'}
                </p>
                <Link href={`/${locale}/products?certifications=traditional`} className="inline-flex items-center text-white font-semibold hover:underline">
                  {t('seeMore')} →
                </Link>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="/8.jpeg"
                alt="Medicinal Plants"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {locale === 'fr' ? 'Plantes Médicinales' : locale === 'es' ? 'Plantas Medicinales' : 'Medicinal Plants'}
                </h3>
                <p className="text-amber-100 mb-4">
                  {locale === 'fr' ? 'Le pouvoir de la nature à votre service' : locale === 'es' ? 'El poder de la naturaleza a su servicio' : 'The power of nature at your service'}
                </p>
                <Link href={`/${locale}/products?category=medicinal-plants`} className="inline-flex items-center text-white font-semibold hover:underline">
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
                      <ProductPrice price={product.price || 0} />
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
    </>
  );
}
