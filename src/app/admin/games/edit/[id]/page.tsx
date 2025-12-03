'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import GameForm from '@/components/admin/GameForm'

export default function EditGamePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGame()
  }, [params.id])

  const loadGame = async () => {
    try {
      const response = await fetch('/data/games.json')
      const games = await response.json()
      const foundGame = games.find((g: any) => g.id === params.id)
      
      if (foundGame) {
        setGame(foundGame)
      } else {
        alert('Game not found!')
        router.push('/admin/games')
      }
    } catch (error) {
      console.error('Error loading game:', error)
      alert('Failed to load game')
      router.push('/admin/games')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (updatedGame: any) => {
    // In a real app, you would update the JSON file here
    alert('Game updated successfully!')
    console.log('Updated game:', updatedGame)
    router.push('/admin/games')
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/games')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
        <button
          onClick={() => router.push('/admin/games')}
          className="btn-primary"
        >
          Back to Games
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Game</h1>
        <p className="text-gray-400">Update the details of "{game.title}"</p>
      </div>

      <div className="glass-card p-6">
        <GameForm
          initialData={game}
          mode="edit"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
