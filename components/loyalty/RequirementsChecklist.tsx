'use client'

import { TierType, TierRequirements } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'
import { MemberQualificationStatus } from '@/lib/api'

interface RequirementsChecklistProps {
  tier: TierType
  tierName: string
  requirements: TierRequirements
  memberStatus: MemberQualificationStatus
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function RequirementsChecklist({
  tier,
  tierName,
  requirements,
  memberStatus,
}: RequirementsChecklistProps) {
  const meetsBalance = memberStatus.qualifyingBalance >= requirements.minimumBalance
  const meetsAutopay = memberStatus.autopayCount >= requirements.minimumAutopay
  const balanceShort = requirements.minimumBalance - memberStatus.qualifyingBalance

  return (
    <section aria-label={`${tierName} qualification requirements`}>
      <h3 className="text-xl font-bold text-gray-900 mb-3">How to Qualify</h3>
      <ul className="space-y-3" role="list">
        <li className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
          {meetsBalance ? <CheckIcon /> : <XIcon />}
          <div>
            <p className="text-base font-medium text-gray-900">
              {formatCurrency(requirements.minimumBalance)}+ rolling 3-month average balance
              <span className="ml-2 text-sm font-normal text-gray-500">
                {meetsBalance
                  ? '(Met)'
                  : `(${formatCurrency(balanceShort)} short)`
                }
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Your rolling balance: {formatCurrency(memberStatus.qualifyingBalance)}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
          {meetsAutopay ? <CheckIcon /> : <XIcon />}
          <div>
            <p className="text-base font-medium text-gray-900">
              {requirements.minimumAutopay} active autopay{requirements.minimumAutopay !== 1 ? 's' : ''}
              <span className="ml-2 text-sm font-normal text-gray-500">
                {meetsAutopay
                  ? '(Met)'
                  : `(Need ${requirements.minimumAutopay - memberStatus.autopayCount} more)`
                }
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Your autopays: {memberStatus.autopayCount} ({memberStatus.autopayTypes.join(', ') || 'none'})
            </p>
            {requirements.creditCardAutopayLimit > 0 && (
              <p className="text-sm text-amber-600 mt-1">
                Credit card autopay limit: max {requirements.creditCardAutopayLimit} per tier
              </p>
            )}
          </div>
        </li>
      </ul>
    </section>
  )
}
