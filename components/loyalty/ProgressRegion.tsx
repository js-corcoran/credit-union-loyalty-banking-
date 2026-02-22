'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { TierProgressBar } from './TierProgressBar'

interface ProgressRegionProps {
  currentTier: TierType
  currentBalance: number
  nextTier: TierType
  nextTierMinBalance: number
  balanceGap: number
  autopayGap: number
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function ProgressRegion({
  currentTier,
  currentBalance,
  nextTier,
  nextTierMinBalance,
  balanceGap,
  autopayGap,
}: ProgressRegionProps) {
  return (
    <section aria-label="Progress to next tier">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Path to {tierNames[nextTier]} Tier
      </h2>

      <div className="bg-gray-50 rounded-xl p-4 md:p-5">
        <TierProgressBar
          currentValue={currentBalance}
          targetValue={nextTierMinBalance}
          tier={nextTier}
          metric="balance"
          showLabel={true}
          className="mb-4"
        />

        <div className="space-y-2">
          {balanceGap > 0 && (
            <p className="text-base text-gray-700">
              You need <span className="font-bold">{formatCurrency(balanceGap)}</span> more in qualifying balance to reach {tierNames[nextTier]}
            </p>
          )}
          {autopayGap > 0 && (
            <p className="text-base text-gray-700">
              You need <span className="font-bold">{autopayGap} more autopay{autopayGap !== 1 ? 's' : ''}</span> to qualify for {tierNames[nextTier]}
            </p>
          )}
          {balanceGap === 0 && autopayGap === 0 && (
            <p className="text-base text-emerald-600 font-semibold">
              You meet all requirements for {tierNames[nextTier]} tier!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
