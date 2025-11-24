'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  size = 'md',
  showText = false,
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus();
    }
  }, [session, productId]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        const inWishlist = data.wishlist.products.some(
          (p: any) => p._id === productId || p === productId
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/${locale}/login`);
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const res = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getText = () => {
    if (locale === 'fr') {
      return isInWishlist ? 'Dans la liste' : 'Ajouter aux favoris';
    } else if (locale === 'es') {
      return isInWishlist ? 'En la lista' : 'Añadir a favoritos';
    } else {
      return isInWishlist ? 'In wishlist' : 'Add to wishlist';
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${showText ? 'flex items-center gap-2 px-4' : 'flex items-center justify-center'}
        ${sizeClasses[size]}
        ${
          isInWishlist
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }
        border rounded-full transition-all duration-200 disabled:opacity-50
        ${showText ? 'rounded-lg' : ''}
      `}
      title={getText()}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-b-2 ${isInWishlist ? 'border-red-600' : 'border-gray-600'} ${iconSizes[size]}`}></div>
      ) : (
        <>
          <svg
            className={iconSizes[size]}
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {showText && <span className="text-sm font-medium">{getText()}</span>}
        </>
      )}
    </button>
  );
}
