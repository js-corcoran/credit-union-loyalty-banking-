'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/formatting'
import { Card } from '@/components/shared/Card'

interface AccountStatusRegionProps {
  totalQualifyingBalance: number
  autopayCount: number
  autopayExpirationDate: Date
}

export function AccountStatusRegion({
  totalQualifyingBalance,
  autopayCount,
  autopayExpirationDate,
}: AccountStatusRegionProps) {
  const daysToExpiry = Math.ceil(
    (autopayExpirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <section aria-label="Your account status">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Accounts</h2>
      <Card className="p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Qualifying Balance</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalQualifyingBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Autopays</p>
            <p className="text-xl font-bold text-gray-900">
              {autopayCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Days to Expiry</p>
            <p className="text-xl font-bold text-gray-900">
              {daysToExpiry > 0 ? daysToExpiry : 'N/A'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href="/loyalty/account-status"
            className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
          >
            View detailed account status
          </Link>
        </div>
      </Card>
    </section>
  )
}
