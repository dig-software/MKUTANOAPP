/**
 * PWA Offline-to-Online Data Sync Layer
 * Handles storing offline data locally and syncing to Supabase when online
 */

import { supabase } from './supabase'
import {
  recordContribution,
  issueLoan,
  recordRepayment,
  addToSyncQueue,
  getPendingSyncItems,
  markSyncItemAsSynced,
} from './supabaseService'

const OFFLINE_STORAGE_KEY = 'mkutano_offline_data'

/**
 * Interface for offline data storage
 */
interface OfflineData {
  contributions: any[]
  loans: any[]
  repayments: any[]
  meetings: any[]
  [key: string]: any[]
}

function createEmptyOfflineData(): OfflineData {
  return {
    contributions: [],
    loans: [],
    repayments: [],
    meetings: [],
  }
}

/**
 * Save offline operation to localStorage
 */
export function saveOfflineData(
  dataType: string,
  data: any,
  userId: string,
  groupId: string
) {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
    const offlineData: OfflineData = stored ? JSON.parse(stored) : createEmptyOfflineData()

    // Initialize array if needed
    if (!offlineData[dataType]) {
      offlineData[dataType] = []
    }

    // Add timestamp and metadata
    const dataWithMeta = {
      ...data,
      _id: `${dataType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      _timestamp: new Date().toISOString(),
      _userId: userId,
      _groupId: groupId,
      _synced: false,
    }

    offlineData[dataType].push(dataWithMeta)

    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData))

    console.log(`[Offline] Saved ${dataType}:`, dataWithMeta._id)

    return dataWithMeta
  } catch (error) {
    console.error('Failed to save offline data:', error)
    throw error
  }
}

/**
 * Get all offline data for a user
 */
export function getOfflineData(userId: string): OfflineData {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
    if (!stored) return createEmptyOfflineData()

    const allData = { ...createEmptyOfflineData(), ...JSON.parse(stored) }

    // Filter by userId
    const userOfflineData: OfflineData = createEmptyOfflineData()
    Object.keys(allData).forEach((key) => {
      userOfflineData[key] = allData[key].filter(
        (item: any) => item._userId === userId && !item._synced
      )
    })

    return userOfflineData
  } catch (error) {
    console.error('Failed to read offline data:', error)
    return createEmptyOfflineData()
  }
}

/**
 * Sync offline data to Supabase
 */
export async function syncOfflineData(userId: string) {
  if (!navigator.onLine) {
    console.log('[Sync] Offline - cannot sync')
    return { synced: 0, failed: 0, errors: [] }
  }

  const offlineData = getOfflineData(userId)
  let synced = 0
  let failed = 0
  const errors: string[] = []

  try {
    // Sync contributions
    for (const contribution of offlineData.contributions || []) {
      try {
        await recordContribution(contribution)
        markOfflineDataAsSynced(contribution._id)
        synced++
      } catch (error: any) {
        failed++
        errors.push(`Contribution sync failed: ${error.message}`)
      }
    }

    // Sync loans
    for (const loan of offlineData.loans || []) {
      try {
        await issueLoan(loan)
        markOfflineDataAsSynced(loan._id)
        synced++
      } catch (error: any) {
        failed++
        errors.push(`Loan sync failed: ${error.message}`)
      }
    }

    // Sync repayments
    for (const repayment of offlineData.repayments || []) {
      try {
        await recordRepayment(repayment)
        markOfflineDataAsSynced(repayment._id)
        synced++
      } catch (error: any) {
        failed++
        errors.push(`Repayment sync failed: ${error.message}`)
      }
    }

    console.log(`[Sync] Complete: ${synced} synced, ${failed} failed`)

    return { synced, failed, errors }
  } catch (error: any) {
    console.error('[Sync] Error:', error)
    return { synced, failed: offlineData.contributions?.length || 0, errors: [error.message] }
  }
}

/**
 * Mark offline data as synced
 */
function markOfflineDataAsSynced(dataId: string) {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
    if (!stored) return

    const offlineData = JSON.parse(stored)

    Object.keys(offlineData).forEach((key) => {
      offlineData[key] = offlineData[key].map((item: any) =>
        item._id === dataId ? { ...item, _synced: true } : item
      )
    })

    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData))
  } catch (error) {
    console.error('Failed to mark data as synced:', error)
  }
}

/**
 * Clear synced offline data (cleanup)
 */
export function clearSyncedOfflineData() {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
    if (!stored) return

    const offlineData = JSON.parse(stored)

    // Remove synced items
    Object.keys(offlineData).forEach((key) => {
      offlineData[key] = offlineData[key].filter((item: any) => !item._synced)
    })

    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData))
    console.log('[Offline] Cleaned up synced data')
  } catch (error) {
    console.error('Failed to clear synced data:', error)
  }
}

/**
 * Get offline data statistics
 */
export function getOfflineStats(): { pending: number; synced: number; total: number } {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY)
    if (!stored) return { pending: 0, synced: 0, total: 0 }

    const offlineData = JSON.parse(stored)

    let pending = 0
    let synced = 0

    Object.keys(offlineData).forEach((key) => {
      offlineData[key].forEach((item: any) => {
        if (item._synced) {
          synced++
        } else {
          pending++
        }
      })
    })

    return {
      pending,
      synced,
      total: pending + synced,
    }
  } catch (error) {
    console.error('Failed to get offline stats:', error)
    return { pending: 0, synced: 0, total: 0 }
  }
}

/**
 * Setup automatic sync when online
 */
export function setupAutoSync(userId: string, interval = 30000) {
  // Check online status
  window.addEventListener('online', () => {
    console.log('[Sync] Device online - syncing data...')
    syncOfflineData(userId)
      .then((result) => {
        if (result.synced > 0) {
          console.log(`[Sync] Successfully synced ${result.synced} items`)
        }
      })
      .catch((error) => {
        console.error('[Sync] Auto sync failed:', error)
      })
  })

  // Periodic sync check (when online)
  setInterval(() => {
    if (navigator.onLine) {
      const stats = getOfflineStats()
      if (stats.pending > 0) {
        console.log(`[Sync] ${stats.pending} pending items - syncing...`)
        syncOfflineData(userId)
      }
    }
  }, interval)

  console.log('[Sync] Auto-sync enabled')
}

/**
 * Create a contribution offline
 */
export async function createContributionOffline(
  userId: string,
  groupId: string,
  contribution: any
) {
  if (!navigator.onLine) {
    // Save to offline storage
    return saveOfflineData('contributions', contribution, userId, groupId)
  }

  // Online - sync directly
  try {
    const result = await recordContribution(contribution)
    return result
  } catch (error) {
    console.warn('Online sync failed - saving offline:', error)
    return saveOfflineData('contributions', contribution, userId, groupId)
  }
}

/**
 * Create a loan offline
 */
export async function createLoanOffline(userId: string, groupId: string, loan: any) {
  if (!navigator.onLine) {
    return saveOfflineData('loans', loan, userId, groupId)
  }

  try {
    const result = await issueLoan(loan)
    return result
  } catch (error) {
    console.warn('Online sync failed - saving offline:', error)
    return saveOfflineData('loans', loan, userId, groupId)
  }
}

/**
 * Create a repayment offline
 */
export async function createRepaymentOffline(
  userId: string,
  groupId: string,
  repayment: any
) {
  if (!navigator.onLine) {
    return saveOfflineData('repayments', repayment, userId, groupId)
  }

  try {
    const result = await recordRepayment(repayment)
    return result
  } catch (error) {
    console.warn('Online sync failed - saving offline:', error)
    return saveOfflineData('repayments', repayment, userId, groupId)
  }
}
