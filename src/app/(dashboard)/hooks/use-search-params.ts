"use client"

import { useQueryState } from 'nuqs'

/**
 * Hook for managing search-related URL parameters
 * Uses nuqs for URL state persistence
 */
export function useSearchParams() {
  // Search query parameter
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    clearOnDefault: true,
  })

  // Search filter parameter (for future data table filtering)
  const [searchFilter, setSearchFilter] = useQueryState('filter', {
    defaultValue: '',
    clearOnDefault: true,
  })

  // Search category parameter (for scoped search)
  const [searchCategory, setSearchCategory] = useQueryState('category', {
    defaultValue: 'all',
    clearOnDefault: true,
  })

  return {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    searchCategory,
    setSearchCategory,
    // Helper to clear all search params
    clearSearch: () => {
      setSearchQuery('')
      setSearchFilter('')
      setSearchCategory('all')
    }
  }
}
