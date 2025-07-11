"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface LoadingState {
  [key: string]: boolean
}

interface UseVisualFeedbackReturn {
  // Loading states
  loadingStates: LoadingState
  setLoading: (key: string, isLoading: boolean) => void
  isLoading: (key: string) => boolean
  
  // Toast notifications
  showSuccess: (message: string, description?: string) => void
  showError: (message: string, description?: string) => void
  showInfo: (message: string, description?: string) => void
  showWarning: (message: string, description?: string) => void
  
  // Progress tracking
  progress: number
  setProgress: (value: number) => void
  
  // Async operation wrapper
  withLoading: <T>(key: string, operation: () => Promise<T>) => Promise<T>
}

export function useVisualFeedback(): UseVisualFeedbackReturn {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})
  const [progress, setProgress] = useState(0)

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const showSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  }, [])

  const showError = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    })
  }, [])

  const showInfo = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  }, [])

  const showWarning = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    })
  }, [])

  const withLoading = useCallback(async <T>(
    key: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    try {
      setLoading(key, true)
      const result = await operation()
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(key, false)
    }
  }, [setLoading])

  return {
    loadingStates,
    setLoading,
    isLoading,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    progress,
    setProgress,
    withLoading,
  }
}
