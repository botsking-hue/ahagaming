'use client'

import { useState, useEffect } from 'react'

interface WhatsAppChannel {
  id: string
  name: string
  description: string
  members: string
  link: string
  icon: string
  category: string
}

export function useWhatsApp() {
  const [channels, setChannels] = useState<WhatsAppChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalChannels: 0,
    totalMembers: 0,
    mostPopular: ''
  })

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      const response = await fetch('/data/whatsapp-channels.json')
      const data: WhatsAppChannel[] = await response.json()
      setChannels(data)
      
      // Calculate stats
      const totalMembers = data.reduce((sum, channel) => {
        const members = parseInt(channel.members.replace('K', '000')) || 0
        return sum + members
      }, 0)
      
      const mostPopular = data.reduce((max, channel) => {
        const maxMembers = parseInt(max.members.replace('K', '000')) || 0
        const channelMembers = parseInt(channel.members.replace('K', '000')) || 0
        return channelMembers > maxMembers ? channel : max
      }, data[0])
      
      setStats({
        totalChannels: data.length,
        totalMembers,
        mostPopular: mostPopular?.name || ''
      })
    } catch (error) {
      console.error('Error loading WhatsApp channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId)
    if (channel) {
      window.open(channel.link, '_blank', 'noopener,noreferrer')
      
      // Track join (in a real app, you'd send to analytics)
      console.log(`User joined WhatsApp channel: ${channel.name}`)
    }
  }

  const getChannelsByCategory = (category: string) => {
    return channels.filter(channel => channel.category === category)
  }

  const getPopularChannels = (limit = 3) => {
    return [...channels]
      .sort((a, b) => {
        const aMembers = parseInt(a.members.replace('K', '000')) || 0
        const bMembers = parseInt(b.members.replace('K', '000')) || 0
        return bMembers - aMembers
      })
      .slice(0, limit)
  }

  return {
    channels,
    loading,
    stats,
    joinChannel,
    getChannelsByCategory,
    getPopularChannels,
    refresh: loadChannels
  }
}
