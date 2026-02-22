'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TierType, TierConfiguration } from '@/lib/types'
import { getTierDetails, TierDetailsResponse } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { TierTabs } from '@/components/loyalty/TierTabs'
import { RequirementsChecklist } from '@/components/loyalty/RequirementsChecklist'
import { RollingBalanceDiagram } from '@/components/loyalty/RollingBalanceDiagram'
import { AutopayRulesTable } from '@/components/loyalty/AutopayRulesTable'
import { GracePeriodExplainer } from '@/components/loyalty/GracePeriodExplainer'
import { BenefitCard } from '@/components/loyalty/BenefitCard'
import { TierProgressionCTA } from '@/components/loyalty/TierProgressionCTA'
import { LoyaltyAmountBadge } from '@/components/loyalty/LoyaltyAmountBadge'
import { Button } from '@/components/shared/Button'
import { useTierGap } from '@/context/LoyaltyTransferContext'
import { getTierDisplayName, getNextTier } from '@/lib/loyalty-transfer/utils'

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

const tierSummaries: Record<TierType, string> = {
  classic: 'Maintain $2,500+ balance and 1 autopay to qualify',
  plus: 'Maintain $10,000+ balance and 2 autopays to qualify',
  premium: 'Maintain $25,000+ balance and 3 autopays to qualify',
}

function TierDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading tier details">
      <div className="flex border-b border-gray-200">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 py-3 px-4">
            <div className="h-5 w-16 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-7 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
      <div className="h-48 bg-gray-100 rounded-xl" />
    </div>
  )
}

function BenefitsForTier({
  tier,
  memberBalance,
}: {
  tier: TierConfiguration
  memberBalance: number
}) {
  const benefits = tier.benefits.map((b) => {
    let value = 0
    let note = ''
    if (b.benefitType === 'apy-boost') {
      value = (memberBalance * (b.apyBoostPercentage || 0)) / 100
      note = `Based on your ${formatCurrency(memberBalance)} balance`
    } else if (b.benefitType === 'fee-waiver') {
      value = 2 * 12 * (b.feeAmount || 0)
      note = 'Based on ~2 transfers/month'
    } else if (b.benefitType === 'third-party-rewards') {
      value = 15000 * (b.rewardRate || 0)
      note = 'Based on your purchase history'
    }
    return {
      benefitId: b.benefitId,
      benefitName: b.benefitName,
      benefitType: b.benefitType,
      description: b.description,
      annualValue: Math.round(value * 100) / 100,
      personalizationNote: note,
    }
  })

  const totalValue = benefits.reduce((s, b) => s + b.annualValue, 0)

  return (
    <section aria-label={`${tier.tierName} benefits`}>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Benefits at {tier.tierName} Tier
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        {benefits.map((b) => (
          <BenefitCard
            key={b.benefitId}
            benefitName={b.benefitName}
            benefitType={b.benefitType}
            description={b.description}
            annualValue={b.annualValue}
            personalizationNote={b.personalizationNote}
          />
        ))}
      </div>
      <p className="text-base text-gray-600">
        Total annual value:{' '}
        <span className="font-bold text-emerald-600">
          {formatCurrency(totalValue)}/year
        </span>
      </p>
    </section>
  )
}

function TierProgressionSection({
  data,
  activeTier,
}: {
  data: TierDetailsResponse
  activeTier: TierType
}) {
  const { gap, isLoading: gapLoading, refresh } = useTierGap()

  const nextTier = getNextTier(data.currentTier)
  const isCurrentOrLowerTier = activeTier === data.currentTier || (
    activeTier === 'classic' && data.currentTier !== 'classic'
  ) || (
    activeTier === 'plus' && data.currentTier === 'premium'
  )

  const balanceGap = gap?.tierGapAmount ?? data.memberStatus.balanceGapToNextTier
  const targetTier = nextTier ?? 'premium'
  const targetTierConfig = data.tiers.find((t) => t.tierId === targetTier)

  const tierBenefits = targetTierConfig?.benefits.map((b) => ({
    label: b.benefitName,
    value: b.description,
    annualSavings: b.benefitType === 'apy-boost'
      ? (data.memberStatus.qualifyingBalance * (b.apyBoostPercentage || 0)) / 100
      : b.benefitType === 'fee-waiver'
      ? 2 * 12 * (b.feeAmount || 0)
      : 0,
  })) ?? []

  if (data.currentTier === 'premium') {
    return (
      <section aria-label="Actions" className="space-y-3">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 text-center">
          <p className="text-base font-semibold text-emerald-700">
            You have reached the highest tier — Premium
          </p>
        </div>
        <Link href="/loyalty/account-status">
          <Button variant="secondary" size="md" className="w-full mt-3">
            View your account status
          </Button>
        </Link>
      </section>
    )
  }

  return (
    <section aria-label="Tier progression actions" className="space-y-4">
      {/* Balance gap badge */}
      {balanceGap > 0 && !isCurrentOrLowerTier && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base text-gray-700">Balance gap:</span>
          <LoyaltyAmountBadge
            amount={balanceGap}
            isStale={gap?.calculatedAt ? (Date.now() - new Date(gap.calculatedAt).getTime() > 15 * 60 * 1000) : false}
            showRefresh
            onRefresh={refresh}
          />
        </div>
      )}

      {/* Smart CTA */}
      <TierProgressionCTA
        currentTier={data.currentTier}
        targetTier={targetTier}
        tierGapAmount={balanceGap}
        currentBalance={gap?.currentBalance ?? data.memberStatus.qualifyingBalance}
        tierThreshold={gap?.nextTierThreshold ?? (targetTierConfig?.requirements.minimumBalance || 0)}
        destinationAccountId={gap?.destinationAccountId ?? 'SAV-5432'}
        destinationAccountName="Savings"
        destinationBalance={gap?.currentBalance ?? data.memberStatus.qualifyingBalance}
        tierBenefits={tierBenefits}
        isLoading={gapLoading}
        isDisabled={isCurrentOrLowerTier || balanceGap <= 0}
        disabledReason={
          isCurrentOrLowerTier
            ? `You already qualify for ${getTierDisplayName(activeTier)}`
            : balanceGap <= 0
            ? `You already qualify for ${getTierDisplayName(targetTier)}`
            : undefined
        }
      />

      {/* Secondary action */}
      <Link href="/loyalty/account-status">
        <Button variant="secondary" size="md" className="w-full mt-2">
          View your account status
        </Button>
      </Link>
    </section>
  )
}

export default function TierDetailsPage() {
  const [data, setData] = useState<TierDetailsResponse | null>(null)
  const [activeTier, setActiveTier] = useState<TierType>('plus')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getTierDetails('MEMBER-001')
      setData(result)
      setActiveTier(result.currentTier)
    } catch {
      setError('Unable to load tier information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedTierConfig = data?.tiers.find((t) => t.tierId === activeTier)
  const memberBalance = data?.memberStatus.qualifyingBalance || 0

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
            <li><span className="text-gray-900 font-medium">Tier Details</span></li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Understand Your Tiers
          </h1>
          <p className="text-base text-gray-600">
            Compare requirements and benefits across all three tiers
          </p>
        </div>

        {loading && <TierDetailsSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {!loading && !error && data && selectedTierConfig && (
          <div className="space-y-8">
            {/* Tab Navigation */}
            <TierTabs
              activeTier={activeTier}
              currentMemberTier={data.currentTier}
              onTabChange={setActiveTier}
            />

            {/* Tab Panel */}
            <div
              role="tabpanel"
              id={`tier-panel-${activeTier}`}
              aria-labelledby={`tier-tab-${activeTier}`}
              className="space-y-8"
            >
              {/* Tier Summary */}
              <div className="flex items-center gap-4">
                <TierBadge tier={activeTier} size="large" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tierNames[activeTier]} Tier
                  </h2>
                  <p className="text-base text-gray-600 mt-0.5">
                    {tierSummaries[activeTier]}
                  </p>
                </div>
              </div>

              {/* Requirements Checklist */}
              <RequirementsChecklist
                tier={activeTier}
                tierName={tierNames[activeTier]}
                requirements={selectedTierConfig.requirements}
                memberStatus={data.memberStatus}
              />

              {/* Rolling Balance Diagram */}
              <RollingBalanceDiagram
                monthlyBalances={data.memberStatus.rollingBalance3Month}
              />

              {/* Autopay Rules Table */}
              <AutopayRulesTable
                rules={data.autopayRules}
                memberAutopayTypes={data.memberStatus.autopayTypes}
              />

              {/* Benefits */}
              <BenefitsForTier
                tier={selectedTierConfig}
                memberBalance={memberBalance}
              />

              {/* Grace Period */}
              <GracePeriodExplainer
                gracePeriodDays={selectedTierConfig.gracePeriodDays}
                tierName={tierNames[activeTier]}
              />

              {/* Smart Transfer CTA */}
              <TierProgressionSection
                data={data}
                activeTier={activeTier}
              />
            </div>
          </div>
        )}
      </main>
    </>
  )
}
