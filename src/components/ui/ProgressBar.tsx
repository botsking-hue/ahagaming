'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const ProgressBar = ({
  value,
  max = 100,
  showLabel = true,
  color = 'primary',
  size = 'md',
  animated = false,
  className
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Progress</span>
          <span className="font-medium text-white">{percentage.toFixed(0)}%</span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-white/10 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color],
            animated && 'animate-shimmer'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
