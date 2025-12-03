'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GameForm from '@/components/admin/GameForm'

export default function NewGamePage() {
  const router = useRouter()

  const handleSave = (gameData: any) => {
    // In a real app, you would save to your JSON file here
    // For now, we'll just show a success message and redirect
    alert('Game saved successfully!')
    console.log('Game data to save:', gameData)
    router.push('/admin/games')
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/games')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Add New Game</h1>
        <p className="text-gray-400">Fill in the details below to add a new game to your library</p>
      </div>

      <div className="glass-card p-6">
        <GameForm
          mode="create"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>

      {/* Help Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Tips for Adding Games</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-cyan-400 font-medium mb-2">Download Links</div>
            <div className="text-sm text-gray-400">
              Use MediaFire, Google Drive, or other trusted file hosting services
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-cyan-400 font-medium mb-2">Cover Images</div>
            <div className="text-sm text-gray-400">
              Recommended size: 400x600px. Use /images/games/ folder
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-cyan-400 font-medium mb-2">SEO Friendly</div>
            <div className="text-sm text-gray-400">
              Use descriptive titles and detailed descriptions for better search
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
