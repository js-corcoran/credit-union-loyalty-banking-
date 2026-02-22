'use client'

import { TierType } from '@/lib/types'

interface TierBadgeIndicatorProps {
  tier: TierType
  className?: string
}

const TIER_STYLES: Record<TierType, { bg: string; text: string; label: string }> = {
  classic: {
    bg: 'bg-gray-300',
    text: 'text-gray-900',
    label: 'CLASSIC',
  },
  plus: {
    bg: 'bg-yellow-400',
    text: 'text-gray-900',
    label: 'PLUS',
  },
  premium: {
    bg: 'bg-gray-200',
    text: 'text-gray-900',
    label: 'PREMIUM',
  },
}

/**
 * Tier badge indicator for navigation.
 * Shows tier name in a colored pill. Color-coded per tier.
 * Classic tier is hidden by default (only Plus/Premium shown).
 */
export function TierBadgeIndicator({ tier, className = '' }: TierBadgeIndicatorProps) {
  // Only show Plus and Premium badges in the nav
  if (tier === 'classic') return null

  const style = TIER_STYLES[tier]

  return (
    <span
      aria-label={`${style.label} tier`}
      className={`inline-flex items-center px-2 py-1 rounded-full font-semibold text-xs ${style.bg} ${style.text} ${className}`}
    >
      {style.label}
    </span>
  )
}
