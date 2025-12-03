'use client'

import { useState, useEffect } from 'react'
import GameCard from './GameCard'

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

const GameGrid = () => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/data/games.json')
        const data = await response.json()
        setGames(data)
      } catch (error) {
        console.error('Error loading games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="h-48 bg-gray-800 rounded-t-2xl" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-800 rounded" />
              <div className="h-4 bg-gray-800 rounded" />
              <div className="h-4 bg-gray-800 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

export default GameGrid
