import { Gamepad2, Download, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="mt-16 glass-card mx-4 mb-4 rounded-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">GameHub</h2>
                <p className="text-sm text-gray-400">Free Game Downloads</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Download latest games for free. Safe, fast, and verified downloads.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="#trending" className="text-gray-400 hover:text-white transition">Trending Games</Link></li>
              <li><Link href="#categories" className="text-gray-400 hover:text-white transition">Categories</Link></li>
              <li><Link href="#platforms" className="text-gray-400 hover:text-white transition">Platforms</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Arcade</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Racing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Soccer</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition">Action</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Why Choose Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-400">Virus Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-400">Fast Downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-400">Direct Links</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} GameHub. All games are property of their respective owners.</p>
          <p className="mt-2">Download links provided by MediaFire & Google Drive</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
