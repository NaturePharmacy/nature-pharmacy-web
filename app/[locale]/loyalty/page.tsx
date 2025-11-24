'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LoyaltyData {
  loyalty: {
    totalPoints: number;
    lifetimePoints: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    transactions: Array<{
      type: string;
      points: number;
      description: string;
      createdAt: string;
    }>;
  };
  tierBenefits: {
    multiplier: number;
    pointsPerCFA: number;
    benefits: string[];
  };
  nextTier: {
    name: string;
    threshold: number;
    pointsNeeded: number;
  } | null;
}

export default function LoyaltyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user) {
      fetchLoyaltyData();
    }
  }, [session, status, router, locale]);

  const fetchLoyaltyData = async () => {
    try {
      const res = await fetch('/api/loyalty');
      if (res.ok) {
        const loyaltyData = await res.json();
        setData(loyaltyData);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-gray-800 to-gray-600';
      case 'gold':
        return 'from-yellow-500 to-yellow-600';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      case 'bronze':
      default:
        return 'from-orange-600 to-orange-700';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return '💎';
      case 'gold':
        return '👑';
      case 'silver':
        return '⭐';
      case 'bronze':
      default:
        return '🥉';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Failed to load loyalty data</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loyalty Rewards</h1>

          {/* Points Overview Card */}
          <div className={`bg-gradient-to-r ${getTierColor(data.loyalty.tier)} rounded-lg shadow-lg p-8 text-white mb-8`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Your Tier</p>
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{getTierIcon(data.loyalty.tier)}</span>
                  <h2 className="text-3xl font-bold capitalize">{data.loyalty.tier}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Available Points</p>
                <p className="text-4xl font-bold">{data.loyalty.totalPoints.toLocaleString()}</p>
                <p className="text-white/80 text-sm mt-1">= {data.loyalty.totalPoints.toLocaleString()} CFA</p>
              </div>
            </div>

            {/* Progress to next tier */}
            {data.nextTier && (
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Progress to {data.nextTier.name}</p>
                  <p className="text-sm font-bold">
                    {data.loyalty.lifetimePoints.toLocaleString()} / {data.nextTier.threshold.toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((data.loyalty.lifetimePoints / data.nextTier.threshold) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-white/80 mt-2">
                  {data.nextTier.pointsNeeded.toLocaleString()} more points to reach {data.nextTier.name}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Benefits</h3>
                <ul className="space-y-3">
                  {data.tierBenefits.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {data.loyalty.transactions.length > 0 ? (
                    data.loyalty.transactions.slice(0, 10).map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.points > 0 ? '+' : ''}
                            {transaction.points.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How it Works</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🛍️</span>
                      <h4 className="font-semibold text-gray-900">Earn Points</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      Earn {data.tierBenefits.pointsPerCFA} point{data.tierBenefits.pointsPerCFA > 1 ? 's' : ''} for every 1 CFA you spend
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💰</span>
                      <h4 className="font-semibold text-gray-900">Redeem Points</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      1 point = 1 CFA discount on your purchases
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📈</span>
                      <h4 className="font-semibold text-gray-900">Level Up</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      Reach higher tiers for better rewards and exclusive benefits
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">Tier Thresholds</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span>🥉</span>
                        <span className="text-gray-600">Bronze: 0 points</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>⭐</span>
                        <span className="text-gray-600">Silver: 20,000 points</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>👑</span>
                        <span className="text-gray-600">Gold: 50,000 points</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>💎</span>
                        <span className="text-gray-600">Platinum: 100,000 points</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
