'use client'

import { TierConfiguration, TierType } from '@/lib/types'

interface TierRulesAccordionProps {
  tiers: TierConfiguration[]
  memberTier: TierType
  expandedByDefault?: boolean
  className?: string
}

export function TierRulesAccordion({
  tiers,
  memberTier,
  expandedByDefault = false,
  className,
}: TierRulesAccordionProps) {
  // TODO: Implement TierRulesAccordion
  return null
}
