'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface DisputeParty {
  _id: string;
  name: string;
  email: string;
}

interface DisputeOrder {
  _id: string;
  orderNumber: string;
  totalPrice: number;
}

interface DisputeMessage {
  _id?: string;
  sender: { _id: string; name: string; email: string } | string;
  senderRole: 'buyer' | 'seller' | 'admin';
  message: string;
  createdAt: string;
}

interface Dispute {
  _id: string;
  disputeNumber: string;
  order: DisputeOrder;
  buyer: DisputeParty;
  seller: DisputeParty;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_seller' | 'closed';
  resolution?: string;
  refundAmount?: number;
  messages: DisputeMessage[];
  evidence: string[];
  resolvedAt?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  open: number;
  resolvedBuyer: number;
  resolvedSeller: number;
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

const STATUS_CONFIG = {
  open: { label: 'Ouvert', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'En examen', color: 'bg-yellow-100 text-yellow-700' },
  resolved_buyer: { label: 'Résolu acheteur', color: 'bg-green-100 text-green-700' },
  resolved_seller: { label: 'Résolu vendeur', color: 'bg-orange-100 text-orange-700' },
  closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-600' },
};

const REASON_LABELS: Record<string, string> = {
  not_received: 'Non reçu',
  not_as_described: 'Non conforme',
  defective: 'Défectueux',
  wrong_item: 'Mauvais article',
  other: 'Autre',
};

export default function AdminDisputesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale() as 'fr' | 'en' | 'es';

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, resolvedBuyer: 0, resolvedSeller: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Modal state
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalForm, setModalForm] = useState({
    status: '',
    resolution: '',
    refundAmount: '',
    message: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`);
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push(`/${locale}`);
  }, [status, session, router, locale]);

  const fetchDisputes = useCallback(async () => {
    if (session?.user?.role !== 'admin') return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page.toString(), limit: '15' });
      if (filterStatus) params.append('status', filterStatus);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/disputes?${params}`);
      const data = await res.json();
      if (res.ok) {
        setDisputes(data.disputes);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } finally {
      setLoading(false);
    }
  }, [session, pagination.page, filterStatus, search]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const openModal = async (dispute: Dispute) => {
    // Fetch full dispute with messages
    const res = await fetch(`/api/admin/disputes/${dispute._id}`);
    const data = await res.json();
    if (res.ok) {
      setSelectedDispute(data.dispute);
      setModalForm({
        status: data.dispute.status,
        resolution: data.dispute.resolution || '',
        refundAmount: data.dispute.refundAmount?.toString() || '',
        message: '',
      });
    }
  };

  const closeModal = () => {
    setSelectedDispute(null);
    setModalForm({ status: '', resolution: '', refundAmount: '', message: '' });
  };

  const handleUpdate = async () => {
    if (!selectedDispute) return;
    setModalLoading(true);

    const body: any = {
      status: modalForm.status,
      resolution: modalForm.resolution,
    };
    if (modalForm.refundAmount) body.refundAmount = parseFloat(modalForm.refundAmount);
    if (modalForm.message.trim()) body.message = modalForm.message;

    const res = await fetch(`/api/admin/disputes/${selectedDispute._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setModalLoading(false);

    if (res.ok) {
      showToast('Litige mis à jour avec succès');
      setSelectedDispute(data.dispute);
      setModalForm(f => ({ ...f, message: '' }));
      fetchDisputes();
    } else {
      showToast(data.error || 'Erreur lors de la mise à jour');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
          {toast}
        </div>
      )}

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-1 inline-flex items-center gap-1">
              ← Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Litiges</h1>
            <p className="text-gray-500 text-sm">{pagination.total} litige(s)</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total litiges</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ouverts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Résolus acheteur</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedBuyer}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Résolus vendeur</p>
              <p className="text-2xl font-bold text-orange-600">{stats.resolvedSeller}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Rechercher par N° commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDisputes()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Litige</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Commande</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acheteur</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendeur</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Raison</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <svg className="animate-spin h-6 w-6 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </td>
                    </tr>
                  ) : disputes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                        Aucun litige trouvé
                      </td>
                    </tr>
                  ) : (
                    disputes.map((dispute) => {
                      const sc = STATUS_CONFIG[dispute.status];
                      return (
                        <tr key={dispute._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono text-sm text-gray-700">{dispute.disputeNumber}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono text-sm text-gray-700">{dispute.order?.orderNumber || 'N/A'}</span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-800">{dispute.buyer?.name}</p>
                            <p className="text-xs text-gray-400">{dispute.buyer?.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-800">{dispute.seller?.name}</p>
                            <p className="text-xs text-gray-400">{dispute.seller?.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-600">{REASON_LABELS[dispute.reason] || dispute.reason}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc?.color || 'bg-gray-100 text-gray-600'}`}>
                              {sc?.label || dispute.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-500">
                              {new Date(dispute.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => openModal(dispute)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                            >
                              Voir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  ← Préc.
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPagination(pag => ({ ...pag, page: p }))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === pagination.page ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  Suiv. →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Litige {selectedDispute.disputeNumber}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Commande : {selectedDispute.order?.orderNumber}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Dispute Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Acheteur</p>
                  <p className="text-sm font-medium text-gray-800">{selectedDispute.buyer?.name}</p>
                  <p className="text-xs text-gray-400">{selectedDispute.buyer?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vendeur</p>
                  <p className="text-sm font-medium text-gray-800">{selectedDispute.seller?.name}</p>
                  <p className="text-xs text-gray-400">{selectedDispute.seller?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Raison</p>
                  <p className="text-sm text-gray-700">{REASON_LABELS[selectedDispute.reason] || selectedDispute.reason}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date d'ouverture</p>
                  <p className="text-sm text-gray-700">{new Date(selectedDispute.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedDispute.description}
                </div>
              </div>

              {/* Evidence */}
              {selectedDispute.evidence && selectedDispute.evidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preuves</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDispute.evidence.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                      >
                        Pièce jointe {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Thread */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Messages ({selectedDispute.messages?.length || 0})
                </p>
                {selectedDispute.messages && selectedDispute.messages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDispute.messages.map((msg, idx) => {
                      const roleColors: Record<string, string> = {
                        admin: 'bg-purple-50 border-purple-200',
                        buyer: 'bg-blue-50 border-blue-200',
                        seller: 'bg-amber-50 border-amber-200',
                      };
                      const roleLabels: Record<string, string> = {
                        admin: 'Admin',
                        buyer: 'Acheteur',
                        seller: 'Vendeur',
                      };
                      const senderName = typeof msg.sender === 'object' ? msg.sender.name : 'Utilisateur';
                      return (
                        <div key={idx} className={`border rounded-lg p-3 ${roleColors[msg.senderRole] || 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              {senderName} <span className="text-gray-400 font-normal">({roleLabels[msg.senderRole] || msg.senderRole})</span>
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(msg.createdAt).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Aucun message pour l'instant.</p>
                )}
              </div>

              {/* Admin Reply */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Répondre (admin)</p>
                <textarea
                  rows={3}
                  value={modalForm.message}
                  onChange={(e) => setModalForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Écrire un message aux parties..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
              </div>

              {/* Status + Resolution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Changer le statut
                  </label>
                  <select
                    value={modalForm.status}
                    onChange={(e) => setModalForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Montant remboursé (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={modalForm.refundAmount}
                    onChange={(e) => setModalForm(f => ({ ...f, refundAmount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Résolution (note interne)
                </label>
                <textarea
                  rows={3}
                  value={modalForm.resolution}
                  onChange={(e) => setModalForm(f => ({ ...f, resolution: e.target.value }))}
                  placeholder="Décision prise, actions effectuées..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={closeModal}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Fermer
              </button>
              <button
                onClick={handleUpdate}
                disabled={modalLoading}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {modalLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
