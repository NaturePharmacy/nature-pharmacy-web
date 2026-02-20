'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface ShippingZone {
  _id: string;
  name: {
    fr: string;
    en: string;
    es: string;
  };
  description?: {
    fr: string;
    en: string;
    es: string;
  };
  countries: string[];
  regions?: string[];
  shippingCost: number;
  freeShippingThreshold?: number;
  estimatedDeliveryDays: {
    min: number;
    max: number;
  };
  isActive: boolean;
  priority: number;
}

export default function AdminShippingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');

  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', es: '' },
    description: { fr: '', en: '', es: '' },
    countries: ['SN'],
    regions: [] as string[],
    shippingCost: 0,
    freeShippingThreshold: 0,
    estimatedDeliveryDays: { min: 1, max: 3 },
    isActive: true,
    priority: 0,
  });
  const [regionInput, setRegionInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push(`/${locale}`);
    } else {
      fetchZones();
    }
  }, [session, status, router, locale]);

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/shipping/zones');
      if (res.ok) {
        const data = await res.json();
        setZones(data.zones);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingZone
        ? `/api/shipping/zones/${editingZone._id}`
        : '/api/shipping/zones';

      const res = await fetch(url, {
        method: editingZone ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          freeShippingThreshold: formData.freeShippingThreshold || undefined,
        }),
      });

      if (res.ok) {
        await fetchZones();
        setShowForm(false);
        setEditingZone(null);
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Error saving zone');
      }
    } catch (error) {
      console.error('Error saving zone:', error);
      alert('Error saving zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping zone?')) {
      return;
    }

    try {
      const res = await fetch(`/api/shipping/zones/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchZones();
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting zone');
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      alert('Error deleting zone');
    }
  };

  const handleEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description || { fr: '', en: '', es: '' },
      countries: zone.countries,
      regions: zone.regions || [],
      shippingCost: zone.shippingCost,
      freeShippingThreshold: zone.freeShippingThreshold || 0,
      estimatedDeliveryDays: zone.estimatedDeliveryDays,
      isActive: zone.isActive,
      priority: zone.priority,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: { fr: '', en: '', es: '' },
      description: { fr: '', en: '', es: '' },
      countries: ['SN'],
      regions: [],
      shippingCost: 0,
      freeShippingThreshold: 0,
      estimatedDeliveryDays: { min: 1, max: 3 },
      isActive: true,
      priority: 0,
    });
    setRegionInput('');
  };

  const addRegion = () => {
    if (regionInput.trim() && !formData.regions.includes(regionInput.trim())) {
      setFormData({
        ...formData,
        regions: [...formData.regions, regionInput.trim()],
      });
      setRegionInput('');
    }
  };

  const removeRegion = (region: string) => {
    setFormData({
      ...formData,
      regions: formData.regions.filter((r) => r !== region),
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Zones</h1>
            <p className="text-gray-600 mt-1">Manage shipping zones and delivery costs</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingZone(null);
              resetForm();
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Zone'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name (FR)</label>
                  <input
                    type="text"
                    required
                    value={formData.name.fr}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={formData.name.en}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name (ES)</label>
                  <input
                    type="text"
                    required
                    value={formData.name.es}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Countries */}
              <div>
                <label className="block text-sm font-medium mb-2">Countries (ISO codes, comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.countries.join(', ')}
                  onChange={(e) => setFormData({ ...formData, countries: e.target.value.split(',').map(c => c.trim()) })}
                  placeholder="SN, FR, US"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Regions */}
              <div>
                <label className="block text-sm font-medium mb-2">Regions (optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
                    placeholder="Add region (e.g., Paris)"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={addRegion}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.regions.map((region) => (
                    <span
                      key={region}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2"
                    >
                      {region}
                      <button
                        type="button"
                        onClick={() => removeRegion(region)}
                        className="text-green-900 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Costs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Shipping Cost (CFA)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.shippingCost}
                    onChange={(e) => setFormData({ ...formData, shippingCost: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Free Shipping Threshold (CFA, 0 = none)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Delivery Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Delivery Days</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.estimatedDeliveryDays.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      estimatedDeliveryDays: { ...formData.estimatedDeliveryDays, min: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Delivery Days</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.estimatedDeliveryDays.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      estimatedDeliveryDays: { ...formData.estimatedDeliveryDays, max: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority (lower = higher priority)</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingZone ? 'Update Zone' : 'Create Zone'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingZone(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Zones List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Countries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zones.map((zone) => (
                <tr key={zone._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {zone.name[locale as keyof typeof zone.name]}
                    </div>
                    {zone.regions && zone.regions.length > 0 && (
                      <div className="text-sm text-gray-500">{zone.regions.join(', ')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {zone.countries.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {zone.shippingCost.toLocaleString()} CFA
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {zone.freeShippingThreshold
                      ? `${zone.freeShippingThreshold.toLocaleString()} CFA`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {zone.estimatedDeliveryDays.min}-{zone.estimatedDeliveryDays.max} days
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        zone.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {zones.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No shipping zones configured yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
