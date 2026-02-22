'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { NavigationState } from './types'
import { getActiveNavItem } from './utils'
import { NAVIGATION_CONFIG } from './config'

/**
 * Hook that returns current navigation state based on pathname.
 * Memoized to prevent unnecessary re-renders.
 */
export function useNavigationState(): NavigationState {
  const pathname = usePathname()

  const state = useMemo<NavigationState>(() => {
    const activeNavItem = getActiveNavItem(pathname, NAVIGATION_CONFIG)
    return {
      pathname,
      activeNavItem,
      activeSection: activeNavItem?.id ?? null,
    }
  }, [pathname])

  return state
}
