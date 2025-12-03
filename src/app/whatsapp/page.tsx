'use client'

import { MessageCircle, Users, ExternalLink, Bell, TrendingUp } from 'lucide-react'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export default function WhatsAppPage() {
  const { channels, stats, loading, getChannelsByCategory, getPopularChannels } = useWhatsApp()

  const categories = [
    { id: 'updates', name: 'Updates', icon: '📢' },
    { id: 'platform', name: 'Platform', icon: '📱' },
    { id: 'category', name: 'Categories', icon: '🎮' },
    { id: 'deals', name: 'Deals', icon: '🎁' },
    { id: 'support', name: 'Support', icon: '🛠️' }
  ]

  const popularChannels = getPopularChannels(3)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-400">Loading WhatsApp channels...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 rounded-2xl text-center bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Join Our WhatsApp Channels</h1>
          <p className="text-xl text-gray-300 mb-8">
            Get instant updates on new games, updates, and exclusive deals directly on WhatsApp
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="text-3xl font-bold gradient-text">{stats.totalChannels}</div>
              <div className="text-gray-400">Active Channels</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold gradient-text">
                {(stats.totalMembers / 1000).toFixed(1)}K+
              </div>
              <div className="text-gray-400">Total Members</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold gradient-text">{stats.mostPopular}</div>
              <div className="text-gray-400">Most Popular</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-green-400" />
                <span>Instant notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>Exclusive updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-400" />
                <span>Join thousands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Channels */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-400" />
            Most Popular Channels
          </h2>
          <div className="text-gray-400">
            Join {popularChannels.reduce((sum, channel) => sum + parseInt(channel.members.replace('K', '')), 0)}K+ gamers
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularChannels.map((channel) => (
            <div key={channel.id} className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{channel.icon}</div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                  {channel.members} members
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{channel.name}</h3>
              <p className="text-gray-400 mb-6">{channel.description}</p>
              <div className="space-y-3">
                <a
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Join Channel</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channels by Category */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Browse Channels by Category</h2>
        
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryChannels = getChannelsByCategory(category.id)
            
            if (categoryChannels.length === 0) return null

            return (
              <div key={category.id} className="glass-card p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <p className="text-gray-400">{categoryChannels.length} channels</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryChannels.map((channel) => (
                    <div key={channel.id} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{channel.icon}</div>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {channel.members}
                        </span>
                      </div>
                      <h4 className="font-medium text-white mb-2">{channel.name}</h4>
                      <p className="text-sm text-gray-400 mb-4">{channel.description}</p>
                      <a
                        href={channel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-400 hover:text-green-300"
                      >
                        Join Channel
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Channels */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">All WhatsApp Channels</h2>
        
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{channel.icon}</div>
                <div>
                  <h4 className="font-medium text-white">{channel.name}</h4>
                  <p className="text-sm text-gray-400">{channel.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">{channel.category}</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      {channel.members} members
                    </span>
                  </div>
                </div>
              </div>
              <a
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:opacity-90 transition"
              >
                Join
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center glass-card p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Join?</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Join our WhatsApp channels now and never miss an update. Get instant notifications for new games, updates, and exclusive deals.
        </p>
        <div className="space-x-4">
          <WhatsAppButton variant="inline" />
          <a
            href="/notifications"
            className="btn-secondary"
          >
            Enable Browser Notifications
          </a>
        </div>
      </div>
    </div>
  )
}
