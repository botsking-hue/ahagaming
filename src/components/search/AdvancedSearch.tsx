'use client'

import { Search, Filter, X, TrendingUp, Clock, Star } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useOptimizedGames } from '@/hooks/useOptimizedGames'

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onClose?: () => void
  initialQuery?: string
}

interface SearchFilters {
  category: string[]
  platform: string[]
  minRating: number
  maxSize: string
  sortBy: 'relevance' | 'newest' | 'popular' | 'rating'
}

const AdvancedSearch = ({ 
  onSearch, 
  onClose,
  initialQuery = '' 
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    platform: [],
    minRating: 0,
    maxSize: '',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const debouncedQuery = useDebounce(query, 300)
  const { games } = useOptimizedGames()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  // Generate suggestions
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const gameTitles = games.map(g => g.title)
      const gameCategories = Array.from(new Set(games.map(g => g.category)))
      
      const allTerms = [...gameTitles, ...gameCategories]
      const filtered = allTerms.filter(term =>
        term.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 5)
      
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, games])

  const saveRecentSearch = useCallback((searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }, [recentSearches])

  const handleSearch = useCallback((searchQuery = query, searchFilters = filters) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery)
    }
    onSearch(searchQuery, searchFilters)
  }, [query, filters, onSearch, saveRecentSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearSearch = () => {
    setQuery('')
    setFilters({
      category: [],
      platform: [],
      minRating: 0,
      maxSize: '',
      sortBy: 'relevance'
    })
    onSearch('', {
      category: [],
      platform: [],
      minRating: 0,
      maxSize: '',
      sortBy: 'relevance'
    })
  }

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }))
  }

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }))
  }

  const getPopularSearches = useCallback(() => {
    return ['arcade', 'racing', 'android', 'free', '2024', 'popular']
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games, categories, or platforms..."
          className="w-full pl-12 pr-24 py-4 bg-white/5 border border-white/10 rounded-2xl 
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                   placeholder-gray-500 text-white text-lg"
          autoFocus
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition ${showFilters ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Filter className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          <div className="max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-600/5">
              <p className="text-sm font-medium text-gray-300">Suggestions</p>
            </div>
            
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full p-4 text-left hover:bg-white/5 transition border-b border-white/5 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-white">{suggestion}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {games.find(g => g.title === suggestion) 
                        ? `${games.filter(g => g.title === suggestion).length} games`
                        : `${games.filter(g => g.category === suggestion).length} games in category`
                      }
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-2xl shadow-2xl z-50 p-6 animate-slide-in-down">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Categories</h4>
              <div className="space-y-2">
                {Array.from(new Set(games.map(g => g.category))).slice(0, 6).map((category) => (
                  <label key={category} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 text-cyan-500 bg-white/5 border-white/10 rounded"
                    />
                    <span className="text-gray-300">{category}</span>
                    <span className="ml-auto text-xs px-2 py-1 bg-white/10 rounded">
                      {games.filter(g => g.category === category).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Platforms</h4>
              <div className="space-y-2">
                {['android', 'ios', 'pc'].map((platform) => (
                  <label key={platform} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.platform.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="h-4 w-4 text-cyan-500 bg-white/5 border-white/10 rounded"
                    />
                    <span className="text-gray-300 capitalize">{platform}</span>
                    <span className="ml-auto text-xs px-2 py-1 bg-white/10 rounded">
                      {games.filter(g => g.platform.includes(platform)).length}
                    </span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Minimum Rating</h4>
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                    className="flex-1 accent-cyan-500"
                  />
                  <span className="text-sm text-white w-12">{filters.minRating.toFixed(1)}+</span>
                </div>
              </div>
            </div>

            {/* Sort & Size */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
              <div className="space-y-2">
                {[
                  { value: 'relevance', label: 'Most Relevant', icon: TrendingUp },
                  { value: 'newest', label: 'Newest First', icon: Clock },
                  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
                  { value: 'rating', label: 'Highest Rating', icon: Star }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${filters.sortBy === option.value ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Max Size */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Max File Size</h4>
                <select
                  value={filters.maxSize}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxSize: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Any Size</option>
                  <option value="100">Up to 100MB</option>
                  <option value="500">Up to 500MB</option>
                  <option value="1000">Up to 1GB</option>
                  <option value="2000">Up to 2GB</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setFilters({
                  category: [],
                  platform: [],
                  minRating: 0,
                  maxSize: '',
                  sortBy: 'relevance'
                })
              }}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear All Filters
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSearch()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent & Popular Searches */}
      {!query && suggestions.length === 0 && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-2xl shadow-2xl z-40 p-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-300">Recent Searches</h4>
              </div>
              
              {recentSearches.length > 0 ? (
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left p-3 hover:bg-white/5 rounded-lg transition"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent searches</p>
              )}
            </div>

            {/* Popular Searches */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-300">Popular Searches</h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {getPopularSearches().map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
