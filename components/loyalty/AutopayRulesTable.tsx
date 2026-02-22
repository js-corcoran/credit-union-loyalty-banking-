'use client'

import { AutopayRule } from '@/lib/api'

interface AutopayRulesTableProps {
  rules: AutopayRule[]
  memberAutopayTypes: string[]
}

const typeLabels: Record<string, string> = {
  loan: 'Loan autopay',
  bill: 'Bill payment',
  'credit-card': 'Credit card autopay',
}

export function AutopayRulesTable({ rules, memberAutopayTypes }: AutopayRulesTableProps) {
  return (
    <section aria-label="Autopay rules">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Autopay Rules</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Autopay Type</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Counts Toward Tier?</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Limit</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Your Status</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => {
              const hasType = memberAutopayTypes.includes(rule.type)
              return (
                <tr key={rule.type} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-base text-gray-900">
                    {typeLabels[rule.type] || rule.type}
                  </td>
                  <td className="py-3 px-4">
                    {rule.countsTowardTier ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-base text-gray-600">
                    {rule.limit !== null ? `Max ${rule.limit} per tier` : 'No limit'}
                  </td>
                  <td className="py-3 px-4">
                    {hasType ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not set up</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-3">
        You have {memberAutopayTypes.length} active autopay{memberAutopayTypes.length !== 1 ? 's' : ''}{' '}
        ({memberAutopayTypes.join(', ') || 'none'})
      </p>
    </section>
  )
}
