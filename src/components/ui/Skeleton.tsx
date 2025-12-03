import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave'
  width?: string
  height?: string
}

const Skeleton = ({ 
  className, 
  variant = 'text',
  animation = 'pulse',
  width,
  height
}: SkeletonProps) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer'
  }

  const style = {
    width,
    height
  }

  return (
    <div
      className={cn(
        'bg-white/10',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}

export default Skeleton
