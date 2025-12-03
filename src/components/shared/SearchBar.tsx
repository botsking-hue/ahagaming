'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    // Get initial query from URL
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)
  }, [searchParams])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  const fetchSuggestions = async (searchTerm: string) => {
    try {
      const response = await fetch('/data/games.json')
      const games = await response.json()
      
      const filtered = games.filter((game: any) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
      
      setSuggestions(filtered)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleSearch = useCallback((searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    
    router.push(`/search?${params.toString()}`)
    setShowSuggestions(false)
  }, [router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push('/games')
  }

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search games by name or category..."
          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                   placeholder-gray-500 text-white"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <div className="p-3 border-b border-white/10">
              <p className="text-sm text-gray-400">Search Results</p>
            </div>
            {suggestions.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  router.push(`/games/${game.slug}`)
                  setShowSuggestions(false)
                  setQuery('')
                }}
                className="p-4 hover:bg-white/5 cursor-pointer transition border-b border-white/5 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎮</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {game.title}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 rounded">
                        {game.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {game.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div 
              onClick={() => handleSearch(query)}
              className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 cursor-pointer text-center"
            >
              <span className="text-cyan-400 font-medium">
                View all results for "{query}"
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
