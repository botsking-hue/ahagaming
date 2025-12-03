'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  text: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

const Tooltip = ({ 
  text, 
  children, 
  position = 'top',
  delay = 200,
  className 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top
    })
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
    left: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
    right: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg glass-card whitespace-nowrap',
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {text}
          <div className={cn(
            'absolute w-2 h-2 bg-gray-900 rotate-45',
            arrowClasses[position]
          )} />
        </div>
      )}
    </div>
  )
}

export default Tooltip
