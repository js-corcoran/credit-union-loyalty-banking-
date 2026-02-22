'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Card } from '@/components/shared/Card'
import { BenefitComparisonChart } from './BenefitComparisonChart'

interface BreakdownItem {
  benefitType: string
  benefitName: string
  value: number
  percentage: number
}

interface TierComparisonItem {
  tier: TierType
  tierName: string
  totalValue: number
}

interface AnnualSummaryCardProps {
  totalValue: number
  breakdown: BreakdownItem[]
  tierComparison: TierComparisonItem[]
  memberTier: TierType
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

const benefitColors: Record<string, string> = {
  'apy-boost': 'bg-blue-500',
  'fee-waiver': 'bg-emerald-500',
  'third-party-rewards': 'bg-purple-500',
}

export function AnnualSummaryCard({
  totalValue,
  breakdown,
  tierComparison,
  memberTier,
}: AnnualSummaryCardProps) {
  const ariaLabel = `Your ${tierNames[memberTier]} tier provides ${formatCurrency(totalValue)} annually in benefits: ${breakdown.map((b) => `${formatCurrency(b.value)} from ${b.benefitName}`).join(', ')}`

  return (
    <section aria-label={ariaLabel}>
      <h3 className="text-xl font-bold text-gray-900 mb-3">Your Benefits This Year</h3>
      <Card className="p-4 md:p-6">
        {/* Total value */}
        <p className="text-2xl font-bold text-emerald-600 mb-5">
          {formatCurrency(totalValue)}<span className="text-base font-medium text-gray-500">/year</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breakdown */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-3">Benefit breakdown</h4>
            <div className="space-y-3">
              {breakdown.map((item) => (
                <div key={item.benefitType}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.benefitName}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.value)} <span className="text-gray-500 font-normal">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${benefitColors[item.benefitType] || 'bg-gray-400'} transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={item.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.benefitName}: ${item.percentage}% of total`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Methodology note */}
            <p className="text-sm text-gray-500 mt-4">
              APY based on 3-month average balance. Fee waivers based on historical transfer frequency. Rewards based on estimated spending patterns.
            </p>
          </div>

          {/* Tier comparison */}
          <BenefitComparisonChart
            tierComparison={tierComparison}
            currentTier={memberTier}
          />
        </div>
      </Card>
    </section>
  )
}
