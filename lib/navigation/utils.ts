import { NavigationItem, NavigationConfig } from './types'
import { NAVIGATION_CONFIG } from './config'

/**
 * Determine which navigation item is active based on the current pathname.
 * Uses a three-pass strategy:
 * 1. Exact match on route
 * 2. Prefix match on routePrefixes
 * 3. Fallback to Home
 */
export function getActiveNavItem(
  pathname: string,
  config: NavigationConfig = NAVIGATION_CONFIG
): NavigationItem | null {
  // Strip query params and hash
  const cleanPath = pathname.split('?')[0].split('#')[0]

  // Pass 1: Exact match
  const exactMatch = config.sections.find(
    (section) => section.route === cleanPath
  )
  if (exactMatch) return exactMatch

  // Pass 2: Prefix match (longest prefix wins)
  let bestMatch: NavigationItem | null = null
  let bestPrefixLength = 0

  for (const section of config.sections) {
    for (const prefix of section.routePrefixes) {
      if (
        cleanPath.startsWith(prefix) &&
        prefix.length > bestPrefixLength
      ) {
        bestMatch = section
        bestPrefixLength = prefix.length
      }
    }
  }
  if (bestMatch) return bestMatch

  // Pass 3: Fallback to Home for unknown routes
  return config.sections.find((s) => s.id === 'home') ?? null
}

/**
 * Get a navigation section by its ID.
 */
export function getNavItemById(
  id: string,
  config: NavigationConfig = NAVIGATION_CONFIG
): NavigationItem | undefined {
  return config.sections.find((s) => s.id === id)
}
