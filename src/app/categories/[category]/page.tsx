'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Gamepad2, Download, Star } from 'lucide-react'
import GameGrid from '@/components/games/GameGrid'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  gameCount: number
  color: string
}

export default function CategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load category
        const categoryRes = await fetch('/data/categories.json')
        const categories: Category[] = await categoryRes.json()
        const foundCategory = categories.find(c => c.slug === params.category)
        setCategory(foundCategory || null)

        // Load games for this category
        const gamesRes = await fetch('/data/games.json')
        const allGames = await gamesRes.json()
        const categoryGames = allGames.filter((game: any) => 
          game.category.toLowerCase() === params.category
        )
        setGames(categoryGames)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.category])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Category not found</h2>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="glass-card p-8 rounded-2xl">
        <Link 
          href="/games" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Games
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`text-4xl ${category.color.replace('from-', 'bg-gradient-to-br from-')} bg-clip-text text-transparent`}>
                {category.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{category.name} Games</h1>
                <p className="text-gray-400 mt-2">{category.description}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold gradient-text">{category.gameCount}</div>
            <div className="text-gray-400">Games Available</div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{games.length}</div>
                <div className="text-sm text-gray-400">Total Games</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {games.reduce((acc, game) => {
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
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {games.length > 0 
                    ? (games.reduce((acc, game) => acc + game.rating, 0) / games.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games in this category */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All {category.name} Games</h2>
          <div className="text-gray-400">
            {games.length} games found
          </div>
        </div>
        <GameGrid />
      </div>

      {/* Related Categories */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">More Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Racing', games: 32, icon: '🏎️' },
            { name: 'Action', games: 67, icon: '🔫' },
            { name: 'Adventure', games: 39, icon: '🗺️' },
            { name: 'Sports', games: 38, icon: '🏀' }
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${cat.name.toLowerCase()}`}
              className="glass-card p-4 text-center hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-white">{cat.name}</div>
              <div className="text-sm text-gray-400">{cat.games} games</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
