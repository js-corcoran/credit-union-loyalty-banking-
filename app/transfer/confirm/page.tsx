'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransfer } from '@/context/TransferContext'
import { useTierGap } from '@/context/LoyaltyTransferContext'
import { getAccountDetail, initiateTransfer, AccountDetail } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { getTierDisplayName, getNextTier } from '@/lib/loyalty-transfer/utils'
import { TierLevel } from '@/lib/loyalty-transfer/types'
import { Button } from '@/components/shared/Button'

type Step = 'confirm' | 'processing' | 'success' | 'error'

function LoyaltyImpactSection({
  toAccountBalance,
  amount,
  targetTier,
  gap,
}: {
  toAccountBalance: number
  amount: number
  targetTier: TierLevel
  gap: ReturnType<typeof useTierGap>['gap']
}) {
  const projectedBalance = toAccountBalance + amount
  const threshold = gap?.nextTierThreshold ?? 0
  const wouldQualify = threshold > 0 && projectedBalance >= threshold
  const targetName = getTierDisplayName(targetTier)

  const tierBenefits = useMemo(() => {
    if (targetTier === 'plus') {
      return [
        { label: 'APY on Savings', value: '0.95%', savings: 45 },
        { label: 'ATM Fee Waiver', value: '$0.50/mo', savings: 6 },
        { label: 'Included Autopays', value: '2 free', savings: 0 },
      ]
    }
    if (targetTier === 'premium') {
      return [
        { label: 'APY on Savings', value: '1.25%', savings: 125 },
        { label: 'ATM Fee Waiver', value: '$0.50/mo', savings: 6 },
        { label: 'Included Autopays', value: 'Unlimited', savings: 0 },
      ]
    }
    return [
      { label: 'Standard APY', value: '0.25%', savings: 2 },
    ]
  }, [targetTier])

  const totalSavings = tierBenefits.reduce((s, b) => s + b.savings, 0)

  return (
    <section
      aria-label="Loyalty tier impact"
      className={`rounded-xl p-5 mb-6 ${
        wouldQualify
          ? 'bg-teal-50 border border-teal-200'
          : 'bg-amber-50 border border-amber-200'
      }`}
    >
      <h2 className="text-base font-bold text-gray-900 mb-3">
        Tier Impact
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
          <span className="text-sm text-gray-600">Projected balance after transfer</span>
          <span className="text-base font-bold text-gray-900">{formatCurrency(projectedBalance)}</span>
        </div>

        <div className="flex items-center gap-2 py-2">
          {wouldQualify ? (
            <>
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-emerald-700">
                Qualifies for {targetName} Tier
              </span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <span className="text-base font-semibold text-amber-700">
                Won&apos;t reach {targetName} Tier with this amount
              </span>
            </>
          )}
        </div>

        {wouldQualify && (
          <>
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">{targetName} Tier Benefits:</p>
              <ul className="space-y-1.5">
                {tierBenefits.map((b) => (
                  <li key={b.label} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {b.label} ({b.value})
                    {b.savings > 0 && (
                      <span className="text-emerald-600 font-medium">— saves ${b.savings}/yr</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-gray-200/50">
              <p className="text-sm text-gray-600">
                Est. annual savings:{' '}
                <span className="font-bold text-emerald-600">{formatCurrency(totalSavings)}/year</span>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function TierAchievementSection({
  targetTier,
  amount,
  projectedBalance,
}: {
  targetTier: TierLevel
  amount: number
  projectedBalance: number
}) {
  const targetName = getTierDisplayName(targetTier)
  const nextTier = getNextTier(targetTier)
  const nextTierName = nextTier ? getTierDisplayName(nextTier) : null

  const nextTierThreshold = nextTier === 'plus' ? 10000 : nextTier === 'premium' ? 25000 : 0
  const nextGap = nextTierThreshold > 0 ? Math.max(0, nextTierThreshold - projectedBalance) : 0

  const tierBenefits =
    targetTier === 'plus'
      ? ['0.95% APY on Savings', '$0.50/mo ATM Fee Waiver', '2 Included Autopays']
      : targetTier === 'premium'
      ? ['1.25% APY on Savings', '$0.50/mo ATM Fee Waiver', 'Unlimited Autopays']
      : ['0.25% Standard APY']

  return (
    <div className="space-y-4">
      {/* Tier Achievement Banner */}
      <section
        aria-label="Tier achievement"
        className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 text-center"
        aria-live="polite"
      >
        <p className="text-2xl mb-2" aria-hidden="true">
          {'\ud83c\udf89'}
        </p>
        <h2 className="text-xl font-bold text-teal-800 mb-1">
          {targetName} Tier Achieved!
        </h2>
        <p className="text-base text-teal-700">
          You now have {formatCurrency(projectedBalance)} rolling balance
        </p>
        <div className="mt-4 text-left inline-block">
          <p className="text-sm font-semibold text-teal-800 mb-2">Benefits Active Immediately:</p>
          <ul className="space-y-1">
            {tierBenefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-teal-700">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next Milestone */}
      {nextTier && nextGap > 0 && (
        <section
          aria-label="Next tier milestone"
          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <p className="text-sm font-semibold text-gray-700 mb-1">Next Milestone</p>
          <p className="text-base text-gray-900">
            {nextTierName} Tier (requires {formatCurrency(nextTierThreshold)})
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            You&apos;re {formatCurrency(nextGap)} away
          </p>
          <Link
            href="/loyalty/tier-details"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline mt-2 min-h-[44px]"
          >
            View Tier Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      )}
    </div>
  )
}

export default function TransferConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session, clearSession } = useTransfer()
  const { gap } = useTierGap()

  const isLoyaltyTransfer = searchParams.get('loyalty') === 'true'
  const targetTier = (searchParams.get('targetTier') as TierLevel) || 'plus'

  const [step, setStep] = useState<Step>('confirm')
  const [fromAccount, setFromAccount] = useState<AccountDetail | null>(null)
  const [toAccount, setToAccount] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmationId, setConfirmationId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!session) {
      router.replace('/transfer')
      return
    }

    const fetchAccounts = async () => {
      try {
        const [from, to] = await Promise.all([
          getAccountDetail(session.formData.fromAccountId),
          getAccountDetail(session.formData.toAccountId),
        ])
        setFromAccount(from)
        setToAccount(to)
      } catch {
        // Continue with session data only
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [session, router])

  if (!session) return null

  const { formData, feeWaiverApplied, normalFee, memberTier } = session
  const actualFee = feeWaiverApplied ? 0 : normalFee
  const tierLabel = memberTier === 'plus' ? 'Plus' : memberTier === 'premium' ? 'Premium' : 'Classic'

  const projectedToBalance = (toAccount?.currentBalance ?? 0) + formData.amount

  const handleConfirm = async () => {
    setStep('processing')
    try {
      const result = await initiateTransfer(
        'MEMBER-001',
        formData.fromAccountId,
        formData.toAccountId,
        formData.amount
      )
      setConfirmationId(result.transferId)
      setStep('success')
    } catch {
      setErrorMessage('Unable to process transfer. Please try again or contact support.')
      setStep('error')
    }
  }

  const handleRetry = () => {
    setErrorMessage('')
    setStep('confirm')
  }

  const handleDone = () => {
    clearSession()
    router.push(isLoyaltyTransfer ? '/loyalty' : '/')
  }

  if (loading) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading confirmation">
            <div className="h-7 w-48 bg-gray-200 rounded" />
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Success state
  if (step === 'success') {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Complete</h1>
            <p className="text-base text-gray-600 mb-6">Your transfer has been processed successfully.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Transfer Receipt</h2>
            <dl className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Confirmation #</dt>
                <dd className="text-sm text-gray-900 font-mono font-medium">{confirmationId}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">From</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {fromAccount?.accountName} {fromAccount?.maskedAccountNumber}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">To</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {toAccount?.accountName} {toAccount?.maskedAccountNumber}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Amount</dt>
                <dd className="text-sm text-gray-900 font-semibold">{formatCurrency(formData.amount)}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Fee</dt>
                <dd className="text-sm text-emerald-600 font-medium">
                  {feeWaiverApplied ? '$0.00 (waived)' : formatCurrency(actualFee)}
                </dd>
              </div>
              {formData.memo && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm text-gray-500">Memo</dt>
                  <dd className="text-sm text-gray-900">{formData.memo}</dd>
                </div>
              )}
              <div className="flex justify-between py-2">
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="text-sm text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
              </div>
            </dl>
          </div>

          {feeWaiverApplied && !isLoyaltyTransfer && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-emerald-700 font-medium">
                You saved {formatCurrency(normalFee)} with your {tierLabel} tier fee waiver.
              </p>
            </div>
          )}

          {/* Loyalty Tier Achievement */}
          {isLoyaltyTransfer && (
            <div className="mb-6">
              <TierAchievementSection
                targetTier={targetTier}
                amount={formData.amount}
                projectedBalance={projectedToBalance}
              />
            </div>
          )}

          <div className="space-y-3">
            <Button variant="primary" size="lg" className="w-full" onClick={handleDone}>
              {isLoyaltyTransfer ? 'Return to Loyalty Hub' : 'Return to Home'}
            </Button>
            {isLoyaltyTransfer && (
              <Link href="/loyalty/tier-details" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  View Tier Details
                </Button>
              </Link>
            )}
            {!isLoyaltyTransfer && (
              <Link href={`/accounts/${formData.fromAccountId}`} className="block">
                <Button variant="outline" size="lg" className="w-full">
                  View Account
                </Button>
              </Link>
            )}
          </div>
        </main>
      </>
    )
  }

  // Error state
  if (step === 'error') {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-red-900 mb-2">Transfer Failed</h1>
            <p className="text-base text-red-800 mb-6">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={handleRetry}>Try Again</Button>
              <Link href="/transfer">
                <Button variant="outline">Edit Transfer</Button>
              </Link>
              <Link href="/help">
                <Button variant="secondary">Contact Support</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Confirm state (default)
  return (
    <>
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/transfer" className="hover:text-gray-700 hover:underline">Transfer</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Confirm</span></li>
          </ol>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm Transfer</h1>

        {/* Transfer Details */}
        <section aria-label="Transfer details" className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Transfer Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">From</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {fromAccount?.accountName} {fromAccount?.maskedAccountNumber}
                {fromAccount && (
                  <span className="text-gray-400 ml-1">({formatCurrency(fromAccount.currentBalance)})</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">To</dt>
              <dd className="text-sm text-gray-900 font-medium">
                {toAccount?.accountName} {toAccount?.maskedAccountNumber}
              </dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="text-xl font-bold text-gray-900">{formatCurrency(formData.amount)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="text-sm text-gray-900">Today</dd>
            </div>
            {formData.memo && (
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Memo</dt>
                <dd className="text-sm text-gray-900">{formData.memo}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Loyalty Impact Section */}
        {isLoyaltyTransfer && (
          <LoyaltyImpactSection
            toAccountBalance={toAccount?.currentBalance ?? 0}
            amount={formData.amount}
            targetTier={targetTier}
            gap={gap}
          />
        )}

        {/* Fee Impact */}
        <section
          aria-label={feeWaiverApplied ? 'Fee waived with your tier' : 'Transfer fee applies'}
          className={`rounded-xl p-5 mb-6 ${
            feeWaiverApplied
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-amber-50 border border-amber-200'
          }`}
          aria-live="polite"
        >
          <h2 className="text-base font-bold text-gray-900 mb-3">Your Fee</h2>

          {feeWaiverApplied ? (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-emerald-800">
                  Your {tierLabel} tier saves you {formatCurrency(normalFee)}
                </p>
              </div>
              <div className="flex items-center gap-4 mb-2 ml-[52px]">
                <span className="text-sm text-gray-400 line-through">
                  Fee: {formatCurrency(normalFee)}
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  $0.00
                </span>
              </div>
              <p className="text-sm text-emerald-700 ml-[52px]">
                Fee-free transfers are included with your tier.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    This transfer costs {formatCurrency(normalFee)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    With Plus tier, you&apos;d save {formatCurrency(normalFee)} on transfers.
                  </p>
                </div>
              </div>
              <Link
                href="/loyalty/tier-details"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium ml-[52px] mt-1 inline-flex items-center min-h-[44px]"
              >
                See how to reach Plus tier
              </Link>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleConfirm}
            disabled={step === 'processing'}
          >
            {step === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Confirm Transfer'
            )}
          </Button>
          <Link href="/transfer" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Edit Details
            </Button>
          </Link>
          <button
            onClick={() => { clearSession(); router.push('/') }}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 hover:underline font-medium min-h-[48px] inline-flex items-center justify-center"
          >
            Cancel Transfer
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Your transfer is secure. We use encryption to protect your information.
        </p>
      </main>
    </>
  )
}
