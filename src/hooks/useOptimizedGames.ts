'use client'

import { useState, useEffect, useCallback } from 'react'

interface Game {
  id: string
  slug: string
  title: string
  category: string
  platform: string[]
  cover: string
  description: string
  downloadLink: string
  size: string
  version: string
  rating: number
  downloads: string
  updatedAt: string
  featured?: boolean
  status?: 'draft' | 'published'
}

interface FilterOptions {
  category?: string
  platform?: string
  sort?: string
  search?: string
  limit?: number
}

const CACHE_KEY = 'games_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useOptimizedGames(filters: FilterOptions = {}) {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cache, setCache] = useState<{
    data: Game[]
    timestamp: number
  } | null>(null)

  const loadGames = useCallback(async () => {
    try {
      setLoading(true)
      
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        const age = Date.now() - parsed.timestamp
        
        if (age < CACHE_DURATION) {
          setGames(parsed.data)
          setCache(parsed)
          applyFilters(parsed.data, filters)
          setLoading(false)
          return
        }
      }

      // Fetch fresh data
      const response = await fetch('/data/games.json')
      if (!response.ok) throw new Error('Failed to fetch games')
      const data = await response.json()
      
      // Update cache
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
      setCache(cacheData)
      setGames(data)
      applyFilters(data, filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Try to use stale cache if available
      if (cache?.data) {
        setGames(cache.data)
        applyFilters(cache.data, filters)
      }
    } finally {
      setLoading(false)
    }
  }, [cache, filters])

  const applyFilters = useCallback((gamesList: Game[], filterOpts: FilterOptions) => {
    let result = [...gamesList]

    // Apply category filter
    if (filterOpts.category) {
      result = result.filter(game => 
        game.category.toLowerCase() === filterOpts.category?.toLowerCase()
      )
    }

    // Apply platform filter
    if (filterOpts.platform) {
      result = result.filter(game => 
        game.platform.includes(filterOpts.platform!)
      )
    }

    // Apply search filter
    if (filterOpts.search) {
      const searchTerm = filterOpts.search.toLowerCase()
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    switch (filterOpts.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'popular':
        result.sort((a, b) => {
          const aDownloads = parseDownloads(a.downloads)
          const bDownloads = parseDownloads(b.downloads)
          return bDownloads - aDownloads
        })
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    // Apply limit
    if (filterOpts.limit) {
      result = result.slice(0, filterOpts.limit)
    }

    setFilteredGames(result)
  }, [])

  const parseDownloads = (downloadStr: string): number => {
    const match = downloadStr.match(/(\d+(\.\d+)?)([MKBT]?)\+/)
    if (!match) return 0
    
    const [, numStr, , unit] = match
    const num = parseFloat(numStr)
    
    switch (unit) {
      case 'M': return num * 1000000
      case 'K': return num * 1000
      case 'B': return num * 1000000000
      case 'T': return num * 1000000000000
      default: return num
    }
  }

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setCache(null)
    loadGames()
  }

  const refreshGames = () => {
    clearCache()
  }

  useEffect(() => {
    loadGames()
  }, [loadGames])

  useEffect(() => {
    applyFilters(games, filters)
  }, [games, filters, applyFilters])

  return {
    games,
    filteredGames,
    loading,
    error,
    cache,
    clearCache,
    refreshGames,
    getCategories: () => {
      const categories = games.reduce((acc, game) => {
        acc[game.category] = (acc[game.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(categories).map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase()
      }))
    },
    getPlatforms: () => {
      const platforms = games.reduce((acc, game) => {
        game.platform.forEach(platform => {
          acc[platform] = (acc[platform] || 0) + 1
        })
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(platforms).map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase()
      }))
    }
  }
}
