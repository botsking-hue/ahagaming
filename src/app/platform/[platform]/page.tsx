'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Smartphone, Monitor, Download, Star } from 'lucide-react'
import GameGrid from '@/components/games/GameGrid'

interface Platform {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  gameCount: number
  color: string
}

export default function PlatformPage() {
  const params = useParams()
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load platform
        const platformRes = await fetch('/data/platforms.json')
        const platforms: Platform[] = await platformRes.json()
        const foundPlatform = platforms.find(p => p.slug === params.platform)
        setPlatform(foundPlatform || null)

        // Load games for this platform
        const gamesRes = await fetch('/data/games.json')
        const allGames = await gamesRes.json()
        const platformGames = allGames.filter((game: any) => 
          game.platform.includes(params.platform)
        )
        setGames(platformGames)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.platform])

  const getPlatformIcon = () => {
    switch (platform?.id) {
      case 'android': return <Smartphone className="h-12 w-12 text-green-400" />
      case 'ios': return <Smartphone className="h-12 w-12 text-gray-400" />
      case 'pc': return <Monitor className="h-12 w-12 text-blue-400" />
      default: return <Smartphone className="h-12 w-12" />
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!platform) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Platform not found</h2>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Platform Header */}
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
              <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
                {getPlatformIcon()}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{platform.name} Games</h1>
                <p className="text-gray-400 mt-2">{platform.description}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold gradient-text">{platform.gameCount}</div>
            <div className="text-gray-400">Games Available</div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <span className="text-2xl">{platform.icon}</span>
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

      {/* Games for this platform */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All {platform.name} Games</h2>
          <div className="text-gray-400">
            {games.length} games found
          </div>
        </div>
        <GameGrid />
      </div>

      {/* Platform Comparison */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Other Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Android', games: 156, icon: '📱', color: 'from-green-500 to-emerald-600' },
            { name: 'iOS', games: 89, icon: '📱', color: 'from-gray-500 to-gray-700' },
            { name: 'PC', games: 124, icon: '💻', color: 'from-blue-500 to-indigo-600' }
          ]
          .filter(p => p.name !== platform.name)
          .map((plat) => (
            <Link
              key={plat.name}
              href={`/platform/${plat.name.toLowerCase()}`}
              className={`glass-card p-6 text-center hover:scale-105 transition-transform bg-gradient-to-br ${plat.color} bg-opacity-10`}
            >
              <div className={`text-4xl mb-4 bg-gradient-to-br ${plat.color} bg-clip-text text-transparent`}>
                {plat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{plat.name}</div>
              <div className="text-gray-300">{plat.games} games available</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
