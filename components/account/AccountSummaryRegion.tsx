'use client'

import { AccountDetail } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { TierType } from '@/lib/types'

interface AccountSummaryRegionProps {
  account: AccountDetail
  currentTier: TierType
}

const statusColors: Record<string, string> = {
  active: 'text-emerald-600',
  closed: 'text-red-600',
  dormant: 'text-gray-500',
}

export function AccountSummaryRegion({
  account,
  currentTier,
}: AccountSummaryRegionProps) {
  return (
    <section
      aria-label="Account summary"
      className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 mb-6 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {account.accountName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {account.maskedAccountNumber}
          </p>
          <p className={`text-sm font-medium mt-0.5 capitalize ${statusColors[account.accountStatus] || 'text-gray-500'}`}>
            {account.accountStatus}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p
            className="text-3xl md:text-4xl font-bold text-gray-900"
            aria-label={`Current balance ${formatCurrency(account.currentBalance)}`}
          >
            {formatCurrency(account.currentBalance)}
          </p>
          <TierBadge tier={currentTier} size="medium" showLabel={false} />
        </div>
      </div>

      {account.tierAPYBoost > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-emerald-600 font-medium">
            +{(account.tierAPYBoost * 100).toFixed(2)}% APY boost applied
            <span className="text-gray-500 font-normal ml-2">
              (Effective APY: {(account.effectiveAPY * 100).toFixed(2)}%)
            </span>
          </p>
        </div>
      )}
    </section>
  )
}
