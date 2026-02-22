'use client'

import Link from 'next/link'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDateShort } from '@/lib/formatting'

interface TransactionItemProps {
  transaction: Transaction
  className?: string
}

export function TransactionItem({ transaction, className = '' }: TransactionItemProps) {
  const isCredit = transaction.transactionType === 'credit' || transaction.transactionType === 'interest'
  const displayAmount = isCredit
    ? `+${formatCurrency(Math.abs(transaction.amount))}`
    : `-${formatCurrency(Math.abs(transaction.amount))}`

  return (
    <Link
      href={`/transactions/${transaction.transactionId}`}
      className={`
        flex items-center justify-between py-3 px-4
        hover:bg-gray-50 transition-colors duration-150
        min-h-[56px] border-b border-gray-100 last:border-b-0
        ${className}
      `.trim()}
      aria-label={`${transaction.merchant}, ${displayAmount}, ${formatDateShort(transaction.date)}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-gray-900 truncate">
          {transaction.merchant}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-gray-500">
            {formatDateShort(transaction.date)}
          </span>
          {transaction.tierBenefit && transaction.tierBenefit.benefitValue > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              {transaction.tierBenefit.description}
            </span>
          )}
        </div>
      </div>
      <span
        className={`text-base font-semibold ml-4 whitespace-nowrap ${
          isCredit ? 'text-emerald-600' : 'text-gray-900'
        }`}
      >
        {displayAmount}
      </span>
    </Link>
  )
}
