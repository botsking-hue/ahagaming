'use client'

import { Check, ExternalLink, X } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import Link from 'next/link'

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    icon: string
    gameSlug?: string
    category?: string
    link?: string
    timestamp: string
    read: boolean
  }
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead, deleteNotification } = useNotifications()

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Handle navigation based on notification type
    if (notification.gameSlug) {
      window.location.href = `/games/${notification.gameSlug}`
    } else if (notification.category) {
      window.location.href = `/categories/${notification.category}`
    } else if (notification.link) {
      window.open(notification.link, '_blank', 'noopener,noreferrer')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_game': return 'bg-gradient-to-r from-green-500/20 to-emerald-600/20'
      case 'update': return 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20'
      case 'announcement': return 'bg-gradient-to-r from-purple-500/20 to-pink-600/20'
      case 'whatsapp': return 'bg-gradient-to-r from-green-500/20 to-emerald-600/20'
      case 'maintenance': return 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20'
      default: return 'bg-white/5'
    }
  }

  return (
    <div 
      className={`p-4 transition-all ${!notification.read ? 'bg-gradient-to-r from-cyan-500/5 to-blue-600/5' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
          <span className="text-lg">{notification.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
              title="Delete notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {formatTime(notification.timestamp)}
            </span>
            
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center"
                  title="Mark as read"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark read
                </button>
              )}
              
              {(notification.gameSlug || notification.category || notification.link) && (
                <button
                  onClick={handleClick}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center"
                >
                  {notification.link ? 'Open link' : 'View details'}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
