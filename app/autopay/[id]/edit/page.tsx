'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getAutopays, getMemberProfile } from '@/lib/api'
import { AutopayDetail } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { Button } from '@/components/shared/Button'

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
] as const

export default function AutopayEditPage() {
  const params = useParams()
  const router = useRouter()
  const autopayId = params.id as string

  const [autopay, setAutopay] = useState<AutopayDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'bi-weekly' | 'quarterly'>('monthly')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const member = await getMemberProfile('MEMBER-001')
        const autopays = await getAutopays('MEMBER-001')
        const found = autopays.find((a) => a.autopayId === autopayId) ||
          member.autopayStatus.autopayDetails.find((a) => a.autopayId === autopayId)
        if (found) {
          setAutopay(found)
          setAmount(String(found.amount))
          setFrequency(found.frequency)
        }
      } catch {
        setError('Unable to load autopay details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [autopayId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Mock update
    await new Promise((r) => setTimeout(r, 500))
    setSubmitting(false)
    router.push('/autopay')
  }

  if (loading) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse space-y-4" aria-busy="true">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="h-12 w-full bg-gray-100 rounded-lg" />
            <div className="h-12 w-full bg-gray-100 rounded-lg" />
          </div>
        </main>
      </>
    )
  }

  if (error || !autopay) {
    return (
      <>
        <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error || 'Autopay not found.'}</p>
            <Link href="/autopay"><Button variant="primary">Back to Autopays</Button></Link>
          </div>
        </main>
      </>
    )
  }

  const payeeLabel = autopay.payeeType === 'credit-card' ? 'Credit Card' : autopay.payeeType === 'loan' ? 'Loan Payment' : 'Bill Payment'

  return (
    <>
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/autopay" className="hover:text-gray-700 hover:underline">Autopay</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Edit</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Autopay</h1>
        <p className="text-base text-gray-600 mb-6">
          Update your {payeeLabel.toLowerCase()} autopay settings.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <span className="font-bold">Note:</span> This autopay contributes to your tier qualification. Significant changes may affect your tier status.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 mb-1">Payment Type</p>
            <p className="text-base text-gray-700">{payeeLabel}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900 mb-1">Account</p>
            <p className="text-base text-gray-700">{autopay.accountId}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="edit-amount" className="block text-sm font-bold text-gray-900 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-gray-500">$</span>
              <input
                id="edit-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full h-12 pl-8 pr-4 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="edit-frequency" className="block text-sm font-bold text-gray-900 mb-2">
              Payment Frequency
            </label>
            <select
              id="edit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full h-12 px-4 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
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
