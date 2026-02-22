'use client'

import { formatCurrency } from '@/lib/formatting'

interface BenefitCalculationBreakdownProps {
  calculationType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  formula: string
  memberValues: {
    balance?: number
    apyPercentage?: number
    transfersPerMonth?: number
    feePerTransfer?: number
    monthlySpend?: number
    pointsPerDollar?: number
    pointsMultiplier?: number
    cashValuePerPoint?: number
  }
  result: number
  steps: { label: string; value: string }[]
}

export function BenefitCalculationBreakdown({
  formula,
  memberValues,
  result,
  steps,
}: BenefitCalculationBreakdownProps) {
  return (
    <div
      className="bg-gray-50 rounded-lg p-4"
      aria-label={`Calculation breakdown: ${formula} equals ${formatCurrency(result)} per year`}
    >
      <p className="text-sm font-semibold text-gray-700 mb-2">Your calculation</p>

      {/* Formula display */}
      <div className="bg-white rounded border border-gray-200 p-3 mb-3">
        <p className="font-mono text-base text-gray-600 mb-1">
          {formula}
        </p>
        <p className="font-mono text-base">
          {memberValues.balance !== undefined && memberValues.apyPercentage !== undefined && (
            <span>
              <span className="text-blue-700 font-bold">{formatCurrency(memberValues.balance)}</span>
              <span className="text-gray-400"> × </span>
              <span className="text-blue-700 font-bold">{memberValues.apyPercentage}%</span>
              <span className="text-gray-400"> ÷ 100 = </span>
              <span className="text-emerald-600 font-bold">{formatCurrency(result)}</span>
            </span>
          )}
          {memberValues.transfersPerMonth !== undefined && memberValues.feePerTransfer !== undefined && (
            <span>
              <span className="text-blue-700 font-bold">{memberValues.transfersPerMonth}</span>
              <span className="text-gray-400"> × 12 × </span>
              <span className="text-blue-700 font-bold">{formatCurrency(memberValues.feePerTransfer)}</span>
              <span className="text-gray-400"> = </span>
              <span className="text-emerald-600 font-bold">{formatCurrency(result)}</span>
            </span>
          )}
          {memberValues.monthlySpend !== undefined && memberValues.pointsPerDollar !== undefined && (
            <span>
              <span className="text-blue-700 font-bold">{formatCurrency(memberValues.monthlySpend)}</span>
              <span className="text-gray-400"> × </span>
              <span className="text-blue-700 font-bold">{memberValues.pointsPerDollar}</span>
              <span className="text-gray-400"> × 12 × </span>
              <span className="text-blue-700 font-bold">${memberValues.cashValuePerPoint}</span>
              <span className="text-gray-400"> = </span>
              <span className="text-emerald-600 font-bold">{formatCurrency(result)}</span>
            </span>
          )}
        </p>
      </div>

      {/* Step-by-step breakdown */}
      <dl className="space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-gray-600">{step.label}</dt>
            <dd className="text-sm font-medium text-gray-900 text-right">{step.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
