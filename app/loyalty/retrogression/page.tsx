'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRetrogressionStatus, RetrogressionStatusResponse } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { TierBadge } from '@/components/loyalty/TierBadge'

const severityConfig = {
  '30-day': {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900',
    label: 'Warning',
  },
  '14-day': {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-900',
    label: 'Urgent',
  },
  final: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    label: 'Final Notice',
  },
}

function getAlertTitle(severity: string, tierName: string): string {
  if (severity === 'final') return `Your ${tierName} Tier Ends Tomorrow`
  if (severity === '14-day') return `Your ${tierName} Tier Ends in 14 Days`
  return `Your ${tierName} Tier is at Risk`
}

export default function RetrogressionPage() {
  const [data, setData] = useState<RetrogressionStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [graceExpanded, setGraceExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await getRetrogressionStatus('MEMBER-001')
        setData(status)
      } catch {
        setError('Unable to load your tier status.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-4" aria-busy="true">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded-xl" />
            <div className="h-40 w-full bg-gray-100 rounded-xl" />
            <div className="h-24 w-full bg-gray-100 rounded-xl" />
          </div>
        </main>
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error || 'Unable to determine tier status.'}</p>
            <Link href="/loyalty">
              <Button variant="primary">Go to Loyalty Hub</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  // No risk — tier is secure
  if (!data.isAtRisk) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/loyalty" className="hover:text-gray-700 hover:underline">Loyalty</Link></li>
              <li aria-hidden="true">/</li>
              <li><span className="text-gray-900 font-medium">Tier Status</span></li>
            </ol>
          </nav>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Tier is Secure</h1>
            <p className="text-base text-gray-600 mb-4">
              Your {data.currentTier === 'plus' ? 'Plus' : data.currentTier === 'premium' ? 'Premium' : 'Classic'} tier
              is secure. You&apos;re above the minimum balance.
            </p>
            <Link href="/loyalty/account-status">
              <Button variant="outline">View Account Status</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  const config = severityConfig[data.severity]
  const tierName = data.currentTier === 'plus' ? 'Plus' : data.currentTier === 'premium' ? 'Premium' : 'Classic'
  const lowerTierName = data.currentTier === 'premium' ? 'Plus' : 'Classic'
  const balanceGap = Math.abs(data.qualificationStatus.balanceGap)
  const endDate = new Date(data.gracePeriod.endDate)

  return (
    <>
      <Header />
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/loyalty" className="hover:text-gray-700 hover:underline">Loyalty</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Tier at Risk</span></li>
          </ol>
        </nav>

        {/* Alert Header */}
        <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-5 mb-6`} role="alert">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${config.titleColor}`}>
                {getAlertTitle(data.severity, tierName)}
              </h1>
              <p className="text-base text-gray-700 mt-1">
                {data.riskReason === 'balance' && (
                  <>Your balance is {formatCurrency(balanceGap)} below the {tierName} tier minimum ({formatCurrency(data.qualificationStatus.requiredBalance)})</>
                )}
                {data.riskReason === 'autopay' && (
                  <>You have {data.qualificationStatus.currentAutopayCount} autopay{data.qualificationStatus.currentAutopayCount !== 1 ? 's' : ''} (need {data.qualificationStatus.requiredAutopayCount} for {tierName})</>
                )}
                {data.riskReason === 'both' && (
                  <>Your balance and autopay count are below {tierName} tier requirements</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <TierBadge tier={data.currentTier} size="small" showLabel />
            <div>
              <p className="text-sm text-gray-500">Current Tier</p>
              <p className="text-base font-bold text-gray-900">{tierName}</p>
            </div>
          </div>

          <dl className="space-y-2 mb-4">
            {(data.riskReason === 'balance' || data.riskReason === 'both') && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Your rolling balance</dt>
                <dd className="text-sm text-red-600 font-bold">
                  {formatCurrency(data.qualificationStatus.currentBalance)}
                  <span className="text-gray-400 font-normal ml-1">
                    (need {formatCurrency(data.qualificationStatus.requiredBalance)})
                  </span>
                </dd>
              </div>
            )}
            {(data.riskReason === 'autopay' || data.riskReason === 'both') && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Your autopays</dt>
                <dd className="text-sm text-red-600 font-bold">
                  {data.qualificationStatus.currentAutopayCount}
                  <span className="text-gray-400 font-normal ml-1">
                    (need {data.qualificationStatus.requiredAutopayCount})
                  </span>
                </dd>
              </div>
            )}
          </dl>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Days to take action</p>
            <p
              className="text-3xl font-bold text-gray-900"
              aria-label={`${data.gracePeriod.daysRemaining} days remaining until your tier changes`}
            >
              {data.gracePeriod.daysRemaining}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Deadline: {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Benefits at Risk */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Benefits You&apos;ll Lose</h2>
          <ul className="space-y-3" aria-label="Benefits at risk">
            {data.benefitsAtRisk.map((b) => (
              <li key={b.benefitId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-base font-medium text-gray-900">{b.name}</p>
                  <p className="text-sm text-gray-500">{b.description}</p>
                </div>
                <span className="text-base font-bold text-gray-900">{formatCurrency(b.annualValue)}/yr</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-base font-bold text-gray-900">Total at risk</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(data.totalAnnualValueAtRisk)}/yr</p>
          </div>
        </div>

        {/* Recovery Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What You Can Do</h2>
          <div className="space-y-3">
            {data.recoveryActions.map((action, i) => (
              <div key={i}>
                {action.action === 'transfer' && action.amountNeeded && (
                  <Link href={`/transfer`} className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer min-h-[48px]">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-bold text-blue-900">Transfer {formatCurrency(action.amountNeeded)} to your account</p>
                        <p className="text-sm text-blue-700">Bring your balance above the {tierName} minimum</p>
                      </div>
                    </div>
                  </Link>
                )}
                {action.action === 'autopay' && (
                  <Link href="/autopay/add" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer min-h-[48px]">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-bold text-blue-900">Add an autopay</p>
                        <p className="text-sm text-blue-700">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            <span className="font-bold text-red-600">Action required by:</span>{' '}
            {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at 11:59 PM
          </p>
        </div>

        {/* Grace Period Explainer */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl mb-6">
          <button
            onClick={() => setGraceExpanded(!graceExpanded)}
            aria-expanded={graceExpanded}
            className="w-full flex items-center justify-between p-4 text-left min-h-[48px]"
          >
            <span className="text-base font-bold text-gray-900">How much time do I have?</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${graceExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {graceExpanded && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-amber-500 rounded-full"
                      style={{ width: `${Math.max(5, ((30 - data.gracePeriod.daysRemaining) / 30) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Day 0</span>
                    <span className="text-xs text-gray-500">{data.gracePeriod.daysRemaining} days left</span>
                    <span className="text-xs text-red-600 font-medium">Day 30</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Your grace period started on{' '}
                {new Date(data.gracePeriod.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                After{' '}
                {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })},
                your tier will change to {lowerTierName}.
              </p>
              <p className="text-sm text-gray-600">
                Once your tier changes, it takes 30 days of maintaining {tierName} qualifications to move back up.
              </p>
            </div>
          )}
        </div>

        {/* Support Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help? We&apos;re here for you.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/loyalty/faq"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
            >
              FAQ
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="tel:1-800-555-0100"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
            >
              Call 1-800-555-0100
            </a>
            <span className="text-gray-300">|</span>
            <Link
              href="/help"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
            >
              Support
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
