import { useState, useEffect } from 'react'

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
}

interface FilterOptions {
  category?: string
  platform?: string
  sort?: string
  search?: string
}

export function useGames(filters: FilterOptions = {}) {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    if (games.length > 0) {
      applyFilters()
    }
  }, [filters, games])

  const fetchGames = async () => {
    try {
      const response = await fetch('/data/games.json')
      if (!response.ok) throw new Error('Failed to fetch games')
      const data = await response.json()
      setGames(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...games]

    // Apply category filter
    if (filters.category) {
      result = result.filter(game => 
        game.category.toLowerCase() === filters.category?.toLowerCase()
      )
    }

    // Apply platform filter
    if (filters.platform) {
      result = result.filter(game => 
        game.platform.includes(filters.platform!)
      )
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    switch (filters.sort) {
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

    setFilteredGames(result)
  }

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

  const getCategories = () => {
    const categories = games.reduce((acc, game) => {
      acc[game.category] = (acc[game.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(categories).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase()
    }))
  }

  const getPlatforms = () => {
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

  return {
    games,
    filteredGames,
    loading,
    error,
    getCategories,
    getPlatforms,
    refetch: fetchGames
  }
}
