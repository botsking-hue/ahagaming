'use client'

import { Filter, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const GameFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    platform: '',
    sort: 'newest'
  })

  useEffect(() => {
    // Load categories
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(setCategories)
    
    // Load platforms
    fetch('/data/platforms.json')
      .then(res => res.json())
      .then(setPlatforms)

    // Get filters from URL
    const category = searchParams.get('category') || ''
    const platform = searchParams.get('platform') || ''
    const sort = searchParams.get('sort') || 'newest'
    
    setSelectedFilters({ category, platform, sort })
  }, [searchParams])

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...selectedFilters, [type]: value }
    setSelectedFilters(newFilters)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedFilters({ category: '', platform: '', sort: 'newest' })
    router.push(pathname)
  }

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between btn-secondary mb-4"
      >
        <span className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(selectedFilters.category || selectedFilters.platform) && (
            <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-xs rounded-full">
              Active
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Games
            </h3>
            {(selectedFilters.category || selectedFilters.platform) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Category
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${!selectedFilters.category ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange('category', category.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center justify-between ${selectedFilters.category === category.slug ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded">
                      {category.gameCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Platform
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange('platform', '')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${!selectedFilters.platform ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                >
                  All Platforms
                </button>
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleFilterChange('platform', platform.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center justify-between ${selectedFilters.platform === platform.slug ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{platform.icon}</span>
                      {platform.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded">
                      {platform.gameCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Sort By
              </label>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'rating', label: 'Highest Rating' },
                  { value: 'name', label: 'Name A-Z' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('sort', option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${selectedFilters.sort === option.value ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedFilters.category || selectedFilters.platform) && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.category && (
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm flex items-center">
                    Category: {categories.find(c => c.slug === selectedFilters.category)?.name}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-2 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedFilters.platform && (
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-sm flex items-center">
                    Platform: {platforms.find(p => p.slug === selectedFilters.platform)?.name}
                    <button
                      onClick={() => handleFilterChange('platform', '')}
                      className="ml-2 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameFilters
