'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AccountTierContext } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'

interface TierContributionRegionProps {
  accountId: string
  tierContext: AccountTierContext
}

const tierLabels: Record<string, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function TierContributionRegion({
  accountId,
  tierContext,
}: TierContributionRegionProps) {
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  useEffect(() => {
    const key = `tierNudgeDismissedUntil_${accountId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      const expiry = new Date(stored)
      if (expiry > new Date()) {
        setNudgeDismissed(true)
      } else {
        localStorage.removeItem(key)
      }
    }
  }, [accountId])

  // Visibility rules: only show when NOT premium AND within $500 of next tier
  const isAtPremium = tierContext.currentTierFromAllAccounts === 'premium'
  const balanceGap = tierContext.nextTierThreshold.balanceShortfall
  const isVisible = !isAtPremium && balanceGap <= 500

  if (!isVisible) return null

  const handleDismissNudge = () => {
    setNudgeDismissed(true)
    const key = `tierNudgeDismissedUntil_${accountId}`
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)
    localStorage.setItem(key, expiry.toISOString())
  }

  const progressPercent = Math.min(
    100,
    (tierContext.allAccountsTotalBalance / tierContext.nextTierThreshold.minimumBalance) * 100
  )

  const otherAccountsBalance = tierContext.allAccountsTotalBalance - tierContext.accountBalance
  const nextTierLabel = tierLabels[tierContext.nextTierThreshold.tier] || tierContext.nextTierThreshold.tier

  return (
    <section
      role="region"
      aria-label="Loyalty tier contribution"
      className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6"
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">
          Loyalty Tier Contribution
        </h2>
        <span className="text-xs text-gray-400 font-medium">Information only</span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700">
          This account&apos;s rolling 3-month balance:{' '}
          <span className="font-semibold">{formatCurrency(tierContext.rollingBalance3Month)}</span>
        </p>
        <p className="text-sm text-gray-700">
          Together with your other accounts, you qualify for:{' '}
          <span className="font-semibold">
            {tierLabels[tierContext.currentTierFromAllAccounts] || tierContext.currentTierFromAllAccounts} Tier
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>
            {formatCurrency(tierContext.allAccountsTotalBalance)} total
          </span>
          <span>
            {formatCurrency(tierContext.nextTierThreshold.minimumBalance)} needed for {nextTierLabel}
          </span>
        </div>
        <div
          className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={tierContext.allAccountsTotalBalance}
          aria-valuemin={0}
          aria-valuemax={tierContext.nextTierThreshold.minimumBalance}
          aria-label={`${formatCurrency(tierContext.allAccountsTotalBalance)} of ${formatCurrency(tierContext.nextTierThreshold.minimumBalance)} needed for ${nextTierLabel} tier`}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #D4A574 0%, #E8C89E 100%)',
            }}
          />
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
          <span>This account: {formatCurrency(tierContext.accountBalance)}</span>
          {otherAccountsBalance > 0 && (
            <span>Other accounts: {formatCurrency(otherAccountsBalance)}</span>
          )}
        </div>
      </div>

      {/* Nudge */}
      {!nudgeDismissed && balanceGap > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
          <p className="text-sm text-blue-800">
            Add {formatCurrency(balanceGap)} to reach {nextTierLabel} tier and unlock additional benefits.
          </p>
          <button
            onClick={handleDismissNudge}
            className="ml-3 flex-shrink-0 w-6 h-6 flex items-center justify-center text-blue-400 hover:text-blue-600 rounded"
            aria-label="Dismiss tier advancement suggestion"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mt-3">
        <Link
          href="/loyalty/faq?search=tier+calculated"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
        >
          How is my tier calculated?
        </Link>
      </div>
    </section>
  )
}
