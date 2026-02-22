'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getLegacyMigration, markMigrationComplete, LegacyMigrationResponse } from '@/lib/api'
import { formatCurrency, formatNumber } from '@/lib/formatting'
import { Button } from '@/components/shared/Button'
import { TierBadge } from '@/components/loyalty/TierBadge'

type Step = 1 | 2 | 3 | 4 // 4 = completion

function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
        className="flex items-center gap-2 mb-2"
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">
        Step {Math.min(currentStep, totalSteps)} of {totalSteps}
      </p>
    </div>
  )
}

export default function MigrationPage() {
  const router = useRouter()
  const [data, setData] = useState<LegacyMigrationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<Step>(1)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const migration = await getLegacyMigration('MEMBER-001')
        setData(migration)
      } catch {
        setError('Unable to load migration details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (step > 1) {
      stepHeadingRef.current?.focus()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [step])

  const handleComplete = async () => {
    try {
      await markMigrationComplete('MEMBER-001')
    } catch {
      // Continue regardless
    }
    setStep(4)
  }

  const handleSkip = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-6" aria-busy="true">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2 flex-1 bg-gray-200 rounded-full" />
              ))}
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-100 rounded-xl" />
            <div className="h-40 w-full bg-gray-100 rounded-xl" />
          </div>
        </main>
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error || 'Migration data unavailable.'}</p>
            <Link href="/loyalty">
              <Button variant="primary">Go to Loyalty Hub</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  const tierColors: Record<string, string> = {
    classic: '#6B7280',
    plus: '#D4A574',
    premium: '#E8E8E8',
  }

  // Step 4: Completion
  if (step === 4) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re All Set!</h1>
          <p className="text-base text-gray-600 mb-6">
            You&apos;re now enrolled in our {data.newProgram.tierName} Tier loyalty program.
            You don&apos;t need to do anything — benefits start immediately.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Next Steps</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-base">1.</span>
                <Link href="/loyalty" className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Explore your benefits
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-base">2.</span>
                <Link href="/loyalty/tier-details" className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Learn the full program
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-base">3.</span>
                <Link href="/loyalty/faq" className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  View frequently asked questions
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Have questions about your benefits? Visit our{' '}
              <Link href="/loyalty/faq" className="text-blue-600 hover:underline font-medium">FAQ</Link> or call us at{' '}
              <a href="tel:1-800-555-0100" className="text-blue-600 hover:underline font-medium">1-800-555-0100</a>.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/loyalty" className="block">
              <Button variant="primary" size="lg" className="w-full">Get Started</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" size="lg" className="w-full">Go to Home</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/loyalty" className="hover:text-gray-700 hover:underline">Loyalty</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Migration Guide</span></li>
          </ol>
        </nav>

        <ProgressIndicator currentStep={step} totalSteps={3} />

        <div role="region" aria-live="polite" aria-label="Migration wizard">
          {/* Step 1: Welcome / Change Narrative */}
          {step === 1 && (
            <div>
              <h1
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-2xl font-bold text-gray-900 mb-4 outline-none"
              >
                Welcome to Your New Loyalty Program
              </h1>

              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                {data.narrativeText}
              </p>

              {/* Program comparison visual */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-gray-600">Old</span>
                    </div>
                    <p className="text-sm text-gray-600">Legacy Program</p>
                  </div>
                  <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-blue-700">New</span>
                    </div>
                    <p className="text-sm text-gray-600">3-Tier Program</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {(['classic', 'plus', 'premium'] as const).map((tier) => (
                    <div
                      key={tier}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                      style={{ borderColor: tierColors[tier], backgroundColor: tierColors[tier] + '15' }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tierColors[tier] }}
                      />
                      <span className="text-sm font-medium text-gray-800 capitalize">{tier}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
                <div className="flex items-center justify-between">
                  <Link
                    href="/loyalty/tier-details"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
                  >
                    Learn more about tiers
                  </Link>
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Tier Mapping */}
          {step === 2 && (
            <div>
              <h1
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-2xl font-bold text-gray-900 mb-4 outline-none"
              >
                Your New Tier
              </h1>

              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  <TierBadge tier={data.newProgram.mappedTier} size="large" showLabel />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Your New Tier: {data.newProgram.tierName}
                </h2>
                <p className="text-base text-gray-600 text-center">
                  You automatically qualify based on your current account activity
                </p>
              </div>

              {/* Qualification checklist */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">Your Qualification</h3>
                <ul className="space-y-3" aria-label="Qualification requirements">
                  <li className="flex items-start gap-3">
                    {data.newProgram.qualificationStatus.balanceQualified ? (
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-base text-gray-900">
                        Your account balance: {formatCurrency(data.newProgram.qualificationStatus.qualifyingBalance)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Required: {formatCurrency(10000)}+
                        {data.newProgram.qualificationStatus.balanceQualified && (
                          <span className="text-emerald-600 font-medium ml-1">Met</span>
                        )}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    {data.newProgram.qualificationStatus.autopayQualified ? (
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-base text-gray-900">
                        Your active autopays: {data.newProgram.qualificationStatus.autopayCount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Required: 2
                        {data.newProgram.qualificationStatus.autopayQualified && (
                          <span className="text-emerald-600 font-medium ml-1">Met</span>
                        )}
                      </p>
                    </div>
                  </li>
                </ul>

                {data.newProgram.qualificationStatus.balanceQualified &&
                  data.newProgram.qualificationStatus.autopayQualified && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p className="text-sm text-emerald-700 font-medium">
                        No action needed — you&apos;re already set!
                      </p>
                    </div>
                  )}
              </div>

              {/* Legacy mapping */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Your legacy program tier was <span className="font-bold">{data.legacyProgram.tierName}</span>,
                  which maps to our new <span className="font-bold">{data.newProgram.tierName}</span> tier.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep(3)}
                >
                  Next: See Your Benefits
                </Button>
                <Link
                  href="/loyalty/faq"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] leading-[44px]"
                >
                  Have questions?
                </Link>
              </div>
            </div>
          )}

          {/* Step 3: Benefit Comparison */}
          {step === 3 && (
            <div>
              <h1
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-2xl font-bold text-gray-900 mb-2 outline-none"
              >
                Your Benefits
              </h1>
              <p className="text-base text-gray-600 mb-6">
                Here&apos;s how your benefits change with the new program.
              </p>

              <div className="space-y-4 mb-6">
                {/* Benefits You Keep */}
                {data.benefitComparison.keep.length > 0 && (
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Benefits You Keep
                    </h2>
                    <ul className="space-y-3">
                      {data.benefitComparison.keep.map((b) => (
                        <li key={b.benefitId} className="flex justify-between items-start">
                          <div>
                            <p className="text-base font-medium text-gray-900">{b.newName || b.name}</p>
                            {b.legacyValue !== undefined && b.newValue !== undefined && b.newValue > b.legacyValue && (
                              <p className="text-sm text-emerald-700">
                                Upgraded: {formatCurrency(b.legacyValue)}/yr → {formatCurrency(b.newValue)}/yr
                              </p>
                            )}
                          </div>
                          <span className="text-base font-bold text-emerald-700">
                            {b.newValue !== undefined ? `${formatCurrency(b.newValue)}/yr` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits You Gain */}
                {data.benefitComparison.gain.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">NEW</span>
                      Benefits You Gain
                    </h2>
                    <ul className="space-y-3">
                      {data.benefitComparison.gain.map((b) => (
                        <li key={b.benefitId} className="flex justify-between items-start">
                          <p className="text-base font-medium text-gray-900">{b.name}</p>
                          <span className="text-base font-bold text-blue-700">
                            {b.newValue !== undefined ? `${formatCurrency(b.newValue)}/yr` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits You Lose */}
                {data.benefitComparison.lose.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Benefits That Changed</h2>
                    <ul className="space-y-3">
                      {data.benefitComparison.lose.map((b) => (
                        <li key={b.benefitId}>
                          <div className="flex justify-between items-start">
                            <p className="text-base font-medium text-gray-900">{b.name}</p>
                            <span className="text-base text-gray-500 line-through">
                              {b.oldValue !== undefined ? `${formatCurrency(b.oldValue)}/yr` : ''}
                            </span>
                          </div>
                          {b.replacement && (
                            <p className="text-sm text-gray-600 mt-1">
                              Replaced with: {b.replacement}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Net value summary */}
              <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-base font-bold text-gray-900">Your new annual benefit value</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {formatCurrency(data.newProgram.benefits.reduce((sum, b) => sum + b.annualValue, 0))}/yr
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Previously: {formatCurrency(data.legacyProgram.benefitsList.reduce((sum, b) => sum + b.annualValue, 0))}/yr
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleComplete}
                >
                  Get Started
                </Button>
                <Link href="/" className="block">
                  <Button variant="outline" size="lg" className="w-full">Go to Home</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
