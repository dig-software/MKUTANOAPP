# PWA Setup Guide for Mkutano

Your app is now configured as a Progressive Web App (PWA)! Here's what was added:

## What's New

### 1. **Service Worker** (`public/sw.js`)
- Handles offline caching
- Network-first strategy for pages
- Cache-first strategy for assets
- Background sync placeholders for contributions & loans
- Automatic refresh checking

### 2. **Web Manifest** (`public/manifest.json`)
- App metadata & branding
- Install icons in multiple sizes
- Theme colors
- App shortcuts (Dashboard, New Meeting, Members)
- Category & screenshot info

### 3. **PWA Utilities** (`src/lib/pwa.ts`)
- Service worker registration
- Online/offline detection
- Background sync management
- Install prompt handling

### 4. **Install Component** (`src/components/ui/PWAInstall.tsx`)
- Shows install prompt to users
- Displays offline status indicator
- Manages app installation flow

### 5. **Metadata Updates** (`src/app/layout.tsx`)
- Apple Web App settings
- Theme colors
- Viewport optimization
- PWA link tags

---

## Next Steps

### 🎨 Add App Icons
You MUST add icon files for the app to be installable. Create these in `/public/icons/`:

1. **icon-192x192.png** - Standard icon (192×192px)
2. **icon-512x512.png** - Large icon (512×512px)
3. **icon-maskable-192x192.png** - Maskable icon for adaptive icons (192×192px)
4. **icon-maskable-512x512.png** - Maskable icon (512×512px)

Create these using a design tool (Figma, Photoshop, etc.) or use an online icon generator:
- Upload Mkutano logo/branding
- Generate PWA icons at these sizes
- Save as PNG with transparency

### 📸 Add Screenshots (Optional)
For better app store presence, add these in `/public/screenshots/`:

- **screenshot-540x720.png** - Mobile screenshot (540×720px)
- **screenshot-1280x720.png** - Tablet/desktop screenshot (1280×720px)

---

## Testing the PWA

### 1. **Local Testing**
```bash
npm run build
npm run start
```

Then open `http://localhost:3000` in Chrome/Edge.

### 2. **Check Installation**
- Open DevTools (F12)
- Go to **Application** → **Manifest**
- You should see your manifest data
- Go to **Service Workers** 
- You should see your service worker registered

### 3. **Install on Desktop**
- Look for the install icon in the browser address bar (⬇️ icon)
- Click to install
- Or right-click → "Install app"

### 4. **Test Offline**
- Open DevTools
- Go to **Network**
- Check "Offline"
- Try navigating around the app
- Cached pages should still load

### 5. **Install on Mobile**
- Open in mobile Safari (iOS) or Chrome (Android)
- iOS: Tap Share → Add to Home Screen
- Android: Tap menu → "Install app"

---

## Offline Features

The service worker currently caches:
- ✅ Main pages (/, /dashboard, /login, /signup)
- ✅ CSS, JS, fonts
- ✅ HTML pages you visit
- ❌ API calls (returns fallback if offline)
- ❌ Images (shows fallback message if offline)

### To Add Offline Data Sync

When users create contributions/loans offline:

```typescript
// In your form handler
if (!isOnline()) {
  await requestBackgroundSync('sync-contributions');
  // Save to localStorage for now
  localStorage.setItem('pending_contribution', JSON.stringify(data));
}
```

Then in `public/sw.js`, implement the sync handlers to:
1. Retrieve pending data from IndexedDB
2. Send to server when online
3. Clear cache on success

---

## Configuration Options

### Theme Color
Change in `manifest.json` and `src/app/layout.tsx`:
```json
"theme_color": "#10b981",  // Currently emerald-600
"background_color": "#ffffff"
```

### App Shortcuts
Edit `manifest.json` shortcuts array to customize quick actions users see when long-pressing the app icon.

### Cache Strategy
Modify `public/sw.js` to adjust:
- Which API endpoints to cache
- Cache duration
- Fallback pages

---

## Performance Tips

1. **Compress Icons** - Use tools like TinyPNG before uploading
2. **Code Splitting** - Break up large JS bundles
3. **Image Optimization** - Use Next.js Image component
4. **Lazy Loading** - Use React's Suspense for routes
5. **Regular Updates** - Service workers check for updates periodically

---

## Troubleshooting

### Install button not showing
- Make sure icons are in `/public/icons/`
- Check manifest.json is valid (DevTools → Application → Manifest)
- Service worker must be registered

### App not caching offline content
- Open DevTools → Application → Cache Storage
- Check if cache entries exist
- Service worker might have errors in console

### Changes not reflecting
- Service workers cache aggressively
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or uninstall app and clear cache in DevTools

---

## Learn More

- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Manifest Spec](https://www.w3.org/TR/appmanifest/)

Enjoy your PWA! 🚀
