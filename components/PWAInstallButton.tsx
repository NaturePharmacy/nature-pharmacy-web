'use client';

import { useEffect, useState } from 'react';

type Platform = 'windows' | 'android' | 'ios' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/win/.test(ua)) return 'windows';
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

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIosHint(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  // Cache: already installed or no install available on this platform
  if (installed) return null;
  if (platform === 'other') return null;
  // On Windows/Android, only show if browser supports install prompt
  if ((platform === 'windows' || platform === 'android') && !deferredPrompt) return null;

  const label =
    platform === 'android'
      ? '📱 Télécharger l\'app Android'
      : platform === 'ios'
      ? '📱 Installer sur iPhone'
      : '💻 Installer l\'app Windows';

  return (
    <div className="relative">
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-medium transition-colors"
      >
        {label}
      </button>

      {/* iOS hint tooltip */}
      {showIosHint && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 w-56 text-center shadow-xl z-50">
          Appuyez sur{' '}
          <span className="font-bold">Partager ↑</span> puis{' '}
          <span className="font-bold">Sur l&apos;écran d&apos;accueil</span>
          <button
            onClick={() => setShowIosHint(false)}
            className="absolute top-1 right-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
