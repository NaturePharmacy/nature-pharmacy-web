'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function ContactPage() {
  const locale = useLocale() as 'fr' | 'en' | 'es';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const content = {
    fr: {
      title: 'Contactez-nous',
      subtitle: 'Nous sommes là pour vous aider',
      form: {
        name: 'Nom complet',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
        send: 'Envoyer',
        sending: 'Envoi...',
      },
      info: {
        title: 'Informations de contact',
        email: 'contact@nature-pharmacy.com',
        hours: '24/7 - Support en ligne',
        response: 'Réponse sous 24-48h',
      },
      success: 'Message envoyé avec succès! Nous vous répondrons bientôt.',
      error: 'Une erreur s\'est produite. Veuillez réessayer.',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We\'re here to help',
      form: {
        name: 'Full Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...',
      },
      info: {
        title: 'Contact Information',
        email: 'contact@nature-pharmacy.com',
        hours: '24/7 - Online Support',
        response: 'Response within 24-48h',
      },
      success: 'Message sent successfully! We\'ll get back to you soon.',
      error: 'An error occurred. Please try again.',
    },
    es: {
      title: 'Contáctenos',
      subtitle: 'Estamos aquí para ayudarle',
      form: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        subject: 'Asunto',
        message: 'Mensaje',
        send: 'Enviar',
        sending: 'Enviando...',
      },
      info: {
        title: 'Información de contacto',
        email: 'contact@nature-pharmacy.com',
        hours: '24/7 - Soporte en línea',
        response: 'Respuesta en 24-48h',
      },
      success: '¡Mensaje enviado con éxito! Le responderemos pronto.',
      error: 'Ocurrió un error. Por favor, inténtelo de nuevo.',
    },
  };

  const t = content[locale] || content.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t.success);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setMessage(data.error || t.error);
      }
    } catch {
      setMessage(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {message}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.name}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.subject}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.message}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? t.form.sending : t.form.send}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.info.title}</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{t.info.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{locale === 'fr' ? 'Disponibilité' : locale === 'es' ? 'Disponibilidad' : 'Availability'}</h3>
                      <p className="text-gray-600">{t.info.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{locale === 'fr' ? 'Délai de réponse' : locale === 'es' ? 'Tiempo de respuesta' : 'Response time'}</h3>
                      <p className="text-gray-600">{t.info.response}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-4">{locale === 'fr' ? 'Support rapide' : locale === 'es' ? 'Soporte rápido' : 'Quick support'}</h3>
                <div className="space-y-2">
                  <a href={`/${locale}/support`} className="block text-green-600 hover:text-green-700">
                    → {locale === 'fr' ? 'Centre d\'aide' : locale === 'es' ? 'Centro de ayuda' : 'Help center'}
                  </a>
                  <a href={`/${locale}/orders`} className="block text-green-600 hover:text-green-700">
                    → {locale === 'fr' ? 'Suivre ma commande' : locale === 'es' ? 'Seguir mi pedido' : 'Track my order'}
                  </a>
                  <a href={`/${locale}/returns`} className="block text-green-600 hover:text-green-700">
                    → {locale === 'fr' ? 'Retours et remboursements' : locale === 'es' ? 'Devoluciones y reembolsos' : 'Returns and refunds'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

          </div>
  );
}
