'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

const GlobalNotification = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [notification, setNotification] = useState<any>(null)
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Show notification on first visit
    const hasSeenNotification = localStorage.getItem('hasSeenGlobalNotification')
    
    if (!hasSeenNotification) {
      setTimeout(() => {
        setNotification({
          title: 'Join Our WhatsApp Channels! 📲',
          message: 'Get instant updates when new games are added',
          type: 'whatsapp',
          icon: '💬'
        })
        setIsVisible(true)
        localStorage.setItem('hasSeenGlobalNotification', 'true')
      }, 3000)
    }

    // Listen for game updates (simulated)
    const interval = setInterval(() => {
      const shouldShow = Math.random() > 0.7 // 30% chance
      if (shouldShow && !isVisible) {
        const notifications = [
          {
            title: 'New Game Alert! 🎮',
            message: 'Check out our latest game additions',
            type: 'new_game',
            icon: '🎮'
          },
          {
            title: 'Game Updated ⚡',
            message: 'Popular games have been updated',
            type: 'update',
            icon: '⚡'
          },
          {
            title: 'Join WhatsApp Channel 💬',
            message: 'Never miss an update',
            type: 'whatsapp',
            icon: '💬'
          }
        ]
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
        setNotification(randomNotification)
        setIsVisible(true)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setNotification(null), 300)
  }

  const handleAction = () => {
    if (notification.type === 'whatsapp') {
      window.open('/whatsapp', '_blank')
    } else if (notification.type === 'new_game') {
      window.open('/games?sort=newest', '_blank')
    } else if (notification.type === 'update') {
      window.open('/notifications', '_blank')
    }
    handleClose()
  }

  if (!isVisible || !notification) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="glass-card p-4 rounded-2xl shadow-2xl border border-white/10">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">{notification.icon}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-white">{notification.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={handleClose}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mt-3">
              <button
                onClick={handleAction}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium rounded-lg hover:opacity-90 transition"
              >
                {notification.type === 'whatsapp' ? 'Join Now' : 
                 notification.type === 'new_game' ? 'View Games' : 'See Updates'}
              </button>
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalNotification
