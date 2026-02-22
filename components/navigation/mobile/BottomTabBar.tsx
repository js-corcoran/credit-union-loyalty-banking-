'use client'

import { useState } from 'react'
import { NavigationItem, NavigationConfig } from '@/lib/navigation/types'
import { BottomTabItem } from './BottomTabItem'
import { MoreMenuButton } from './MoreMenuButton'
import { MoreMenuDrawer } from '../more/MoreMenuDrawer'

interface BottomTabBarProps {
  pathname: string
  activeNavItem: NavigationItem | null
  navigationConfig: NavigationConfig
}

/**
 * Mobile bottom tab navigation bar. Visible only on mobile (<768px).
 * Fixed to bottom of viewport. 56px height + safe area inset.
 */
export function BottomTabBar({
  pathname,
  activeNavItem,
  navigationConfig,
}: BottomTabBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden w-full border-t border-gray-200 bg-white"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-14">
          {navigationConfig.sections
            .filter((item) => item.visible)
            .map((item, index) => (
              <BottomTabItem
                key={item.id}
                item={item}
                isActive={activeNavItem?.id === item.id}
                index={index}
              />
            ))}

          {/* More button */}
          <MoreMenuButton
            isActive={false}
            onPress={() => setDrawerOpen(true)}
          />
        </div>
      </nav>

      {/* More Menu Drawer */}
      <MoreMenuDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        moreMenuItems={navigationConfig.moreMenuItems}
      />
    </>
  )
}
