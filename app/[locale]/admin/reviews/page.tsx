'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface Review {
  _id: string;
  user: { _id: string; name: string; email: string; avatar?: string };
  product: { _id: string; name: { fr: string; en: string; es: string }; images: string[] };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  isFlagged: boolean;
  flagReason?: string;
  moderatedBy?: { name: string; email: string };
  moderatedAt?: string;
  moderationNote?: string;
  createdAt: string;
}

export default function AdminReviews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const t = {
    fr: {
      title: 'Modération des avis',
      all: 'Tous',
      pending: 'En attente',
      approved: 'Approuvés',
      rejected: 'Rejetés',
      flagged: 'Signalés',
      search: 'Rechercher...',
      reviewer: 'Auteur',
      product: 'Produit',
      rating: 'Note',
      comment: 'Commentaire',
      status: 'Statut',
      actions: 'Actions',
      approve: 'Approuver',
      reject: 'Rejeter',
      delete: 'Supprimer',
      view: 'Voir détails',
      verified: 'Achat vérifié',
      flagged_badge: 'Signalé',
      loading: 'Chargement...',
      noReviews: 'Aucun avis trouvé',
      noAccess: 'Accès non autorisé',
      moderateReview: 'Modérer l\'avis',
      addNote: 'Ajouter une note de modération',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet avis ?',
      stats: {
        total: 'Total avis',
        pending: 'En attente',
        approved: 'Approuvés',
        flagged: 'Signalés',
      },
    },
    en: {
      title: 'Review Moderation',
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      flagged: 'Flagged',
      search: 'Search...',
      reviewer: 'Reviewer',
      product: 'Product',
      rating: 'Rating',
      comment: 'Comment',
      status: 'Status',
      actions: 'Actions',
      approve: 'Approve',
      reject: 'Reject',
      delete: 'Delete',
      view: 'View Details',
      verified: 'Verified Purchase',
      flagged_badge: 'Flagged',
      loading: 'Loading...',
      noReviews: 'No reviews found',
      noAccess: 'Access Denied',
      moderateReview: 'Moderate Review',
      addNote: 'Add moderation note',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this review?',
      stats: {
        total: 'Total Reviews',
        pending: 'Pending',
        approved: 'Approved',
        flagged: 'Flagged',
      },
    },
  };

  const tr = t[locale as keyof typeof t] || t.fr;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchReviews();
    }
  }, [session, filter, pagination.page, searchTerm]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20',
      });

      if (filter !== 'all') {
        if (filter === 'flagged') {
          params.append('flagged', 'true');
        } else {
          params.append('status', filter);
        }
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await fetch(`/api/admin/reviews?${params}`);
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          moderationNote,
        }),
      });

      if (res.ok) {
        fetchReviews();
        setSelectedReview(null);
        setModerationNote('');
      }
    } catch (err) {
      console.error('Error moderating review:', err);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm(tr.confirmDelete)) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const statsData = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    flagged: reviews.filter((r) => r.isFlagged).length,
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">{tr.loading}</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{tr.noAccess}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{tr.title}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">{tr.stats.total}</div>
          <div className="text-2xl font-bold text-gray-900">{statsData.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">{tr.stats.pending}</div>
          <div className="text-2xl font-bold text-yellow-600">{statsData.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">{tr.stats.approved}</div>
          <div className="text-2xl font-bold text-green-600">{statsData.approved}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600 mb-1">{tr.stats.flagged}</div>
          <div className="text-2xl font-bold text-red-600">{statsData.flagged}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={tr.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected', 'flagged'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tr[f as keyof typeof tr] as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            {tr.noReviews}
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {review.product.images[0] && (
                    <div className="relative w-24 h-24">
                      <Image
                        src={review.product.images[0]}
                        alt={review.product.name[locale]}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.product.name[locale]}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>{review.user.name}</span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.isVerifiedPurchase && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">{tr.verified}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          review.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.isFlagged && (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          {tr.flagged_badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {review.moderationNote && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>Note de modération:</strong> {review.moderationNote}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setModerationNote('');
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          {tr.approve}
                        </button>
                        <button
                          onClick={() => moderateReview(review._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          {tr.reject}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      {tr.delete}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Moderation Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{tr.moderateReview}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tr.addNote}
              </label>
              <textarea
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional moderation note..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setModerationNote('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {tr.cancel}
              </button>
              <button
                onClick={() => moderateReview(selectedReview._id, 'approved')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {tr.approve}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPagination({ ...pagination, page: i + 1 })}
              className={`px-4 py-2 rounded ${
                pagination.page === i + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
