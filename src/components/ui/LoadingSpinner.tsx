'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gradient'
  className?: string
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'border-cyan-500',
    white: 'border-white',
    gradient: 'border-transparent border-t-cyan-500 border-r-blue-600 border-b-purple-500'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'rounded-full border-2 animate-spin',
        sizeClasses[size],
        colorClasses[color]
      )} />
    </div>
  )
}

export default LoadingSpinner
