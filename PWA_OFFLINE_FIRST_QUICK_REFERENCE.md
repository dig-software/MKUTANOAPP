# PWA Offline-First Quick Reference

Copy-paste snippets for common scenarios.

## 1. Dashboard with Sync Status

```typescript
// src/app/dashboard/layout.tsx
'use client'

import { useEffect } from 'react'
import { setupAutoSync } from '@/lib/syncManager'
import SyncStatus from '@/components/ui/SyncStatus'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const userId = localStorage.getItem('USER_ID')
    if (userId) {
      setupAutoSync(userId, 30000) // Sync every 30 seconds
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

## 2. Simple Form with Offline Support

```typescript
// Example: Contribute to Meeting
'use client'

import { useCreateContribution, useOnlineStatus } from '@/lib/useOffline'
import { useState } from 'react'

export default function ContributeForm({ groupId, meetingId }: Props) {
  const userId = localStorage.getItem('USER_ID') || ''
  const isOnline = useOnlineStatus()
  const { create, isLoading, error } = useCreateContribution(userId, groupId)
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await create({
      member_id: userId,
      amount: parseFloat(amount),
      type: 'regular',
      meeting_id: meetingId,
      date_recorded: new Date().toISOString(),
    })
    
    if (result.success) {
      alert(result.savedOffline ? '📱 Saved offline' : '✓ Saved online')
      setAmount('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (UGX)"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Contribute'}
      </button>
      {!isOnline && <p>📱 Offline Mode</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

## 3. List with Offline Fallback

```typescript
// Display members, meetings, or any list
'use client'

import { useFetchData } from '@/lib/useOffline'
import { getGroupMembers } from '@/lib/supabaseService'
import { mockMembers } from '@/lib/mockData'

export default function MembersList({ groupId }: { groupId: string }) {
  const userId = localStorage.getItem('USER_ID') || ''
  
  const { data: members, isLoading, isOnline } = useFetchData(
    () => getGroupMembers(groupId),
    'members',
    userId,
    { fallbackData: mockMembers }
  )

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      {!isOnline && <p>📱 Offline - showing cached data</p>}
      {members.map(member => (
        <div key={member.id}>
          <strong>{member.name}</strong>
          <p>{member.phone}</p>
          <p>Balance: {member.wallet_balance} UGX</p>
        </div>
      ))}
    </div>
  )
}
```

## 4. Manual Sync Button

```typescript
'use client'

import { useSyncStatus } from '@/lib/useOffline'

export default function SyncButton() {
  const userId = localStorage.getItem('USER_ID') || ''
  const { pending, isSyncing, sync } = useSyncStatus(userId)

  if (pending === 0) return null

  return (
    <button 
      onClick={() => sync()} 
      disabled={isSyncing}
      style={{
        padding: '8px 16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isSyncing ? '⏳ Syncing...' : `📤 Sync ${pending} items`}
    </button>
  )
}
```

## 5. Online/Offline Status Indicator

```typescript
'use client'

import { useOnlineStatus } from '@/lib/useOffline'

export default function StatusIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '4px',
      backgroundColor: isOnline ? '#dcfce7' : '#fed7aa',
      color: isOnline ? '#166534' : '#b45309',
    }}>
      <span style={{ fontSize: '20px' }}>
        {isOnline ? '🟢' : '🔴'}
      </span>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  )
}
```

## 6. Loan Creation Form

```typescript
'use client'

import { useCreateLoan, useOnlineStatus } from '@/lib/useOffline'
import { useState } from 'react'

export default function LoanForm({ groupId }: { groupId: string }) {
  const userId = localStorage.getItem('USER_ID') || ''
  const isOnline = useOnlineStatus()
  const { create, isLoading, error } = useCreateLoan(userId, groupId)
  
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    durationMonths: 12,
    interestRate: 15,
    purpose: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await create({
      member_id: formData.memberId,
      amount: parseFloat(formData.amount),
      duration_months: parseInt(formData.durationMonths),
      interest_rate: parseFloat(formData.interestRate),
      purpose: formData.purpose,
    })

    if (result.success) {
      alert(result.savedOffline ? '📱 Loan saved offline' : '✓ Loan approved')
      setFormData({
        memberId: '',
        amount: '',
        durationMonths: 12,
        interestRate: 15,
        purpose: '',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div>
        <label>Member ID</label>
        <input
          value={formData.memberId}
          onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
        />
      </div>
      
      <div>
        <label>Loan Amount (UGX)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <div>
        <label>Duration (months)</label>
        <input
          type="number"
          value={formData.durationMonths}
          onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
        />
      </div>

      <div>
        <label>Interest Rate (%)</label>
        <input
          type="number"
          step="0.1"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
        />
      </div>

      <div>
        <label>Purpose</label>
        <textarea
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
        />
      </div>

      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Loan'}
      </button>

      {!isOnline && <p>📱 Offline - will sync when online</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

## 7. Repayment Recording

```typescript
'use client'

import { useCreateRepayment, useSyncStatus } from '@/lib/useOffline'
import { useState } from 'react'

export default function RecordRepayment({ loanId, groupId }: Props) {
  const userId = localStorage.getItem('USER_ID') || ''
  const { create, isLoading, error } = useCreateRepayment(userId, groupId)
  const { pending, sync } = useSyncStatus(userId)
  
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('cash')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await create({
      loan_id: loanId,
      amount: parseFloat(amount),
      date_paid: new Date().toISOString(),
      payment_method: method,
    })

    if (result.success) {
      alert('✓ Repayment recorded')
      setAmount('')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="bank">Bank Transfer</option>
        </select>

        <button disabled={isLoading}>
          {isLoading ? 'Recording...' : 'Record Repayment'}
        </button>
      </form>

      {pending > 0 && (
        <button onClick={() => sync()}>
          Sync {pending} pending items
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
```

## 8. Offline Banner

```typescript
'use client'

import { useOfflineBanner } from '@/lib/useOffline'

export default function OfflineBanner() {
  const showBanner = useOfflineBanner()

  if (!showBanner) return null

  return (
    <div style={{
      backgroundColor: '#fed7aa',
      color: '#92400e',
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '20px' }}>📱</span>
      <span>You are offline. Data will sync when connection is restored.</span>
    </div>
  )
}
```

## 9. Check Offline Data in Console

```javascript
// Run in browser developer console

// View all offline data
JSON.parse(localStorage.getItem('mkutano_offline_data'))

// Count pending items
const data = JSON.parse(localStorage.getItem('mkutano_offline_data') || '{}')
Object.values(data).flat().filter(item => !item._synced).length

// View sync stats
import { getOfflineStats } from '@/lib/syncManager'
getOfflineStats()

// Manually sync
import { syncOfflineData } from '@/lib/syncManager'
const userId = localStorage.getItem('USER_ID')
await syncOfflineData(userId)
```

## 10. Environment Setup

Create `.env.local` in project root:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Session
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 11. Handle Form Validation

```typescript
'use client'

import { useOfflineFormSubmit } from '@/lib/useOffline'
import { useState } from 'react'

export default function ValidatedForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { submit, isLoading, error } = useOfflineFormSubmit(
    async (data) => {
      // Validation
      const newErrors: Record<string, string> = {}
      if (!data.name) newErrors.name = 'Name required'
      if (!data.amount) newErrors.amount = 'Amount required'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        throw new Error('Validation failed')
      }

      // Submit
      return await createContributionOffline(data.userId, data.groupId, data)
    },
    {
      onSuccess: (result) => {
        alert(result.message)
      },
      onError: (error) => {
        console.error(error)
      },
    }
  )

  const handleSubmit = async (formData: any) => {
    setErrors({})
    await submit(formData)
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit({
        name: 'John',
        amount: 50000,
      })
    }}>
      <input placeholder="Name" />
      <input type="number" placeholder="Amount" />
      <button disabled={isLoading}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

## 12. Test Offline Mode

```javascript
// In DevTools Console

// Simulate offline
navigator.__defineGetter__('onLine', function(){ return false })

// Trigger offline event
window.dispatchEvent(new Event('offline'))

// Go back online
navigator.__defineGetter__('onLine', function(){ return true })

// Trigger online event  
window.dispatchEvent(new Event('online'))

// Clear offline data
localStorage.removeItem('mkutano_offline_data')
```

---

**Need Help?** Check:
- `PWA_OFFLINE_SYNC_GUIDE.md` - Architecture details
- `PWA_OFFLINE_FIRST_INTEGRATION.md` - Implementation guide
- `DATABASE_SCHEMA.md` - Data structure reference
- `SUPABASE_SETUP.md` - Backend configuration
