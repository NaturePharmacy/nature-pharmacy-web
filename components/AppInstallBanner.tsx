'use client';

import { useEffect, useState } from 'react';

type Platform = 'android' | 'ios' | 'pc' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'app_install_banner_dismissed';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/win|mac|linux/.test(ua)) return 'pc';
  return 'other';
}

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or installed as PWA
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (dismissed || isStandalone) return;

    const p = detectPlatform();
    setPlatform(p);

    // Capture PWA install prompt (Chrome/Edge on PC/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Show banner after 2 seconds on first visit
    const timer = setTimeout(() => {
      if (p !== 'other') setVisible(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const handleAndroidDownload = () => {
    dismiss();
  };

  const handlePCInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-green-600 px-5 py-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192x192.png"
            alt="Nature Pharmacy"
            className="w-12 h-12 rounded-xl shadow-md"
          />
          <div>
            <p className="text-white font-bold text-base leading-tight">Nature Pharmacy</p>
            <p className="text-green-100 text-xs">
              {platform === 'android' ? 'Application Android' : platform === 'ios' ? 'App iPhone / iPad' : 'Application web'}
            </p>
          </div>
          <button
            onClick={dismiss}
            className="ml-auto text-white/70 hover:text-white transition-colors p-1"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-gray-800 font-semibold text-sm mb-1">
            {platform === 'android' && 'Installez notre application gratuite'}
            {platform === 'ios' && 'Ajoutez l\'app à votre écran d\'accueil'}
            {platform === 'pc' && 'Installez l\'application sur votre bureau'}
          </p>
          <p className="text-gray-500 text-xs mb-4">
            {platform === 'android' && 'Accès rapide, notifications, expérience native optimisée.'}
            {platform === 'ios' && 'Navigation rapide sans passer par le navigateur.'}
            {platform === 'pc' && 'Lancez Nature Pharmacy comme une vraie application desktop.'}
          </p>

          {/* Features */}
          <div className="flex gap-4 mb-5">
            {['Gratuit', 'Rapide', 'Hors-ligne'].map((f) => (
              <div key={f} className="flex items-center gap-1 text-xs text-green-700">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </div>
            ))}
          </div>

          {/* CTA */}
          {platform === 'android' && (
            <a
              href="/downloads/nature-pharmacy.apk"
              download="Nature-Pharmacy.apk"
              onClick={handleAndroidDownload}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger l&apos;APK Android
            </a>
          )}

          {platform === 'ios' && (
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 text-center leading-relaxed">
              Appuyez sur{' '}
              <span className="font-semibold text-gray-800">Partager</span>
              {' '}
              <svg className="inline w-4 h-4 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l-6 6h4v8h4V8h4l-6-6zm-7 14v4h14v-4h-2v2H7v-2H5z"/>
              </svg>
              {' '}puis{' '}
              <span className="font-semibold text-gray-800">Sur l&apos;écran d&apos;accueil</span>
            </div>
          )}

          {platform === 'pc' && deferredPrompt && (
            <button
              onClick={handlePCInstall}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Installer l&apos;application
            </button>
          )}

          {platform === 'pc' && !deferredPrompt && (
            <p className="text-center text-xs text-gray-400">
              Ouvrez ce site dans Chrome ou Edge pour installer l&apos;application.
            </p>
          )}

          <button
            onClick={dismiss}
            className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Non merci, continuer sur le site
          </button>
        </div>
      </div>
    </div>
  );
}
