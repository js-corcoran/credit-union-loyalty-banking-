'use client'

import { SkipToContentLink } from './SkipToContentLink'
import { TopNavigationBar } from './desktop/TopNavigationBar'
import { BottomTabBar } from './mobile/BottomTabBar'
import { MobileNavSpacer } from './mobile/MobileNavSpacer'
import { useNavigationState } from '@/lib/navigation/hooks'
import { NAVIGATION_CONFIG } from '@/lib/navigation/config'
import { useMember } from '@/lib/hooks'
import { useNotifications } from '@/lib/hooks'
import type { NavigationUserData } from '@/lib/navigation/types'

/**
 * Root navigation shell that wraps all page content.
 * Provides desktop top nav (>=768px) and mobile bottom tab bar (<768px).
 */
export function NavigationShell({ children }: { children: React.ReactNode }) {
  const { pathname, activeNavItem } = useNavigationState()
  const { member } = useMember()
  const { unreadCount } = useNotifications()

  const user: NavigationUserData | undefined = member
    ? {
        name: `${member.firstName} ${member.lastName}`,
        initials: `${member.firstName[0]}${member.lastName[0]}`,
        tier: member.currentTier,
      }
    : undefined

  return (
    <>
      <SkipToContentLink />

      {/* Desktop Top Navigation (hidden on mobile <768px) */}
      <TopNavigationBar
        pathname={pathname}
        activeNavItem={activeNavItem}
        navigationConfig={NAVIGATION_CONFIG}
        user={user}
        unreadCount={unreadCount}
      />

      {/* Main content area */}
      <main
        id="main-content"
        className="min-h-screen md:pt-16 pb-20 md:pb-0"
      >
        {children}
      </main>

      {/* Mobile Bottom Tab Bar (hidden on desktop >=768px) */}
      <BottomTabBar
        pathname={pathname}
        activeNavItem={activeNavItem}
        navigationConfig={NAVIGATION_CONFIG}
      />

      {/* Mobile spacer to prevent content overlap with fixed bottom bar */}
      <MobileNavSpacer />
    </>
  )
}
