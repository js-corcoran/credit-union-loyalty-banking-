'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getMemberProfile, getAccountDetail, createAutopay, AccountDetail } from '@/lib/api'
import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Button } from '@/components/shared/Button'
import { TIER_CONFIGURATIONS } from '@/lib/constants'

const PAYMENT_TYPES = [
  { value: 'loan', label: 'Loan Payment', description: 'Auto-loan, mortgage, or personal loan' },
  { value: 'credit-card', label: 'Credit Card', description: 'Minimum or fixed payment' },
  { value: 'bill', label: 'Bill Payment', description: 'Utility, insurance, or other bill' },
] as const

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
] as const

export default function AutopayAddPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountDetail[]>([])
  const [currentTier, setCurrentTier] = useState<TierType>('classic')
  const [autopayCount, setAutopayCount] = useState(0)
  const [creditCardCount, setCreditCardCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [payeeType, setPayeeType] = useState<'loan' | 'credit-card' | 'bill'>('loan')
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'bi-weekly' | 'quarterly'>('monthly')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const member = await getMemberProfile('MEMBER-001')
        setCurrentTier(member.currentTier)
        setAutopayCount(member.autopayStatus.totalCount)
        setCreditCardCount(
          member.autopayStatus.autopayDetails.filter(
            (a) => a.payeeType === 'credit-card' && a.status === 'active'
          ).length
        )
        const accs = await Promise.all(
          member.qualifyingAccounts.map((a) => getAccountDetail(a.accountId).catch(() => null))
        )
        setAccounts(accs.filter(Boolean) as AccountDetail[])
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Determine next tier advancement
  const tierConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === currentTier)
  const nextTier = currentTier === 'classic' ? 'plus' : currentTier === 'plus' ? 'premium' : null
  const nextTierConfig = nextTier ? TIER_CONFIGURATIONS.find((t) => t.tierId === nextTier) : null
  const autopaysNeededForNext = nextTierConfig
    ? Math.max(0, nextTierConfig.requirements.minimumAutopay - (autopayCount + 1))
    : 0
  const wouldAdvance = nextTierConfig && autopayCount + 1 >= nextTierConfig.requirements.minimumAutopay

  // Credit card limit check
  const creditCardLimitReached = payeeType === 'credit-card' && creditCardCount >= (tierConfig?.requirements.creditCardAutopayLimit || 1)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!accountId) newErrors.account = 'Please select an account.'
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter an amount greater than $0.00.'
    }
    if (creditCardLimitReached) {
      newErrors.type = `Credit card autopay limit reached (max ${tierConfig?.requirements.creditCardAutopayLimit || 1} per tier).`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await createAutopay('MEMBER-001', {
        accountId,
        payeeType,
        amount: parseFloat(amount),
        frequency,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        contributesToTier: ['classic', 'plus', 'premium'],
      })
      setSuccess(true)
    } catch {
      setErrors({ submit: 'Unable to create autopay. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-6" aria-busy="true">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-12 w-full bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  if (success) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Autopay Created</h1>
          <p className="text-base text-gray-600 mb-6">
            Your {payeeType === 'credit-card' ? 'credit card' : payeeType} autopay of {formatCurrency(parseFloat(amount))} has been set up.
          </p>
          {wouldAdvance && nextTier && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-emerald-700 font-medium">
                This autopay brings you closer to {nextTier === 'plus' ? 'Plus' : 'Premium'} tier!
              </p>
            </div>
          )}
          <div className="space-y-3">
            <Link href="/autopay" className="block">
              <Button variant="primary" size="lg" className="w-full">View Autopays</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" size="lg" className="w-full">Return Home</Button>
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
            <li><Link href="/autopay" className="hover:text-gray-700 hover:underline">Autopay</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Add</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Autopay</h1>
        <p className="text-base text-gray-600 mb-6">
          Add an automatic payment to help maintain your tier qualification.
        </p>

        {/* Tier context */}
        {nextTier && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-bold">Tier Impact:</span>{' '}
              {wouldAdvance
                ? `Adding this autopay meets the autopay requirement for ${nextTier === 'plus' ? 'Plus' : 'Premium'} tier!`
                : `You need ${autopaysNeededForNext} more autopay${autopaysNeededForNext !== 1 ? 's' : ''} after this to reach ${nextTier === 'plus' ? 'Plus' : 'Premium'} tier.`
              }
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Payment Type */}
          <fieldset className="mb-6">
            <legend className="block text-sm font-bold text-gray-900 mb-3">Payment Type</legend>
            <div className="space-y-2">
              {PAYMENT_TYPES.map((pt) => (
                <label
                  key={pt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer min-h-[48px] transition-colors ${
                    payeeType === pt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payeeType"
                    value={pt.value}
                    checked={payeeType === pt.value}
                    onChange={() => setPayeeType(pt.value as typeof payeeType)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <span className="text-base font-medium text-gray-900">{pt.label}</span>
                    <span className="block text-sm text-gray-500">{pt.description}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600 font-medium" role="alert">{errors.type}</p>
            )}
          </fieldset>

          {/* Account */}
          <div className="mb-6">
            <label htmlFor="autopay-account" className="block text-sm font-bold text-gray-900 mb-2">
              Pay From Account
            </label>
            <select
              id="autopay-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className={`w-full h-12 px-4 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.account ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select account...</option>
              {accounts.filter((a) => a.accountStatus === 'active').map((a) => (
                <option key={a.accountId} value={a.accountId}>
                  {a.accountName} {a.maskedAccountNumber} ({formatCurrency(a.currentBalance)})
                </option>
              ))}
            </select>
            {errors.account && <p className="mt-1 text-sm text-red-600 font-medium" role="alert">{errors.account}</p>}
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label htmlFor="autopay-amount" className="block text-sm font-bold text-gray-900 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-500">$</span>
              <input
                id="autopay-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className={`w-full h-12 pl-8 pr-4 text-base border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-600 font-medium" role="alert">{errors.amount}</p>}
          </div>

          {/* Frequency */}
          <div className="mb-8">
            <label htmlFor="autopay-frequency" className="block text-sm font-bold text-gray-900 mb-2">
              Payment Frequency
            </label>
            <select
              id="autopay-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full h-12 px-4 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4" role="alert">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Autopay'}
            </Button>
            <Link href="/autopay" className="block">
              <Button variant="secondary" size="lg" className="w-full" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </main>
    </>
  )
}
