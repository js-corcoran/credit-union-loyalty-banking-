'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getMemberProfile, getAccountDetail, AccountDetail } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { useTransfer } from '@/context/TransferContext'
import { TierType } from '@/lib/types'

export default function TransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillFrom = searchParams.get('from') || ''
  const { session, setSession } = useTransfer()

  const [accounts, setAccounts] = useState<AccountDetail[]>([])
  const [memberTier, setMemberTier] = useState<TierType>('classic')
  const [loading, setLoading] = useState(true)

  // Form state - restore from session if editing
  const [fromAccountId, setFromAccountId] = useState(session?.formData.fromAccountId || prefillFrom)
  const [toAccountId, setToAccountId] = useState(session?.formData.toAccountId || '')
  const [amount, setAmount] = useState(session?.formData.amount ? String(session.formData.amount) : '')
  const [memo, setMemo] = useState(session?.formData.memo || '')

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const member = await getMemberProfile('MEMBER-001')
        setMemberTier(member.currentTier)

        const accountIds = member.qualifyingAccounts.map((a) => a.accountId)
        const accountDetails = await Promise.all(
          accountIds.map((id) => getAccountDetail(id).catch(() => null))
        )
        const validAccounts = accountDetails.filter(Boolean) as AccountDetail[]
        setAccounts(validAccounts)

        // Pre-fill from account if not already set
        if (prefillFrom && !session) {
          setFromAccountId(prefillFrom)
        }
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [prefillFrom, session])

  const fromAccount = accounts.find((a) => a.accountId === fromAccountId)
  const availableToAccounts = accounts.filter(
    (a) => a.accountId !== fromAccountId && a.accountStatus === 'active'
  )

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!fromAccountId) {
      newErrors.from = 'Please select a source account.'
    } else {
      const acc = accounts.find((a) => a.accountId === fromAccountId)
      if (acc && acc.accountStatus !== 'active') {
        newErrors.from = 'Selected account is not active.'
      }
    }

    if (!toAccountId) {
      newErrors.to = 'Please select a destination account.'
    }
    if (toAccountId === fromAccountId) {
      newErrors.to = 'Source and destination accounts must be different.'
    }

    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter an amount greater than $0.00.'
    } else if (fromAccount && numAmount > fromAccount.availableBalance) {
      newErrors.amount = `Insufficient funds. Available: ${formatCurrency(fromAccount.availableBalance)}`
    } else if (numAmount > 50000) {
      newErrors.amount = 'Amount exceeds the daily transfer limit of $50,000.'
    }

    if (memo.length > 200) {
      newErrors.memo = 'Memo cannot exceed 200 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReview = () => {
    // Mark all as touched
    setTouched({ from: true, to: true, amount: true, memo: true })

    if (!validate()) return

    const numAmount = parseFloat(amount)
    const feeWaiverApplied = memberTier === 'plus' || memberTier === 'premium'

    setSession({
      formData: {
        fromAccountId,
        toAccountId,
        amount: numAmount,
        memo,
      },
      createdAt: new Date(),
      memberTier,
      feeWaiverApplied,
      normalFee: 2.50,
    })

    router.push('/transfer/confirm')
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validate()
  }

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, '')
    // Prevent multiple decimal points
    const parts = cleaned.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    setAmount(cleaned)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse" aria-busy="true" aria-label="Loading transfer form">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-12 w-full bg-gray-100 rounded-lg" />
                </div>
              ))}
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Transfer</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transfer Money
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Transfer between your accounts
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); handleReview() }}
          aria-label="Transfer form"
          noValidate
        >
          {/* From Account */}
          <div className="mb-6">
            <label htmlFor="from-account" className="block text-sm font-bold text-gray-900 mb-2">
              From account
            </label>
            <select
              id="from-account"
              value={fromAccountId}
              onChange={(e) => {
                setFromAccountId(e.target.value)
                // Reset to account if it matches from
                if (e.target.value === toAccountId) setToAccountId('')
              }}
              onBlur={() => handleBlur('from')}
              aria-label="Select source account"
              aria-invalid={touched.from && !!errors.from}
              aria-describedby={errors.from ? 'from-error' : undefined}
              className={`w-full h-12 px-4 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.from && errors.from ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select account...</option>
              {accounts
                .filter((a) => a.accountStatus === 'active')
                .map((a) => (
                  <option key={a.accountId} value={a.accountId}>
                    {a.accountName} {a.maskedAccountNumber} ({formatCurrency(a.currentBalance)})
                  </option>
                ))}
            </select>
            {touched.from && errors.from && (
              <p id="from-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
                {errors.from}
              </p>
            )}
          </div>

          {/* To Account */}
          <div className="mb-6">
            <label htmlFor="to-account" className="block text-sm font-bold text-gray-900 mb-2">
              To account
            </label>
            <select
              id="to-account"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              onBlur={() => handleBlur('to')}
              aria-label="Select destination account"
              aria-invalid={touched.to && !!errors.to}
              aria-describedby={errors.to ? 'to-error' : undefined}
              className={`w-full h-12 px-4 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.to && errors.to ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select account...</option>
              {availableToAccounts.map((a) => (
                <option key={a.accountId} value={a.accountId}>
                  {a.accountName} {a.maskedAccountNumber} ({formatCurrency(a.currentBalance)})
                </option>
              ))}
            </select>
            {touched.to && errors.to && (
              <p id="to-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
                {errors.to}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-bold text-gray-900 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-500 font-medium">$</span>
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={() => handleBlur('amount')}
                placeholder="0.00"
                aria-label="Transfer amount in dollars"
                aria-invalid={touched.amount && !!errors.amount}
                aria-describedby={`${errors.amount ? 'amount-error ' : ''}available-balance`}
                className={`w-full h-12 pl-8 pr-4 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  touched.amount && errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {fromAccount && (
              <p id="available-balance" className="mt-1 text-sm text-gray-500">
                Available: {formatCurrency(fromAccount.availableBalance)}
              </p>
            )}
            {touched.amount && errors.amount && (
              <p id="amount-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Memo */}
          <div className="mb-8">
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose or memo <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onBlur={() => handleBlur('memo')}
              placeholder="Enter memo..."
              maxLength={200}
              rows={2}
              aria-invalid={touched.memo && !!errors.memo}
              className={`w-full px-4 py-3 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                touched.memo && errors.memo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {memo.length}/200
            </p>
            {touched.memo && errors.memo && (
              <p className="mt-1 text-sm text-red-600 font-medium" role="alert">
                {errors.memo}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
            >
              Review Transfer
            </Button>
            <Link href="/" className="block">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                type="button"
              >
                Cancel
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            Transfers between your accounts are processed immediately.
          </p>
        </form>
      </main>
    </>
  )
}
