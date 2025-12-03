'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useWhatsApp } from '@/hooks/useWhatsApp'

interface WhatsAppButtonProps {
  variant?: 'floating' | 'inline'
  channelId?: string
}

const WhatsAppButton = ({ variant = 'floating', channelId }: WhatsAppButtonProps) => {
  const { channels, joinChannel, loading } = useWhatsApp()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    if (channelId) {
      joinChannel(channelId)
    } else {
      // Default to first channel
      const defaultChannel = channels[0]
      if (defaultChannel) {
        window.open(defaultChannel.link, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const getChannelName = () => {
    if (channelId) {
      const channel = channels.find(c => c.id === channelId)
      return channel?.name || 'WhatsApp'
    }
    return 'Join WhatsApp'
  }

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative flex items-center justify-center"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Button */}
          <div className="relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95">
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Join WhatsApp</span>
          </div>

          {/* Tooltip */}
          {isHovering && (
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2">
              <div className="glass-card px-4 py-2 rounded-lg whitespace-nowrap">
                <p className="text-sm font-medium text-white">Get instant updates</p>
                <p className="text-xs text-gray-400">Join our channels</p>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1">
                <div className="w-2 h-2 bg-white/10 backdrop-blur-sm rotate-45"></div>
              </div>
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95"
      disabled={loading}
    >
      <MessageCircle className="h-4 w-4" />
      <span>{loading ? 'Loading...' : getChannelName()}</span>
    </button>
  )
}

export default WhatsAppButton
