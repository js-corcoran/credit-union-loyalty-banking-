'use client'

import { Card } from '@/components/shared/Card'
import { formatCurrency } from '@/lib/formatting'

interface BenefitCardProps {
  benefitName: string
  benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  description: string
  annualValue: number
  personalizationNote: string
  onClick?: () => void
  className?: string
}

const benefitIcons: Record<string, React.ReactNode> = {
  'apy-boost': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  'fee-waiver': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'third-party-rewards': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
}

export function BenefitCard({
  benefitName,
  benefitType,
  description,
  annualValue,
  personalizationNote,
  onClick,
  className = '',
}: BenefitCardProps) {
  return (
    <Card
      as="article"
      className={`p-4 md:p-5 ${onClick ? '' : ''} ${className}`}
      onClick={onClick}
      ariaLabel={`${benefitName}: ${formatCurrency(annualValue)} per year`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-blue-600 flex-shrink-0 mt-0.5">
          {benefitIcons[benefitType]}
        </span>
        <div>
          <h3 className="text-base font-bold text-gray-900">{benefitName}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-lg font-bold text-emerald-600">
          {formatCurrency(annualValue)}/year
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{personalizationNote}</p>
      </div>

      {onClick && (
        <p className="text-sm text-blue-600 font-medium mt-3 hover:underline">
          Learn more about this benefit
        </p>
      )}
    </Card>
  )
}
