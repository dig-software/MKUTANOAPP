# PWA Offline-First Architecture Guide

## Overview

The Mkutano app is a **Progressive Web App (PWA)** with full offline support. The architecture enables users to work without internet while automatically syncing data to the server when online.

## Architecture Components

### 1. **Service Worker** (`/public/sw.js`)
- Intercepts all network requests
- Caches static assets (JS, CSS, images, icons)
- Returns cached assets when offline
- Falls back to placeholder for unavailable content

**Caching Strategies:**
- **Network-first**: Try network, fall back to cache (HTML pages)
- **Cache-first**: Use cache, fall back to network (assets, icons)
- **Stale-while-revalidate**: Return cached asset immediately, refresh in background

### 2. **Offline Storage** (`/src/lib/syncManager.ts`)
- Uses browser **localStorage** for non-synced data
- Stores contributions, loans, repayments while offline
- Each item tagged with: timestamp, userId, groupId, sync status
- Persists across browser sessions

### 3. **Sync Manager** (`/src/lib/syncManager.ts`)
- **saveOfflineData()**: Saves operations to localStorage
- **syncOfflineData()**: Pushes stored data to Supabase
- **setupAutoSync()**: Automatic sync when online detected
- **getOfflineStats()**: Shows pending items count

### 4. **Sync Status UI** (`/src/components/ui/SyncStatus.tsx`)
- Shows online/offline status
- Displays pending items count
- Manual sync button
- Auto-hides when online with no pending data

### 5. **Database Service Layer** (`/src/lib/supabaseService.ts`)
- All CRUD operations for Supabase tables
- Handles both online creates and sync-on-demand

## Data Flow

### Creating a Contribution While Offline

```
User fills form
    ↓
createContributionOffline() called
    ↓
IS ONLINE?
    ├─ YES → recordContribution() to Supabase
    │         └─ Success → Display confirmation
    │         └─ Error → Fall back to offline storage
    │
    └─ NO  → saveOfflineData() to localStorage
             └─ Show "Saved offline" message
```

### Automatic Sync When Online

```
User regains internet
    ↓
Browser detects "online" event
    ↓
setupAutoSync() listener triggered
    ↓
syncOfflineData() called
    ↓
For each pending item:
    ├─ Send to Supabase
    ├─ If success → markOfflineDataAsSynced()
    └─ If error → Retry later
    
    ↓
clearSyncedOfflineData()
    ↓
User sees "Sync successful" notification
```

## Implementation Guide

### Step 1: Initialize Auto-Sync in Your Layout

Add to `/src/app/dashboard/layout.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { setupAutoSync } from '@/lib/syncManager'
import SyncStatus from '@/components/ui/SyncStatus'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const userId = localStorage.getItem('userId') // Get from auth context
    if (userId) {
      setupAutoSync(userId, 30000) // Check every 30 seconds
    }
  }, [])

  return (
    <div>
      {children}
      <SyncStatus userId={localStorage.getItem('userId')} />
    </div>
  )
}
```

### Step 2: Use Offline-Aware Functions in Forms

For Contribution Form:

```typescript
import { createContributionOffline } from '@/lib/syncManager'

async function handleSubmitContribution(formData: any) {
  try {
    const result = await createContributionOffline(
      userId,
      groupId,
      {
        member_id: formData.memberId,
        amount: parseFloat(formData.amount),
        type: 'regular', // or 'special'
        meeting_id: currentMeetingId,
        date_recorded: new Date().toISOString(),
      }
    )

    // Show success message
    showNotification('Contribution saved' + (navigator.onLine ? '' : ' offline'))
  } catch (error) {
    showError((error as Error).message)
  }
}
```

### Step 3: Replace Mock Data with Offline-Aware Calls

**Before (Mock Data):**
```typescript
const contributions = mockContributions.filter(c => c.meeting_id === meetingId)
```

**After (With Offline Support):**
```typescript
const [contributions, setContributions] = useState([])

useEffect(() => {
  async function fetchContributions() {
    if (navigator.onLine) {
      // Online - fetch from Supabase
      const data = await getContributionsByMeeting(meetingId)
      setContributions(data)
    } else {
      // Offline - show from localStorage + cached data
      const offlineData = getOfflineData(userId)
      setContributions([
        ...(cachedContributions || []),
        ...(offlineData.contributions || [])
      ])
    }
  }
  
  fetchContributions()
}, [navigator.onLine])
```

## Key Functions

### Saving Offline Data

```typescript
// Contributions
await createContributionOffline(userId, groupId, {
  member_id: string
  amount: number
  type: 'regular' | 'special'
  meeting_id: string
  date_recorded: string
})

// Loans
await createLoanOffline(userId, groupId, {
  member_id: string
  amount: number
  duration_months: number
  interest_rate: number
  purpose: string
})

// Repayments
await createRepaymentOffline(userId, groupId, {
  loan_id: string
  amount: number
  date_paid: string
  payment_method: string
})
```

### Checking Sync Status

```typescript
import { getOfflineStats, syncOfflineData } from '@/lib/syncManager'

// Get stats
const { pending, synced, total } = getOfflineStats()
console.log(`${pending} pending, ${synced} synced, ${total} total`)

// Manual sync
const result = await syncOfflineData(userId)
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`)
if (result.errors.length > 0) {
  console.error('Errors:', result.errors)
}
```

## Offline Data Storage Format

Data stored in `localStorage['mkutano_offline_data']`:

```json
{
  "contributions": [
    {
      "member_id": "uuid",
      "amount": 50000,
      "type": "regular",
      "meeting_id": "uuid",
      "date_recorded": "2024-01-15T10:30:00Z",
      "_id": "contributions_1705315800000_abc123",
      "_timestamp": "2024-01-15T10:30:00Z",
      "_userId": "uuid",
      "_groupId": "uuid",
      "_synced": false
    }
  ],
  "loans": [],
  "repayments": []
}
```

## Testing Offline Functionality

### 1. **Chrome DevTools**
- Open DevTools → Application → Service Workers
- Check "Offline" to simulate offline mode
- Make network calls - should see cached responses

### 2. **Manual Testing**
```javascript
// In browser console
localStorage.getItem('mkutano_offline_data') // View all offline data
Object.keys(JSON.parse(localStorage.getItem('mkutano_offline_data'))).forEach(key => 
  console.log(`${key}: ${JSON.parse(localStorage.getItem('mkutano_offline_data'))[key].length}`)
) // Count items by type
```

### 3. **Network Tab**
- Open DevTools → Network
- Disable internet (DevTools → Network → "Offline")
- Navigate app - all requests should fail except cached/fallback responses

## Best Practices

### 1. Always Check Navigator.onLine
```typescript
if (!navigator.onLine) {
  console.log('Offline mode')
  // Use local/cached data
} else {
  console.log('Online mode')
  // Fetch fresh data from Supabase
}
```

### 2. Provide User Feedback
```typescript
const message = navigator.onLine 
  ? 'Saved to server'
  : '📱 Saved locally - will sync when online'

showNotification(message)
```

### 3. Handle Sync Errors Gracefully
```typescript
try {
  const result = await syncOfflineData(userId)
  if (result.failed > 0) {
    console.warn(`${result.failed} items failed to sync`)
    // Retry later or show user
  }
} catch (error) {
  console.error('Sync failed:', error)
  // Schedule retry
}
```

### 4. Limit localStorage Usage
- Each item adds ~500 bytes
- localStorage limit: ~5-10MB per app
- Expected max: 10,000 items before fullness
- Monitor with `getOfflineStats()`

## Troubleshooting

### Service Worker Not Caching
**Problem**: Changes to app not reflected
**Solution**: 
- Hard refresh: `Ctrl+Shift+R` (Windows)
- DevTools → Application → Clear site data
- Re-register service worker

### Offline Data Not Syncing
**Problem**: Items stay pending after going online
**Solution**:
```typescript
// Manually trigger sync
import { syncOfflineData } from '@/lib/syncManager'
await syncOfflineData(userId)

// Check if items are marked synced
console.log(getOfflineStats())
```

### Storage Quota Exceeded
**Problem**: `QuotaExceededError` when saving offline data
**Solution**:
```typescript
// Check storage before saving
if (navigator.storage?.estimate) {
  const estimate = await navigator.storage.estimate()
  const percentUsed = (estimate.usage / estimate.quota) * 100
  console.log(`${percentUsed.toFixed(2)}% storage used`)
}

// Clean up old synced data
clearSyncedOfflineData()
```

## Performance Metrics

| Metric | Value | Note |
|--------|-------|------|
| Service Worker Registration | ~100ms | One-time, on first load |
| Offline Save | ~10ms | localStorage write |
| Sync Single Item | ~500ms | Network + DB insert |
| Full 100-item Sync | ~5-10s | Batch processing |
| Service Worker Cache Hit | ~5ms | Immediate response |
| Storage Limit | 5-10MB | Browser dependent |

## File Structure

```
src/lib/
├── syncManager.ts          # Core sync logic
├── supabaseService.ts      # Database operations
├── supabase.ts             # Supabase client
├── pwa.ts                  # PWA utilities
└── accountManager.ts       # Account/auth

src/components/ui/
├── SyncStatus.tsx          # Sync UI component
└── PWAInstall.tsx          # Install prompt

public/
├── sw.js                   # Service worker
└── manifest.json          # PWA manifest
```

## Next Steps

1. **Wire Components**: Replace mock data with `supabaseService` calls
2. **Add Error Boundaries**: Handle Supabase auth/connection errors
3. **Test on Mobile**: Install PWA on Android/iOS via browser
4. **Monitor Sync**: Log sync metrics for debugging
5. **Beta Test**: Have real users work offline and reconnect

## Related Documentation

- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration
- [Database Schema](./DATABASE_SCHEMA.md) - Data structure
- [PWA Setup](./PWA_SETUP.md) - Installation & manifest configuration
