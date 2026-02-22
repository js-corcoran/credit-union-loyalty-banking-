'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLoyaltySummary, LoyaltySummaryResponse } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { BenefitsSummaryRegion } from '@/components/loyalty/BenefitsSummaryRegion'
import { AccountStatusRegion } from '@/components/loyalty/AccountStatusRegion'
import { ProgressRegion } from '@/components/loyalty/ProgressRegion'
import { ActionSection } from '@/components/loyalty/ActionSection'
import { FAQSection } from '@/components/loyalty/FAQSection'
import { SupportSection } from '@/components/loyalty/SupportSection'
import { Button } from '@/components/shared/Button'

const tierNames: Record<string, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

function LoyaltyHubSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading loyalty information">
      {/* Tier Status Skeleton */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3" />
        <div className="h-7 w-40 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-5 w-56 bg-gray-200 rounded mx-auto" />
      </div>

      {/* Benefits Skeleton */}
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="h-5 w-20 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Status Skeleton */}
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Skeleton */}
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="h-3 w-full bg-gray-200 rounded-full mb-3" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function LoyaltyHubPage() {
  const [summary, setSummary] = useState<LoyaltySummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLoyaltySummary('MEMBER-001')
      setSummary(data)
    } catch {
      setError('Unable to load your tier status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Header />
      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-900 font-medium">Loyalty</span>
            </li>
          </ol>
        </nav>

        <h1 className="sr-only">Loyalty Benefits</h1>

        {loading && <LoyaltyHubSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && summary && (
          <div className="space-y-8">
            {/* Tier Status Region */}
            <section
              className="bg-gray-50 rounded-xl p-6 text-center"
              aria-label="Your loyalty tier status"
            >
              <div className="flex justify-center mb-3">
                <TierBadge
                  tier={summary.currentTier}
                  size="large"
                  onClick={() => {}}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {tierNames[summary.currentTier]} Tier
              </h2>
              <p className="text-base text-gray-600">
                You&apos;re earning{' '}
                <span className="font-bold text-emerald-600">
                  {formatCurrency(summary.annualBenefitValue)}/year
                </span>{' '}
                in benefits
              </p>
            </section>

            {/* Benefits Summary */}
            <BenefitsSummaryRegion benefits={summary.benefits} />

            {/* Total Annual Value */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 md:p-5 text-center">
              <p className="text-base text-emerald-800">
                Your {tierNames[summary.currentTier]} tier gives you
              </p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {formatCurrency(summary.annualBenefitValue)}/year in total benefits
              </p>
              {summary.nextTierThreshold && (
                <p className="text-sm text-emerald-600 mt-2">
                  If you upgraded to {tierNames[summary.nextTierThreshold.tier]}, you could earn even more
                </p>
              )}
            </div>

            {/* Account Status */}
            <AccountStatusRegion
              totalQualifyingBalance={summary.totalQualifyingBalance}
              autopayCount={summary.autopayStatus.totalCount}
              autopayExpirationDate={summary.autopayStatus.expirationDate}
            />

            {/* Progress to Next Tier */}
            {summary.nextTierThreshold && (
              <ProgressRegion
                currentTier={summary.currentTier}
                currentBalance={summary.totalQualifyingBalance}
                nextTier={summary.nextTierThreshold.tier}
                nextTierMinBalance={summary.nextTierThreshold.minimumBalance}
                balanceGap={summary.nextTierThreshold.balanceGap}
                autopayGap={summary.nextTierThreshold.autopayGap}
              />
            )}

            {/* Action Section */}
            {summary.nextTierThreshold ? (
              <ActionSection
                currentTier={summary.currentTier}
                balanceGap={summary.nextTierThreshold.balanceGap}
                autopayGap={summary.nextTierThreshold.autopayGap}
                nextTierName={tierNames[summary.nextTierThreshold.tier]}
              />
            ) : (
              <ActionSection
                currentTier={summary.currentTier}
                balanceGap={0}
                autopayGap={0}
                nextTierName=""
              />
            )}

            {/* FAQ Section */}
            <FAQSection />

            {/* Support Section */}
            <SupportSection />
          </div>
        )}
      </main>
    </>
  )
}
