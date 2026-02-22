import { TierType } from '@/lib/types'

/** A primary navigation section (Home, Loyalty, Move Money, Loans) */
export interface NavigationItem {
  id: string
  label: string
  route: string
  icon: string
  /** Screen IDs that belong to this section */
  screens: string[]
  /** Route prefixes used for active-state matching */
  routePrefixes: string[]
  /** Whether this item is visible (e.g., Loans only if user has loans) */
  visible: boolean
}

/** A secondary menu item shown in the More menu */
export interface MoreMenuItem {
  id: string
  label: string
  route: string
  icon: string
  description?: string
}

/** Complete navigation configuration */
export interface NavigationConfig {
  sections: NavigationItem[]
  moreMenuItems: MoreMenuItem[]
}

/** Current navigation state derived from pathname */
export interface NavigationState {
  pathname: string
  activeNavItem: NavigationItem | null
  activeSection: string | null
}

/** Props shared by both desktop and mobile navigation */
export interface NavigationShellProps {
  children: React.ReactNode
}

/** User data needed by navigation utilities */
export interface NavigationUserData {
  name: string
  initials: string
  tier: TierType
}
