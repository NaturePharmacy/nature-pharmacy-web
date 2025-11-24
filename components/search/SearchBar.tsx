'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
  images: string[];
  price: number;
}

interface Category {
  _id: string;
  name: { fr: string; en: string; es: string };
  slug: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const router = useRouter();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setProducts([]);
      setCategories([]);
      setIsOpen(false);
      return;
    }

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleCategoryClick = (categorySlug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${locale}/products?category=${categorySlug}`);
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search for products...'}
          className="w-full h-10 px-4 pr-10 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (query.length >= 2) && (products.length > 0 || categories.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="p-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                {locale === 'fr' ? 'Catégories' : locale === 'es' ? 'Categorías' : 'Categories'}
              </p>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {category.name[locale as keyof typeof category.name]}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                {locale === 'fr' ? 'Produits' : locale === 'es' ? 'Productos' : 'Products'}
              </p>
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/${locale}/products/${product.slug}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name[locale as keyof typeof product.name]}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name[locale as keyof typeof product.name]}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Results */}
          <div className="p-2 border-t">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSearch(e);
              }}
              className="w-full py-2 text-center text-sm text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
            >
              {locale === 'fr'
                ? `Voir tous les résultats pour "${query}"`
                : locale === 'es'
                ? `Ver todos los resultados para "${query}"`
                : `View all results for "${query}"`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
