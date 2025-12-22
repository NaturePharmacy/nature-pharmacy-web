'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import ShareButtons from '@/components/social/ShareButtons';

interface ReferredUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Reward {
  referredUser: {
    _id: string;
    name: string;
    email: string;
  };
  order?: string;
  amount: number;
  status: 'pending' | 'paid';
  createdAt: string;
}

interface ReferralData {
  referralCode: string;
  totalReferred: number;
  totalEarned: number;
  conversions: number;
  pendingRewards: number;
  paidRewards: number;
  conversionRate: number;
}

interface ReferralDetails {
  referred: ReferredUser[];
  rewards: Reward[];
}

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralDetails, setReferralDetails] = useState<ReferralDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (session?.user) {
      fetchReferralData();
    }
  }, [session, status, router, locale]);

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const data = await res.json();
        setReferralData(data.summary);
        setReferralDetails({
          referred: data.referral.referred || [],
          rewards: data.referral.rewards || [],
        });
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (referralData?.referralCode) {
      try {
        await navigator.clipboard.writeText(referralData.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Referral Data</h2>
          <Link href={`/${locale}`} className="text-green-600 hover:text-green-700">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/register?ref=${referralData.referralCode}`;

  return (
    <main className="flex-1 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
            <p className="text-gray-600 mt-1">Earn rewards by inviting your friends to Nature Pharmacy</p>
          </div>

          {/* Referral Code Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
              <p className="mb-6 opacity-90">Share this code with friends and earn rewards when they make their first purchase</p>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <div className="font-mono text-4xl font-bold tracking-wider mb-4">
                  {referralData.referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-6 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <ShareButtons
                  url={referralUrl}
                  title={`Join Nature Pharmacy with my referral code: ${referralData.referralCode}`}
                  description="Shop natural and organic products with exclusive discounts!"
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Referred</h3>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{referralData.totalReferred}</p>
              <p className="text-sm text-gray-500 mt-1">users joined</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Earned</h3>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{referralData.totalEarned.toFixed(2)} FCFA</p>
              <p className="text-sm text-gray-500 mt-1">all-time rewards</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{referralData.conversions}</p>
              <p className="text-sm text-gray-500 mt-1">{referralData.conversionRate.toFixed(1)}% conversion rate</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Pending Rewards</h3>
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">{referralData.pendingRewards.toFixed(2)} FCFA</p>
              <p className="text-sm text-gray-500 mt-1">awaiting payment</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share Your Code</h3>
                <p className="text-gray-600 text-sm">Share your unique referral code with friends via social media or direct link</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Friends Sign Up</h3>
                <p className="text-gray-600 text-sm">Your friends create an account using your referral code</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">Get rewarded when your referrals make their first purchase</p>
              </div>
            </div>
          </div>

          {/* Referred Users */}
          {referralDetails && referralDetails.referred.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Referred Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralDetails.referred.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rewards History */}
          {referralDetails && referralDetails.rewards.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rewards History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralDetails.rewards.map((reward, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{reward.referredUser.name}</p>
                            <p className="text-sm text-gray-500">{reward.referredUser.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">
                          {reward.amount.toFixed(2)} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              reward.status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {reward.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(reward.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {referralDetails && referralDetails.referred.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Referrals Yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your referral code to earn rewards!</p>
            </div>
          )}
        </div>
    </main>
  );
}
