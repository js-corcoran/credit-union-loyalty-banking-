'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'

interface TierComparisonItem {
  tier: TierType
  tierName: string
  totalValue: number
}

interface BenefitComparisonChartProps {
  tierComparison: TierComparisonItem[]
  currentTier: TierType
  className?: string
}

const tierColors: Record<TierType, { bg: string; bar: string; text: string }> = {
  classic: { bg: 'bg-gray-100', bar: 'bg-gray-500', text: 'text-gray-700' },
  plus: { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-800' },
  premium: { bg: 'bg-slate-100', bar: 'bg-slate-500', text: 'text-slate-700' },
}

export function BenefitComparisonChart({
  tierComparison,
  currentTier,
  className = '',
}: BenefitComparisonChartProps) {
  const maxValue = Math.max(...tierComparison.map((t) => t.totalValue), 1)

  return (
    <div className={className}>
      <h4 className="text-base font-bold text-gray-900 mb-3">Compare to other tiers</h4>

      {/* Visual bar chart */}
      <div className="space-y-3 mb-4" role="img" aria-label="Tier benefit comparison chart">
        {tierComparison.map((tier) => {
          const colors = tierColors[tier.tier]
          const isCurrent = tier.tier === currentTier
          const widthPercent = (tier.totalValue / maxValue) * 100

          return (
            <div key={tier.tier}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${colors.text}`}>
                  {tier.tierName}
                  {isCurrent && (
                    <span className="ml-2 text-xs font-bold text-emerald-600">(current)</span>
                  )}
                </span>
                <span className={`text-sm font-bold ${isCurrent ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {formatCurrency(tier.totalValue)}/yr
                </span>
              </div>
              <div className={`h-3 rounded-full ${colors.bg} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-300`}
                  style={{ width: `${widthPercent}%` }}
                  role="progressbar"
                  aria-valuenow={tier.totalValue}
                  aria-valuemin={0}
                  aria-valuemax={maxValue}
                  aria-label={`${tier.tierName} tier: ${formatCurrency(tier.totalValue)} per year`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Accessible data table */}
      <table className="w-full text-sm sr-only" aria-label="Tier benefit values">
        <thead>
          <tr>
            <th scope="col">Tier</th>
            <th scope="col">Annual Value</th>
          </tr>
        </thead>
        <tbody>
          {tierComparison.map((tier) => (
            <tr key={tier.tier}>
              <td>{tier.tierName}{tier.tier === currentTier ? ' (current)' : ''}</td>
              <td>{formatCurrency(tier.totalValue)}/year</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
