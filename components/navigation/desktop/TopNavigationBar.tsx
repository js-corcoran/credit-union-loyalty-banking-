'use client'

import Link from 'next/link'
import { NavigationItem, NavigationConfig, NavigationUserData } from '@/lib/navigation/types'
import { TopNavItem } from './TopNavItem'
import { TopNavUtilities } from './TopNavUtilities'

interface TopNavigationBarProps {
  pathname: string
  activeNavItem: NavigationItem | null
  navigationConfig: NavigationConfig
  user?: NavigationUserData
  unreadCount?: number
}

/**
 * Desktop top navigation bar. Hidden on mobile (<768px).
 * Fixed sticky header with logo, primary nav items, and utility area.
 */
export function TopNavigationBar({
  pathname,
  activeNavItem,
  navigationConfig,
  user,
  unreadCount = 0,
}: TopNavigationBarProps) {
  return (
    <header className="hidden md:block sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo / Home Link */}
          <Link
            href="/"
            className="flex-shrink-0 mr-8 text-lg font-bold text-gray-900 hover:text-gray-700 min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded"
            aria-label="Credit Union Home"
          >
            CU Banking
          </Link>

          {/* Primary Navigation Items */}
          <nav aria-label="Main navigation" className="flex items-center flex-1 space-x-1 lg:space-x-2">
            {navigationConfig.sections
              .filter((item) => item.visible)
              .map((item, index) => (
                <TopNavItem
                  key={item.id}
                  item={item}
                  isActive={activeNavItem?.id === item.id}
                  index={index}
                />
              ))}
          </nav>

          {/* Utilities: Notification bell, tier badge, profile */}
          <TopNavUtilities
            user={user}
            unreadCount={unreadCount}
            moreMenuItems={navigationConfig.moreMenuItems}
          />
        </div>
      </div>
    </header>
  )
}
