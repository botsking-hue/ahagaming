'use client'

import { useState, useEffect, useMemo } from 'react'
import GameCard from './GameCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useOptimizedGames } from '@/hooks/useOptimizedGames'

interface GameGridProps {
  category?: string
  platform?: string
  sort?: string
  search?: string
  limit?: number
  showFilters?: boolean
}

const GameGrid = ({ 
  category, 
  platform, 
  sort = 'newest', 
  search, 
  limit,
  showFilters = true
}: GameGridProps) => {
  const { filteredGames, loading, error } = useOptimizedGames({
    category,
    platform,
    sort,
    search,
    limit
  })

  const [visibleGames, setVisibleGames] = useState(limit || 12)

  // Infinite scroll handler
  useEffect(() => {
    if (limit) return // Don't infinite scroll if limit is set

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        visibleGames < filteredGames.length
      ) {
        setVisibleGames(prev => Math.min(prev + 12, filteredGames.length))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleGames, filteredGames.length, limit])

  if (loading) {
    return (
      <div className="py-12 text-center">
        <LoadingSpinner size="lg" color="gradient" className="mx-auto" />
        <p className="mt-4 text-gray-400">Loading games...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center glass-card rounded-2xl">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Games</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  if (filteredGames.length === 0) {
    return (
      <div className="py-12 text-center glass-card rounded-2xl">
        <div className="text-4xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
        <p className="text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  const gamesToShow = limit ? filteredGames.slice(0, limit) : filteredGames.slice(0, visibleGames)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesToShow.map((game, index) => (
          <div 
            key={game.id}
            className="stagger-item animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* Load More Button (for non-infinite scroll) */}
      {!limit && visibleGames < filteredGames.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleGames(prev => Math.min(prev + 12, filteredGames.length))}
            className="btn-primary px-8"
          >
            Load More Games ({filteredGames.length - visibleGames} remaining)
          </button>
        </div>
      )}

      {/* End of Results */}
      {!limit && visibleGames >= filteredGames.length && filteredGames.length > 0 && (
        <div className="text-center mt-8 py-8 border-t border-white/10">
          <p className="text-gray-400">🎉 You've seen all {filteredGames.length} games!</p>
        </div>
      )}
    </>
  )
}

export default GameGrid
