'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  getAccountDetail,
  getAccountTransactions,
  getAccountTierContext,
  getMemberProfile,
  AccountDetail,
  AccountTransaction,
  AccountTierContext,
} from '@/lib/api'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { AccountSelectorRegion } from '@/components/account/AccountSelectorRegion'
import { AccountSummaryRegion } from '@/components/account/AccountSummaryRegion'
import { TierContributionRegion } from '@/components/account/TierContributionRegion'
import { TierType } from '@/lib/types'

function AccountDetailSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading account details">
      {/* Account selector skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-12 w-40 bg-gray-200 rounded-lg" />
        <div className="h-12 w-40 bg-gray-200 rounded-lg" />
      </div>
      {/* Summary skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Transactions skeleton */}
      <div className="space-y-0 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 px-4 border-b border-gray-100 last:border-b-0">
            <div>
              <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AccountDetailPage() {
  const params = useParams()
  const accountId = params.id as string

  const [account, setAccount] = useState<AccountDetail | null>(null)
  const [allAccounts, setAllAccounts] = useState<AccountDetail[]>([])
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [tierContext, setTierContext] = useState<AccountTierContext | null>(null)
  const [currentTier, setCurrentTier] = useState<TierType>('classic')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [accountData, txnData, tierData, memberData] = await Promise.all([
        getAccountDetail(accountId),
        getAccountTransactions(accountId, 10, 0),
        getAccountTierContext(accountId),
        getMemberProfile('MEMBER-001'),
      ])

      setAccount(accountData)
      setTransactions(txnData.transactions)
      setTotalTransactions(txnData.totalCount)
      setHasMore(txnData.hasMore)
      setTierContext(tierData)
      setCurrentTier(memberData.currentTier)

      // Build account list from member's qualifying accounts
      const accountIds = memberData.qualifyingAccounts.map((a) => a.accountId)
      const accountDetails = await Promise.all(
        accountIds.map((id) => getAccountDetail(id).catch(() => null))
      )
      setAllAccounts(accountDetails.filter(Boolean) as AccountDetail[])
    } catch {
      setError('Unable to load account details. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const txnData = await getAccountTransactions(accountId, 10, transactions.length)
      setTransactions((prev) => [...prev, ...txnData.transactions])
      setHasMore(txnData.hasMore)
    } catch {
      // Silently fail; user can retry
    } finally {
      setLoadingMore(false)
    }
  }

  const isAccountClosed = account?.accountStatus === 'closed'

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
              <span className="text-gray-900 font-medium">
                {account ? `${account.accountName} ${account.maskedAccountNumber}` : 'Account'}
              </span>
            </li>
          </ol>
        </nav>

        {/* Loading */}
        {loading && <AccountDetailSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {/* Loaded Content */}
        {!loading && !error && account && (
          <>
            {/* Account Selector */}
            {allAccounts.length > 1 && (
              <AccountSelectorRegion
                accounts={allAccounts}
                currentAccountId={accountId}
              />
            )}

            {/* Account Summary */}
            <AccountSummaryRegion
              account={account}
              currentTier={currentTier}
            />

            {/* Tier Contribution (conditional) */}
            {tierContext && (
              <TierContributionRegion
                accountId={accountId}
                tierContext={tierContext}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href={`/transfer?from=${accountId}`} className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isAccountClosed}
                >
                  Transfer Money
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={isAccountClosed}
              >
                Pay a Bill
              </Button>
              <Link href="/autopay" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isAccountClosed}
                >
                  Set Up Autopay
                </Button>
              </Link>
            </div>

            {isAccountClosed && (
              <p className="text-sm text-red-600 mb-6 -mt-4">
                This account is closed and cannot be used for transactions.
              </p>
            )}

            {/* Recent Transactions */}
            <section aria-label="Recent transactions">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Transactions
              </h2>

              {transactions.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-base text-gray-600">
                    No recent transactions. Your activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div role="list" aria-label="Transaction list">
                    {transactions.map((txn) => {
                      const isCredit = txn.amount > 0
                      const displayAmount = isCredit
                        ? `+${formatCurrency(Math.abs(txn.amount))}`
                        : `-${formatCurrency(Math.abs(txn.amount))}`
                      const txnDate = new Date(txn.date)

                      return (
                        <Link
                          key={txn.transactionId}
                          href={`/transactions/${txn.transactionId}`}
                          role="listitem"
                          className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors min-h-[56px] border-b border-gray-100 last:border-b-0"
                          aria-label={`${txn.merchant}, ${displayAmount}, ${formatDateShort(txnDate)}${txn.tierBenefit ? `, ${txn.tierBenefit.description}` : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {txn.merchant}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-sm text-gray-500">
                                {formatDateShort(txnDate)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {txn.category}
                              </span>
                              {txn.tierBenefit && (
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white"
                                  aria-label={`${txn.tierBenefit.description}: ${formatCurrency(txn.tierBenefit.benefitValue)}`}
                                >
                                  {txn.tierBenefit.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <span
                              className={`text-base font-semibold whitespace-nowrap ${
                                isCredit ? 'text-emerald-600' : 'text-gray-900'
                              }`}
                            >
                              {displayAmount}
                            </span>
                            {txn.runningBalance !== undefined && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                Bal: {formatCurrency(txn.runningBalance)}
                              </p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Load More / Pagination */}
                  {hasMore && (
                    <div className="p-4 border-t border-gray-100 text-center">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? 'Loading...' : `Load More (${totalTransactions - transactions.length} remaining)`}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {transactions.length > 0 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Showing {transactions.length} of {totalTransactions} transactions
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </>
  )
}
