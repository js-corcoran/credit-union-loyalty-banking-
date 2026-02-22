'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Card } from '@/components/shared/Card'

interface QualifyingAccount {
  accountId: string
  accountName: string
  balance: number
  rollingBalance3Month: number
  contributesToTier: TierType[]
}

interface QualifyingAccountsListProps {
  accounts: QualifyingAccount[]
  currentTier: TierType
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function QualifyingAccountsList({
  accounts,
  currentTier,
}: QualifyingAccountsListProps) {
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalRolling = accounts.reduce((sum, a) => sum + a.rollingBalance3Month, 0)

  if (accounts.length === 0) {
    return (
      <section aria-label="Your qualifying accounts">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Your Qualifying Accounts</h3>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-base text-gray-600">
            No qualifying accounts found. Link accounts to unlock tier benefits.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Your qualifying accounts">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Your Qualifying Accounts</h3>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600">Account</th>
                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Current Balance</th>
                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Rolling Balance</th>
                <th scope="col" className="py-3 px-4 text-sm font-semibold text-gray-600 text-center" aria-label="Contributes to tier qualification">Qualifies?</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const qualifies = account.contributesToTier.includes(currentTier)
                return (
                  <tr key={account.accountId} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <p className="text-base font-medium text-gray-900">{account.accountName}</p>
                      <p className="text-sm text-gray-500">{account.accountId}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-base font-bold text-gray-900">{formatCurrency(account.balance)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-base text-gray-700">{formatCurrency(account.rollingBalance3Month)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {qualifies ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="sr-only">Yes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                          <span className="sr-only">No</span>
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="py-3 px-4 text-base font-bold text-gray-900">Total</td>
                <td className="py-3 px-4 text-right text-base font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </td>
                <td className="py-3 px-4 text-right text-base font-bold text-gray-900">
                  {formatCurrency(totalRolling)}
                </td>
                <td className="py-3 px-4" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </section>
  )
}
