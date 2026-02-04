'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CURRENCY_CONFIG } from '@/lib/currency';

// Extraire les taux et symboles depuis la config centralisée
const CURRENCY_RATES: Record<string, number> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([key, config]) => [key, config.rate])
);

const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([key, config]) => [key, config.symbol])
);

const CURRENCY_POSITIONS: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([key, config]) => [key, config.position])
);

type Currency = keyof typeof CURRENCY_RATES;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-currency', newCurrency);
    }
  }, []);

  const convertPrice = useCallback(
    (price: number, fromCurrency: Currency = 'USD'): number => {
      // Convert from source currency to USD, then to target currency
      const priceInUSD = price / CURRENCY_RATES[fromCurrency];
      return priceInUSD * CURRENCY_RATES[currency];
    },
    [currency]
  );

  const formatPrice = useCallback(
    (price: number): string => {
      const convertedPrice = convertPrice(price);
      const symbol = CURRENCY_SYMBOLS[currency];
      const position = CURRENCY_POSITIONS[currency];
      const decimals = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]?.decimals ?? 2;

      // Format with proper decimal places
      const formatted = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(convertedPrice);

      // Return formatted price with symbol based on position
      if (position === 'after') {
        return `${formatted} ${symbol}`;
      }
      return `${symbol}${formatted}`;
    },
    [currency, convertPrice]
  );

  // Load currency from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-currency');
      if (saved && saved in CURRENCY_RATES) {
        setCurrencyState(saved as Currency);
      }
    }
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Export types and constants
export type { Currency, CurrencyContextType };
export { CURRENCY_RATES, CURRENCY_SYMBOLS };
