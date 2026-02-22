'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker, isOnline, onOnlineStatusChange } from '@/lib/pwa';
import Button from './Button';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Check if app is already installed
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          setIsInstalled(true);
        }
      });
    }

    // Detect install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    // Track online/offline status
    setIsOnlineStatus(isOnline());
    const unsubscribe = onOnlineStatusChange((online) => {
      setIsOnlineStatus(online);
    });

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstall(false);
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      unsubscribe?.();
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstall(false);
      }
    }
  };

  // Status indicator bar
  if (!isOnlineStatus) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
        You are offline. Some features may be limited.
      </div>
    );
  }

  // Install prompt
  if (showInstall && deferredPrompt && !isInstalled) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <p className="font-semibold">Install Mkutano App</p>
          <p className="text-sm opacity-90">Add to your home screen for offline access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstall(false)}
            className="px-3 py-1 text-sm rounded hover:bg-emerald-700"
          >
            Later
          </button>
          <Button
            onClick={handleInstall}
            size="sm"
            variant="outline"
          >
            Install
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
