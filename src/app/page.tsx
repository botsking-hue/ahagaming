import { Gamepad2, TrendingUp, Zap, Shield } from 'lucide-react'
import GameGrid from '@/components/games/GameGrid'
import Link from 'next/link'

export default function Home() {
  const categories = [
    { name: 'Arcade', count: 45, color: 'from-cyan-500 to-blue-600' },
    { name: 'Racing', count: 32, color: 'from-purple-500 to-pink-600' },
    { name: 'Soccer', count: 28, color: 'from-green-500 to-emerald-600' },
    { name: 'Action', count: 67, color: 'from-red-500 to-orange-600' },
    { name: 'Adventure', count: 39, color: 'from-yellow-500 to-amber-600' },
    { name: 'Puzzle', count: 24, color: 'from-indigo-500 to-purple-600' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="gradient-text">Download & Play</span>
          <br />
          <span className="text-white">The Best Games For Free</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Get the latest games for Android, iOS, and PC. Safe, fast downloads with no viruses.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary text-lg px-8 py-4">
            <Gamepad2 className="inline mr-2 h-5 w-5" />
            Explore Games
          </button>
          <button className="btn-secondary text-lg px-8 py-4">
            <TrendingUp className="inline mr-2 h-5 w-5" />
            Trending Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Fast Downloads</h3>
          <p className="text-gray-400">Direct download links with high speed</p>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="inline-flex p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Virus Free</h3>
          <p className="text-gray-400">All files are scanned and verified</p>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mb-4">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Latest Versions</h3>
          <p className="text-gray-400">Always updated with newest game versions</p>
        </div>
      </section>

      {/* Categories */}
      <section id="categories">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-3xl font-bold text-white">Browse Categories</h2>
    <Link href="/games" className="text-cyan-400 hover:text-cyan-300 transition">
      View All →
    </Link>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {categories.map((category) => (
      <Link
        key={category.name}
        href={`/categories/${category.name.toLowerCase()}`}
        className={`glass-card p-6 text-center group cursor-pointer hover:scale-105 transition-transform duration-300`}
      >
        <div className={`h-12 w-12 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
          <Gamepad2 className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-white mb-1">{category.name}</h3>
        <p className="text-sm text-gray-400">{category.count} Games</p>
      </Link>
    ))}
  </div>
</section>

      {/* Featured Games */}
      <section id="trending">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Games</h2>
          <Link href="/games" className="text-cyan-400 hover:text-cyan-300 transition">
            View All Games →
          </Link>
        </div>
        <GameGrid />
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 glass-card rounded-2xl">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Download?
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Join thousands of gamers downloading their favorite games every day
        </p>
        <div className="space-x-4">
          <button className="btn-primary px-8 py-4 text-lg">
            <Download className="inline mr-2 h-5 w-5" />
            Start Downloading
          </button>
          <button className="btn-secondary px-8 py-4 text-lg">
            Join WhatsApp
          </button>
        </div>
      </section>
    </div>
  )
}
