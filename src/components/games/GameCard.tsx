'use client'

import { Download, Star, Users, Smartphone, Monitor } from 'lucide-react'
import Link from 'next/link'
import { useLazyLoad } from '@/hooks/useLazyLoad'
import { useState } from 'react'

interface GameCardProps {
  game: {
    id: string
    slug: string
    title: string
    category: string
    platform: string[]
    cover: string
    description: string
    size: string
    rating: number
    downloads: string
  }
}

const GameCard = ({ game }: GameCardProps) => {
  const [ref, isVisible] = useLazyLoad<HTMLDivElement>()
  const [imageLoaded, setImageLoaded] = useState(false)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'android':
        return <Smartphone className="h-4 w-4" />
      case 'ios':
        return <Smartphone className="h-4 w-4" />
      case 'pc':
        return <Monitor className="h-4 w-4" />
      default:
        return <Smartphone className="h-4 w-4" />
    }
  }

  return (
    <Link href={`/games/${game.slug}`} prefetch={false}>
      <div 
        ref={ref}
        className="glass-card game-card-hover overflow-hidden h-full"
      >
        {/* Game Cover with Lazy Load */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
          {isVisible && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* In production, use next/image with placeholder */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl">🎮</span>
                  <div className="mt-2 text-sm text-gray-400">Game Cover</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-700 to-gray-800" />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold rounded-full">
              {game.category}
            </span>
          </div>
          
          {/* Platform Badges */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {game.platform.map((platform) => (
              <div
                key={platform}
                className="p-1.5 bg-black/40 backdrop-blur-sm rounded-lg"
                title={platform.toUpperCase()}
              >
                {getPlatformIcon(platform)}
              </div>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {game.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{game.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-gray-400">{game.downloads}</span>
            </div>
            <div className="text-sm text-gray-400">
              {game.size}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              window.open(`/api/download?game=${game.slug}`, '_blank')
            }}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Now</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
