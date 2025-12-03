'use client'

import { useState, useEffect } from 'react'
import { Send, Bell, Gamepad2, Megaphone, Wrench, MessageCircle } from 'lucide-react'

interface NotificationFormData {
  type: 'new_game' | 'update' | 'announcement' | 'whatsapp' | 'maintenance'
  title: string
  message: string
  gameSlug: string
  category: string
  link: string
  sendToWhatsApp: boolean
  sendAsBrowserNotification: boolean
}

interface NotificationFormProps {
  onSend: (data: NotificationFormData) => void
  onCancel: () => void
}

const NotificationForm = ({ onSend, onCancel }: NotificationFormProps) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    type: 'announcement',
    title: '',
    message: '',
    gameSlug: '',
    category: '',
    link: '',
    sendToWhatsApp: true,
    sendAsBrowserNotification: true
  })

  const [games, setGames] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load games for dropdown
    fetch('/data/games.json')
      .then(res => res.json())
      .then(setGames)

    // Load categories
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(setCategories)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_game': return <Gamepad2 className="h-5 w-5" />
      case 'update': return <Bell className="h-5 w-5" />
      case 'announcement': return <Megaphone className="h-5 w-5" />
      case 'whatsapp': return <MessageCircle className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_game': return 'from-green-500 to-emerald-600'
      case 'update': return 'from-blue-500 to-indigo-600'
      case 'announcement': return 'from-purple-500 to-pink-600'
      case 'whatsapp': return 'from-green-500 to-emerald-600'
      case 'maintenance': return 'from-yellow-500 to-amber-600'
      default: return 'from-cyan-500 to-blue-600'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in title and message')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSend(formData)
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillSampleData = (type: NotificationFormData['type']) => {
    const samples = {
      new_game: {
        title: 'New Game Added! 🎮',
        message: 'Check out our latest game addition with amazing features',
        gameSlug: games[0]?.slug || ''
      },
      update: {
        title: 'Game Updated ⚡',
        message: 'Important updates and bug fixes for popular games',
        gameSlug: games[1]?.slug || ''
      },
      announcement: {
        title: 'Important Announcement 📢',
        message: 'We have important news about upcoming features',
        link: '/games'
      },
      whatsapp: {
        title: 'Join Our WhatsApp Channel 💬',
        message: 'Never miss an update by joining our WhatsApp channel',
        link: '/whatsapp'
      },
      maintenance: {
        title: 'Scheduled Maintenance 🔧',
        message: 'Site maintenance scheduled for this weekend',
        link: ''
      }
    }

    setFormData(prev => ({
      ...prev,
      type,
      ...samples[type]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Send Notification</h3>
          <p className="text-sm text-gray-400">Notify users about updates and new games</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-gradient-to-r ${getTypeColor(formData.type)} text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Sending...' : 'Send Notification'}</span>
          </button>
        </div>
      </div>

      {/* Notification Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Notification Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['new_game', 'update', 'announcement', 'whatsapp', 'maintenance'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, type: type as any }))
                fillSampleData(type as any)
              }}
              className={`p-4 rounded-lg transition ${formData.type === type ? `bg-gradient-to-r ${getTypeColor(type)} text-white` : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center space-y-2">
                {getTypeIcon(type)}
                <span className="text-xs capitalize">{type.replace('_', ' ')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Title & Message */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            placeholder="Enter notification title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            placeholder="Enter notification message"
          />
        </div>
      </div>

      {/* Game & Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Related Game
          </label>
          <select
            name="gameSlug"
            value={formData.gameSlug}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="">Select a game (optional)</option>
            {games.map((game) => (
              <option key={game.id} value={game.slug}>
                {game.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Related Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="">Select a category (optional)</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Action Link (optional)
        </label>
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          placeholder="https://example.com"
        />
      </div>

      {/* Delivery Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Delivery Options</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
            <input
              type="checkbox"
              name="sendToWhatsApp"
              checked={formData.sendToWhatsApp}
              onChange={handleChange}
              className="h-5 w-5 text-green-500 bg-white/5 border-white/10 rounded focus:ring-green-500 mt-1"
            />
            <div>
              <div className="font-medium text-white">Send to WhatsApp</div>
              <div className="text-sm text-gray-400 mt-1">
                Share this notification to all WhatsApp channels
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
            <input
              type="checkbox"
              name="sendAsBrowserNotification"
              checked={formData.sendAsBrowserNotification}
              onChange={handleChange}
              className="h-5 w-5 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500 mt-1"
            />
            <div>
              <div className="font-medium text-white">Browser Notifications</div>
              <div className="text-sm text-gray-400 mt-1">
                Send push notifications to users with permission
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>
        <div className={`p-4 rounded-lg bg-gradient-to-r ${getTypeColor(formData.type)} bg-opacity-10 border ${getTypeColor(formData.type).replace('from-', 'border-').replace('to-', 'border-').split(' ')[0]}`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(formData.type)}`}>
              {getTypeIcon(formData.type)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">
                {formData.title || 'Notification Title'}
              </div>
              <div className="text-sm text-gray-300">
                {formData.message || 'Notification message will appear here...'}
              </div>
              {(formData.gameSlug || formData.link) && (
                <div className="mt-3">
                  <div className="text-xs text-gray-400">
                    Action: {formData.gameSlug ? `View game` : formData.link ? 'Open link' : 'None'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default NotificationForm
