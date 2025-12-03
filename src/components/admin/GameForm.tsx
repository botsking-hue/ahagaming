'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

interface GameFormData {
  id?: string
  slug: string
  title: string
  category: string
  platform: string[]
  cover: string
  description: string
  downloadLink: string
  size: string
  version: string
  rating: number
  downloads: string
  featured: boolean
  status: 'draft' | 'published'
}

interface GameFormProps {
  initialData?: GameFormData
  onSave: (data: GameFormData) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

const GameForm = ({ initialData, onSave, onCancel, mode }: GameFormProps) => {
  const [formData, setFormData] = useState<GameFormData>({
    slug: '',
    title: '',
    category: 'arcade',
    platform: ['android'],
    cover: '',
    description: '',
    downloadLink: '',
    size: '',
    version: '',
    rating: 4.5,
    downloads: '1M+',
    featured: false,
    status: 'draft'
  })

  const [categories, setCategories] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }

    // Load categories
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(setCategories)
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => {
      const newPlatforms = prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
      return { ...prev, platform: newPlatforms }
    })
  }

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.downloadLink.trim()) newErrors.downloadLink = 'Download link is required'
    if (!formData.size.trim()) newErrors.size = 'Size is required'
    if (!formData.version.trim()) newErrors.version = 'Version is required'
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be between 0-5'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const finalData = {
        ...formData,
        id: mode === 'edit' ? formData.id : Date.now().toString(),
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      onSave(finalData)
    } catch (error) {
      console.error('Error saving game:', error)
      alert('Failed to save game. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Add New Game' : 'Edit Game'}
          </h3>
          <p className="text-sm text-gray-400">
            {mode === 'create' ? 'Fill in the details below to add a new game' : 'Update game information'}
          </p>
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
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Game'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/5 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                placeholder="e.g., Subway Surfers"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL Slug *
                <button
                  type="button"
                  onClick={generateSlug}
                  className="ml-2 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Generate
                </button>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/5 border ${errors.slug ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                placeholder="e.g., subway-surfers"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-2 bg-white/5 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
              placeholder="Describe the game..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          {/* Download Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Download Link *
              <span className="ml-2 text-xs text-gray-500">(MediaFire, Google Drive, etc.)</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="url"
                name="downloadLink"
                value={formData.downloadLink}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-white/5 border ${errors.downloadLink ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                placeholder="https://mediafire.com/..."
              />
            </div>
            {errors.downloadLink && <p className="mt-1 text-sm text-red-400">{errors.downloadLink}</p>}
          </div>

          {/* Size & Version */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Size *
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/5 border ${errors.size ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                placeholder="e.g., 150 MB"
              />
              {errors.size && <p className="mt-1 text-sm text-red-400">{errors.size}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Version *
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/5 border ${errors.version ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
                placeholder="e.g., 1.0.0"
              />
              {errors.version && <p className="mt-1 text-sm text-red-400">{errors.version}</p>}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Settings */}
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Platform *
            </label>
            <div className="space-y-2">
              {['android', 'ios', 'pc'].map((platform) => (
                <label key={platform} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={formData.platform.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="h-4 w-4 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
                  />
                  <span className="text-gray-300 capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating & Downloads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className={`w-full px-4 py-2 bg-white/5 border ${errors.rating ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
              />
              {errors.rating && <p className="mt-1 text-sm text-red-400">{errors.rating}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Downloads
              </label>
              <input
                type="text"
                name="downloads"
                value={formData.downloads}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="e.g., 1M+"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Cover Image URL
            </label>
            <div className="space-y-3">
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                  placeholder="/images/games/example.jpg"
                />
              </div>
              
              {/* Image Preview */}
              {formData.cover && (
                <div className="mt-2">
                  <div className="text-xs text-gray-400 mb-1">Preview:</div>
                  <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Image will appear here</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium text-white">Featured Game</div>
                <div className="text-sm text-gray-400">Show on homepage</div>
              </div>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-5 w-5 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium text-white">Publish Now</div>
                <div className="text-sm text-gray-400">Make game visible</div>
              </div>
              <input
                type="checkbox"
                name="status"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.checked ? 'published' : 'draft'
                }))}
                className="h-5 w-5 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            // Fill with sample data for testing
            setFormData({
              slug: 'sample-game',
              title: 'Sample Game',
              category: 'arcade',
              platform: ['android'],
              cover: '/images/games/sample.jpg',
              description: 'A sample game description',
              downloadLink: 'https://mediafire.com/sample',
              size: '100 MB',
              version: '1.0.0',
              rating: 4.5,
              downloads: '1M+',
              featured: false,
              status: 'draft'
            })
          }}
          className="text-sm text-gray-400 hover:text-white"
        >
          Fill Sample Data
        </button>
        <button
          type="button"
          onClick={() => setFormData({
            slug: '',
            title: '',
            category: 'arcade',
            platform: ['android'],
            cover: '',
            description: '',
            downloadLink: '',
            size: '',
            version: '',
            rating: 4.5,
            downloads: '1M+',
            featured: false,
            status: 'draft'
          })}
          className="text-sm text-gray-400 hover:text-white"
        >
          Clear Form
        </button>
      </div>
    </form>
  )
}

export default GameForm
