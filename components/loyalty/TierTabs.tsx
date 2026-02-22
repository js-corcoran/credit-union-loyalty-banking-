'use client'

import { TierType } from '@/lib/types'

interface TierTabsProps {
  activeTier: TierType
  currentMemberTier: TierType
  onTabChange: (tier: TierType) => void
}

const tabs: { id: TierType; label: string; color: string }[] = [
  { id: 'classic', label: 'Classic', color: 'border-gray-500' },
  { id: 'plus', label: 'Plus', color: 'border-[#D4A574]' },
  { id: 'premium', label: 'Premium', color: 'border-gray-400' },
]

export function TierTabs({ activeTier, currentMemberTier, onTabChange }: TierTabsProps) {
  return (
    <div role="tablist" aria-label="Tier comparison tabs" className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTier === tab.id
        const isCurrent = currentMemberTier === tab.id

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tier-panel-${tab.id}`}
            id={`tier-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 px-4 py-3 text-base font-medium text-center
              min-h-[48px] transition-colors duration-150
              border-b-2 -mb-[1px]
              ${isActive
                ? `${tab.color} text-gray-900 font-bold`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `.trim()}
          >
            {tab.label}
            {isCurrent && (
              <span className="ml-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                Your tier
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
