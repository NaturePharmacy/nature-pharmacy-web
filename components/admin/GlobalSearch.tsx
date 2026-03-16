'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface SearchResult {
  type: 'order' | 'product' | 'user';
  id: string;
  label: string;
  sub?: string;
  status?: string;
  role?: string;
  href: string;
}

const TYPE_ICONS: Record<string, string> = { order: '🛒', product: '📦', user: '👤' };
const TYPE_LABELS: Record<string, string> = { order: 'Commande', product: 'Produit', user: 'Utilisateur' };

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    setSelected(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  };

  const navigate = (result: SearchResult) => {
    setOpen(false);
    router.push(`/${locale}${result.href}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) navigate(results[selected]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg text-sm transition-colors"
        title="Recherche globale (Ctrl+K)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Rechercher</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chercher une commande, un produit, un client..."
            className="flex-1 text-gray-900 text-sm outline-none placeholder-gray-400 bg-transparent"
          />
          {loading && (
            <svg className="animate-spin w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">Esc</button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {results.map((r, i) => (
              <li key={r.id + r.type}>
                <button
                  className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${i === selected ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  onClick={() => navigate(r)}
                >
                  <span className="text-xl flex-shrink-0">{TYPE_ICONS[r.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.label}</p>
                    {r.sub && <p className="text-xs text-gray-500 truncate">{r.sub}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{TYPE_LABELS[r.type]}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : query.length >= 2 && !loading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Aucun résultat pour « {query} »</div>
        ) : query.length === 0 ? (
          <div className="px-5 py-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Accès rapide</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Commandes', href: '/admin/orders', icon: '🛒' },
                { label: 'Produits', href: '/admin/products', icon: '📦' },
                { label: 'Utilisateurs', href: '/admin/users', icon: '👤' },
                { label: 'Tickets', href: '/admin/tickets', icon: '🎫' },
                { label: 'Analytics', href: '/admin/analytics', icon: '📊' },
                { label: 'Logs', href: '/admin/logs', icon: '📋' },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => { setOpen(false); router.push(`/${locale}${item.href}`); }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors text-left"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="px-5 py-3 border-t bg-gray-50 flex gap-4 text-xs text-gray-400">
          <span>↑↓ Naviguer</span>
          <span>↵ Ouvrir</span>
          <span>Esc Fermer</span>
        </div>
      </div>
    </div>
  );
}
