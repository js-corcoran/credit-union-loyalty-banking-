'use client'

import Link from 'next/link'
import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

interface ActionSectionProps {
  currentTier: TierType
  balanceGap: number
  autopayGap: number
  nextTierName: string
}

export function ActionSection({
  currentTier,
  balanceGap,
  autopayGap,
  nextTierName,
}: ActionSectionProps) {
  const primaryAction =
    balanceGap > 0
      ? {
          label: `Increase balance by ${formatCurrency(balanceGap)} to qualify for ${nextTierName}`,
          cta: 'Transfer Money',
          href: '/transfer',
        }
      : autopayGap > 0
        ? {
            label: `Add ${autopayGap} more autopay${autopayGap !== 1 ? 's' : ''} to qualify for ${nextTierName}`,
            cta: 'Add Autopay',
            href: '/autopay/add',
          }
        : null

  return (
    <section aria-label="Next steps">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>

      {primaryAction && (
        <Card className="p-4 md:p-5 mb-4 border-l-4 border-l-blue-500">
          <p className="text-base font-semibold text-gray-900 mb-3">
            {primaryAction.label}
          </p>
          <Link href={primaryAction.href}>
            <Button variant="primary" size="md">
              {primaryAction.cta}
            </Button>
          </Link>
        </Card>
      )}

      {!primaryAction && (
        <Card className="p-4 md:p-5 mb-4 border-l-4 border-l-emerald-500">
          <p className="text-base font-semibold text-emerald-700">
            You&apos;re at the highest tier! Keep maintaining your balance and autopays.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/loyalty/tier-details"
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-base font-medium text-gray-700 min-h-[48px]"
        >
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View tier details
        </Link>
        <Link
          href="/loyalty/benefits"
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-base font-medium text-gray-700 min-h-[48px]"
        >
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View your benefits
        </Link>
        <Link
          href="/autopay"
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-base font-medium text-gray-700 min-h-[48px]"
        >
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Manage autopay
        </Link>
      </div>
    </section>
  )
}
