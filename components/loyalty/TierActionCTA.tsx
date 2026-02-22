'use client'

import { TierType } from '@/lib/types'

interface TierActionCTAProps {
  actionType: 'increase-balance' | 'add-autopay' | 'confirm-autopay' | 'learn-more'
  currentValue: number
  targetValue: number
  tier: TierType
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function TierActionCTA({
  actionType,
  currentValue,
  targetValue,
  tier,
  onClick,
  disabled,
  className,
}: TierActionCTAProps) {
  // TODO: Implement TierActionCTA
  return null
}
