'use client'

import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
  id: string
}

const Toast = ({ 
  message, 
  type = 'info',
  duration = 5000,
  onClose,
  id 
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const typeConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-green-400'
    },
    error: {
      icon: <XCircle className="h-5 w-5" />,
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      text: 'text-red-400'
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5" />,
      bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
      text: 'text-yellow-400'
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      bg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      text: 'text-cyan-400'
    }
  }

  const config = typeConfig[type]

  return (
    <div
      id={id}
      className={cn(
        'glass-card rounded-lg shadow-lg overflow-hidden mb-2 animate-slide-in-up',
        isExiting && 'animate-slide-in-down opacity-0'
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg', config.bg)}>
            {config.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <div
          className={cn('h-full', config.bg)}
          style={{
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  )
}

export default Toast
