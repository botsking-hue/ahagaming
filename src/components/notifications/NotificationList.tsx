'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationItem from './NotificationItem'

const NotificationList = () => {
  const { notifications, loading, markAllAsRead } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('unread')

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' ? true : !notification.read
  )

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_game': return '🎮'
      case 'update': return '⚡'
      case 'announcement': return '📢'
      case 'whatsapp': return '💬'
      case 'maintenance': return '⚙️'
      default: return '🔔'
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="mt-2 text-sm text-gray-400">Loading notifications...</p>
      </div>
    )
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-white font-medium">All caught up!</p>
        <p className="text-sm text-gray-400 mt-1">No notifications to show</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Filter Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-3 text-sm font-medium ${filter === 'unread' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 text-sm font-medium ${filter === 'all' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}
        >
          All
        </button>
      </div>

      {/* Notifications */}
      <div className="divide-y divide-white/5">
        {filteredNotifications.slice(0, 5).map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>

      {/* Show More */}
      {filteredNotifications.length > 5 && (
        <div className="p-3 text-center border-t border-white/10">
          <span className="text-xs text-gray-400">
            +{filteredNotifications.length - 5} more notifications
          </span>
        </div>
      )}
    </div>
  )
}

export default NotificationList
