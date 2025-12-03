'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  Download, 
  Star, 
  Users, 
  Calendar, 
  Smartphone, 
  Monitor,
  Shield,
  Zap,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

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

export default function GamePage() {
  const params = useParams()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch('/data/games.json')
        const games: Game[] = await response.json()
        const foundGame = games.find(g => g.slug === params.slug)
        setGame(foundGame || null)
      } catch (error) {
        console.error('Error loading game:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [params.slug])

  if (loading) {
    return (
      <div className="glass-card p-8 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-3/4 mb-4" />
        <div className="h-64 bg-gray-800 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-gray-400 hover:text-white mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Games
      </Link>

      {/* Game Header */}
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Game Cover */}
          <div className="md:w-1/3">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-4">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Game Cover</h3>
                <p className="text-sm text-gray-400">Image preview</p>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="md:w-2/3">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-semibold">
                {game.category}
              </span>
              {game.platform.map((platform) => (
                <span 
                  key={platform}
                  className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full text-sm text-gray-300"
                >
                  {platform.toUpperCase()}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{game.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{game.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-4 text-center">
                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2 fill-current" />
                <div className="text-2xl font-bold text-white">{game.rating}</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
              <div className="glass-card p-4 text-center">
                <Users className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{game.downloads}</div>
                <div className="text-sm text-gray-400">Downloads</div>
              </div>
              <div className="glass-card p-4 text-center">
                <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">v{game.version}</div>
                <div className="text-sm text-gray-400">Version</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white">{game.size}</div>
                <div className="text-sm text-gray-400">Size</div>
              </div>
            </div>

            {/* Download Button */}
            <div className="space-y-4">
              <button
                onClick={() => window.open(game.downloadLink, '_blank')}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-3"
              >
                <Download className="h-6 w-6" />
                <span>Download {game.title} Now</span>
              </button>
              
              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Virus Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Fast Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* System Requirements */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Platform Support</h3>
          <div className="space-y-3">
            {game.platform.map((platform) => (
              <div key={platform} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {platform === 'pc' ? (
                    <Monitor className="h-5 w-5 text-cyan-400" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-cyan-400" />
                  )}
                  <span className="font-medium text-white">{platform.toUpperCase()}</span>
                </div>
                <span className="text-sm text-gray-400">Supported</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Details */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Game Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white">{game.updatedAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">File Size</span>
              <span className="text-white">{game.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-white">{game.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category</span>
              <span className="text-white capitalize">{game.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Instructions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">How to Download</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-3">
              <span className="font-bold text-white">1</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Click Download</h4>
            <p className="text-sm text-gray-400">Press the download button above</p>
          </div>
          <div className="text-center p-4">
            <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-3">
              <span className="font-bold text-white">2</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Follow Link</h4>
            <p className="text-sm text-gray-400">You'll be redirected to MediaFire</p>
          </div>
          <div className="text-center p-4">
            <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-3">
              <span className="font-bold text-white">3</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Install & Play</h4>
            <p className="text-sm text-gray-400">Install the game and enjoy!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
