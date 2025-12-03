'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      root.classList.toggle('dark', newTheme === 'dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return (
      <div className="h-10 w-10 bg-white/5 rounded-lg animate-pulse"></div>
    )
  }

  return (
    <div className="relative group">
      <div className="flex items-center space-x-1 glass-card rounded-xl p-1">
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          title="Light theme"
        >
          <Sun className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          title="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => handleThemeChange('system')}
          className={`p-2 rounded-lg transition-all ${theme === 'system' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          title="System theme"
        >
          <Monitor className="h-4 w-4" />
        </button>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="glass-card px-3 py-1.5 rounded-lg whitespace-nowrap">
          <span className="text-xs font-medium text-white">Theme</span>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle
