'use client'

import { useEffect, useState } from 'react'
import { Member, Transaction } from '@/lib/types'
import { getMemberProfile, getTransactions } from '@/lib/api'
import { TIER_CONFIGURATIONS } from '@/lib/constants'
import { Header } from '@/components/layout/Header'
import { TierStatusRegion } from '@/components/home/TierStatusRegion'
import { AccountSummaryRegion } from '@/components/home/AccountSummaryRegion'
import { RecentTransactionsRegion } from '@/components/home/RecentTransactionsRegion'
import { Button } from '@/components/shared/Button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import Link from 'next/link'

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading dashboard">
      {/* Tier Status Skeleton */}
      <div className="bg-gray-100 rounded-xl p-5 md:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full" />
      </div>

      {/* Accounts Skeleton */}
      <div>
        <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
              <div className="flex justify-between mb-3">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              </div>
              <div className="h-8 w-32 bg-gray-200 rounded mb-3" />
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div>
        <div className="h-7 w-48 bg-gray-200 rounded mb-4" />
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-b-0">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [member, setMember] = useState<Member | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [memberData, txnData] = await Promise.all([
        getMemberProfile('MEMBER-001'),
        getTransactions('MEMBER-001', undefined, 5),
      ])
      setMember(memberData)
      setTransactions(txnData)
    } catch {
      setError('Unable to load your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getNextTierInfo = () => {
    if (!member) return { threshold: undefined, name: undefined }
    const totalBalance = member.qualifyingAccounts.reduce(
      (sum, acc) => sum + acc.rollingBalance3Month,
      0
    )
    if (member.currentTier === 'classic') {
      return { threshold: 10000, name: 'Plus', currentBalance: totalBalance }
    }
    if (member.currentTier === 'plus') {
      return { threshold: 25000, name: 'Premium', currentBalance: totalBalance }
    }
    return { threshold: undefined, name: undefined, currentBalance: totalBalance }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8"
      >
        <h1 className="sr-only">Home - Credit Union Banking</h1>

        {loading && <DashboardSkeleton />}

        {error && !loading && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            role="alert"
          >
            <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && member && (
          <div className="space-y-8">
            {/* Tier Status Region */}
            <TierStatusRegion
              currentTier={member.currentTier}
              firstName={member.firstName}
              currentBalance={getNextTierInfo().currentBalance || 0}
              nextTierThreshold={getNextTierInfo().threshold}
              nextTierName={getNextTierInfo().name}
            />

            {/* Account Summary Region */}
            <AccountSummaryRegion
              accounts={member.qualifyingAccounts}
              memberTier={member.currentTier}
            />

            {/* Recent Transactions Region */}
            <RecentTransactionsRegion transactions={transactions} />

            {/* Action Buttons Region */}
            <section aria-label="Quick actions" className="space-y-3">
              <Link href="/transfer" className="block">
                <Button variant="primary" size="lg" className="w-full">
                  Transfer Money
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" size="md" className="w-full">
                  Pay a Bill
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Request Check
                </Button>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-8">
        <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6">
          <nav className="flex flex-wrap gap-4 text-sm text-gray-500" aria-label="Footer navigation">
            <Link href="/help" className="hover:text-gray-700 hover:underline min-h-[44px] inline-flex items-center">
              Help
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link href="/settings" className="hover:text-gray-700 hover:underline min-h-[44px] inline-flex items-center">
              Security
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <span className="min-h-[44px] inline-flex items-center">Accessibility Statement</span>
          </nav>
        </div>
      </footer>
    </>
  )
}
