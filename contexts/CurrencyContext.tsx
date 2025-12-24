'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Currency rates (base: USD)
const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  XOF: 605.5, // West African CFA franc
  MAD: 10.12, // Moroccan Dirham
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  XOF: 'CFA',
  MAD: 'DH',
};

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

      // Format with proper decimal places
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);

      // Return formatted price with symbol
      if (currency === 'XOF' || currency === 'MAD') {
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
