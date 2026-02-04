'use client';

import ProductCardWithCart from './ProductCardWithCart';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  isOrganic?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface FeaturedProductsGridProps {
  products: Product[];
  locale: string;
}

export default function FeaturedProductsGrid({ products, locale }: FeaturedProductsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, 4).map((product) => (
        <ProductCardWithCart
          key={product._id}
          product={product}
          locale={locale}
          showRating={true}
        />
      ))}
    </div>
  );
}
