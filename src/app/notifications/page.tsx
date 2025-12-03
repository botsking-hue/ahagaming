'use client'

import { Bell, Settings, Check, Trash2, Filter } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationItem from '@/components/notifications/NotificationItem'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    clearAll,
    requestNotificationPermission 
  } = useNotifications()
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'new_game' | 'update'>('all')
  const [showSettings, setShowSettings] = useState(false)

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const getStats = () => {
    const total = notifications.length
    const unread = notifications.filter(n => !n.read).length
    const newGames = notifications.filter(n => n.type === 'new_game').length
    const updates = notifications.filter(n => n.type === 'update').length

    return { total, unread, newGames, updates }
  }

  const stats = getStats()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400 mt-2">
                Stay updated with new games and announcements
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <WhatsAppButton variant="inline" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stats.unread}</div>
            <div className="text-sm text-gray-400">Unread</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stats.newGames}</div>
            <div className="text-sm text-gray-400">New Games</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stats.updates}</div>
            <div className="text-sm text-gray-400">Updates</div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Notification Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">Browser Notifications</div>
                <div className="text-sm text-gray-400 mt-1">
                  Get desktop notifications for important updates
                </div>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:opacity-90 transition"
              >
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">WhatsApp Updates</div>
                <div className="text-sm text-gray-400 mt-1">
                  Join our WhatsApp channels for instant updates
                </div>
              </div>
              <a
                href="/whatsapp"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition"
              >
                Join Channels
              </a>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">Email Notifications</div>
                <div className="text-sm text-gray-400 mt-1">
                  Receive weekly game updates via email
                </div>
              </div>
              <div className="text-sm text-gray-400">Coming Soon</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-white">Filter Notifications</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300"
              >
                <Check className="h-4 w-4" />
                <span>Mark all as read</span>
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'unread', label: 'Unread', count: stats.unread },
            { id: 'new_game', label: 'New Games', count: stats.newGames },
            { id: 'update', label: 'Updates', count: stats.updates },
            { id: 'announcement', label: 'Announcements', count: notifications.filter(n => n.type === 'announcement').length },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-4 py-2 rounded-lg transition ${filter === filterOption.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                  {filterOption.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {filter === 'all' ? 'All Notifications' : 
             filter === 'unread' ? 'Unread Notifications' :
             filter === 'new_game' ? 'New Game Alerts' :
             'Game Updates'}
          </h2>
          <span className="text-gray-400">
            {filteredNotifications.length} items
          </span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-400 mb-6">
              {filter === 'unread' 
                ? 'You have no unread notifications'
                : 'No notifications match your filter'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="btn-primary"
              >
                View All Notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="glass-card rounded-2xl overflow-hidden">
                <NotificationItem notification={notification} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp CTA */}
      <div className="glass-card p-8 rounded-2xl text-center bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Don't Miss Any Updates!
          </h3>
          <p className="text-gray-300 mb-6">
            Join our WhatsApp channels to get instant notifications when new games are added
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/whatsapp"
              className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              View All Channels
            </a>
            <button
              onClick={requestNotificationPermission}
              className="btn-secondary"
            >
              Enable Browser Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
