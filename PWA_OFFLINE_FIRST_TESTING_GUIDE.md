# PWA Offline-First Testing Guide

Complete testing procedures for the offline-first architecture.

## Test Environment Setup

### Browser Console Setup

```javascript
// Paste into DevTools Console to get debugging utilities

// View all offline data
window.debugOffline = {
  viewData: () => {
    const data = JSON.parse(localStorage.getItem('mkutano_offline_data') || '{}')
    console.table(data)
    return data
  },
  
  viewStats: () => {
    const data = JSON.parse(localStorage.getItem('mkutano_offline_data') || '{}')
    let pending = 0, synced = 0
    Object.values(data).forEach(arr => {
      arr.forEach(item => {
        if (item._synced) synced++
        else pending++
      })
    })
    console.log(`📊 Offline Stats: ${pending} pending, ${synced} synced, ${pending + synced} total`)
  },
  
  clearData: () => {
    localStorage.removeItem('mkutano_offline_data')
    console.log('✓ Offline data cleared')
  },
  
  goOffline: () => {
    navigator.__defineGetter__('onLine', function(){ return false })
    window.dispatchEvent(new Event('offline'))
    console.log('📱 Offline mode activated')
  },
  
  goOnline: () => {
    navigator.__defineGetter__('onLine', function(){ return true })
    window.dispatchEvent(new Event('online'))
    console.log('🟢 Online mode activated')
  },
  
  getStorageUsage: () => {
    const data = localStorage.getItem('mkutano_offline_data') || ''
    const bytes = new Blob([data]).size
    const mb = (bytes / 1024 / 1024).toFixed(3)
    console.log(`📦 Storage: ${bytes} bytes (${mb} MB)`)
    return { bytes, mb }
  }
}

console.log('✓ Debug utilities loaded. Use window.debugOffline.* commands')
// Example: window.debugOffline.viewStats()
```

## Test Cases

### Test 1: Simple Offline Save

**Objective**: Verify data saves to localStorage when offline

**Steps**:
1. Open app to dashboard
2. Go offline: `window.debugOffline.goOffline()`
3. Navigate to Contributions page
4. Click "Record Contribution"
5. Fill form: Amount = 50000
6. Click "Record"

**Expected**:
- ✅ Shows "📱 Saved offline" message
- ✅ `getOfflineStats()` shows pending = 1
- ✅ localStorage has saved data

**Verification**:
```javascript
window.debugOffline.viewStats()  // Should show 1 pending
```

### Test 2: Online Submission

**Objective**: Verify data syncs to Supabase when online

**Steps**:
1. Ensure you're online
2. Navigate to Contributions
3. Record contribution: Amount = 75000
4. Click "Record"

**Expected**:
- ✅ Shows "✓ Saved to server" message
- ✅ `getOfflineStats()` shows 0 pending
- ✅ Supabase DB has the record

**Verification**:
- Open Supabase Dashboard → contributions table
- Should see new row with your data

### Test 3: Auto-Sync When Reconnecting

**Objective**: Verify offline data auto-syncs when online

**Steps**:
1. Go offline: `window.debugOffline.goOffline()`
2. Record 3 contributions (amounts: 50000, 60000, 70000)
3. Verify all show "📱 Saved offline"
4. Check stats: `window.debugOffline.viewStats()` → Should show 3 pending
5. Go online: `window.debugOffline.goOnline()`
6. Wait 30 seconds (default sync interval)
7. Watch SyncStatus component

**Expected**:
- ✅ SyncStatus shows "🟢 Online"
- ✅ Pending count decreases as items sync
- ✅ All 3 items appear in Supabase

**Verification**:
```javascript
// After going online, check after 30-60 seconds
window.debugOffline.viewStats()  // Should show 0 pending
```

### Test 4: Manual Sync Button

**Objective**: Verify manual sync works

**Steps**:
1. Create offline data: Go offline → Record 2 contributions
2. Go online: `window.debugOffline.goOnline()`
3. Click "Sync Now" button on SyncStatus
4. Watch for "✓ Sync successful" notification

**Expected**:
- ✅ Notification appears
- ✅ Pending count goes to 0
- ✅ Data appears in Supabase

### Test 5: Multiple Data Types

**Objective**: Verify different data types (contributions, loans, repayments) sync

**Steps**:
1. Go offline
2. Record: 1 contribution (UGX 50000)
3. Create: 1 loan (UGX 5,000,000, 12 months)
4. Record: 1 repayment (UGX 500,000)
5. Verify all show "📱 Saved offline"
6. Go online
7. Wait for auto-sync

**Expected**:
- ✅ All 3 items sync successfully
- ✅ Stats show: pending = 0, synced = 3
- ✅ Supabase has all 3 records in respective tables

**Verification**:
```javascript
window.debugOffline.viewData()  // Should show contributions, loans, repayments
```

### Test 6: Storage Limit Warning

**Objective**: Verify app handles near-full storage gracefully

**Steps**:
1. Create large amounts of offline data (~1000 items)
2. Check storage usage: `window.debugOffline.getStorageUsage()`
3. Try to add more data

**Expected**:
- ✅ Still accepts data but warns user
- ✅ Shows storage percentage in debug info
- ✅ App doesn't crash

**Note**: Most browsers allow 5-10MB. At 500 bytes/item, that's ~10,000 items.

### Test 7: Online/Offline Toggle

**Objective**: Verify smooth transitions between online/offline

**Steps**:
1. Go online
2. Verify "🟢 Online" status
3. Go offline: `window.debugOffline.goOffline()`
4. Verify "🔴 Offline" status
5. Go online: `window.debugOffline.goOnline()`
6. Verify "🟢 Online" status

**Expected**:
- ✅ Status switches instantly
- ✅ No console errors
- ✅ All features work in both modes

### Test 8: Form Error Handling

**Objective**: Verify form validation works offline and online

**Steps**:
1. Go offline
2. Try to submit empty form
3. Verify validation error appears
4. Go online
5. Repeat

**Expected**:
- ✅ Validation works identically online/offline
- ✅ Error messages are clear
- ✅ No "undefined" errors

### Test 9: Page Refresh Persistence

**Objective**: Verify offline data persists after page refresh

**Steps**:
1. Go offline
2. Record 5 contributions
3. Refresh page (F5)
4. Offline data should still be there
5. Check: `window.debugOffline.viewStats()`

**Expected**:
- ✅ Data still shows 5 pending
- ✅ Can still interact with app
- ✅ Sync status still shows pending items

### Test 10: Concurrent Operations

**Objective**: Verify app handles multiple simultaneous operations

**Steps**:
1. Go offline
2. Quickly record 5 contributions
3. All should show "📱 Saved offline"
4. Go online
5. All should sync

**Expected**:
- ✅ No race conditions
- ✅ All items sync successfully
- ✅ No data corruption

## Mobile Testing

### iOS Safari (Offline PWA)

**Setup**:
1. Open app on iPhone in Safari
2. Menu → Add to Home Screen
3. Open installed app

**Test**:
```
1. Go offline (Settings → WiFi: OFF, Cellular: OFF)
2. Use app normally
3. Record some contributions
4. All should show "📱 Saved offline"
5. Turn WiFi back on
6. App should auto-sync
```

### Android Chrome (Offline PWA)

**Setup**:
1. Open app on Android in Chrome
2. Menu → Install app
3. Open installed app

**Test**:
```
1. Go offline (Settings → WiFi: OFF)
2. Use app
3. Record contributions
4. Turn WiFi back on
5. Watch auto-sync
```

## Performance Testing

### Test 1: Sync Speed

**Measure**: How long does it take to sync N items?

```javascript
// Measure sync time
console.time('Sync')
await syncOfflineData(userId)
console.timeEnd('Sync')
```

**Expected**:
- 1 item: ~500ms
- 10 items: ~1-2 seconds
- 100 items: ~5-10 seconds

### Test 2: Offline Save Speed

**Measure**: How long does it take to save offline?

```javascript
console.time('Save Offline')
await createContributionOffline(userId, groupId, { amount: 50000 })
console.timeEnd('Save Offline')
```

**Expected**: ~10-50ms

### Test 3: Data Load Speed

**Measure**: Page load time with offline data

```javascript
// Profile in DevTools → Performance tab
// Record: 1) Page load online, 2) Page load offline
```

**Expected**: Offline should be faster (from cache)

## Stress Testing

### Test 1: 1000 Offline Items

**Procedure**:
```javascript
// Create 1000 offline items (in console)
async function createStressData() {
  for (let i = 0; i < 1000; i++) {
    saveOfflineData('contributions', {
      member_id: 'test',
      amount: 1000,
      type: 'regular'
    }, 'userId', 'groupId')
    if (i % 100 === 0) console.log(`Created ${i} items`)
  }
  console.log('✓ 1000 items created')
}
createStressData()
```

**Check**:
- ✅ localStorage still works
- ✅ App doesn't crash
- ✅ Stats display correctly

### Test 2: Rapid Online/Offline Toggle

**Procedure**:
```javascript
// Toggle 10 times quickly
for (let i = 0; i < 10; i++) {
  window.debugOffline.goOffline()
  await new Promise(r => setTimeout(r, 500))
  window.debugOffline.goOnline()
  await new Promise(r => setTimeout(r, 500))
}
```

**Check**:
- ✅ No console errors
- ✅ Sync still works correctly
- ✅ No UI glitches

### Test 3: Sync Under Load

**Procedure**:
1. Create 500 offline items
2. Go online
3. Sync starts
4. While syncing, try to add more items
5. Record page interactions

**Check**:
- ✅ New items queue correctly
- ✅ No items lost
- ✅ UI remains responsive

## Browser Compatibility Testing

Test on each browser/OS combination:

```
Desktop:
- Windows 10: Chrome ✅, Edge ✅, Firefox ✅
- macOS: Chrome ✅, Safari ✅, Firefox ✅
- Linux: Chrome ✅, Firefox ✅

Mobile:
- iOS: Safari ✅, Chrome ✅
- Android: Chrome ✅, Firefox ✅
```

### Test Procedure for Each:
1. Open app
2. Record offline contribution
3. Go offline → Verify saves
4. Go online → Verify syncs
5. Check DevTools for errors

## Test Report Template

```markdown
# Offline-First Testing Report

## Date: [DATE]
## Tester: [NAME]
## Browser: [BROWSER] v[VERSION]
## OS: [OS] [VERSION]

### Test Summary
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Skipped: [X]

### Results

#### Test 1: Simple Offline Save
- Status: ✅ PASS / ❌ FAIL / ⚠️ SKIP
- Notes: [DESCRIPTION]

#### Test 2: Online Submission
- Status: ✅ PASS / ❌ FAIL / ⚠️ SKIP
- Notes: [DESCRIPTION]

...

### Issues Found
1. [ISSUE]: [DESCRIPTION]
   - Severity: Critical/High/Medium/Low
   - Steps: [HOW TO REPRODUCE]
   - Expected: [SHOULD HAPPEN]
   - Actual: [WHAT ACTUALLY HAPPENED]
   - Solution: [PROPOSED FIX]

### Performance Metrics
- Offline save: [TIME]ms
- Online sync (1 item): [TIME]ms
- Online sync (100 items): [TIME]ms
- Page load (offline): [TIME]ms
- Page load (online): [TIME]ms

### Recommendations
- [RECOMMENDATION 1]
- [RECOMMENDATION 2]

### Sign-off
- Tester: [NAME]
- Date: [DATE]
- Status: APPROVED / NEEDS FIXES
```

## Debugging Commands

```javascript
// View complete offline data
JSON.parse(localStorage.getItem('mkutano_offline_data'))

// Count items by type
const data = JSON.parse(localStorage.getItem('mkutano_offline_data') || '{}')
Object.entries(data).forEach(([key, items]) => 
  console.log(`${key}: ${items.length} items`)
)

// Find failed sync items
const data = JSON.parse(localStorage.getItem('mkutano_offline_data') || '{}')
Object.entries(data).forEach(([key, items]) => {
  const failed = items.filter(i => !i._synced)
  if (failed.length) console.log(`${key}: ${failed.length} failed`, failed)
})

// Export offline data to JSON file
const data = JSON.parse(localStorage.getItem('mkutano_offline_data'))
const dataStr = JSON.stringify(data, null, 2)
const dataBlob = new Blob([dataStr], {type: 'application/json'})
const url = URL.createObjectURL(dataBlob)
const link = document.createElement('a')
link.href = url
link.download = 'offline_data.json'
link.click()

// Clear all offline data CAREFULLY
localStorage.removeItem('mkutano_offline_data')

// Monitor sync in real-time
setInterval(() => {
  const stats = getOfflineStats()
  console.clear()
  console.log('Offline Stats:')
  console.log(`📤 Pending: ${stats.pending}`)
  console.log(`✓ Synced: ${stats.synced}`)
  console.log(`📦 Total: ${stats.total}`)
  console.log(`Online: ${navigator.onLine ? '🟢' : '🔴'}`)
}, 1000)
```

---

**Pro Tip**: Keep browser DevTools console open during testing to catch any errors immediately.
