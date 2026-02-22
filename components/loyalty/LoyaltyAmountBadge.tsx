'use client'

import { formatCurrency } from '@/lib/loyalty-transfer/utils'

interface LoyaltyAmountBadgeProps {
  amount: number
  label?: string
  isStale?: boolean
  showRefresh?: boolean
  onRefresh?: () => void
  variant?: 'default' | 'compact'
  className?: string
}

export function LoyaltyAmountBadge({
  amount,
  label = 'Need',
  isStale = false,
  showRefresh = false,
  onRefresh,
  variant = 'default',
  className = '',
}: LoyaltyAmountBadgeProps) {
  if (amount <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 font-semibold text-sm ${className}`}
        role="status"
        aria-label="Requirement met"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Met
      </span>
    )
  }

  const isCompact = variant === 'compact'

  return (
    <span
      className={`inline-flex items-center gap-2 ${
        isCompact ? 'px-2 py-1 text-sm' : 'px-3 py-1.5 text-base'
      } rounded-md font-semibold ${
        isStale
          ? 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800'
          : 'bg-teal-50 border-l-4 border-teal-500 text-gray-900'
      } ${className}`}
      role="status"
      aria-label={`${label} ${formatCurrency(amount)} more${isStale ? ', data may be outdated' : ''}`}
    >
      {label} {formatCurrency(amount)} more
      {isStale && (
        <>
          <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {showRefresh && onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRefresh()
              }}
              className="text-yellow-700 underline hover:text-yellow-900 text-sm min-h-[44px] min-w-[44px] inline-flex items-center"
              aria-label="Refresh balance data"
            >
              Refresh
            </button>
          )}
        </>
      )}
    </span>
  )
}
