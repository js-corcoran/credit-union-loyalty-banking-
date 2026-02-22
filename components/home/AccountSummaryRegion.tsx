'use client'

import { QualifyingAccount, TierType } from '@/lib/types'
import { AccountCard } from '@/components/banking/AccountCard'

interface AccountSummaryRegionProps {
  accounts: QualifyingAccount[]
  memberTier: TierType
}

export function AccountSummaryRegion({ accounts, memberTier }: AccountSummaryRegionProps) {
  if (accounts.length === 0) {
    return (
      <section aria-label="Your accounts">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Accounts</h2>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-base text-gray-600">
            You don&apos;t have any accounts yet. Visit a branch or call us to open an account.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Your accounts">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Accounts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {accounts.map((account) => (
          <AccountCard
            key={account.accountId}
            account={account}
            memberTier={memberTier}
          />
        ))}
      </div>
    </section>
  )
}
