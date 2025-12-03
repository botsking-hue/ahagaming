'use client'

import { 
  LayoutDashboard, 
  Gamepad2, 
  Bell, 
  BarChart3, 
  Settings, 
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin',
      active: pathname === '/admin'
    },
    {
      title: 'Games',
      icon: <Gamepad2 className="h-5 w-5" />,
      href: '/admin/games',
      active: pathname.startsWith('/admin/games')
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      href: '/admin/notifications',
      active: pathname === '/admin/notifications'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/admin/analytics',
      active: pathname === '/admin/analytics'
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '#',
      disabled: true
    },
    {
      title: 'Content',
      icon: <FileText className="h-5 w-5" />,
      href: '#',
      disabled: true
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '#',
      disabled: true
    }
  ]

  return (
    <aside className={`glass-card h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div>
                <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
                <p className="text-xs text-gray-400">GameHub Management</p>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.disabled ? '#' : item.href}
                  className={`flex items-center ${collapsed ? 'justify-center p-3' : 'px-4 py-3'} rounded-lg transition ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${item.active ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'text-gray-400'}`}
                >
                  <div className={`${item.active ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                  {item.disabled && !collapsed && (
                    <span className="ml-auto text-xs px-2 py-1 bg-white/10 rounded">Soon</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            )}
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Back to site"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
