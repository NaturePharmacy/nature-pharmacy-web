'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import ProductReviews from '@/components/products/ProductReviews';
import WishlistButton from '@/components/wishlist/WishlistButton';
import ShareButtons from '@/components/social/ShareButtons';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  description: { fr: string; en: string; es: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: { fr: string; en: string; es: string };
    slug: string;
  };
  seller: {
    _id: string;
    name: string;
    sellerInfo: {
      storeName: string;
      rating: number;
      verified: boolean;
    };
  };
  stock: number;
  isOrganic: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  ingredients?: { fr: string; en: string; es: string };
  usage?: { fr: string; en: string; es: string };
  weight?: string;
  dimensions?: string;
}

interface SimilarProduct {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const t = useTranslations('productDetail');
  const tCommon = useTranslations('common');
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [contactingLoading, setContactingLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/slug/${slug}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data.product);
        setSimilarProducts(data.similarProducts || []);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      price: product.price,
      quantity: quantity,
      stock: product.stock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product!.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleContactSeller = async () => {
    if (!session) {
      router.push(`/${locale}/login`);
      return;
    }

    if (!product) return;

    setContactingLoading(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: product.seller._id,
          productId: product._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/${locale}/messages/${data.conversation._id}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setContactingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('notFound')}</h1>
        <Link
          href={`/${locale}/products`}
          className="text-green-600 hover:text-green-700"
        >
          {t('backToProducts')}
        </Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href={`/${locale}`} className="text-gray-500 hover:text-green-600">
            {tCommon('home')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/${locale}/products`} className="text-gray-500 hover:text-green-600">
            {tCommon('products')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={`/${locale}/products?category=${product.category.slug}`}
            className="text-gray-500 hover:text-green-600"
          >
            {product.category.name[locale as keyof typeof product.category.name]}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">
            {product.name[locale as keyof typeof product.name]}
          </span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name[locale as keyof typeof product.name]}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isOrganic && (
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t('organic')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-green-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name[locale as keyof typeof product.name]} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              <Link
                href={`/${locale}/products?category=${product.category.slug}`}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {product.category.name[locale as keyof typeof product.category.name]}
              </Link>

              {/* Title with Wishlist and Share Buttons */}
              <div className="flex items-start justify-between gap-4 mt-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {product.name[locale as keyof typeof product.name]}
                </h1>
                <div className="flex items-center gap-2">
                  <WishlistButton productId={product._id} size="lg" />
                  <ShareButtons
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/products/${product.slug}`}
                    title={product.name[locale as keyof typeof product.name]}
                    description={product.description[locale as keyof typeof product.description]}
                    image={product.images[0]}
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} {t('reviews')})
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {product.stock > 0 ? (
                  <span className={`inline-flex items-center text-sm ${
                    product.stock <= 10 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {product.stock <= 10
                      ? t('lowStock', { count: product.stock })
                      : t('inStock')}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm text-red-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {t('outOfStock')}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">{t('description')}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {product.description[locale as keyof typeof product.description]}
                </p>
              </div>

              {/* Ingredients */}
              {product.ingredients && product.ingredients[locale as keyof typeof product.ingredients] && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">{t('ingredients')}</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {product.ingredients[locale as keyof typeof product.ingredients]}
                  </p>
                </div>
              )}

              {/* Usage */}
              {product.usage && product.usage[locale as keyof typeof product.usage] && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">{t('usage')}</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {product.usage[locale as keyof typeof product.usage]}
                  </p>
                </div>
              )}

              {/* Product Details */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900">{t('details')}</h3>
                <dl className="mt-2 space-y-2">
                  {product.weight && (
                    <div className="flex text-sm">
                      <dt className="text-gray-500 w-24">{t('weight')}:</dt>
                      <dd className="text-gray-900">{product.weight}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex text-sm">
                      <dt className="text-gray-500 w-24">{t('dimensions')}:</dt>
                      <dd className="text-gray-900">{product.dimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Add to Cart */}
              {product.stock > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-3 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                        addedToCart
                          ? 'bg-green-500'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {addedToCart ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('addedToCart')}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {t('addToCart')}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Seller Info */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t('soldBy')}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">
                        {product.seller.sellerInfo?.storeName?.charAt(0) || product.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {product.seller.sellerInfo?.storeName || product.seller.name}
                        </span>
                        {product.seller.sellerInfo?.verified && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {product.seller.sellerInfo?.rating && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {product.seller.sellerInfo.rating.toFixed(1)} {t('sellerRating')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Seller Button */}
                  {session?.user?.id !== product.seller._id && (
                    <button
                      onClick={handleContactSeller}
                      disabled={contactingLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      {contactingLoading ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">{t('contactSeller')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product._id} locale={locale} />

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('similarProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {similarProducts.map((item) => (
                <Link
                  key={item._id}
                  href={`/${locale}/products/${item.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name[locale as keyof typeof item.name]}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {item.isOrganic && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Bio
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.name[locale as keyof typeof item.name]}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-500">{item.rating.toFixed(1)}</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                      {item.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${item.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
