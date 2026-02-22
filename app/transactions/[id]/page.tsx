'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getTransactionDetail, TransactionDetail } from '@/lib/api'
import { formatCurrency, formatDateShort } from '@/lib/formatting'
import { Button } from '@/components/shared/Button'
import { TransactionBenefitBadge } from '@/components/transactions/TransactionBenefitBadge'

const statusStyles: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700' },
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading transaction details">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TransactionDetailPage() {
  const params = useParams()
  const transactionId = params.id as string

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTransactionDetail(transactionId)
      setTransaction(data)
    } catch {
      setError('Unable to load transaction details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId])

  const isCredit = transaction ? transaction.amount > 0 : false
  const displayAmount = transaction
    ? (isCredit ? `+${formatCurrency(Math.abs(transaction.amount))}` : `-${formatCurrency(Math.abs(transaction.amount))}`)
    : ''
  const txnDate = transaction ? new Date(transaction.date) : new Date()
  const status = transaction ? statusStyles[transaction.status] || statusStyles.completed : statusStyles.completed

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
              <Link href="/transactions" className="hover:text-gray-700 hover:underline">Transactions</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-900 font-medium">
                {transaction ? `${formatDateShort(txnDate)} ${transaction.merchant}` : 'Detail'}
              </span>
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1.5 text-base text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Transactions
          </Link>
        </div>

        {/* Loading */}
        {loading && <DetailSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="primary" onClick={fetchData}>Retry</Button>
              <Link href="/transactions">
                <Button variant="outline">Back to Transactions</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Transaction Content */}
        {!loading && !error && transaction && (
          <div className="space-y-6">
            {/* Transaction Summary Card */}
            <section
              aria-label="Transaction summary"
              className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {transaction.merchant}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">
                      {formatDateShort(txnDate)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {transaction.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-3xl md:text-4xl font-bold whitespace-nowrap ${
                    isCredit ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                  aria-label={`Transaction amount ${displayAmount}`}
                >
                  {displayAmount}
                </p>
              </div>
            </section>

            {/* Transaction Details */}
            <section aria-label="Transaction details" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction Details</h2>
              <dl className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Merchant</dt>
                  <dd className="text-sm text-gray-900 font-medium">{transaction.merchant}</dd>
                </div>
                {transaction.merchantAddress !== transaction.merchant && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{transaction.merchantAddress}</dd>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className={`text-sm font-semibold ${isCredit ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {displayAmount}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">{transaction.type}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Transaction Date</dt>
                  <dd className="text-sm text-gray-900">{formatDateShort(txnDate)}</dd>
                </div>
                {transaction.postingDate !== transaction.date && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Posting Date</dt>
                    <dd className="text-sm text-gray-900">{formatDateShort(new Date(transaction.postingDate))}</dd>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{transaction.transactionId}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{transaction.category}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Balance Before</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(transaction.balanceBeforeTransaction)}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Balance After</dt>
                  <dd className="text-sm text-gray-900 font-semibold">{formatCurrency(transaction.runningBalance)}</dd>
                </div>
                {transaction.relatedAccount && (
                  <div className="flex justify-between py-2">
                    <dt className="text-sm font-medium text-gray-500">
                      {transaction.type === 'transfer'
                        ? (transaction.amount < 0 ? 'Transferred To' : 'Transferred From')
                        : 'Account'}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <Link
                        href={`/accounts/${transaction.relatedAccount.accountId}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                      >
                        {transaction.relatedAccount.accountName} {transaction.relatedAccount.maskedNumber}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Loyalty Context Section */}
            {transaction.tierBenefit && (
              <section aria-label="Loyalty benefits applied" className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Loyalty Benefits Applied</h2>
                <TransactionBenefitBadge
                  benefitType={transaction.tierBenefit.benefitType}
                  benefitValue={transaction.tierBenefit.benefitValue}
                  description={transaction.tierBenefit.description}
                  variant="full"
                />
                <div className="mt-4">
                  <Link
                    href="/loyalty/tier-details"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
                  >
                    Learn more about your tier benefits
                  </Link>
                </div>
              </section>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/accounts/${transaction.accountId}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  View Account
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="flex-1">
                Dispute Transaction
              </Button>
              <Link href="/transactions" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  Back to Transactions
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
