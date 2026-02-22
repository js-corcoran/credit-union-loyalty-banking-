'use client'

import Link from 'next/link'
import { TierType } from '@/lib/types'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { TierProgressBar } from '@/components/loyalty/TierProgressBar'

interface TierStatusRegionProps {
  currentTier: TierType
  firstName: string
  currentBalance: number
  nextTierThreshold?: number
  nextTierName?: string
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function TierStatusRegion({
  currentTier,
  firstName,
  currentBalance,
  nextTierThreshold,
  nextTierName,
}: TierStatusRegionProps) {
  return (
    <section
      className="bg-gray-50 rounded-xl p-5 md:p-6"
      aria-label="Your loyalty tier status"
    >
      <div className="flex items-center gap-4 mb-4">
        <TierBadge tier={currentTier} size="medium" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h2>
          <p className="text-base text-gray-600">
            You&apos;re in {tierNames[currentTier]} Tier
          </p>
        </div>
      </div>

      {nextTierThreshold && nextTierName && (
        <TierProgressBar
          currentValue={currentBalance}
          targetValue={nextTierThreshold}
          tier={currentTier}
          metric="balance"
          showLabel={true}
          className="mb-4"
        />
      )}

      <Link
        href="/loyalty"
        className="inline-flex items-center text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px]"
      >
        Explore Loyalty Benefits
        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  )
}
