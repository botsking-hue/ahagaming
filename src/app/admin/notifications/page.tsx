'use client'

import { useState, useEffect } from 'react'
import { Send, Bell, History, BarChart3, Calendar, Users } from 'lucide-react'
import NotificationForm from '@/components/admin/NotificationForm'

interface NotificationStats {
  totalSent: number
  todaySent: number
  readRate: number
  clickRate: number
  topType: string
}

interface NotificationHistory {
  id: string
  type: string
  title: string
  sentAt: string
  recipients: number
  readCount: number
  status: 'sent' | 'failed' | 'scheduled'
}

export default function NotificationsPage() {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    todaySent: 0,
    readRate: 0,
    clickRate: 0,
    topType: 'announcement'
  })

  const [history, setHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      type: 'new_game',
      title: 'New Game: PUBG Mobile',
      sentAt: '2024-01-20 10:30',
      recipients: 15000,
      readCount: 12000,
      status: 'sent'
    },
    {
      id: '2',
      type: 'announcement',
      title: 'Site Maintenance',
      sentAt: '2024-01-19 14:00',
      recipients: 20000,
      readCount: 18000,
      status: 'sent'
    },
    {
      id: '3',
      type: 'whatsapp',
      title: 'Join WhatsApp Channel',
      sentAt: '2024-01-18 09:15',
      recipients: 25000,
      readCount: 22000,
      status: 'sent'
    },
    {
      id: '4',
      type: 'update',
      title: 'Game Updates Available',
      sentAt: '2024-01-17 16:45',
      recipients: 18000,
      readCount: 15000,
      status: 'sent'
    }
  ])

  const handleSendNotification = (data: any) => {
    alert('Notification sent successfully!')
    console.log('Notification data:', data)
    
    // Add to history
    const newNotification: NotificationHistory = {
      id: Date.now().toString(),
      type: data.type,
      title: data.title,
      sentAt: new Date().toLocaleString(),
      recipients: Math.floor(Math.random() * 20000) + 10000,
      readCount: Math.floor(Math.random() * 15000) + 8000,
      status: 'sent'
    }
    
    setHistory(prev => [newNotification, ...prev])
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalSent: prev.totalSent + 1,
      todaySent: prev.todaySent + 1
    }))
    
    setShowForm(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_game': return 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400'
      case 'update': return 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-400'
      case 'announcement': return 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-400'
      case 'whatsapp': return 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400'
      case 'maintenance': return 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20 text-yellow-400'
      default: return 'bg-white/5 text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'scheduled': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400">Send updates and announcements to users</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Send Notification</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
              <Bell className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalSent}</div>
              <div className="text-gray-400">Total Sent</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg">
              <Calendar className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.todaySent}</div>
              <div className="text-gray-400">Today</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.readRate}%</div>
              <div className="text-gray-400">Read Rate</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-lg">
              <Bell className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.clickRate}%</div>
              <div className="text-gray-400">Click Rate</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white capitalize">{stats.topType}</div>
              <div className="text-gray-400">Top Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Form */}
      {showForm && (
        <div className="glass-card p-6">
          <NotificationForm
            onSend={handleSendNotification}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* History */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Notification History</h2>
          </div>
          <div className="text-sm text-gray-400">
            {history.length} notifications sent
          </div>
        </div>

        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full ${getTypeColor(item.type)}`}>
                    <span className="text-sm capitalize">{item.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <div className="text-sm text-gray-400 mt-1">
                      Sent: {item.sentAt}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm text-white">{item.recipients.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Recipients</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{item.readCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Read</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                    <div className="text-xs text-gray-400">Status</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Templates */}
      {!showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setShowForm(true)
                // Pre-fill form with template
              }}
              className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 rounded-lg text-left transition"
            >
              <div className="text-green-400 font-medium mb-2">New Game Alert</div>
              <div className="text-sm text-gray-400">Announce new game releases</div>
            </button>
            
            <button
              onClick={() => setShowForm(true)}
              className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 hover:from-blue-500/20 hover:to-indigo-600/20 rounded-lg text-left transition"
            >
              <div className="text-blue-400 font-medium mb-2">Update Available</div>
              <div className="text-sm text-gray-400">Notify about game updates</div>
            </button>
            
            <button
              onClick={() => setShowForm(true)}
              className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 hover:from-purple-500/20 hover:to-pink-600/20 rounded-lg text-left transition"
            >
              <div className="text-purple-400 font-medium mb-2">WhatsApp Channel</div>
              <div className="text-sm text-gray-400">Promote WhatsApp channels</div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
