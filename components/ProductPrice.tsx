'use client';

import { useCurrency } from '@/hooks/useCurrency';

interface ProductPriceProps {
  price: number;
  compareAtPrice?: number;
  className?: string;
}

export default function ProductPrice({ price, compareAtPrice, className = '' }: ProductPriceProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
      {compareAtPrice && (
        <span className="text-sm text-gray-400 line-through">{formatPrice(compareAtPrice)}</span>
      )}
    </div>
  );
}
