'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageOptimizerProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  fallback?: React.ReactNode
}

const ImageOptimizer = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  fallback
}: ImageOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Generate blur placeholder
  const generateBlurDataURL = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#94a3b8" font-family="system-ui">
          ${alt.substring(0, 10)}...
        </text>
      </svg>
    `)}`
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-800 to-slate-900" />
      )}

      {/* Optimized Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-500 object-cover',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={generateBlurDataURL()}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Error Fallback */}
      {error && !fallback && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-sm text-gray-400">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageOptimizer
