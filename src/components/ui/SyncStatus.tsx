'use client'

import React, { useState, useEffect } from 'react'
import { getOfflineStats, syncOfflineData } from '@/lib/syncManager'
import Button from './Button'

interface SyncStatusProps {
  userId?: string
  showAlways?: boolean
}

/**
 * UI Component to show offline sync status and control sync
 */
export default function SyncStatus({ userId, showAlways = false }: SyncStatusProps) {
  const [stats, setStats] = useState({ pending: 0, synced: 0, total: 0 })
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update stats periodically
    const updateStats = () => {
      const newStats = getOfflineStats()
      setStats(newStats)

      // Show notification when items are pending
      if (newStats.pending > 0 && isOnline) {
        setShowNotification(true)
      }
    }

    updateStats()
    const interval = setInterval(updateStats, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [isOnline])

  const handleManualSync = async () => {
    if (!userId || !isOnline) return

    setIsSyncing(true)
    try {
      const result = await syncOfflineData(userId)
      setStats(getOfflineStats())

      if (result.synced > 0) {
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }

      if (result.errors.length > 0) {
        console.error('Sync errors:', result.errors)
      }
    } finally {
      setIsSyncing(false)
    }
  }

  // Show only if offline or pending items exist
  if (!showAlways && isOnline && stats.pending === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Status Badge */}
      <div
        className={`rounded-lg shadow-lg p-3 mb-2 transition-all ${
          isOnline ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Pending Items Count */}
        {stats.pending > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            {stats.pending} item{stats.pending !== 1 ? 's' : ''} pending sync
          </div>
        )}

        {/* Sync Button */}
        {isOnline && stats.pending > 0 && userId && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="mt-2 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-2 py-1 rounded transition-colors"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>

      {/* Success Notification */}
      {showNotification && (
        <div className="bg-green-500 text-white text-sm rounded-lg shadow-lg p-3 animate-pulse">
          ✓ Sync successful
        </div>
      )}
    </div>
  )
}
