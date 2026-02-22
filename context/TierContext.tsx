'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import { TierConfiguration, TierRequirements, TierType, Member } from '@/lib/types'
import { getTierConfigurations } from '@/lib/api'
import { getTierQualification } from '@/lib/calculations'

interface TierContextType {
  tiers: TierConfiguration[]
  tierThresholds: Map<TierType, TierRequirements>
  loading: boolean
  getTierRequirements: (tier: TierType) => TierRequirements | undefined
  calculateTierFromData: (member: Member) => TierType | null
}

export const TierContext = createContext<TierContextType | undefined>(undefined)

export function TierProvider({ children }: { children: ReactNode }) {
  const [tiers, setTiers] = useState<TierConfiguration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTierConfigurations().then((data) => {
      setTiers(data)
      setLoading(false)
    })
  }, [])

  const tierThresholds = new Map<TierType, TierRequirements>(
    tiers.map((t) => [t.tierId, t.requirements])
  )

  const getTierRequirementsForTier = (tier: TierType) => {
    return tiers.find((t) => t.tierId === tier)?.requirements
  }

  const calculateTierFromData = (member: Member): TierType | null => {
    const totalBalance = member.qualifyingAccounts.reduce(
      (sum, acc) => sum + acc.rollingBalance3Month,
      0
    )
    const autopayCount = member.autopayStatus.totalCount
    return getTierQualification({ balance: totalBalance, autopayCount })
  }

  return (
    <TierContext.Provider
      value={{
        tiers,
        tierThresholds,
        loading,
        getTierRequirements: getTierRequirementsForTier,
        calculateTierFromData,
      }}
    >
      {children}
    </TierContext.Provider>
  )
}
