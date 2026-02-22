'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBenefitDetails, BenefitDetailsResponse, BenefitDetailItem } from '@/lib/api'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { BenefitCalculationBreakdown } from '@/components/loyalty/BenefitCalculationBreakdown'
import { AnnualSummaryCard } from '@/components/loyalty/AnnualSummaryCard'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { TierType } from '@/lib/types'

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

const benefitIcons: Record<string, React.ReactNode> = {
  'apy-boost': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  'fee-waiver': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'third-party-rewards': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
}

function BenefitDetailCard({
  benefit,
  isExpanded,
  onToggle,
  currentTier,
}: {
  benefit: BenefitDetailItem
  isExpanded: boolean
  onToggle: () => void
  currentTier: TierType
}) {
  return (
    <Card
      as="article"
      className="p-4 md:p-5"
      ariaLabel={`${benefit.benefitName} benefit, provides ${formatCurrency(benefit.calculatedAnnualValue)} annually`}
    >
      {/* Header — always visible */}
      <button
        className="w-full text-left flex items-start gap-3 min-h-[48px]"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`benefit-detail-${benefit.benefitId}`}
      >
        <span className="text-blue-600 flex-shrink-0 mt-0.5">
          {benefitIcons[benefit.benefitType]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">{benefit.benefitName}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{benefit.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(benefit.calculatedAnnualValue)}
              </p>
              <p className="text-sm text-gray-500">/year</p>
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      <div
        id={`benefit-detail-${benefit.benefitId}`}
        className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isExpanded}
      >
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {/* Rules */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">How it works</p>
            <p className="text-base text-gray-700">{benefit.rules}</p>
          </div>

          {/* Calculation breakdown */}
          <BenefitCalculationBreakdown
            calculationType={benefit.benefitType}
            formula={benefit.formula}
            memberValues={benefit.memberValues}
            result={benefit.calculatedAnnualValue}
            steps={benefit.steps}
          />

          {/* Tier comparison for this benefit */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">This benefit across tiers</p>
            <div className="grid grid-cols-3 gap-2">
              {(['classic', 'plus', 'premium'] as TierType[]).map((tier) => {
                const comp = benefit.comparisonToOtherTiers[tier]
                const isCurrent = tier === currentTier
                return (
                  <div
                    key={tier}
                    className={`rounded-lg p-3 text-center ${isCurrent ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}
                  >
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {tierNames[tier]}
                      {isCurrent && <span className="text-emerald-600"> (you)</span>}
                    </p>
                    <p className={`text-base font-bold ${isCurrent ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {formatCurrency(comp.value)}
                    </p>
                    <p className="text-xs text-gray-500">{comp.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Proof data — real-dollar proof */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-800 mb-1">Real-dollar proof</p>
            <p className="text-base text-blue-700">
              You earned <strong>{formatCurrency(benefit.proofData.pastYearEarnings)}</strong> from this benefit over the past year
              <span className="text-sm text-blue-600 ml-1">({benefit.proofData.period})</span>
            </p>
          </div>

          {/* Recent examples */}
          {benefit.proofData.recentExamples && benefit.proofData.recentExamples.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Recent examples</p>
              <div className="space-y-2">
                {benefit.proofData.recentExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm text-gray-900">{ex.description}</p>
                      <p className="text-xs text-gray-500">{formatDateShort(new Date(ex.date))}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-emerald-600">
                        +{formatCurrency(ex.amount)} saved
                      </p>
                      <p className="text-xs text-gray-500">{ex.benefitApplied}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner link for third-party rewards */}
          {benefit.partnerName && benefit.partnerURL && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Partner:</span>
              <a
                href={benefit.partnerURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[48px] inline-flex items-center"
              >
                {benefit.partnerName}
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* FAQ link */}
          <Link
            href={`/loyalty/faq?search=${benefit.benefitType}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
          >
            Learn more about {benefit.benefitName}
          </Link>
        </div>
      </div>
    </Card>
  )
}

function BenefitsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading benefits">
      {/* Overview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Benefit cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
      {/* Annual summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-full bg-gray-200 rounded mb-1" />
              <div className="h-2.5 w-full bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BenefitDetailsPage() {
  const [data, setData] = useState<BenefitDetailsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedBenefitId, setExpandedBenefitId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getBenefitDetails('MEMBER-001')
      setData(result)
    } catch {
      setError('Unable to calculate your benefits. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggle = (benefitId: string) => {
    setExpandedBenefitId((prev) => (prev === benefitId ? null : benefitId))
  }

  return (
    <>
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
            <li><span className="text-gray-900 font-medium">Benefits</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Benefits
        </h1>
        <p className="text-base text-gray-600 mb-6">
          Transparent breakdown of every benefit you earn with your loyalty tier
        </p>

        {loading && <BenefitsSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-8">
            {/* Benefit Overview Region */}
            <section aria-label="Benefit overview" className="flex items-center gap-4">
              <TierBadge tier={data.currentTier} size="large" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Benefits in {tierNames[data.currentTier]} Tier
                </h2>
                <p className="text-base text-gray-600 mt-0.5">
                  Total annual value:{' '}
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(data.totalAnnualBenefitValue)}/year
                  </span>
                </p>
              </div>
            </section>

            {/* Benefit Detail Cards */}
            <section aria-label="Your benefits">
              <h3 className="sr-only">Benefit details</h3>
              <div className="space-y-4">
                {data.benefits.map((benefit) => (
                  <BenefitDetailCard
                    key={benefit.benefitId}
                    benefit={benefit}
                    isExpanded={expandedBenefitId === benefit.benefitId}
                    onToggle={() => handleToggle(benefit.benefitId)}
                    currentTier={data.currentTier}
                  />
                ))}
              </div>
            </section>

            {/* Annual Summary */}
            <AnnualSummaryCard
              totalValue={data.totalAnnualBenefitValue}
              breakdown={data.annualSummary.breakdown}
              tierComparison={data.annualSummary.tierComparison}
              memberTier={data.currentTier}
            />

            {/* Action Section */}
            <section aria-label="Actions" className="space-y-3">
              <Link href="/loyalty/account-status" className="block">
                <Button variant="primary" size="lg" className="w-full">
                  Maximize your benefits — review accounts &amp; autopay
                </Button>
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/loyalty/tier-details" className="block">
                  <Button variant="secondary" size="md" className="w-full">
                    Explore {data.currentTier === 'premium' ? 'tier details' : tierNames[data.currentTier === 'classic' ? 'plus' : 'premium'] + ' tier'}
                  </Button>
                </Link>
                <Link href="/loyalty" className="block">
                  <Button variant="outline" size="md" className="w-full">
                    Back to Loyalty Hub
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
