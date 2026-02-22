'use client'

import { useState } from 'react'
import Link from 'next/link'

interface GracePeriodExplainerProps {
  gracePeriodDays: number
  tierName: string
}

export function GracePeriodExplainer({ gracePeriodDays, tierName }: GracePeriodExplainerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section aria-label="Grace period information">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors min-h-[48px] text-left"
        aria-expanded={expanded}
      >
        <h3 className="text-xl font-bold text-gray-900">
          What if I lose qualification?
        </h3>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-4 pt-2 space-y-4">
          <div>
            <p className="text-base font-semibold text-gray-900 mb-1">You have time to act</p>
            <p className="text-base text-gray-600">
              If your qualification criteria lapse, you have a <span className="font-bold">{gracePeriodDays}-day grace period</span> before your tier changes. This gives you time to restore your balance or add an autopay.
            </p>
          </div>

          <div>
            <p className="text-base font-semibold text-gray-900 mb-1">What triggers a tier change?</p>
            <ul className="list-disc list-inside text-base text-gray-600 space-y-1">
              <li>Your rolling balance drops below the minimum for {tierName}</li>
              <li>Your active autopays fall below the required count</li>
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-gray-900 mb-1">What happens after {gracePeriodDays} days?</p>
            <p className="text-base text-gray-600">
              On day {gracePeriodDays + 1}, your tier automatically adjusts to the tier you currently qualify for. You&apos;ll be notified before this happens.
            </p>
          </div>

          <div>
            <p className="text-base font-semibold text-gray-900 mb-1">How to maintain your tier</p>
            <ul className="list-disc list-inside text-base text-gray-600 space-y-1">
              <li>Keep your balance above the tier minimum</li>
              <li>Maintain the required number of active autopays</li>
              <li>We&apos;ll send proactive alerts at 30, 14, and 7 days before any change</li>
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-gray-900 mb-1">Can I re-qualify?</p>
            <p className="text-base text-gray-600">
              Yes! If your tier does change, you can re-qualify at any time by meeting the requirements again. Your new tier will take effect as soon as you qualify.
            </p>
          </div>

          <Link
            href="/loyalty/account-status"
            className="inline-flex items-center text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px]"
          >
            View your account status to see specific actions
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  )
}
