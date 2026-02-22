'use client'

import { TierType } from '@/lib/types'

interface LoyaltyHubNavigationProps {
  currentPage: 'main' | 'tier-details' | 'account-status' | 'benefits' | 'faq'
  tier: TierType
  className?: string
}

export function LoyaltyHubNavigation({
  currentPage,
  tier,
  className,
}: LoyaltyHubNavigationProps) {
  // TODO: Implement LoyaltyHubNavigation
  return null
}
