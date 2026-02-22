'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { getAllTransactions, AccountTransaction } from '@/lib/api'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { TransactionBenefitBadge } from '@/components/transactions/TransactionBenefitBadge'

const CATEGORIES = [
  'All',
  'Groceries',
  'Food & Dining',
  'Transfer',
  'Income',
  'Shopping',
  'Bills & Utilities',
  'Transportation',
  'Entertainment',
  'Health',
  'Interest',
]

const ACCOUNTS = [
  { value: '', label: 'All Accounts' },
  { value: 'CHK-9876', label: 'Checking ****9876' },
  { value: 'SAV-5432', label: 'Savings ****5432' },
]

function TransactionListSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading transactions">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeAccount, setActiveAccount] = useState('')

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const fetchTransactions = useCallback(async (
    search: string,
    category: string,
    account: string,
    offset: number = 0,
    append: boolean = false
  ) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const filters: {
        search?: string
        category?: string
        accountId?: string
      } = {}

      if (search.trim().length >= 2) filters.search = search
      if (category !== 'All') filters.category = category
      if (account) filters.accountId = account

      const result = await getAllTransactions(filters, 10, offset)

      if (append) {
        setTransactions((prev) => [...prev, ...result.transactions])
      } else {
        setTransactions(result.transactions)
      }
      setTotalCount(result.totalCount)
      setHasMore(result.hasMore)
    } catch {
      setError('Unable to load transactions. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchTransactions('', 'All', '')
  }, [fetchTransactions])

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchTransactions(value, activeCategory, activeAccount)
    }, 300)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    fetchTransactions(searchQuery, category, activeAccount)
  }

  const handleAccountChange = (account: string) => {
    setActiveAccount(account)
    fetchTransactions(searchQuery, activeCategory, account)
  }

  const handleLoadMore = () => {
    fetchTransactions(searchQuery, activeCategory, activeAccount, transactions.length, true)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveCategory('All')
    setActiveAccount('')
    fetchTransactions('', 'All', '')
  }

  const hasActiveFilters = searchQuery.trim().length >= 2 || activeCategory !== 'All' || activeAccount !== ''

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      fetchTransactions('', activeCategory, activeAccount)
    }
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
            <li><span className="text-gray-900 font-medium">Transactions</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transaction History
        </h1>
        <p className="text-base text-gray-600 mb-6">
          View and search your recent transactions across all accounts
        </p>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-[600px]">
            <label htmlFor="txn-search" className="sr-only">Search transactions</label>
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="txn-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by merchant or description..."
              className="w-full h-12 pl-10 pr-10 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search transactions by merchant or description"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={() => handleSearchChange('')}
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Category filter */}
          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex-1">
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium min-h-[40px] transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Account filter */}
          <div className="flex-shrink-0">
            <label htmlFor="account-filter" className="sr-only">Filter by account</label>
            <select
              id="account-filter"
              value={activeAccount}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              {ACCOUNTS.map((acc) => (
                <option key={acc.value} value={acc.value}>{acc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters / clear */}
        {hasActiveFilters && !loading && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500" aria-live="polite">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
              {searchQuery.trim().length >= 2 && ` for "${searchQuery}"`}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
              {activeAccount && ` for ${ACCOUNTS.find((a) => a.value === activeAccount)?.label}`}
            </p>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <TransactionListSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={() => fetchTransactions(searchQuery, activeCategory, activeAccount)}>
              Retry
            </Button>
          </div>
        )}

        {/* Transaction List */}
        {!loading && !error && (
          <>
            {transactions.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-base text-gray-600 mb-2">
                  {hasActiveFilters
                    ? `No transactions found${searchQuery.trim().length >= 2 ? ` matching "${searchQuery}"` : ''}. Try different filters.`
                    : 'No transactions yet. Your transaction history will appear here.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[48px] inline-flex items-center"
                  >
                    Clear filters and show all transactions
                  </button>
                )}
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
                          <div className="flex items-center gap-2">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {txn.merchant}
                            </p>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {txn.accountId}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-sm text-gray-500">
                              {formatDateShort(txnDate)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {txn.category}
                            </span>
                            {txn.tierBenefit && (
                              <TransactionBenefitBadge
                                benefitType={txn.tierBenefit.benefitType}
                                benefitValue={txn.tierBenefit.benefitValue}
                                description={txn.tierBenefit.description}
                                variant="inline"
                              />
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
                          <p className="text-xs text-gray-400 mt-0.5">
                            {txn.status === 'pending' ? 'Pending' : txn.status === 'failed' ? 'Failed' : ''}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="p-4 border-t border-gray-100 text-center">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Loading...' : `Load More (${totalCount - transactions.length} remaining)`}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {transactions.length > 0 && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Showing {transactions.length} of {totalCount} transactions
              </p>
            )}
          </>
        )}
      </main>
    </>
  )
}
