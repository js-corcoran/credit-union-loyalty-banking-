'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getMemberProfile, getAccountDetail, AccountDetail } from '@/lib/api'
import { formatCurrency } from '@/lib/formatting'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'
import { useTransfer } from '@/context/TransferContext'
import { useLoyaltyTransfer, useTierGap } from '@/context/LoyaltyTransferContext'
import { parseLoyaltyTransferParams, getTierDisplayName } from '@/lib/loyalty-transfer/utils'
import { LoyaltyTransferContext as LoyaltyTransferContextType } from '@/lib/loyalty-transfer/types'
import { TierType } from '@/lib/types'

function LoyaltyTransferBanner({
  loyaltyContext,
  onDismiss,
  staleAmount,
  onUpdateAmount,
}: {
  loyaltyContext: LoyaltyTransferContextType
  onDismiss: () => void
  staleAmount: number | null
  onUpdateAmount: (amount: number) => void
}) {
  const targetName = getTierDisplayName(loyaltyContext.targetTier)
  const gapFormatted = formatCurrency(loyaltyContext.tierGapAmount)

  return (
    <div
      className="bg-teal-50 border-l-4 border-teal-500 rounded-lg px-4 py-3 md:px-5 md:py-4 mb-6"
      role="region"
      aria-label="Loyalty transfer information"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">
              Transfer {gapFormatted} to reach {targetName} tier
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Fields below are pre-filled based on your tier gap. You can edit any field.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-100 transition-colors"
          aria-label="Dismiss loyalty transfer banner"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {staleAmount !== null && staleAmount !== loyaltyContext.tierGapAmount && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Tier qualification amount updated to {formatCurrency(staleAmount)} (was {gapFormatted}).
          </p>
          <button
            onClick={() => onUpdateAmount(staleAmount)}
            className="mt-1 text-sm font-semibold text-yellow-700 underline hover:text-yellow-900 min-h-[44px] inline-flex items-center"
          >
            Update to {formatCurrency(staleAmount)}
          </button>
        </div>
      )}
    </div>
  )
}

export default function TransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillFrom = searchParams.get('from') || ''
  const { session, setSession } = useTransfer()
  const { setLoyaltyContext } = useLoyaltyTransfer()
  const { gap } = useTierGap()

  // Parse loyalty params
  const loyaltyContext = useMemo(
    () => parseLoyaltyTransferParams(searchParams),
    [searchParams]
  )
  const isLoyaltyTransfer = !!loyaltyContext
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const [accounts, setAccounts] = useState<AccountDetail[]>([])
  const [memberTier, setMemberTier] = useState<TierType>('classic')
  const [loading, setLoading] = useState(true)

  // Form state - initialize from loyalty context if available
  const [fromAccountId, setFromAccountId] = useState(session?.formData.fromAccountId || prefillFrom)
  const [toAccountId, setToAccountId] = useState(
    session?.formData.toAccountId || loyaltyContext?.destinationAccountId || ''
  )
  const [amount, setAmount] = useState(
    session?.formData.amount
      ? String(session.formData.amount)
      : loyaltyContext
      ? String(loyaltyContext.tierGapAmount)
      : ''
  )
  const [memo, setMemo] = useState(
    session?.formData.memo ||
    (loyaltyContext ? 'Loyalty tier qualification transfer' : '')
  )

  // Pre-fill tracking
  const [amountPreFilled] = useState(loyaltyContext?.tierGapAmount ?? 0)
  const [amountEdited, setAmountEdited] = useState(false)

  // Stale amount detection
  const staleAmount = useMemo(() => {
    if (!isLoyaltyTransfer || !gap) return null
    if (gap.tierGapAmount !== loyaltyContext?.tierGapAmount) {
      return gap.tierGapAmount
    }
    return null
  }, [isLoyaltyTransfer, gap, loyaltyContext])

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (loyaltyContext) {
      setLoyaltyContext(loyaltyContext)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

        if (prefillFrom && !session) {
          setFromAccountId(prefillFrom)
        }

        // Match loyalty destination to actual account
        if (loyaltyContext && !session) {
          const destAccount = validAccounts.find(
            (a) =>
              a.accountId === loyaltyContext.destinationAccountId ||
              a.accountType.toLowerCase().includes('saving')
          )
          if (destAccount) {
            setToAccountId(destAccount.accountId)
          }
        }
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [prefillFrom, session]) // eslint-disable-line react-hooks/exhaustive-deps

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

    // Pass loyalty flag via search params to confirmation page
    if (isLoyaltyTransfer) {
      router.push(`/transfer/confirm?loyalty=true&targetTier=${loyaltyContext?.targetTier || ''}`)
    } else {
      router.push('/transfer/confirm')
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validate()
  }

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const parts = cleaned.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    setAmount(cleaned)
    if (isLoyaltyTransfer && parseFloat(cleaned) !== amountPreFilled) {
      setAmountEdited(true)
    }
  }

  const handleUpdateAmount = (newAmount: number) => {
    setAmount(String(newAmount))
    setAmountEdited(true)
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
        <p className="text-base text-gray-600 mb-6">
          Transfer between your accounts
        </p>

        {/* Loyalty Transfer Banner */}
        {isLoyaltyTransfer && !bannerDismissed && loyaltyContext && (
          <LoyaltyTransferBanner
            loyaltyContext={loyaltyContext}
            onDismiss={() => setBannerDismissed(true)}
            staleAmount={staleAmount}
            onUpdateAmount={handleUpdateAmount}
          />
        )}

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
              {isLoyaltyTransfer && !amountEdited && (
                <span className="ml-2 text-xs font-normal text-teal-600">(pre-filled)</span>
              )}
            </label>
            <select
              id="to-account"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              onBlur={() => handleBlur('to')}
              aria-label="Select destination account"
              aria-invalid={touched.to && !!errors.to}
              aria-describedby={errors.to ? 'to-error' : undefined}
              className={`w-full h-12 px-4 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoyaltyTransfer
                  ? 'bg-gray-50 border-teal-200'
                  : 'bg-white border-gray-300'
              } ${touched.to && errors.to ? 'border-red-500' : ''}`}
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
              {isLoyaltyTransfer && !amountEdited && (
                <span className="ml-2 text-xs font-normal text-teal-600">(pre-filled)</span>
              )}
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
                aria-describedby={`${errors.amount ? 'amount-error ' : ''}available-balance${isLoyaltyTransfer ? ' amount-help' : ''}`}
                className={`w-full h-12 pl-8 pr-4 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isLoyaltyTransfer && !amountEdited
                    ? 'bg-gray-50 border-teal-200'
                    : 'bg-white border-gray-300'
                } ${touched.amount && errors.amount ? 'border-red-500' : ''}`}
              />
            </div>
            {fromAccount && (
              <p id="available-balance" className="mt-1 text-sm text-gray-500">
                Available: {formatCurrency(fromAccount.availableBalance)}
              </p>
            )}
            {isLoyaltyTransfer && (
              <p id="amount-help" className="mt-1 text-sm text-teal-600">
                Calculated based on your balance and {getTierDisplayName(loyaltyContext!.targetTier)} tier threshold. You can change this.
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
              {isLoyaltyTransfer && (
                <span className="ml-2 text-xs font-normal text-teal-600">(pre-filled)</span>
              )}
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
              className={`w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                isLoyaltyTransfer
                  ? 'bg-gray-50 border-teal-200'
                  : 'bg-white border-gray-300'
              } ${touched.memo && errors.memo ? 'border-red-500' : ''}`}
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
