'use client'

import { formatCurrency } from '@/lib/formatting'

interface FAQVisualizationProps {
  type: 'diagram' | 'flowchart' | 'image'
  memberRollingBalance?: number
}

export function FAQVisualization({ type, memberRollingBalance }: FAQVisualizationProps) {
  if (type !== 'diagram') return null

  const months = [
    { label: 'Nov 30', balance: 14200 },
    { label: 'Dec 31', balance: 14600 },
    { label: 'Jan 31', balance: 14700 },
  ]
  const average = Math.round(months.reduce((sum, m) => sum + m.balance, 0) / months.length)
  const maxBalance = Math.max(...months.map((m) => m.balance))

  return (
    <figure
      className="bg-gray-50 rounded-lg p-4 my-3"
      role="img"
      aria-label={`Rolling balance diagram showing 3 months: ${months.map((m) => `${m.label}: ${formatCurrency(m.balance)}`).join(', ')}. Average: ${formatCurrency(average)}.`}
    >
      <p className="text-sm font-semibold text-gray-700 mb-3">Example: 3-Month Rolling Balance</p>

      {/* Visual bars */}
      <div className="space-y-2 mb-3">
        {months.map((month) => {
          const widthPercent = (month.balance / maxBalance) * 100
          return (
            <div key={month.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-16 flex-shrink-0 text-right">{month.label}</span>
              <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded transition-all duration-300"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-20 text-right">
                {formatCurrency(month.balance)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Average result */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
        <span className="text-sm font-semibold text-gray-700 w-16 flex-shrink-0 text-right">Average</span>
        <div className="flex-1">
          <div className="h-0.5 bg-emerald-400 border-t-2 border-dashed border-emerald-400" />
        </div>
        <span className="text-sm font-bold text-emerald-600 w-20 text-right">
          {formatCurrency(average)}
        </span>
      </div>

      {memberRollingBalance && (
        <p className="text-sm text-blue-700 mt-3 font-medium">
          Your current rolling balance: {formatCurrency(memberRollingBalance)}
        </p>
      )}

      <figcaption className="text-xs text-gray-500 mt-3">
        Your rolling balance is the average of your balance on the last day of each month for the past 3 months.
      </figcaption>
    </figure>
  )
}
