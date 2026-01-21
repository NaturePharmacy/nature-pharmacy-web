'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface Settings {
  _id?: string;
  commissionRate: number;
  storeName: { fr: string; en: string; es: string };
  storeDescription: { fr: string; en: string; es: string };
  storeLogo?: string;
  storeFavicon?: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  defaultCurrency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  defaultLanguage: 'fr' | 'en' | 'es';
  taxEnabled: boolean;
  taxRate: number;
  taxLabel: { fr: string; en: string; es: string };
  pricesIncludeTax: boolean;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
  paymentMethods: {
    stripe: { enabled: boolean; publicKey?: string; secretKey?: string };
    paypal: { enabled: boolean; clientId?: string; secretKey?: string };
    cashOnDelivery: { enabled: boolean };
    bankTransfer: {
      enabled: boolean;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  };
  emailNotifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    orderCancelled: boolean;
    newUserWelcome: boolean;
    passwordReset: boolean;
  };
  orderSettings: {
    orderPrefix: string;
    minimumOrderAmount: number;
    allowGuestCheckout: boolean;
  };
  maintenanceMode: boolean;
  maintenanceMessage: { fr: string; en: string; es: string };
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const t = {
    fr: {
      title: 'Paramètres du magasin',
      loading: 'Chargement...',
      saving: 'Enregistrement...',
      save: 'Enregistrer les modifications',
      success: 'Paramètres mis à jour avec succès',
      tabs: {
        general: 'Général',
        contact: 'Contact & Adresse',
        localization: 'Localisation',
        tax: 'Taxes',
        shipping: 'Expédition',
        payment: 'Paiements',
        email: 'Notifications Email',
        orders: 'Commandes',
        maintenance: 'Maintenance',
      },
      general: {
        commission: 'Taux de commission (%)',
        storeName: 'Nom du magasin',
        storeDescription: 'Description du magasin',
        logo: 'Logo du magasin',
        favicon: 'Favicon',
        uploadLogo: 'Télécharger le logo',
        uploadFavicon: 'Télécharger le favicon',
      },
      contact: {
        title: 'Informations de contact',
        email: 'Email de contact',
        phone: 'Téléphone',
        supportEmail: 'Email support',
        address: 'Adresse',
        street: 'Rue',
        city: 'Ville',
        state: 'État/Région',
        country: 'Pays',
        postalCode: 'Code postal',
        socialMedia: 'Réseaux sociaux',
      },
      localization: {
        title: 'Devise et langue',
        currency: 'Devise par défaut',
        currencySymbol: 'Symbole de devise',
        currencyPosition: 'Position du symbole',
        before: 'Avant',
        after: 'Après',
        defaultLanguage: 'Langue par défaut',
      },
      tax: {
        title: 'Configuration des taxes',
        enabled: 'Activer les taxes',
        rate: 'Taux de taxe (%)',
        label: 'Libellé de taxe',
        includeInPrices: 'Prix incluent les taxes',
      },
      shipping: {
        title: 'Configuration de l\'expédition',
        freeShipping: 'Livraison gratuite activée',
        threshold: 'Seuil de livraison gratuite (CFA)',
      },
      payment: {
        title: 'Méthodes de paiement',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cod: 'Paiement à la livraison',
        bankTransfer: 'Virement bancaire',
        enabled: 'Activé',
        publicKey: 'Clé publique',
        secretKey: 'Clé secrète',
        clientId: 'Client ID',
        bankName: 'Nom de la banque',
        accountNumber: 'Numéro de compte',
        accountName: 'Nom du compte',
      },
      email: {
        title: 'Notifications email',
        orderConfirmation: 'Confirmation de commande',
        orderShipped: 'Commande expédiée',
        orderDelivered: 'Commande livrée',
        orderCancelled: 'Commande annulée',
        newUserWelcome: 'Bienvenue nouveau utilisateur',
        passwordReset: 'Réinitialisation mot de passe',
      },
      orders: {
        title: 'Configuration des commandes',
        prefix: 'Préfixe des commandes',
        minAmount: 'Montant minimum de commande (CFA)',
        guestCheckout: 'Autoriser le paiement invité',
      },
      maintenance: {
        title: 'Mode maintenance',
        enabled: 'Activer le mode maintenance',
        message: 'Message de maintenance',
      },
      noAccess: 'Accès non autorisé',
      noAccessDesc: 'Vous n\'avez pas les permissions pour accéder à cette page.',
    },
    en: {
      title: 'Store Settings',
      loading: 'Loading...',
      saving: 'Saving...',
      save: 'Save Changes',
      success: 'Settings updated successfully',
      tabs: {
        general: 'General',
        contact: 'Contact & Address',
        localization: 'Localization',
        tax: 'Tax',
        shipping: 'Shipping',
        payment: 'Payment',
        email: 'Email Notifications',
        orders: 'Orders',
        maintenance: 'Maintenance',
      },
      general: {
        commission: 'Commission Rate (%)',
        storeName: 'Store Name',
        storeDescription: 'Store Description',
        logo: 'Store Logo',
        favicon: 'Favicon',
        uploadLogo: 'Upload Logo',
        uploadFavicon: 'Upload Favicon',
      },
      contact: {
        title: 'Contact Information',
        email: 'Contact Email',
        phone: 'Phone',
        supportEmail: 'Support Email',
        address: 'Address',
        street: 'Street',
        city: 'City',
        state: 'State/Region',
        country: 'Country',
        postalCode: 'Postal Code',
        socialMedia: 'Social Media',
      },
      localization: {
        title: 'Currency and Language',
        currency: 'Default Currency',
        currencySymbol: 'Currency Symbol',
        currencyPosition: 'Symbol Position',
        before: 'Before',
        after: 'After',
        defaultLanguage: 'Default Language',
      },
      tax: {
        title: 'Tax Configuration',
        enabled: 'Enable Tax',
        rate: 'Tax Rate (%)',
        label: 'Tax Label',
        includeInPrices: 'Prices include tax',
      },
      shipping: {
        title: 'Shipping Configuration',
        freeShipping: 'Free Shipping Enabled',
        threshold: 'Free Shipping Threshold (CFA)',
      },
      payment: {
        title: 'Payment Methods',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cod: 'Cash on Delivery',
        bankTransfer: 'Bank Transfer',
        enabled: 'Enabled',
        publicKey: 'Public Key',
        secretKey: 'Secret Key',
        clientId: 'Client ID',
        bankName: 'Bank Name',
        accountNumber: 'Account Number',
        accountName: 'Account Name',
      },
      email: {
        title: 'Email Notifications',
        orderConfirmation: 'Order Confirmation',
        orderShipped: 'Order Shipped',
        orderDelivered: 'Order Delivered',
        orderCancelled: 'Order Cancelled',
        newUserWelcome: 'New User Welcome',
        passwordReset: 'Password Reset',
      },
      orders: {
        title: 'Order Configuration',
        prefix: 'Order Prefix',
        minAmount: 'Minimum Order Amount (CFA)',
        guestCheckout: 'Allow Guest Checkout',
      },
      maintenance: {
        title: 'Maintenance Mode',
        enabled: 'Enable Maintenance Mode',
        message: 'Maintenance Message',
      },
      noAccess: 'Access Denied',
      noAccessDesc: 'You do not have permission to access this page.',
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
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();

      if (res.ok) {
        setSettings(data.settings);
      } else {
        setError(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'nature-pharmacy/store');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSettings((prev) => (prev ? { ...prev, storeLogo: data.url } : null));
      } else {
        setError(data.error || 'Failed to upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError('Favicon must be less than 1MB');
      return;
    }

    setUploadingFavicon(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'nature-pharmacy/store');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSettings((prev) => (prev ? { ...prev, storeFavicon: data.url } : null));
      } else {
        setError(data.error || 'Failed to upload favicon');
      }
    } catch (err) {
      console.error('Error uploading favicon:', err);
      setError('Failed to upload favicon');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(tr.success);
        setSettings(data.settings);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{tr.noAccess}</h1>
          <p className="text-gray-600">{tr.noAccessDesc}</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return <div className="p-8 text-center text-gray-600">{tr.loading}</div>;
  }

  const tabs = [
    { id: 'general', label: tr.tabs.general },
    { id: 'contact', label: tr.tabs.contact },
    { id: 'localization', label: tr.tabs.localization },
    { id: 'tax', label: tr.tabs.tax },
    { id: 'shipping', label: tr.tabs.shipping },
    { id: 'payment', label: tr.tabs.payment },
    { id: 'email', label: tr.tabs.email },
    { id: 'orders', label: tr.tabs.orders },
    { id: 'maintenance', label: tr.tabs.maintenance },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{tr.title}</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr.general.commission}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commissionRate}
                    onChange={(e) =>
                      setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeName} (FR)
                    </label>
                    <input
                      type="text"
                      value={settings.storeName.fr}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeName: { ...settings.storeName, fr: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeName} (EN)
                    </label>
                    <input
                      type="text"
                      value={settings.storeName.en}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeName: { ...settings.storeName, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeName} (ES)
                    </label>
                    <input
                      type="text"
                      value={settings.storeName.es}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeName: { ...settings.storeName, es: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeDescription} (FR)
                    </label>
                    <textarea
                      value={settings.storeDescription.fr}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeDescription: { ...settings.storeDescription, fr: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeDescription} (EN)
                    </label>
                    <textarea
                      value={settings.storeDescription.en}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeDescription: { ...settings.storeDescription, en: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.storeDescription} (ES)
                    </label>
                    <textarea
                      value={settings.storeDescription.es}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeDescription: { ...settings.storeDescription, es: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.logo}
                    </label>
                    {settings.storeLogo && (
                      <div className="mb-4 relative w-32 h-32">
                        <Image
                          src={settings.storeLogo}
                          alt="Store Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {uploadingLogo && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.general.favicon}
                    </label>
                    {settings.storeFavicon && (
                      <div className="mb-4 relative w-16 h-16">
                        <Image
                          src={settings.storeFavicon}
                          alt="Favicon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      disabled={uploadingFavicon}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {uploadingFavicon && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.contact.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.email}
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.phone}
                    </label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.supportEmail}
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-800 mt-6">{tr.contact.address}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.street}
                    </label>
                    <input
                      type="text"
                      value={settings.address.street}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          address: { ...settings.address, street: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.city}
                    </label>
                    <input
                      type="text"
                      value={settings.address.city}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          address: { ...settings.address, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.state}
                    </label>
                    <input
                      type="text"
                      value={settings.address.state}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          address: { ...settings.address, state: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.country}
                    </label>
                    <input
                      type="text"
                      value={settings.address.country}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          address: { ...settings.address, country: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.contact.postalCode}
                    </label>
                    <input
                      type="text"
                      value={settings.address.postalCode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          address: { ...settings.address, postalCode: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-800 mt-6">
                  {tr.contact.socialMedia}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.facebook || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.twitter || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                        })
                      }
                      placeholder="https://twitter.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.instagram || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.linkedin || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialMedia: { ...settings.socialMedia, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.youtube || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialMedia: { ...settings.socialMedia, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Localization Tab */}
            {activeTab === 'localization' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.localization.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.localization.currency}
                    </label>
                    <input
                      type="text"
                      value={settings.defaultCurrency}
                      onChange={(e) =>
                        setSettings({ ...settings, defaultCurrency: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.localization.currencySymbol}
                    </label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) =>
                        setSettings({ ...settings, currencySymbol: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.localization.currencyPosition}
                    </label>
                    <select
                      value={settings.currencyPosition}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          currencyPosition: e.target.value as 'before' | 'after',
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="before">{tr.localization.before}</option>
                      <option value="after">{tr.localization.after}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.localization.defaultLanguage}
                    </label>
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultLanguage: e.target.value as 'fr' | 'en' | 'es',
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Tab */}
            {activeTab === 'tax' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.tax.title}</h3>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="taxEnabled"
                    checked={settings.taxEnabled}
                    onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="taxEnabled" className="ml-2 text-sm font-medium text-gray-700">
                    {tr.tax.enabled}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.tax.rate}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!settings.taxEnabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.tax.label} (FR)
                    </label>
                    <input
                      type="text"
                      value={settings.taxLabel.fr}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxLabel: { ...settings.taxLabel, fr: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!settings.taxEnabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.tax.label} (EN)
                    </label>
                    <input
                      type="text"
                      value={settings.taxLabel.en}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxLabel: { ...settings.taxLabel, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!settings.taxEnabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.tax.label} (ES)
                    </label>
                    <input
                      type="text"
                      value={settings.taxLabel.es}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxLabel: { ...settings.taxLabel, es: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!settings.taxEnabled}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pricesIncludeTax"
                    checked={settings.pricesIncludeTax}
                    onChange={(e) =>
                      setSettings({ ...settings, pricesIncludeTax: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={!settings.taxEnabled}
                  />
                  <label
                    htmlFor="pricesIncludeTax"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    {tr.tax.includeInPrices}
                  </label>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.shipping.title}</h3>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="freeShipping"
                    checked={settings.freeShippingEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, freeShippingEnabled: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="freeShipping" className="ml-2 text-sm font-medium text-gray-700">
                    {tr.shipping.freeShipping}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tr.shipping.threshold}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!settings.freeShippingEnabled}
                  />
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.payment.title}</h3>

                {/* Stripe */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="stripeEnabled"
                      checked={settings.paymentMethods.stripe.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentMethods: {
                            ...settings.paymentMethods,
                            stripe: { ...settings.paymentMethods.stripe, enabled: e.target.checked },
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="stripeEnabled" className="ml-2 text-sm font-semibold text-gray-700">
                      {tr.payment.stripe}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.publicKey}
                      </label>
                      <input
                        type="text"
                        value={settings.paymentMethods.stripe.publicKey || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              stripe: { ...settings.paymentMethods.stripe, publicKey: e.target.value },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.stripe.enabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.secretKey}
                      </label>
                      <input
                        type="password"
                        value={settings.paymentMethods.stripe.secretKey || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              stripe: { ...settings.paymentMethods.stripe, secretKey: e.target.value },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.stripe.enabled}
                      />
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="paypalEnabled"
                      checked={settings.paymentMethods.paypal.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentMethods: {
                            ...settings.paymentMethods,
                            paypal: { ...settings.paymentMethods.paypal, enabled: e.target.checked },
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="paypalEnabled" className="ml-2 text-sm font-semibold text-gray-700">
                      {tr.payment.paypal}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.clientId}
                      </label>
                      <input
                        type="text"
                        value={settings.paymentMethods.paypal.clientId || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              paypal: { ...settings.paymentMethods.paypal, clientId: e.target.value },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.paypal.enabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.secretKey}
                      </label>
                      <input
                        type="password"
                        value={settings.paymentMethods.paypal.secretKey || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              paypal: { ...settings.paymentMethods.paypal, secretKey: e.target.value },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.paypal.enabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="codEnabled"
                      checked={settings.paymentMethods.cashOnDelivery.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentMethods: {
                            ...settings.paymentMethods,
                            cashOnDelivery: { enabled: e.target.checked },
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="codEnabled" className="ml-2 text-sm font-semibold text-gray-700">
                      {tr.payment.cod}
                    </label>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="bankTransferEnabled"
                      checked={settings.paymentMethods.bankTransfer.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentMethods: {
                            ...settings.paymentMethods,
                            bankTransfer: {
                              ...settings.paymentMethods.bankTransfer,
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="bankTransferEnabled"
                      className="ml-2 text-sm font-semibold text-gray-700"
                    >
                      {tr.payment.bankTransfer}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.bankName}
                      </label>
                      <input
                        type="text"
                        value={settings.paymentMethods.bankTransfer.bankName || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              bankTransfer: {
                                ...settings.paymentMethods.bankTransfer,
                                bankName: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.bankTransfer.enabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.accountNumber}
                      </label>
                      <input
                        type="text"
                        value={settings.paymentMethods.bankTransfer.accountNumber || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              bankTransfer: {
                                ...settings.paymentMethods.bankTransfer,
                                accountNumber: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.bankTransfer.enabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {tr.payment.accountName}
                      </label>
                      <input
                        type="text"
                        value={settings.paymentMethods.bankTransfer.accountName || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentMethods: {
                              ...settings.paymentMethods,
                              bankTransfer: {
                                ...settings.paymentMethods.bankTransfer,
                                accountName: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!settings.paymentMethods.bankTransfer.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Notifications Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.email.title}</h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderConfirmation"
                      checked={settings.emailNotifications.orderConfirmation}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            orderConfirmation: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="orderConfirmation" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.orderConfirmation}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderShipped"
                      checked={settings.emailNotifications.orderShipped}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            orderShipped: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="orderShipped" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.orderShipped}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderDelivered"
                      checked={settings.emailNotifications.orderDelivered}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            orderDelivered: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="orderDelivered" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.orderDelivered}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderCancelled"
                      checked={settings.emailNotifications.orderCancelled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            orderCancelled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="orderCancelled" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.orderCancelled}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newUserWelcome"
                      checked={settings.emailNotifications.newUserWelcome}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            newUserWelcome: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="newUserWelcome" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.newUserWelcome}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="passwordReset"
                      checked={settings.emailNotifications.passwordReset}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: {
                            ...settings.emailNotifications,
                            passwordReset: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="passwordReset" className="ml-2 text-sm font-medium text-gray-700">
                      {tr.email.passwordReset}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.orders.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.orders.prefix}
                    </label>
                    <input
                      type="text"
                      value={settings.orderSettings.orderPrefix}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          orderSettings: { ...settings.orderSettings, orderPrefix: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.orders.minAmount}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.orderSettings.minimumOrderAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          orderSettings: {
                            ...settings.orderSettings,
                            minimumOrderAmount: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="guestCheckout"
                    checked={settings.orderSettings.allowGuestCheckout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        orderSettings: {
                          ...settings.orderSettings,
                          allowGuestCheckout: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="guestCheckout" className="ml-2 text-sm font-medium text-gray-700">
                    {tr.orders.guestCheckout}
                  </label>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">{tr.maintenance.title}</h3>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 text-sm font-medium text-gray-700">
                    {tr.maintenance.enabled}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.maintenance.message} (FR)
                    </label>
                    <textarea
                      value={settings.maintenanceMessage.fr}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maintenanceMessage: { ...settings.maintenanceMessage, fr: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.maintenance.message} (EN)
                    </label>
                    <textarea
                      value={settings.maintenanceMessage.en}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maintenanceMessage: { ...settings.maintenanceMessage, en: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {tr.maintenance.message} (ES)
                    </label>
                    <textarea
                      value={settings.maintenanceMessage.es}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maintenanceMessage: { ...settings.maintenanceMessage, es: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? tr.saving : tr.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
