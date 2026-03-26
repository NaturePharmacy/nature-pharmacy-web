'use client';

import { useEffect, useState } from 'react';

type Platform = 'android' | 'ios' | 'pc' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/win|mac|linux/.test(ua)) return 'pc';
  return 'other';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

export default function PWAInstallButton() {
  const [platform, setPlatform] = useState<Platform>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handlePCInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  if (installed) return null;

  // Android → bouton téléchargement APK direct
  if (platform === 'android') {
    return (
      <a
        href="/downloads/nature-pharmacy.apk"
        download="Nature-Pharmacy.apk"
        className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.523 15.341l-5.373 3.098a.5.5 0 01-.5 0L6.477 15.34A.5.5 0 016 14.906V8.094a.5.5 0 01.25-.433l5.373-3.098a.5.5 0 01.5 0l5.373 3.098A.5.5 0 0118 8.094v6.812a.5.5 0 01-.477.435z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.414l-3.707-3.707 1.414-1.414L11 13.586V7h2v6.586l2.293-2.293 1.414 1.414L13 16.414l-1 1-1-1z"/>
        </svg>
        Télécharger l&apos;app Android
      </a>
    );
  }

  // PC → bouton installation PWA (Chrome/Edge)
  if (platform === 'pc' && deferredPrompt) {
    return (
      <button
        onClick={handlePCInstall}
        className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Installer l&apos;application
      </button>
    );
  }

  // iOS → tooltip "Ajouter à l'écran d'accueil"
  if (platform === 'ios') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowIosHint(true)}
          className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Installer sur iPhone
        </button>
        {showIosHint && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 w-56 text-center shadow-xl z-50">
            Appuyez sur <span className="font-bold">Partager ↑</span> puis{' '}
            <span className="font-bold">Sur l&apos;écran d&apos;accueil</span>
            <button
              onClick={() => setShowIosHint(false)}
              className="absolute top-1 right-2 text-gray-400 hover:text-white"
            >✕</button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
