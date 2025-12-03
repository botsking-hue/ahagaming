'use client'

import { Bell, Check, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationList from './NotificationList'

const NotificationBell = () => {
  const { unreadCount, markAllAsRead, requestNotificationPermission } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = () => {
    setIsOpen(!isOpen)
    setShowSettings(false)
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowSettings(!showSettings)
  }

  const enableBrowserNotifications = () => {
    requestNotificationPermission()
    setShowSettings(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-gradient-to-r from-red-500 to-pink-600 text-xs font-bold text-white rounded-full animate-pulse-glow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 glass-card rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Notifications</h3>
                <p className="text-xs text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleSettingsClick}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings ? (
            <div className="p-4 space-y-4">
              <h4 className="font-medium text-white">Notification Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white text-sm">Browser Notifications</div>
                    <div className="text-xs text-gray-400">Get alerts for new games</div>
                  </div>
                  <button
                    onClick={enableBrowserNotifications}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-medium rounded-lg hover:opacity-90 transition"
                  >
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white text-sm">Email Notifications</div>
                    <div className="text-xs text-gray-400">Receive weekly updates</div>
                  </div>
                  <div className="text-xs text-gray-400">Coming Soon</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white text-sm">WhatsApp Updates</div>
                    <div className="text-xs text-gray-400">Join our channels</div>
                  </div>
                  <a
                    href="/whatsapp"
                    className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-xs font-medium rounded-lg hover:opacity-90 transition"
                  >
                    Join
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Notifications List */
            <NotificationList />
          )}

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-600/5">
            <a
              href="/notifications"
              className="block text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              View all notifications →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
