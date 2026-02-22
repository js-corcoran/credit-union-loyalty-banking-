'use client'

import Link from 'next/link'
import { TierType } from '@/lib/types'
import { formatDateShort } from '@/lib/formatting'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'

interface AutopayItem {
  autopayId: string
  type: string
  status: 'active' | 'expiring-soon' | 'expired'
  expirationDate: Date
  contributesToTier: TierType[]
}

interface AutopayStatusListProps {
  autopays: AutopayItem[]
  requiredCount: number
}

const typeLabels: Record<string, string> = {
  loan: 'Loan autopay',
  bill: 'Bill payment',
  'credit-card': 'Credit card autopay',
}

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  active: { label: 'Active', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  'expiring-soon': { label: 'Expiring Soon', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  expired: { label: 'Expired', bgColor: 'bg-red-50', textColor: 'text-red-700' },
}

export function AutopayStatusList({ autopays, requiredCount }: AutopayStatusListProps) {
  const activeCount = autopays.filter((a) => a.status !== 'expired').length

  if (autopays.length === 0) {
    return (
      <section aria-label="Your autopays">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Your Autopays</h3>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-base text-gray-600 mb-4">
            No active autopays. Add one to maintain or advance your tier.
          </p>
          <Link href="/autopay/add">
            <Button variant="primary">Add Autopay</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Your autopays">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900">Your Autopays</h3>
        <span className="text-sm text-gray-500">
          {activeCount} of {requiredCount} required
        </span>
      </div>
      <div className="space-y-3">
        {autopays.map((autopay) => {
          const config = statusConfig[autopay.status]
          const daysToExpiry = Math.ceil(
            (autopay.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )

          return (
            <Card
              key={autopay.autopayId}
              className="p-4"
              ariaLabel={`${typeLabels[autopay.type] || autopay.type}, ${config.label}, expires ${formatDateShort(autopay.expirationDate)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {autopay.status === 'active' && (
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {autopay.status === 'expiring-soon' && (
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {autopay.status === 'expired' && (
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {typeLabels[autopay.type] || autopay.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {formatDateShort(autopay.expirationDate)}
                      {daysToExpiry > 0 && daysToExpiry <= 60 && (
                        <span className="ml-1">({daysToExpiry} days)</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
      <div className="mt-3">
        <Link
          href="/autopay/add"
          className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
        >
          Add autopay
        </Link>
      </div>
    </section>
  )
}
