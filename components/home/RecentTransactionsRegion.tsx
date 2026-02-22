'use client'

import Link from 'next/link'
import { Transaction } from '@/lib/types'
import { TransactionItem } from '@/components/banking/TransactionItem'
import { Card } from '@/components/shared/Card'

interface RecentTransactionsRegionProps {
  transactions: Transaction[]
}

export function RecentTransactionsRegion({ transactions }: RecentTransactionsRegionProps) {
  return (
    <section aria-label="Recent transactions">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
        <Link
          href="/transactions"
          className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
        >
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-base text-gray-600">
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div role="list" aria-label="Recent transactions list">
            {transactions.map((txn) => (
              <div role="listitem" key={txn.transactionId}>
                <TransactionItem transaction={txn} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  )
}
