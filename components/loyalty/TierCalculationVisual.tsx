'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { TierBadge } from './TierBadge'

interface TierCalculationVisualProps {
  tier: TierType
  qualifyingBalance: number
  autopayCount: number
  className?: string
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function TierCalculationVisual({
  tier,
  qualifyingBalance,
  autopayCount,
  className = '',
}: TierCalculationVisualProps) {
  const ariaLabel = `Your tier equals ${formatCurrency(qualifyingBalance)} in qualifying accounts plus ${autopayCount} active autopays, which qualifies for ${tierNames[tier]} tier`

  return (
    <div
      className={`bg-gray-50 rounded-xl p-5 md:p-6 ${className}`}
      aria-label={ariaLabel}
      role="img"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {/* Balance */}
        <div className="flex flex-col items-center bg-white rounded-lg p-3 border border-gray-200 min-w-[120px]">
          <svg className="w-6 h-6 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-500">Balance</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(qualifyingBalance)}</span>
        </div>

        {/* Plus sign */}
        <span className="text-2xl font-bold text-gray-400" aria-hidden="true">+</span>

        {/* Autopays */}
        <div className="flex flex-col items-center bg-white rounded-lg p-3 border border-gray-200 min-w-[120px]">
          <svg className="w-6 h-6 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-gray-500">Autopays</span>
          <span className="text-lg font-bold text-gray-900">{autopayCount}</span>
        </div>

        {/* Equals sign */}
        <span className="text-2xl font-bold text-gray-400" aria-hidden="true">=</span>

        {/* Tier result */}
        <div className="flex flex-col items-center">
          <TierBadge tier={tier} size="medium" />
        </div>
      </div>
    </div>
  )
}
