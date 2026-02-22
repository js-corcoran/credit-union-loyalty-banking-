'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAutopays, getMemberProfile } from '@/lib/api'
import { AutopayDetail, TierType } from '@/lib/types'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { TierBadge } from '@/components/loyalty/TierBadge'
import { TIER_CONFIGURATIONS } from '@/lib/constants'

const payeeTypeLabels: Record<string, string> = {
  loan: 'Loan Payment',
  'credit-card': 'Credit Card',
  bill: 'Bill Payment',
}

const statusStyles: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700' },
  paused: { label: 'Paused', className: 'bg-amber-50 text-amber-700' },
  expired: { label: 'Expired', className: 'bg-red-50 text-red-700' },
}

function AutopaySkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy="true" aria-label="Loading autopays">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-5 w-36 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AutopayPage() {
  const [autopays, setAutopays] = useState<AutopayDetail[]>([])
  const [currentTier, setCurrentTier] = useState<TierType>('classic')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [autopayData, member] = await Promise.all([
        getAutopays('MEMBER-001'),
        getMemberProfile('MEMBER-001'),
      ])
      setAutopays(autopayData)
      setCurrentTier(member.currentTier)
    } catch {
      setError('Unable to load autopay details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const tierConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === currentTier)
  const requiredAutopays = tierConfig?.requirements.minimumAutopay || 0
  const activeAutopays = autopays.filter((a) => a.status === 'active')

  const isAutopayRequiredForTier = (autopay: AutopayDetail): boolean => {
    if (activeAutopays.length <= requiredAutopays && autopay.status === 'active') {
      return true
    }
    return false
  }

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
            <li><span className="text-gray-900 font-medium">Autopay</span></li>
          </ol>
        </nav>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Autopay Management</h1>
            <p className="text-base text-gray-600">
              Manage your automatic payments and see how they contribute to your tier
            </p>
          </div>
          <Link href="/autopay/add">
            <Button variant="primary" size="md">Add Autopay</Button>
          </Link>
        </div>

        {/* Tier Status Summary */}
        {!loading && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TierBadge tier={currentTier} size="small" showLabel />
              <p className="text-sm text-gray-700">
                You have <span className="font-bold">{activeAutopays.length}</span> of{' '}
                <span className="font-bold">{requiredAutopays}</span> autopays required for your tier
              </p>
            </div>
            {activeAutopays.length < requiredAutopays && (
              <span className="text-sm text-amber-600 font-medium">
                {requiredAutopays - activeAutopays.length} more needed
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && <AutopaySkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {/* Autopay List */}
        {!loading && !error && (
          <>
            {autopays.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-base text-gray-600 mb-4">
                  No autopays set up yet. Add an autopay to unlock higher tier benefits.
                </p>
                <Link href="/autopay/add">
                  <Button variant="primary">Set Up Autopay</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label="Autopay list">
                {autopays.map((autopay) => {
                  const isRequired = isAutopayRequiredForTier(autopay)
                  const status = statusStyles[autopay.status] || statusStyles.active
                  const daysToExpiry = Math.ceil(
                    (autopay.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0 && autopay.status === 'active'

                  return (
                    <div
                      key={autopay.autopayId}
                      role="listitem"
                      className={`bg-white border rounded-xl p-4 md:p-5 ${
                        isRequired ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900">
                              {payeeTypeLabels[autopay.payeeType] || autopay.payeeType}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                              {status.label}
                            </span>
                            {isRequired && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Required for tier
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>{formatCurrency(autopay.amount)} / {autopay.frequency}</span>
                            <span>Account: {autopay.accountId}</span>
                            {autopay.status === 'active' && (
                              <span>
                                {isExpiringSoon
                                  ? <span className="text-amber-600 font-medium">Expires in {daysToExpiry} days</span>
                                  : `Expires ${formatDateShort(autopay.expirationDate)}`
                                }
                              </span>
                            )}
                          </div>

                          {/* Tier contribution badges */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-xs text-gray-400">Counts toward:</span>
                            {autopay.contributesToTier.map((tier) => (
                              <span
                                key={tier}
                                className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 capitalize"
                              >
                                {tier}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/autopay/${autopay.autopayId}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                          <Link href={`/autopay/${autopay.autopayId}/remove`}>
                            <Button
                              variant="secondary"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Help Section */}
            <section aria-label="Autopay help" className="mt-8 bg-gray-50 rounded-xl p-5 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-2">How Autopays Affect Your Tier</h2>
              <p className="text-sm text-gray-600 mb-3">
                Autopays are one of the requirements for tier qualification. Each tier requires a minimum
                number of active autopays. Removing a required autopay may result in tier loss.
              </p>
              <Link href="/loyalty/tier-details">
                <Button variant="outline" size="md">View Tier Requirements</Button>
              </Link>
            </section>
          </>
        )}
      </main>
    </>
  )
}
