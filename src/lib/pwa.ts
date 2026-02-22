/**
 * PWA Service Worker Registration and Management
 */

export const registerServiceWorker = async () => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered:', registration);

      // Check for updates periodically
      setInterval(async () => {
        try {
          await registration.update();
        } catch (error) {
          console.error('Error updating service worker:', error);
        }
      }, 60000); // Check every minute

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Workers unregistered');
    } catch (error) {
      console.error('Error unregistering service workers:', error);
    }
  }
};

export const requestInstallPrompt = () => {
  if (typeof window === 'undefined') return;

  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  return deferredPrompt;
};

export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

export const onOnlineStatusChange = (callback: (online: boolean) => void) => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));

  // Return cleanup function
  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
};

/**
 * Request periodic background sync
 * Used for syncing contributions/loans when app is running
 */
export const requestBackgroundSync = (tag: string) => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then((registration) => {
        (registration as any).sync.register(tag);
      })
      .catch((error) => {
        console.error('Background sync registration failed:', error);
      });
  }
};
