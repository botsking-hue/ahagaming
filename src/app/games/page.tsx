'use client'

import { Filter, Grid3x3, List } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GameFilters from '@/components/games/GameFilters'
import GameGrid from '@/components/games/GameGrid'
import { useGames } from '@/hooks/useGames'
import SearchBar from '@/components/shared/SearchBar'

export default function GamesPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const filters = {
    category: searchParams.get('category') || '',
    platform: searchParams.get('platform') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('q') || ''
  }

  const { filteredGames, loading, getCategories, getPlatforms } = useGames(filters)

  const categories = getCategories()
  const platforms = getPlatforms()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">All Games</h1>
            <p className="text-gray-400">
              Browse and download {filteredGames.length} amazing games
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{filteredGames.length}</div>
            <div className="text-sm text-gray-400">Total Games</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{categories.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{platforms.length}</div>
            <div className="text-sm text-gray-400">Platforms</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">
              {filteredGames.reduce((acc, game) => {
                const match = game.downloads.match(/(\d+(\.\d+)?)([MKBT]?)\+/)
                if (match) {
                  const [, numStr, , unit] = match
                  let num = parseFloat(numStr)
                  if (unit === 'M') num *= 1000000
                  if (unit === 'B') num *= 1000000000
                  return acc + num
                }
                return acc
              }, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Downloads</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <GameFilters />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-400">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredGames.length} games
            {filters.category && ` in ${filters.category}`}
            {filters.platform && ` for ${filters.platform}`}
          </span>
        </div>
        {filteredGames.length > 0 && (
          <div className="text-sm text-gray-400">
            Sorted by: {filters.sort === 'newest' ? 'Newest' : 
                       filters.sort === 'popular' ? 'Most Popular' : 
                       filters.sort === 'rating' ? 'Highest Rating' : 'Name A-Z'}
          </div>
        )}
      </div>

      {/* Games Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Loading games...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-4">
            <Filter className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
          <p className="text-gray-400 mb-6">
            Try changing your filters or search terms
          </p>
          <button
            onClick={() => window.location.href = '/games'}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <GameGrid />
      ) : (
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                      <p className="text-gray-400 mb-4">{game.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm">
                        {game.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white">{game.rating}</span>
                      </div>
                      <div className="text-gray-400">{game.size}</div>
                      <div className="text-gray-400">{game.downloads} downloads</div>
                    </div>
                    <a
                      href={game.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-6 py-2"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
