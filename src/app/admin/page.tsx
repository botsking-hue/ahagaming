'use client'

import { useState, useEffect } from 'react'
import { 
  Gamepad2, 
  Download, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Plus,
  Bell,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalGames: number
  totalDownloads: string
  todayDownloads: number
  activeUsers: string
  notificationsSent: number
  featuredGames: number
}

interface RecentActivity {
  id: string
  type: 'game_added' | 'game_updated' | 'notification_sent'
  title: string
  description: string
  time: string
  user: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    totalDownloads: '0',
    todayDownloads: 0,
    activeUsers: '0',
    notificationsSent: 0,
    featuredGames: 0
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load games data
      const gamesRes = await fetch('/data/games.json')
      const games = await gamesRes.json()

      // Load notifications data
      const notifRes = await fetch('/data/notifications.json')
      const notifications = await notifRes.json()

      // Calculate stats
      const totalDownloads = games.reduce((acc: number, game: any) => {
        const match = game.downloads.match(/(\d+(\.\d+)?)([MKBT]?)\+/)
        if (match) {
          const [, numStr, , unit] = match
          let num = parseFloat(numStr)
          if (unit === 'M') num *= 1000000
          if (unit === 'B') num *= 1000000000
          return acc + num
        }
        return acc
      }, 0)

      const featuredGames = games.filter((game: any) => game.featured).length

      setStats({
        totalGames: games.length,
        totalDownloads: totalDownloads > 1000000 
          ? `${(totalDownloads / 1000000).toFixed(1)}M+`
          : totalDownloads > 1000
          ? `${(totalDownloads / 1000).toFixed(1)}K+`
          : `${totalDownloads}+`,
        todayDownloads: Math.floor(Math.random() * 1000) + 100,
        activeUsers: '45.3K',
        notificationsSent: notifications.length,
        featuredGames
      })

      // Generate recent activity
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'game_added',
          title: 'New Game Added',
          description: 'PUBG Mobile v2.8.0 published',
          time: '2 hours ago',
          user: 'Admin'
        },
        {
          id: '2',
          type: 'notification_sent',
          title: 'Notification Sent',
          description: 'WhatsApp channel update sent',
          time: '4 hours ago',
          user: 'System'
        },
        {
          id: '3',
          type: 'game_updated',
          title: 'Game Updated',
          description: 'Subway Surfers metadata updated',
          time: '1 day ago',
          user: 'Admin'
        },
        {
          id: '4',
          type: 'game_added',
          title: 'New Game Added',
          description: 'Genshin Impact added to Adventure',
          time: '2 days ago',
          user: 'Admin'
        }
      ]

      setRecentActivity(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'game_added': return <Plus className="h-4 w-4 text-green-400" />
      case 'game_updated': return <TrendingUp className="h-4 w-4 text-blue-400" />
      case 'notification_sent': return <Bell className="h-4 w-4 text-purple-400" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/games/new"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Game</span>
          </Link>
          <Link
            href="/admin/notifications"
            className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Send Notification</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="text-green-400 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm ml-1">12%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.totalGames}</div>
          <div className="text-gray-400">Total Games</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg">
              <Download className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-green-400 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm ml-1">24%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.totalDownloads}</div>
          <div className="text-gray-400">Total Downloads</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-green-400 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm ml-1">8%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.activeUsers}</div>
          <div className="text-gray-400">Active Users</div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-lg">
              <Bell className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-red-400 flex items-center">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm ml-1">5%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.notificationsSent}</div>
          <div className="text-gray-400">Notifications Sent</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-lg">
              <Download className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.todayDownloads}</div>
              <div className="text-gray-400">Downloads Today</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.featuredGames}</div>
              <div className="text-gray-400">Featured Games</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Link
                href="#"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    <div className="text-xs text-gray-500 mt-2">By {activity.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link
                href="/admin/games/new"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 rounded-lg transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Add New Game</div>
                    <div className="text-sm text-gray-400">Upload game with details</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/notifications"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 rounded-lg transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Send Notification</div>
                    <div className="text-sm text-gray-400">Notify all users</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/games"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 hover:from-purple-500/20 hover:to-pink-600/20 rounded-lg transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <Gamepad2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Manage Games</div>
                    <div className="text-sm text-gray-400">Edit or delete games</div>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-amber-600/10 hover:from-yellow-500/20 hover:to-amber-600/20 rounded-lg transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">View Analytics</div>
                    <div className="text-sm text-gray-400">Track performance</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="glass-card p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Storage</span>
                <span className="text-green-400">75% Used</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Games Database</span>
                <span className="text-green-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Backup</span>
                <span className="text-gray-400">Today, 02:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
