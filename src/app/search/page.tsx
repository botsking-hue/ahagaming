'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, X } from 'lucide-react'
import GameGrid from '@/components/games/GameGrid'
import SearchBar from '@/components/shared/SearchBar'
import { useGames } from '@/hooks/useGames'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(query)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { games, loading } = useGames({ search: query })

  useEffect(() => {
    setSearchTerm(query)
    setSearchResults(games)
  }, [query, games])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    window.location.href = '/search'
  }

  const getSuggestions = () => {
    if (!searchTerm) return []
    
    const categories = Array.from(new Set(games.map(g => g.category)))
    return categories.slice(0, 3).map(cat => ({
      type: 'category',
      name: cat,
      count: games.filter(g => g.category === cat).length
    }))
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="glass-card p-8 rounded-2xl text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-4">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Search Games</h1>
          <p className="text-gray-400 mb-8">
            Find your favorite games by name, category, or description
          </p>
          
          <form onSubmit={handleSearch} className="relative mb-6">
            <SearchBar />
          </form>

          {query && (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-400">
                Showing results for:
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-medium">
                "{query}"
              </span>
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      {!query && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-3">
            {['Arcade', 'Racing', 'Android', 'Free', '2024', 'Popular'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag.toLowerCase()}`}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {query ? 'Search Results' : 'Browse All Games'}
            </h2>
            <p className="text-gray-400 mt-1">
              {query 
                ? `${searchResults.length} games found for "${query}"`
                : `${games.length} total games available`
              }
            </p>
          </div>
          {query && getSuggestions().length > 0 && (
            <div className="hidden md:block">
              <p className="text-sm text-gray-400 mb-2">Try searching by:</p>
              <div className="flex space-x-2">
                {getSuggestions().map((suggestion) => (
                  <Link
                    key={suggestion.name}
                    href={`/search?q=${suggestion.name.toLowerCase()}`}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white"
                  >
                    {suggestion.name} ({suggestion.count})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Searching games...</p>
          </div>
        ) : searchResults.length === 0 && query ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
            <p className="text-gray-400 mb-6">
              We couldn't find any games matching "{query}"
            </p>
            <div className="space-x-4">
              <button
                onClick={clearSearch}
                className="btn-primary"
              >
                Clear Search
              </button>
              <Link
                href="/games"
                className="btn-secondary"
              >
                Browse All Games
              </Link>
            </div>
          </div>
        ) : (
          <>
            <GameGrid />
            
            {/* Search Tips */}
            {query && (
              <div className="mt-8 glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Search Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Use specific terms</div>
                    <div className="text-sm text-gray-400">
                      Try game names like "Subway Surfers" or "Minecraft"
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Filter by category</div>
                    <div className="text-sm text-gray-400">
                      Add "arcade" or "racing" to narrow results
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Check platforms</div>
                    <div className="text-sm text-gray-400">
                      Include "android", "ios", or "pc" for platform-specific games
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
