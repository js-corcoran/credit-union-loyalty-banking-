'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTierStatus, TierStatusResponse } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { TierCalculationVisual } from '@/components/loyalty/TierCalculationVisual'
import { QualifyingAccountsList } from '@/components/loyalty/QualifyingAccountsList'
import { AutopayStatusList } from '@/components/loyalty/AutopayStatusList'
import { TierLossRiskAlert } from '@/components/loyalty/TierLossRiskAlert'
import { AdvancementPathCard } from '@/components/loyalty/AdvancementPathCard'
import { Button } from '@/components/shared/Button'
import { TierType } from '@/lib/types'

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

function AccountStatusSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading account status">
      {/* Tier header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Calculation visual */}
      <div className="bg-gray-100 rounded-xl p-6 h-24" />
      {/* Accounts table */}
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
        <div className="bg-white border border-gray-200 rounded-xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-3 px-4 border-b border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Autopays */}
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      {/* Advancement */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-3 w-full bg-gray-200 rounded-full mb-3" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export default function AccountStatusPage() {
  const [data, setData] = useState<TierStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getTierStatus('MEMBER-001')
      setData(result)
    } catch {
      setError('Unable to calculate your tier status. Please contact support.')
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
              <Link href="/" className="hover:text-gray-700 hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/loyalty" className="hover:text-gray-700 hover:underline">Loyalty</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Account Status</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Status
        </h1>
        <p className="text-base text-gray-600 mb-6">
          Your tier qualification breakdown and advancement path
        </p>

        {loading && <AccountStatusSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-8">
            {/* Current Tier Region */}
            <section aria-label="Your current tier" className="flex items-center gap-4">
              <TierBadge tier={data.currentTier} size="large" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  You&apos;re in {tierNames[data.currentTier]} Tier
                </h2>
                <p className="text-base text-gray-600 mt-0.5">
                  You&apos;re earning{' '}
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(data.annualBenefitValue)}/year
                  </span>{' '}
                  in benefits
                </p>
              </div>
            </section>

            {/* Tier Calculation Visual */}
            <TierCalculationVisual
              tier={data.currentTier}
              qualifyingBalance={data.tierCalculation.qualifyingBalance}
              autopayCount={data.tierCalculation.autopayCount}
            />

            {/* Tier Loss Risk Alert (conditional) */}
            <TierLossRiskAlert
              isAtRisk={data.riskStatus.isAtRisk}
              riskType={data.riskStatus.riskType}
              daysRemaining={data.riskStatus.daysUntilThreshold}
              recoverySteps={data.riskStatus.recoverySteps}
            />

            {/* Qualifying Accounts */}
            <QualifyingAccountsList
              accounts={data.qualifyingAccounts}
              currentTier={data.currentTier}
            />

            {/* Autopay Status */}
            <AutopayStatusList
              autopays={data.autopayStatus}
              requiredCount={
                data.currentTier === 'classic' ? 1
                : data.currentTier === 'plus' ? 2
                : 3
              }
            />

            {/* Advancement Path */}
            {data.nextTierThreshold && (
              <AdvancementPathCard
                currentTier={data.currentTier}
                nextTier={data.nextTierThreshold.tier}
                currentBalance={data.tierCalculation.qualifyingBalance}
                minimumBalance={data.nextTierThreshold.minimumBalance}
                balanceGap={data.nextTierThreshold.balanceGap}
                autopayGap={data.nextTierThreshold.autopayGap}
              />
            )}

            {/* Action Section */}
            <section aria-label="Actions" className="space-y-3">
              {data.nextTierThreshold && data.nextTierThreshold.balanceGap > 0 && (
                <Link href="/transfer" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    Increase balance by {formatCurrency(data.nextTierThreshold.balanceGap)}
                  </Button>
                </Link>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/autopay" className="block">
                  <Button variant="secondary" size="md" className="w-full">
                    Review autopay
                  </Button>
                </Link>
                <Link href="/loyalty/tier-details" className="block">
                  <Button variant="outline" size="md" className="w-full">
                    View tier comparison
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  )
}
