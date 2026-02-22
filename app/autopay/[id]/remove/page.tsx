'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getAutopays, getMemberProfile, deleteAutopay } from '@/lib/api'
import { AutopayDetail, TierType } from '@/lib/types'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { TIER_CONFIGURATIONS } from '@/lib/constants'

const payeeTypeLabels: Record<string, string> = {
  loan: 'Loan Payment',
  'credit-card': 'Credit Card',
  bill: 'Bill Payment',
}

export default function AutopayRemovePage() {
  const params = useParams()
  const router = useRouter()
  const autopayId = params.id as string

  const [autopay, setAutopay] = useState<AutopayDetail | null>(null)
  const [currentTier, setCurrentTier] = useState<TierType>('classic')
  const [activeAutopayCount, setActiveAutopayCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const member = await getMemberProfile('MEMBER-001')
        const autopays = await getAutopays('MEMBER-001')
        setCurrentTier(member.currentTier)
        setActiveAutopayCount(
          member.autopayStatus.autopayDetails.filter((a) => a.status === 'active').length
        )
        const found = autopays.find((a) => a.autopayId === autopayId) ||
          member.autopayStatus.autopayDetails.find((a) => a.autopayId === autopayId)
        setAutopay(found || null)
      } catch {
        setError('Unable to load autopay details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [autopayId])

  const tierConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === currentTier)
  const requiredAutopays = tierConfig?.requirements.minimumAutopay || 0
  const wouldLoseTier = autopay?.status === 'active' && activeAutopayCount <= requiredAutopays

  // Calculate benefits at risk
  const tierBenefitValue = tierConfig?.benefits.reduce((sum, b) => {
    if (b.benefitType === 'apy-boost') return sum + (23500 * (b.apyBoostPercentage || 0)) / 100
    if (b.benefitType === 'fee-waiver') return sum + 2 * 12 * (b.feeAmount || 0)
    if (b.benefitType === 'third-party-rewards') return sum + 15000 * (b.rewardRate || 0)
    return sum
  }, 0) || 0

  // Lower tier value
  const lowerTier = currentTier === 'premium' ? 'plus' : currentTier === 'plus' ? 'classic' : null
  const lowerTierConfig = lowerTier ? TIER_CONFIGURATIONS.find((t) => t.tierId === lowerTier) : null
  const lowerTierBenefitValue = lowerTierConfig?.benefits.reduce((sum, b) => {
    if (b.benefitType === 'apy-boost') return sum + (23500 * (b.apyBoostPercentage || 0)) / 100
    if (b.benefitType === 'fee-waiver') return sum + 2 * 12 * (b.feeAmount || 0)
    if (b.benefitType === 'third-party-rewards') return sum + 15000 * (b.rewardRate || 0)
    return sum
  }, 0) || 0

  const annualLoss = Math.round((tierBenefitValue - lowerTierBenefitValue) * 100) / 100

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await deleteAutopay('MEMBER-001', autopayId)
      router.push('/autopay')
    } catch {
      setError('Unable to remove autopay. Please try again.')
      setRemoving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-4" aria-busy="true">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-100 rounded-xl" />
            <div className="h-32 w-full bg-gray-100 rounded-xl" />
          </div>
        </main>
      </>
    )
  }

  if (error && !autopay) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Link href="/autopay"><Button variant="primary">Back to Autopays</Button></Link>
          </div>
        </main>
      </>
    )
  }

  if (!autopay) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-base text-gray-600 mb-4">Autopay not found.</p>
            <Link href="/autopay"><Button variant="primary">Back to Autopays</Button></Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/autopay" className="hover:text-gray-700 hover:underline">Autopay</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Remove</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Remove Autopay</h1>

        {/* Autopay Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Autopay Details</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900 font-medium">{payeeTypeLabels[autopay.payeeType]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Amount</dt>
              <dd className="text-sm text-gray-900 font-medium">{formatCurrency(autopay.amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Frequency</dt>
              <dd className="text-sm text-gray-900 capitalize">{autopay.frequency}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Account</dt>
              <dd className="text-sm text-gray-900">{autopay.accountId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900 capitalize">{autopay.status}</dd>
            </div>
          </dl>
        </div>

        {/* Tier Impact Warning */}
        {wouldLoseTier && lowerTier && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-6" role="alert">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900 mb-1">This will affect your tier</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Removing this autopay will drop you from{' '}
                  <span className="font-bold capitalize">{currentTier}</span> to{' '}
                  <span className="font-bold capitalize">{lowerTier}</span> tier after a 30-day grace period.
                </p>
                <div className="bg-white/60 rounded-lg p-3 mb-3">
                  <p className="text-sm text-amber-900 font-medium mb-1">
                    Annual benefits you would lose: <span className="font-bold">{formatCurrency(annualLoss)}/year</span>
                  </p>
                  <ul className="text-sm text-amber-800 list-disc list-inside space-y-0.5">
                    {tierConfig?.benefits.map((b) => (
                      <li key={b.benefitId}>{b.benefitName}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium mb-1">Recovery Path</p>
                  <p className="text-sm text-blue-700">
                    You can re-qualify by adding another autopay within the 30-day grace period.
                  </p>
                  <Link
                    href="/autopay/add"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium inline-flex items-center mt-1 min-h-[44px]"
                  >
                    Add a different autopay instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!wouldLoseTier && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Removing this autopay will not affect your current tier status.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4" role="alert">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? 'Removing...' : 'Remove Autopay'}
          </Button>
          <Link href="/autopay" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Keep Autopay
            </Button>
          </Link>
        </div>
      </main>
    </>
  )
}
