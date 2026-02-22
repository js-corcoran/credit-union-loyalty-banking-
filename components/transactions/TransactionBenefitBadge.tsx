'use client'

import { formatCurrency } from '@/lib/formatting'

interface TransactionBenefitBadgeProps {
  benefitType: 'fee-waiver' | 'apy-boost' | 'third-party-rewards'
  benefitValue: number
  description: string
  variant?: 'inline' | 'full'
}

export function TransactionBenefitBadge({
  benefitType,
  benefitValue,
  description,
  variant = 'inline',
}: TransactionBenefitBadgeProps) {
  const icon = benefitType === 'fee-waiver'
    ? (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    )
    : benefitType === 'apy-boost'
      ? (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
      : (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )

  if (variant === 'inline') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white"
        aria-label={`${description}: ${formatCurrency(benefitValue)}`}
      >
        {icon}
        <span>{description}</span>
      </span>
    )
  }

  // Full variant for detail page
  return (
    <div
      className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
      aria-label={`${description}: ${formatCurrency(benefitValue)}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-bold bg-emerald-500 text-white">
          {icon}
          <span>{description}</span>
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          {formatCurrency(benefitValue)}
        </span>
      </div>
      <p className="text-sm text-emerald-700">
        {benefitType === 'fee-waiver' && (
          <>Your tier includes 0% fee on transfers. Without this benefit, this transaction would have cost {formatCurrency(benefitValue)} more.</>
        )}
        {benefitType === 'apy-boost' && (
          <>This interest credit includes +{formatCurrency(benefitValue)} from your tier APY boost.</>
        )}
        {benefitType === 'third-party-rewards' && (
          <>You earned bonus rewards points on this eligible purchase worth {formatCurrency(benefitValue)}.</>
        )}
      </p>
    </div>
  )
}
