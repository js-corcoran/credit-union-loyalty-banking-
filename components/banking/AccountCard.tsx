'use client'

import Link from 'next/link'
import { QualifyingAccount, TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { Card } from '@/components/shared/Card'

interface AccountCardProps {
  account: QualifyingAccount
  memberTier: TierType
  className?: string
}

const accountTypeLabels: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  'money-market': 'Money Market',
  'line-of-credit': 'Line of Credit',
}

const benefitContextByTier: Record<TierType, string> = {
  classic: '+0.10% APY boost applied',
  plus: '+0.25% APY boost applied',
  premium: '+0.50% APY boost applied',
}

export function AccountCard({ account, memberTier, className = '' }: AccountCardProps) {
  const label = accountTypeLabels[account.accountType] || account.accountType

  return (
    <Card as="section" className={`p-4 md:p-5 relative ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{account.accountId}</p>
        </div>
        <TierBadge tier={memberTier} size="small" showLabel={false} />
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-1" aria-label={`Your balance is ${formatCurrency(account.currentBalance)}`}>
        {formatCurrency(account.currentBalance)}
      </p>

      {account.accountType === 'savings' && (
        <p className="text-sm text-emerald-600 mb-3">
          {benefitContextByTier[memberTier]}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link
          href={`/accounts/${account.accountId}`}
          className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[48px] inline-flex items-center"
        >
          View Account
        </Link>
      </div>
    </Card>
  )
}
