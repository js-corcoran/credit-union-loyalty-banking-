'use client'

import { useRouter } from 'next/navigation'
import { TierLevel, TierBenefit } from '@/lib/loyalty-transfer/types'
import { generateLoyaltyTransferUrl, getTierDisplayName, formatCurrency } from '@/lib/loyalty-transfer/utils'

interface TierProgressionCTAProps {
  currentTier: TierLevel
  targetTier: TierLevel
  tierGapAmount: number
  currentBalance: number
  tierThreshold: number
  destinationAccountId: string
  destinationAccountName: string
  destinationBalance: number
  tierBenefits: TierBenefit[]
  isLoading?: boolean
  isDisabled?: boolean
  disabledReason?: string
  className?: string
}

export function TierProgressionCTA({
  currentTier,
  targetTier,
  tierGapAmount,
  currentBalance,
  tierThreshold,
  destinationAccountId,
  destinationAccountName,
  destinationBalance,
  tierBenefits,
  isLoading = false,
  isDisabled = false,
  disabledReason,
  className = '',
}: TierProgressionCTAProps) {
  const router = useRouter()

  const targetName = getTierDisplayName(targetTier)
  const gapFormatted = formatCurrency(tierGapAmount)

  const handleClick = () => {
    if (isDisabled || isLoading) return

    const url = generateLoyaltyTransferUrl({
      sourceTier: currentTier,
      targetTier,
      currentBalance,
      tierThreshold,
      tierGapAmount,
      destinationAccountId,
      destinationAccountName,
      destinationBalance,
      tierBenefits,
      calculatedAt: new Date().toISOString(),
      isStale: false,
      initiatingPage: 'tier-details',
      sessionId: crypto.randomUUID?.() || Date.now().toString(),
    })

    router.push(url)
  }

  const benefitSummary = tierBenefits
    .slice(0, 2)
    .map((b) => b.label)
    .join(' plus ')

  const ariaLabel = isDisabled
    ? disabledReason || `You already qualify for ${targetName} tier`
    : `Increase balance by ${gapFormatted} to reach ${targetName} tier${
        benefitSummary ? ` and unlock ${benefitSummary}` : ''
      }`

  if (isLoading) {
    return (
      <button
        disabled
        aria-busy="true"
        aria-label="Loading tier progression information"
        className={`w-full min-h-[48px] px-6 py-3 rounded-lg font-semibold text-base bg-gray-200 text-gray-500 cursor-wait flex items-center justify-center gap-2 ${className}`}
      >
        <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        Loading...
      </button>
    )
  }

  if (isDisabled) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div
          className="w-full min-h-[48px] px-6 py-3 rounded-lg font-semibold text-base bg-emerald-50 text-emerald-700 border-2 border-emerald-200 flex items-center justify-center gap-2"
          role="status"
          aria-label={ariaLabel}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {disabledReason || `You already qualify for ${targetName}`}
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`w-full min-h-[48px] px-6 py-3 rounded-lg font-semibold text-base md:text-lg bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
    >
      Transfer {gapFormatted} to reach {targetName}
    </button>
  )
}
