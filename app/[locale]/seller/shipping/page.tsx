'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface CountryRule {
  country: string;
  shippingCost: number;
  freeShippingThreshold?: number | '';
  estimatedDeliveryDays?: { min: number; max: number };
}

interface ShippingSettings {
  defaultShippingCost: number;
  freeShippingThreshold?: number | '';
  countryRules: CountryRule[];
  globalFreeShipping: boolean;
  isActive: boolean;
}

const DEFAULT_SETTINGS: ShippingSettings = {
  defaultShippingCost: 0,
  freeShippingThreshold: '',
  countryRules: [],
  globalFreeShipping: false,
  isActive: true,
};

export default function SellerShippingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/vendor/shipping');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          defaultShippingCost: data.defaultShippingCost ?? 0,
          freeShippingThreshold: data.freeShippingThreshold ?? '',
          countryRules: data.countryRules ?? [],
          globalFreeShipping: data.globalFreeShipping ?? false,
          isActive: data.isActive !== false,
        });
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
      return;
    }
    if (status === 'authenticated') {
      if (!['seller', 'admin'].includes(session?.user?.role ?? '')) {
        router.push(`/${locale}`);
        return;
      }
      fetchSettings();
    }
  }, [status, session, locale, router, fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...settings,
        freeShippingThreshold:
          settings.freeShippingThreshold === '' ? undefined : Number(settings.freeShippingThreshold),
        countryRules: settings.countryRules.map((r) => ({
          ...r,
          freeShippingThreshold:
            r.freeShippingThreshold === '' ? undefined : Number(r.freeShippingThreshold),
        })),
      };
      const res = await fetch('/api/vendor/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Paramètres de livraison enregistrés.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error ?? 'Erreur lors de la sauvegarde.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur réseau.' });
    } finally {
      setSaving(false);
    }
  };

  const addCountryRule = () => {
    setSettings((prev) => ({
      ...prev,
      countryRules: [
        ...prev.countryRules,
        { country: '', shippingCost: 0, freeShippingThreshold: '' },
      ],
    }));
  };

  const updateCountryRule = (index: number, field: keyof CountryRule, value: string | number) => {
    setSettings((prev) => {
      const rules = [...prev.countryRules];
      rules[index] = { ...rules[index], [field]: value };
      return { ...prev, countryRules: rules };
    });
  };

  const removeCountryRule = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      countryRules: prev.countryRules.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de livraison</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Global free shipping toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.globalFreeShipping}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, globalFreeShipping: e.target.checked }))
            }
            className="w-5 h-5 rounded border-gray-300 text-green-600"
          />
          <span className="font-medium text-gray-800">Livraison gratuite sur toutes mes commandes</span>
        </label>
      </div>

      {/* Default shipping cost */}
      {!settings.globalFreeShipping && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Tarif par défaut (USD)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Frais de livraison ($)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={settings.defaultShippingCost}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultShippingCost: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Livraison gratuite dès ($) — laisser vide pour désactiver
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    freeShippingThreshold: e.target.value === '' ? '' : parseFloat(e.target.value),
                  }))
                }
                placeholder="Ex: 50"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Country-specific rules */}
      {!settings.globalFreeShipping && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Règles par pays</h2>
            <button
              type="button"
              onClick={addCountryRule}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              + Ajouter un pays
            </button>
          </div>

          {settings.countryRules.length === 0 && (
            <p className="text-sm text-gray-500">
              Aucune règle spécifique. Le tarif par défaut s&apos;applique partout.
            </p>
          )}

          <div className="space-y-3">
            {settings.countryRules.map((rule, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
              >
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Code pays (ISO)</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="FR"
                    value={rule.country}
                    onChange={(e) => updateCountryRule(i, 'country', e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Frais ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={rule.shippingCost}
                    onChange={(e) =>
                      updateCountryRule(i, 'shippingCost', parseFloat(e.target.value) || 0)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gratuit dès ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={rule.freeShippingThreshold ?? ''}
                    onChange={(e) =>
                      updateCountryRule(
                        i,
                        'freeShippingThreshold',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="—"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCountryRule(i)}
                  className="pb-1 text-red-400 hover:text-red-600"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}
