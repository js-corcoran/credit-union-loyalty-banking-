'use client'

import { formatCurrency } from '@/lib/formatting'

interface RollingBalanceDiagramProps {
  monthlyBalances: number[]
  className?: string
}

const monthLabels = ['3 months ago', '2 months ago', 'Last month']

export function RollingBalanceDiagram({
  monthlyBalances,
  className = '',
}: RollingBalanceDiagramProps) {
  const average =
    monthlyBalances.reduce((sum, b) => sum + b, 0) / monthlyBalances.length
  const maxBalance = Math.max(...monthlyBalances) * 1.1

  const ariaDescription = `Your rolling balance is ${formatCurrency(average)}, calculated from ${monthlyBalances.map((b, i) => `${monthLabels[i]}: ${formatCurrency(b)}`).join(', ')}`

  return (
    <section
      className={`bg-gray-50 rounded-xl p-4 md:p-5 ${className}`}
      aria-label={ariaDescription}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        What&apos;s a Rolling Balance?
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Average of your balance on the last day of each month for the past 3 months
      </p>

      {/* Bar chart */}
      <div className="flex items-end justify-center gap-4 md:gap-8 h-40 mb-4">
        {monthlyBalances.map((balance, index) => {
          const heightPct = (balance / maxBalance) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1 max-w-[120px]">
              <span className="text-sm font-semibold text-gray-900 mb-1">
                {formatCurrency(balance)}
              </span>
              <div
                className="w-full bg-blue-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${heightPct}%` }}
                role="presentation"
              />
              <span className="text-xs text-gray-500 mt-2 text-center">
                {monthLabels[index]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Average */}
      <div className="border-t border-gray-200 pt-3 text-center">
        <p className="text-sm text-gray-500">Average (Rolling Balance)</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">
          {formatCurrency(average)}
        </p>
      </div>
    </section>
  )
}
