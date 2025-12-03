'use client'

import { Gamepad2, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/shared/SearchBar'
import NotificationBell from '@/components/notifications/NotificationBell'
import ThemeToggle from '@/components/shared/ThemeToggle'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#trending', label: 'Trending' },
    { href: '#categories', label: 'Categories' },
    { href: '#platforms', label: 'Platforms' },
  ]

  return (
    <header className="sticky top-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">GameHub</h1>
              <p className="text-xs text-gray-400">Free Downloads</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
                  <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <Link href="/games" className="btn-primary">
              Browse Games
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
  <ThemeToggle />
  <NotificationBell />
  <WhatsAppButton variant="inline" />
</div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div className="md:hidden mt-4 pt-4 border-t border-white/10">
  <div className="flex flex-col space-y-4">
    {/* ... existing links ... */}
    <div className="pt-4 flex items-center space-x-4">
      <ThemeToggle />
      <NotificationBell />
      <WhatsAppButton variant="inline" />
    </div>
  </div>
</div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
