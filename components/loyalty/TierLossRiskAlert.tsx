'use client'

import Link from 'next/link'
import { Button } from '@/components/shared/Button'

interface RecoveryStep {
  action: string
  amount: string
  description: string
}

interface TierLossRiskAlertProps {
  isAtRisk: boolean
  riskType: 'balance' | 'autopay' | 'both' | null
  daysRemaining: number
  recoverySteps: RecoveryStep[]
}

export function TierLossRiskAlert({
  isAtRisk,
  riskType,
  daysRemaining,
  recoverySteps,
}: TierLossRiskAlertProps) {
  if (!isAtRisk) return null

  const isCritical = daysRemaining <= 14

  return (
    <div
      className={`rounded-xl p-4 md:p-5 border animate-[fadeIn_200ms_ease-in] ${
        isCritical
          ? 'bg-red-50 border-red-200'
          : 'bg-amber-50 border-amber-200'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <svg
          className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <h3 className={`text-base font-bold ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>
            {isCritical ? 'Alert: ' : ''}
            Your {riskType === 'balance' ? 'balance' : riskType === 'autopay' ? 'autopay count' : 'balance and autopays'} {riskType === 'both' ? 'are' : 'is'} approaching the tier minimum
          </h3>
          <p className={`text-base mt-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
            You have <span className="font-bold">{daysRemaining} days</span> before your grace period starts.
          </p>

          {recoverySteps.length > 0 && (
            <div className="mt-3">
              <p className={`text-sm font-semibold ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>
                To maintain your tier:
              </p>
              <ul className={`list-disc list-inside text-sm mt-1 space-y-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                {recoverySteps.map((step, i) => (
                  <li key={i}>{step.description}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/transfer">
              <Button variant="primary" size="sm">
                Transfer money
              </Button>
            </Link>
            <Link href="/autopay/add">
              <Button variant="outline" size="sm">
                Add autopay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
