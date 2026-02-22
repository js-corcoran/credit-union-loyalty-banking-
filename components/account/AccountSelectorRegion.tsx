'use client'

import { useRouter } from 'next/navigation'
import { AccountDetail } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'

interface AccountSelectorRegionProps {
  accounts: AccountDetail[]
  currentAccountId: string
}

export function AccountSelectorRegion({
  accounts,
  currentAccountId,
}: AccountSelectorRegionProps) {
  const router = useRouter()

  return (
    <nav aria-label="Account selector" className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {accounts.map((account) => {
          const isCurrent = account.accountId === currentAccountId
          return (
            <button
              key={account.accountId}
              onClick={() => {
                if (!isCurrent) {
                  router.push(`/accounts/${account.accountId}`)
                }
              }}
              aria-current={isCurrent ? 'page' : undefined}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium min-h-[48px] transition-colors border-2 ${
                isCurrent
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="block font-semibold">
                {account.accountName} {account.maskedAccountNumber}
              </span>
              <span className={`block text-xs mt-0.5 ${isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                {formatCurrency(account.currentBalance)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
