'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, TrendingUp, Users, Star, Bell } from 'lucide-react'
import { WalletConnect } from './wallet-connect'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/markets', label: 'Markets', icon: TrendingUp },
  { href: '/traders', label: 'Traders', icon: Users },
  { href: '/following', label: 'Following', icon: Star },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* 左侧垂直导航栏 */}
      <aside className="fixed left-0 top-0 h-screen w-52 bg-white border-r border-base-gray-200 flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-base-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3 transition-smooth-fast hover:opacity-80">
            <Image src="/logo.svg" alt="Poli Logo" width={48} height={48} className="h-12 w-12" />
            <span className="text-[38px] text-foreground font-bold tracking-wider leading-[48px]">POLI</span>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-xl font-medium transition-smooth-fast",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-base-gray-700 hover:bg-base-gray-50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 连接钱包按钮 */}
        <div className="p-4 border-t border-base-gray-200">
          <WalletConnect />
        </div>
      </aside>

      {/* 右上角通知铃铛 */}
      <div className="fixed top-6 right-6 z-50">
        <button className="relative p-3 rounded-lg bg-white border border-base-gray-200 hover:bg-base-gray-50 transition-smooth-fast card-elevated">
          <Bell className="h-5 w-5 text-base-gray-700" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger rounded-full flex items-center justify-center text-white text-xs font-bold">
            3
          </span>
        </button>
      </div>
    </>
  )
}
