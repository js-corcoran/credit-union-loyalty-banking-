'use client'

import Link from 'next/link'
import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { TierProgressBar } from './TierProgressBar'

interface AdvancementPathCardProps {
  currentTier: TierType
  nextTier: TierType
  currentBalance: number
  minimumBalance: number
  balanceGap: number
  autopayGap: number
  monthlyIncrementEstimate?: number
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function AdvancementPathCard({
  currentTier,
  nextTier,
  currentBalance,
  minimumBalance,
  balanceGap,
  autopayGap,
  monthlyIncrementEstimate = 100,
}: AdvancementPathCardProps) {
  if (currentTier === 'premium') return null

  const monthsToReach = balanceGap > 0
    ? Math.ceil(balanceGap / monthlyIncrementEstimate)
    : 0
  const isClose = balanceGap > 0 && balanceGap <= 2000

  const ariaLabel = `You need ${formatCurrency(balanceGap)} more in balance to reach ${tierNames[nextTier]} tier, estimated ${monthsToReach} months away`

  return (
    <section aria-label={ariaLabel}>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Next Tier: {tierNames[nextTier]}
      </h3>
      <Card className={`p-4 md:p-5 ${isClose ? 'border-l-4 border-l-emerald-500' : ''}`}>
        {isClose && (
          <p className="text-base font-semibold text-emerald-700 mb-3">
            You&apos;re close to {tierNames[nextTier]} tier!
          </p>
        )}

        <TierProgressBar
          currentValue={currentBalance}
          targetValue={minimumBalance}
          tier={nextTier}
          metric="balance"
          showLabel={true}
          className="mb-4"
        />

        <div className="space-y-2 mb-4">
          {balanceGap > 0 && (
            <p className="text-base text-gray-700">
              Maintain <span className="font-bold">{formatCurrency(minimumBalance)}+</span> balance{' '}
              <span className="text-gray-500">(you have {formatCurrency(currentBalance)}, need {formatCurrency(balanceGap)} more)</span>
            </p>
          )}
          {autopayGap > 0 && (
            <p className="text-base text-gray-700">
              Add <span className="font-bold">{autopayGap} more autopay{autopayGap !== 1 ? 's' : ''}</span>
            </p>
          )}
          {balanceGap === 0 && autopayGap === 0 && (
            <p className="text-base text-emerald-600 font-semibold">
              You meet all requirements for {tierNames[nextTier]}!
            </p>
          )}
        </div>

        {balanceGap > 0 && monthsToReach > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            If you increase balance by {formatCurrency(monthlyIncrementEstimate)}/month, you&apos;ll reach {tierNames[nextTier]} in approximately {monthsToReach} month{monthsToReach !== 1 ? 's' : ''}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {balanceGap > 0 && (
            <Link href="/transfer">
              <Button variant="primary" size="md">
                Increase balance
              </Button>
            </Link>
          )}
          <Link href="/loyalty/tier-details">
            <Button variant="outline" size="md">
              View {tierNames[nextTier]} benefits
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  )
}
