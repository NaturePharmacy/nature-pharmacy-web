'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Ticket {
  _id: string;
  ticketNumber: string;
  user: { name: string; email: string };
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: Array<{ message: string; senderType: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  waiting_user: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  waiting_user: 'Attente client',
  resolved: 'Résolu',
  closed: 'Fermé',
};

const CATEGORY_LABELS: Record<string, string> = {
  order: 'Commande',
  product: 'Produit',
  payment: 'Paiement',
  shipping: 'Livraison',
  account: 'Compte',
  technical: 'Technique',
  other: 'Autre',
};

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [toast, setToast] = useState('');

  const [replyModal, setReplyModal] = useState<{
    open: boolean;
    ticket: Ticket | null;
    message: string;
    newStatus: string;
    loading: boolean;
  }>({ open: false, ticket: null, message: '', newStatus: '', loading: false });

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`);
    else if (status === 'authenticated' && session?.user?.role !== 'admin') router.push(`/${locale}`);
    else fetchTickets();
  }, [session, status, router, locale, filterStatus, filterCategory]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);
      const res = await fetch(`/api/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatus = async (ticketId: string, newStatus: string) => {
    await fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTickets();
  };

  const openReply = (ticket: Ticket) => {
    setReplyModal({
      open: true,
      ticket,
      message: '',
      newStatus: ticket.status === 'open' ? 'in_progress' : ticket.status,
      loading: false,
    });
  };

  const handleReply = async () => {
    if (!replyModal.ticket || !replyModal.message.trim()) return;
    setReplyModal(m => ({ ...m, loading: true }));

    try {
      // Send message
      const msgRes = await fetch(`/api/tickets/${replyModal.ticket._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyModal.message }),
      });

      // Update status if changed
      if (replyModal.newStatus && replyModal.newStatus !== replyModal.ticket.status) {
        await fetch(`/api/tickets/${replyModal.ticket._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: replyModal.newStatus }),
        });
      }

      if (msgRes.ok) {
        showToast('Réponse envoyée');
        setReplyModal({ open: false, ticket: null, message: '', newStatus: '', loading: false });
        fetchTickets();
      }
    } finally {
      setReplyModal(m => ({ ...m, loading: false }));
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const openCount = tickets.filter(t => t.status === 'open').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href={`/${locale}/admin`} className="text-green-600 hover:text-green-700 text-sm mb-1 inline-flex items-center gap-1">
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-gray-500 text-sm">
                {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
                {openCount > 0 && <span className="ml-2 text-blue-600 font-medium">· {openCount} ouvert{openCount > 1 ? 's' : ''}</span>}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="">Tous</option>
                <option value="open">Ouvert</option>
                <option value="in_progress">En cours</option>
                <option value="waiting_user">Attente client</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Fermé</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="">Toutes</option>
                <option value="order">Commande</option>
                <option value="product">Produit</option>
                <option value="payment">Paiement</option>
                <option value="shipping">Livraison</option>
                <option value="account">Compte</option>
                <option value="technical">Technique</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priorité</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">Aucun ticket trouvé</td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-mono text-sm text-gray-700">{ticket.ticketNumber}</p>
                        <p className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('fr')}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-medium text-gray-900 text-sm">{ticket.user.name}</p>
                        <p className="text-xs text-gray-400">{ticket.user.email}</p>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-sm text-gray-700 truncate">{ticket.subject}</p>
                        {ticket.messages?.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {ticket.messages[ticket.messages.length - 1]?.message}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-xs text-gray-600">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {ticket.priority === 'urgent' ? 'Urgent' :
                           ticket.priority === 'high' ? 'Haute' :
                           ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleQuickStatus(ticket._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="open">Ouvert</option>
                          <option value="in_progress">En cours</option>
                          <option value="waiting_user">Attente client</option>
                          <option value="resolved">Résolu</option>
                          <option value="closed">Fermé</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openReply(ticket)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                          >
                            Répondre
                          </button>
                          <Link
                            href={`/${locale}/support/${ticket._id}`}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                          >
                            Voir →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Reply Modal */}
      {replyModal.open && replyModal.ticket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">Répondre au ticket</h2>
              <p className="text-sm text-gray-500 mt-1">
                {replyModal.ticket.ticketNumber} · {replyModal.ticket.user.name}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1 truncate">{replyModal.ticket.subject}</p>
            </div>

            {/* Last message from user */}
            {replyModal.ticket.messages?.filter(m => m.senderType === 'user').slice(-1)[0] && (
              <div className="px-6 pt-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Dernier message du client :</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                  {replyModal.ticket.messages.filter(m => m.senderType === 'user').slice(-1)[0].message}
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Votre réponse</label>
                <textarea
                  rows={5}
                  value={replyModal.message}
                  onChange={(e) => setReplyModal(m => ({ ...m, message: e.target.value }))}
                  placeholder="Tapez votre réponse..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau statut</label>
                <select
                  value={replyModal.newStatus}
                  onChange={(e) => setReplyModal(m => ({ ...m, newStatus: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="open">Ouvert</option>
                  <option value="in_progress">En cours</option>
                  <option value="waiting_user">En attente du client</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setReplyModal({ open: false, ticket: null, message: '', newStatus: '', loading: false })}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReply}
                disabled={replyModal.loading || !replyModal.message.trim()}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {replyModal.loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
