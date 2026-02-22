'use client'

import { TierType } from '@/lib/types'

interface LoyaltyContextCalloutProps {
  context: 'account-summary' | 'transaction-detail' | 'transfer-confirmation' | 'autopay-status'
  tier: TierType
  relevantBenefit: string
  applicableValue?: number
  onLearnMore?: () => void
  className?: string
}

export function LoyaltyContextCallout({
  context,
  tier,
  relevantBenefit,
  applicableValue,
  onLearnMore,
  className,
}: LoyaltyContextCalloutProps) {
  // TODO: Implement LoyaltyContextCallout
  return null
}
