/**
 * React Hooks for PWA offline-first data management
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  createContributionOffline,
  createLoanOffline,
  createRepaymentOffline,
  syncOfflineData,
  getOfflineStats,
  getOfflineData,
} from './syncManager'

/**
 * Hook to detect online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook to track offline sync status
 */
export function useSyncStatus(userId?: string, updateInterval = 5000) {
  const [stats, setStats] = useState({ pending: 0, synced: 0, total: 0 })
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Update stats
  useEffect(() => {
    const updateStats = () => {
      setStats(getOfflineStats())
    }

    updateStats()
    const interval = setInterval(updateStats, updateInterval)
    return () => clearInterval(interval)
  }, [updateInterval])

  // Manual sync function
  const sync = useCallback(
    async (silent = false) => {
      if (!userId) return
      setIsSyncing(true)
      try {
        const result = await syncOfflineData(userId)
        setStats(getOfflineStats())
        setLastSyncTime(new Date())

        if (!silent) {
          console.log(`Synced ${result.synced} items, ${result.failed} failed`)
        }

        return result
      } finally {
        setIsSyncing(false)
      }
    },
    [userId]
  )

  return {
    ...stats,
    isSyncing,
    lastSyncTime,
    sync,
  }
}

/**
 * Hook for creating contributions (offline-aware)
 */
export function useCreateContribution(userId: string, groupId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOnline = useOnlineStatus()

  const create = useCallback(
    async (contributionData: any) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await createContributionOffline(userId, groupId, contributionData)
        return {
          success: true,
          data: result,
          savedOffline: !isOnline,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create contribution'
        setError(message)
        return {
          success: false,
          error: message,
          savedOffline: false,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [userId, groupId, isOnline]
  )

  return { create, isLoading, error, isOnline }
}

/**
 * Hook for creating loans (offline-aware)
 */
export function useCreateLoan(userId: string, groupId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOnline = useOnlineStatus()

  const create = useCallback(
    async (loanData: any) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await createLoanOffline(userId, groupId, loanData)
        return {
          success: true,
          data: result,
          savedOffline: !isOnline,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create loan'
        setError(message)
        return {
          success: false,
          error: message,
          savedOffline: false,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [userId, groupId, isOnline]
  )

  return { create, isLoading, error, isOnline }
}

/**
 * Hook for creating repayments (offline-aware)
 */
export function useCreateRepayment(userId: string, groupId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOnline = useOnlineStatus()

  const create = useCallback(
    async (repaymentData: any) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await createRepaymentOffline(userId, groupId, repaymentData)
        return {
          success: true,
          data: result,
          savedOffline: !isOnline,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create repayment'
        setError(message)
        return {
          success: false,
          error: message,
          savedOffline: false,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [userId, groupId, isOnline]
  )

  return { create, isLoading, error, isOnline }
}

/**
 * Hook to fetch data with offline fallback
 * Combines online data from Supabase with offline cached data
 */
export function useFetchData<T>(
  fetcher: () => Promise<T[]>,
  cacheKey: string,
  userId: string,
  options: {
    fallbackData?: T[]
    refetchInterval?: number
    enabled?: boolean
  } = {}
) {
  const [data, setData] = useState<T[]>(options.fallbackData || [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const cacheRef = useRef<T[]>(data)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return

    setIsLoading(true)
    setError(null)

    try {
      if (!isOnline) {
        // Return cached data + offline data
        const offlineData = getOfflineData(userId)
        const offlineItems = (offlineData as any)[cacheKey] || []
        setData([...(cacheRef.current || []), ...offlineItems])
        return
      }

      // Fetch from Supabase
      const result = await fetcher()
      cacheRef.current = result
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(message)
      // Return cached data on error
      setData(cacheRef.current || options.fallbackData || [])
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, isOnline, userId, cacheKey, options.fallbackData, options.enabled])

  // Initial fetch and periodic refetch
  useEffect(() => {
    fetchData()

    if (options.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, options.refetchInterval])

  // Refetch when online status changes
  useEffect(() => {
    if (isOnline) {
      fetchData()
    }
  }, [isOnline, fetchData])

  return { data, isLoading, error, isOnline, refetch: fetchData }
}

/**
 * Hook for combined data fetching with live sync
 * Automatically syncs offline data when online
 */
export function useSyncedData<T>(
  fetcher: () => Promise<T[]>,
  cacheKey: string,
  userId: string
) {
  const { data, ...rest } = useFetchData(fetcher, cacheKey, userId)
  const { sync } = useSyncStatus(userId)

  // Auto-sync when online
  useEffect(() => {
    if (navigator.onLine) {
      const pendingStats = getOfflineStats()
      if (pendingStats.pending > 0) {
        sync(true) // Silent sync
      }
    }
  }, [sync])

  return { data, ...rest }
}

/**
 * Hook to show offline banner
 */
export function useOfflineBanner(): boolean {
  const isOnline = useOnlineStatus()
  const [showBanner, setShowBanner] = useState(!isOnline)

  useEffect(() => {
    setShowBanner(!isOnline)

    if (!isOnline) {
      // Auto-hide banner after 5 seconds when going online
      const timer = setTimeout(() => {
        if (isOnline) setShowBanner(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  return showBanner
}

/**
 * Hook to handle form submission with offline support
 */
export function useOfflineFormSubmit(
  onSubmit: (data: any) => Promise<any>,
  options: {
    onSuccess?: (result: any) => void
    onError?: (error: string) => void
    offlineMessage?: string
    successMessage?: string
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOnline = useOnlineStatus()

  const submit = useCallback(
    async (data: any) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await onSubmit(data)

        if (options.onSuccess) {
          const message = !isOnline
            ? options.offlineMessage || '✓ Saved offline'
            : options.successMessage || '✓ Saved successfully'

          options.onSuccess({
            ...result,
            message,
            savedOffline: !isOnline,
          })
        }

        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Submission failed'
        setError(message)

        if (options.onError) {
          options.onError(message)
        }

        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [onSubmit, isOnline, options]
  )

  return { submit, isLoading, error, isOnline }
}
