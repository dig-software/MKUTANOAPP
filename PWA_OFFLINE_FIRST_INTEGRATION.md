# PWA Offline-First Integration Guide

Complete guide to implementing offline-first features throughout the Mkutano app.

## Quick Start

### 1. Add Sync Status to Dashboard

Update `/src/app/dashboard/layout.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { setupAutoSync } from '@/lib/syncManager'
import SyncStatus from '@/components/ui/SyncStatus'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Get userId from your auth context/session
    const userId = localStorage.getItem('USER_ID')
    
    if (userId) {
      // Enable automatic sync every 30 seconds when online
      setupAutoSync(userId, 30000)
    }
  }, [])

  return (
    <div>
      {children}
      <SyncStatus userId={localStorage.getItem('USER_ID')} />
    </div>
  )
}
```

### 2. Create Offline-Aware Form

Example: Member Contribution Form

```typescript
'use client'

import { useState } from 'react'
import { useCreateContribution } from '@/lib/useOffline'
import Button from '@/components/ui/Button'

export default function ContributionForm({
  memberId,
  groupId,
}: {
  memberId: string
  groupId: string
}) {
  const userId = localStorage.getItem('USER_ID') || ''
  const { create, isLoading, error, isOnline } = useCreateContribution(userId, groupId)
  const [amount, setAmount] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await create({
      member_id: memberId,
      amount: parseFloat(amount),
      type: 'regular',
      meeting_id: currentMeetingId,
      date_recorded: new Date().toISOString(),
    })

    if (result.success) {
      setSubmitMessage(
        result.savedOffline
          ? '📱 Saved offline - will sync when online'
          : '✓ Saved to server'
      )
      setAmount('')
      setTimeout(() => setSubmitMessage(''), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Amount (UGX)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          type="submit"
          disabled={isLoading || !amount}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : 'Record Contribution'}
        </Button>

        {!isOnline && (
          <span className="text-xs text-orange-600">📱 Offline Mode</span>
        )}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {submitMessage && <div className="text-green-600 text-sm">{submitMessage}</div>}
    </form>
  )
}
```

### 3. Fetch Data with Offline Fallback

Example: Members List

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useFetchData } from '@/lib/useOffline'
import { getGroupMembers } from '@/lib/supabaseService'
import { mockMembers } from '@/lib/mockData'

export default function MembersList({ groupId }: { groupId: string }) {
  const userId = localStorage.getItem('USER_ID') || ''

  const { data: members, isLoading, isOnline } = useFetchData(
    () => getGroupMembers(groupId),
    'members',
    userId,
    {
      fallbackData: mockMembers, // Use mock data if fetch fails
      refetchInterval: 60000, // Refetch every minute when online
    }
  )

  if (isLoading) return <div>Loading members...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Members</h2>
        {!isOnline && <span className="text-xs text-orange-600">📱 Offline Mode</span>}
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-3 border rounded bg-gray-50"
          >
            <div className="font-medium">{member.name}</div>
            <div className="text-sm text-gray-600">{member.phone}</div>
            <div className="text-sm">
              💰 {member.wallet_balance || 0} UGX
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Available Hooks

### `useOnlineStatus()`
Detect if user is online/offline.

```typescript
const isOnline = useOnlineStatus()

return (
  <div>
    {isOnline ? '🟢 Online' : '🔴 Offline'}
  </div>
)
```

### `useSyncStatus(userId, updateInterval)`
Track pending/synced items and manually sync.

```typescript
const { pending, synced, isSyncing, sync } = useSyncStatus(userId, 5000)

return (
  <div>
    <p>Pending: {pending}</p>
    <button onClick={() => sync()}>Sync Now</button>
  </div>
)
```

### `useCreateContribution(userId, groupId)`
Create contributions with offline support.

```typescript
const { create, isLoading, error } = useCreateContribution(userId, groupId)

const result = await create({
  member_id: 'uuid',
  amount: 50000,
  type: 'regular',
  meeting_id: 'uuid',
  date_recorded: '2024-01-15T10:30:00Z',
})

// result: { success: true, data: {...}, savedOffline: false }
```

### `useCreateLoan(userId, groupId)`
Create loans with offline support.

```typescript
const { create, isLoading, error } = useCreateLoan(userId, groupId)

const result = await create({
  member_id: 'uuid',
  amount: 5000000,
  duration_months: 12,
  interest_rate: 15,
  purpose: 'Business expansion',
})
```

### `useCreateRepayment(userId, groupId)`
Record repayments with offline support.

```typescript
const { create, isLoading, error } = useCreateRepayment(userId, groupId)

const result = await create({
  loan_id: 'uuid',
  amount: 500000,
  date_paid: '2024-01-15T10:30:00Z',
  payment_method: 'cash',
})
```

### `useFetchData(fetcher, cacheKey, userId, options)`
Fetch data with online/offline fallback.

```typescript
const { data, isLoading, error, refetch } = useFetchData(
  () => getContributionsByMeeting(meetingId),
  'contributions',
  userId,
  {
    fallbackData: [/* mock data */],
    refetchInterval: 60000,
    enabled: true,
  }
)
```

### `useSyncedData(fetcher, cacheKey, userId)`
Fetch data and auto-sync offline items.

```typescript
const { data, isLoading, error } = useSyncedData(
  () => getLoansByGroup(groupId),
  'loans',
  userId
)
```

### `useOfflineBanner()`
Show/hide offline banner.

```typescript
const showBanner = useOfflineBanner()

return showBanner && (
  <div className="bg-orange-100 p-3 text-orange-800">
    📱 You are currently offline
  </div>
)
```

### `useOfflineFormSubmit(onSubmit, options)`
Generic hook for offline-aware form submission.

```typescript
const { submit, isLoading, error } = useOfflineFormSubmit(
  async (data) => {
    return await recordMeeting(data)
  },
  {
    onSuccess: (result) => {
      showNotification(result.message)
    },
    onError: (error) => {
      showError(error)
    },
    offlineMessage: '📱 Meeting saved offline',
    successMessage: '✓ Meeting created',
  }
)

const handleSubmit = async (formData) => {
  await submit(formData)
}
```

## Migration Checklist

### Phase 1: Setup
- [ ] Copy all files from this conversation to your project
- [ ] Run `npm install @supabase/supabase-js` (if not already done)
- [ ] Update `next.config.mjs` with PWA headers (from PWA_SETUP.md)

### Phase 2: Dashboard Integration
- [ ] Update dashboard layout to include `<SyncStatus>`
- [ ] Add `setupAutoSync()` in dashboard layout useEffect
- [ ] Test: Go offline, make changes, watch sync status
- [ ] Test: Go online, watch pending items sync automatically

### Phase 3: Contribution Page
- [ ] Replace mock contribution submission with `useCreateContribution`
- [ ] Add offline status indicator
- [ ] Add sync notification on success
- [ ] Test: Submit contribution offline, verify it saves
- [ ] Test: Go online, watch it sync

### Phase 4: Members Page
- [ ] Replace mock member data with `useFetchData`
- [ ] Use `getGroupMembers()` from supabaseService
- [ ] Add fallback to mock data
- [ ] Add offline indicator
- [ ] Test: Load online, go offline, verify data persists

### Phase 5: Meetings Page
- [ ] Replace mock meetings with `useSyncedData`
- [ ] Use `addMemberToGroup()` mutations with `useCreateContribution`
- [ ] Add offline queue display
- [ ] Test: Record multiple meetings offline

### Phase 6: Loans & Repayments
- [ ] Use `useCreateLoan()` for loan creation
- [ ] Use `useCreateRepayment()` for repayment recording
- [ ] Test: Create loans offline, repay offline
- [ ] Test: Verify interest calculations after sync

### Phase 7: Quality Assurance
- [ ] Test on mobile browser (iOS Safari, Android Chrome)
- [ ] Test: Slow 3G network scenario
- [ ] Test: Complete offline → online transition
- [ ] Test: Rapid online/offline switching
- [ ] Test: localStorage near full (100+ offline items)
- [ ] Test: Service Worker cache invalidation

## Example: Complete Meetings Page

```typescript
'use client'

import { useState } from 'react'
import { useOnlineStatus, useCreateContribution, useSyncStatus } from '@/lib/useOffline'
import { getMeetingsByGroup } from '@/lib/supabaseService'
import { useFetchData } from '@/lib/useOffline'

export default function MeetingsPage({ params }: { params: { groupId: string } }) {
  const userId = localStorage.getItem('USER_ID') || ''
  const isOnline = useOnlineStatus()
  const { pending } = useSyncStatus(userId)

  const {
    data: meetings,
    isLoading: loadingMeetings,
    refetch: refetchMeetings,
  } = useFetchData(
    () => getMeetingsByGroup(params.groupId),
    'meetings',
    userId,
    { refetchInterval: 60000 }
  )

  const [selectedMeeting, setSelectedMeeting] = useState(meetings[0])
  const { create: createContribution, isLoading: contributionLoading } =
    useCreateContribution(userId, params.groupId)

  const handleRecordContribution = async (memberId: string, amount: number) => {
    const result = await createContribution({
      member_id: memberId,
      amount,
      type: 'regular',
      meeting_id: selectedMeeting.id,
      date_recorded: new Date().toISOString(),
    })

    if (result.success) {
      // Show feedback
      alert(result.savedOffline ? 'Saved offline' : 'Saved online')
      // Refresh meeting contributions
      refetchMeetings()
    }
  }

  return (
    <div className="p-6">
      {/* Status Bar */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <div className="flex gap-4 items-center">
          <span className={isOnline ? 'text-green-600' : 'text-orange-600'}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
          {pending > 0 && <span className="text-blue-600">⏳ {pending} pending</span>}
        </div>
      </div>

      {/* Meetings List */}
      {loadingMeetings ? (
        <div>Loading meetings...</div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`p-4 border rounded cursor-pointer ${
                selectedMeeting?.id === meeting.id ? 'bg-blue-50 border-blue-300' : ''
              }`}
              onClick={() => setSelectedMeeting(meeting)}
            >
              <div className="font-medium">{meeting.meeting_date}</div>
              <div className="text-sm text-gray-600">
                💰 {meeting.total_contributions || 0} UGX collected
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contribution Form */}
      {selectedMeeting && (
        <div className="mt-8 p-6 bg-gray-50 rounded">
          <h2 className="text-xl font-bold mb-4">Record Contribution</h2>
          <ContributionForm
            meetingId={selectedMeeting.id}
            groupId={params.groupId}
            onSuccess={() => refetchMeetings()}
          />
        </div>
      )}
    </div>
  )
}

function ContributionForm({
  meetingId,
  groupId,
  onSuccess,
}: {
  meetingId: string
  groupId: string
  onSuccess: () => void
}) {
  const userId = localStorage.getItem('USER_ID') || ''
  const [memberId, setMemberId] = useState('')
  const [amount, setAmount] = useState('')
  const { create, isLoading, error } = useCreateContribution(userId, groupId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await create({
      member_id: memberId,
      amount: parseFloat(amount),
      type: 'regular',
      meeting_id: meetingId,
      date_recorded: new Date().toISOString(),
    })
    if (result.success) {
      setMemberId('')
      setAmount('')
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Saving...' : 'Record Contribution'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  )
}
```

## Troubleshooting

### Items Not Syncing
1. Check DevTools → Application → localStorage
2. Verify userId is saved: `localStorage.getItem('USER_ID')`
3. Check console for sync errors: `console.log(getOfflineStats())`
4. Manually trigger: `const result = await syncOfflineData(userId); console.log(result)`

### Hook Errors
- Ensure wrapped component has `'use client'` directive
- Verify userId is available before creating hooks
- Check that Supabase client is initialized

### Service Worker Not Caching
- Clear site data: DevTools → Application → Clear site data
- Hard refresh: `Ctrl+Shift+R`
- Check `/public/sw.js` is updated
- Verify manifest is linked in HTML

## Performance Tips

1. **Limit offline items**: Use `clearSyncedOfflineData()` after successful sync
2. **Batch syncs**: Set sync interval to 30-60 seconds, not every 5 seconds
3. **Lazy load data**: Use `refetchInterval` on `useFetchData` to control updates
4. **Monitor storage**: Log `getOfflineStats()` occasionally
5. **Use indices**: Supabase indexes speed up sync queries

## Next Steps

1. **Implement on all data pages** following the migration checklist
2. **Add offline data visualization** (show pending items, sync status)
3. **Create offline-first reporting** (calculate totals from cached + pending)
4. **Test with real users** during pilot phase
5. **Monitor sync performance** and optimize database queries
