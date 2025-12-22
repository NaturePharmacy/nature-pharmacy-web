'use client';

import { useCurrency } from '@/hooks/useCurrency';

interface PriceProps {
  amount: number;
  className?: string;
  showCurrency?: boolean;
}

/**
 * Composant pour afficher un prix formaté selon la locale
 * Le prix doit être fourni en FCFA (monnaie de base)
 */
export default function Price({ amount, className = '', showCurrency = true }: PriceProps) {
  const { formatPrice } = useCurrency();

  return (
    <span className={className}>
      {formatPrice(amount)}
    </span>
  );
}
