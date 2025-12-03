'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface Game {
  id: string
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
  updatedAt: string
  featured: boolean
  status: 'draft' | 'published'
}

export default function ManageGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadGames()
  }, [])

  useEffect(() => {
    filterAndSortGames()
  }, [games, searchTerm, categoryFilter, statusFilter, sortBy])

  const loadGames = async () => {
    try {
      const response = await fetch('/data/games.json')
      const data = await response.json()
      setGames(data)
      setFilteredGames(data)
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortGames = () => {
    let result = [...games]

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(game =>
        game.title.toLowerCase().includes(term) ||
        game.description.toLowerCase().includes(term) ||
        game.category.toLowerCase().includes(term)
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(game => game.category === categoryFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(game => game.status === statusFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'popular':
        result.sort((a, b) => {
          const aDownloads = parseDownloads(a.downloads)
          const bDownloads = parseDownloads(b.downloads)
          return bDownloads - aDownloads
        })
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredGames(result)
    setCurrentPage(1)
  }

  const parseDownloads = (downloadStr: string): number => {
    const match = downloadStr.match(/(\d+(\.\d+)?)([MKBT]?)\+/)
    if (!match) return 0
    
    const [, numStr, , unit] = match
    const num = parseFloat(numStr)
    
    switch (unit) {
      case 'M': return num * 1000000
      case 'K': return num * 1000
      case 'B': return num * 1000000000
      default: return num
    }
  }

  const toggleFeatured = (id: string) => {
    setGames(prev => prev.map(game =>
      game.id === id ? { ...game, featured: !game.featured } : game
    ))
  }

  const toggleStatus = (id: string) => {
    setGames(prev => prev.map(game =>
      game.id === id 
        ? { ...game, status: game.status === 'published' ? 'draft' : 'published' }
        : game
    ))
  }

  const deleteGame = (id: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setGames(prev => prev.filter(game => game.id !== id))
      alert('Game deleted successfully!')
    }
  }

  const getCategories = () => {
    const categories = Array.from(new Set(games.map(game => game.category)))
    return categories
  }

  const getStats = () => {
    const total = games.length
    const published = games.filter(g => g.status === 'published').length
    const drafts = games.filter(g => g.status === 'draft').length
    const featured = games.filter(g => g.featured).length

    return { total, published, drafts, featured }
  }

  const stats = getStats()

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentGames = filteredGames.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Games</h1>
          <p className="text-gray-400">Manage and organize your game library</p>
        </div>
        <Link
          href="/admin/games/new"
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Game</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Games</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{stats.published}</div>
          <div className="text-sm text-gray-400">Published</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{stats.drafts}</div>
          <div className="text-sm text-gray-400">Drafts</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{stats.featured}</div>
          <div className="text-sm text-gray-400">Featured</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            >
              <option value="all">All Categories</option>
              {getCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Sort & Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          <div className="text-sm text-gray-400">
            Showing {filteredGames.length} of {games.length} games
          </div>
        </div>
      </div>

      {/* Games Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Game</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Platform</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Stats</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGames.map((game) => (
                <tr key={game.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🎮</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{game.title}</div>
                        <div className="text-sm text-gray-400">{game.size} • v{game.version}</div>
                      </div>
                      {game.featured && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm">
                      {game.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-1">
                      {game.platform.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 bg-white/5 text-xs text-gray-400 rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {game.status}
                      </span>
                      <button
                        onClick={() => toggleStatus(game.id)}
                        className="p-1 text-gray-400 hover:text-white"
                        title={game.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {game.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{game.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="h-3 w-3 text-cyan-400" />
                        <span className="text-sm text-gray-400">{game.downloads}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFeatured(game.id)}
                        className={`p-2 rounded-lg ${game.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-white'}`}
                        title={game.featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/games/edit/${game.id}`}
                        className="p-2 text-gray-400 hover:text-white rounded-lg"
                        title="Edit game"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/games/${game.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-white rounded-lg"
                        title="View game"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg"
                        title="Delete game"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentGames.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try changing your filters'
                : 'Get started by adding your first game'}
            </p>
            <Link
              href="/admin/games/new"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Game</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredGames.length)} of {filteredGames.length} games
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg ${currentPage === pageNum ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition">
            Export to CSV
          </button>
          <button className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition">
            Update Selected
          </button>
          <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition">
            Delete Selected
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition">
            Import Games
          </button>
        </div>
      </div>
    </div>
  )
}
