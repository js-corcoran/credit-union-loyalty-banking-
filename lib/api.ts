import {
  Member,
  TierConfiguration,
  TierType,
  Notification,
  MemberBenefitCalculation,
  FAQItem,
  AutopayDetail,
  AutopayStatus,
  Transaction,
} from './types'
import { mockMember1, mockFAQItems } from './mock-data'
import { TIER_CONFIGURATIONS } from './constants'

/**
 * Member API Functions
 */

export async function getMemberProfile(memberId: string): Promise<Member> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMember1), 300)
  })
}

export async function getMemberBenefits(
  memberId: string
): Promise<MemberBenefitCalculation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockMember1
      const totalBalance = member.qualifyingAccounts.reduce(
        (sum, acc) => sum + acc.currentBalance,
        0
      )
      const calculation = calculateBenefitValue(
        member.currentTier,
        totalBalance,
        member.autopayStatus
      )
      resolve(calculation)
    }, 300)
  })
}

/**
 * Tier API Functions
 */

export interface AutopayRule {
  type: 'loan' | 'bill' | 'credit-card'
  countsTowardTier: boolean
  limit: number | null
}

export interface MemberQualificationStatus {
  currentTier: TierType
  qualifyingBalance: number
  rollingBalance3Month: number[]
  autopayCount: number
  autopayTypes: string[]
  balanceGapToNextTier: number
  autopayGapToNextTier: number
}

export interface TierDetailsResponse {
  memberId: string
  currentTier: TierType
  tiers: TierConfiguration[]
  memberStatus: MemberQualificationStatus
  autopayRules: AutopayRule[]
}

export async function getTierDetails(
  memberId: string
): Promise<TierDetailsResponse> {
  const member = await getMemberProfile(memberId)
  const rollingBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.rollingBalance3Month,
    0
  )
  const autopayTypes = member.autopayStatus.autopayDetails
    .filter((a) => a.status === 'active')
    .map((a) => a.payeeType)

  let balanceGap = 0
  let autopayGap = 0
  if (member.currentTier === 'classic') {
    const plus = TIER_CONFIGURATIONS.find((t) => t.tierId === 'plus')!
    balanceGap = Math.max(0, plus.requirements.minimumBalance - rollingBalance)
    autopayGap = Math.max(
      0,
      plus.requirements.minimumAutopay - member.autopayStatus.totalCount
    )
  } else if (member.currentTier === 'plus') {
    const premium = TIER_CONFIGURATIONS.find((t) => t.tierId === 'premium')!
    balanceGap = Math.max(
      0,
      premium.requirements.minimumBalance - rollingBalance
    )
    autopayGap = Math.max(
      0,
      premium.requirements.minimumAutopay - member.autopayStatus.totalCount
    )
  }

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId: member.memberId,
          currentTier: member.currentTier,
          tiers: TIER_CONFIGURATIONS,
          memberStatus: {
            currentTier: member.currentTier,
            qualifyingBalance: rollingBalance,
            rollingBalance3Month: [14200, 14600, 14700],
            autopayCount: member.autopayStatus.totalCount,
            autopayTypes,
            balanceGapToNextTier: balanceGap,
            autopayGapToNextTier: autopayGap,
          },
          autopayRules: [
            { type: 'loan', countsTowardTier: true, limit: null },
            { type: 'bill', countsTowardTier: true, limit: null },
            { type: 'credit-card', countsTowardTier: true, limit: 1 },
          ],
        }),
      300
    )
  })
}

export interface TierStatusResponse {
  memberId: string
  currentTier: TierType
  tierCalculation: {
    qualifyingBalance: number
    autopayCount: number
    formulaResult: TierType
  }
  qualifyingAccounts: {
    accountId: string
    accountName: string
    accountType: string
    balance: number
    rollingBalance3Month: number
    contributesToTier: TierType[]
  }[]
  autopayStatus: {
    autopayId: string
    type: string
    status: 'active' | 'expiring-soon' | 'expired'
    expirationDate: Date
    contributesToTier: TierType[]
  }[]
  nextTierThreshold: {
    tier: TierType
    minimumBalance: number
    balanceGap: number
    minimumAutopay: number
    autopayGap: number
  } | null
  riskStatus: {
    isAtRisk: boolean
    riskType: 'balance' | 'autopay' | 'both' | null
    daysUntilThreshold: number
    recoverySteps: { action: string; amount: string; description: string }[]
  }
  annualBenefitValue: number
}

export async function getTierStatus(
  memberId: string
): Promise<TierStatusResponse> {
  const member = await getMemberProfile(memberId)
  const totalBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.currentBalance,
    0
  )
  const rollingBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.rollingBalance3Month,
    0
  )

  const accountTypeLabels: Record<string, string> = {
    checking: 'Checking',
    savings: 'Savings',
    'money-market': 'Money Market',
    'line-of-credit': 'Line of Credit',
  }

  let nextTierThreshold: TierStatusResponse['nextTierThreshold'] = null
  if (member.currentTier === 'classic') {
    const plus = TIER_CONFIGURATIONS.find((t) => t.tierId === 'plus')!
    nextTierThreshold = {
      tier: 'plus',
      minimumBalance: plus.requirements.minimumBalance,
      balanceGap: Math.max(0, plus.requirements.minimumBalance - rollingBalance),
      minimumAutopay: plus.requirements.minimumAutopay,
      autopayGap: Math.max(0, plus.requirements.minimumAutopay - member.autopayStatus.totalCount),
    }
  } else if (member.currentTier === 'plus') {
    const premium = TIER_CONFIGURATIONS.find((t) => t.tierId === 'premium')!
    nextTierThreshold = {
      tier: 'premium',
      minimumBalance: premium.requirements.minimumBalance,
      balanceGap: Math.max(0, premium.requirements.minimumBalance - rollingBalance),
      minimumAutopay: premium.requirements.minimumAutopay,
      autopayGap: Math.max(0, premium.requirements.minimumAutopay - member.autopayStatus.totalCount),
    }
  }

  const tierConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === member.currentTier)!
  const benefitValue = tierConfig.benefits.reduce((sum, b) => {
    if (b.benefitType === 'apy-boost') return sum + (totalBalance * (b.apyBoostPercentage || 0)) / 100
    if (b.benefitType === 'fee-waiver') return sum + 2 * 12 * (b.feeAmount || 0)
    if (b.benefitType === 'third-party-rewards') return sum + 15000 * (b.rewardRate || 0)
    return sum
  }, 0)

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId: member.memberId,
          currentTier: member.currentTier,
          tierCalculation: {
            qualifyingBalance: rollingBalance,
            autopayCount: member.autopayStatus.totalCount,
            formulaResult: member.currentTier,
          },
          qualifyingAccounts: member.qualifyingAccounts.map((a) => ({
            accountId: a.accountId,
            accountName: accountTypeLabels[a.accountType] || a.accountType,
            accountType: a.accountType,
            balance: a.currentBalance,
            rollingBalance3Month: a.rollingBalance3Month,
            contributesToTier: a.contributesToTier,
          })),
          autopayStatus: member.autopayStatus.autopayDetails.map((a) => {
            const daysToExpiry = Math.ceil(
              (a.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
            return {
              autopayId: a.autopayId,
              type: a.payeeType,
              status:
                daysToExpiry <= 0
                  ? ('expired' as const)
                  : daysToExpiry <= 30
                    ? ('expiring-soon' as const)
                    : ('active' as const),
              expirationDate: a.expirationDate,
              contributesToTier: a.contributesToTier,
            }
          }),
          nextTierThreshold,
          riskStatus: {
            isAtRisk: false,
            riskType: null,
            daysUntilThreshold: 120,
            recoverySteps: [],
          },
          annualBenefitValue: Math.round(benefitValue * 100) / 100,
        }),
      300
    )
  })
}

export async function getTierConfigurations(): Promise<TierConfiguration[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TIER_CONFIGURATIONS), 300)
  })
}

export async function calculateMemberTier(memberId: string): Promise<{
  currentTier: TierType
  nextTierThreshold: number | undefined
  daysUntilTierLoss: number
  recommendedActions: string[]
}> {
  const member = await getMemberProfile(memberId)
  const totalBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.rollingBalance3Month,
    0
  )
  const autopayCount = member.autopayStatus.totalCount

  let tier: TierType = 'classic'
  if (totalBalance >= 25000 && autopayCount >= 2) tier = 'premium'
  else if (totalBalance >= 10000 && autopayCount >= 2) tier = 'plus'
  else tier = 'classic'

  return {
    currentTier: tier,
    nextTierThreshold:
      tier === 'classic' ? 10000 : tier === 'plus' ? 25000 : undefined,
    daysUntilTierLoss: 45,
    recommendedActions:
      tier === 'classic'
        ? ['Add $7,500 to balance', 'Add another autopay']
        : [],
  }
}

/**
 * Loyalty Summary API
 */

export interface LoyaltySummaryBenefit {
  benefitId: string
  benefitName: string
  benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  description: string
  annualValue: number
  personalizationNote: string
}

export interface LoyaltySummaryResponse {
  memberId: string
  currentTier: TierType
  tierChangeDate: Date
  annualBenefitValue: number
  totalQualifyingBalance: number
  autopayStatus: {
    totalCount: number
    loanAutopay: boolean
    creditCardAutopay: boolean
    expirationDate: Date
  }
  nextTierThreshold: {
    tier: TierType
    minimumBalance: number
    balanceGap: number
    minimumAutopay: number
    autopayGap: number
  } | null
  benefits: LoyaltySummaryBenefit[]
}

export async function getLoyaltySummary(
  memberId: string
): Promise<LoyaltySummaryResponse> {
  const member = await getMemberProfile(memberId)
  const totalBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.currentBalance,
    0
  )
  const rollingBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.rollingBalance3Month,
    0
  )

  const tierConfig = TIER_CONFIGURATIONS.find(
    (t) => t.tierId === member.currentTier
  )!

  const benefits: LoyaltySummaryBenefit[] = tierConfig.benefits.map((b) => {
    let value = 0
    let note = ''
    if (b.benefitType === 'apy-boost') {
      value = (totalBalance * (b.apyBoostPercentage || 0)) / 100
      note = `Based on your $${totalBalance.toLocaleString()} balance`
    } else if (b.benefitType === 'fee-waiver') {
      value = 2 * 12 * (b.feeAmount || 0)
      note = 'Based on ~2 transfers/month'
    } else if (b.benefitType === 'third-party-rewards') {
      value = 15000 * (b.rewardRate || 0)
      note = 'Based on your purchase history'
    }
    return {
      benefitId: b.benefitId,
      benefitName: b.benefitName,
      benefitType: b.benefitType,
      description: b.description,
      annualValue: Math.round(value * 100) / 100,
      personalizationNote: note,
    }
  })

  const annualBenefitValue = benefits.reduce(
    (sum, b) => sum + b.annualValue,
    0
  )

  let nextTierThreshold: LoyaltySummaryResponse['nextTierThreshold'] = null
  if (member.currentTier === 'classic') {
    const plusConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === 'plus')!
    nextTierThreshold = {
      tier: 'plus',
      minimumBalance: plusConfig.requirements.minimumBalance,
      balanceGap: Math.max(
        0,
        plusConfig.requirements.minimumBalance - rollingBalance
      ),
      minimumAutopay: plusConfig.requirements.minimumAutopay,
      autopayGap: Math.max(
        0,
        plusConfig.requirements.minimumAutopay - member.autopayStatus.totalCount
      ),
    }
  } else if (member.currentTier === 'plus') {
    const premiumConfig = TIER_CONFIGURATIONS.find(
      (t) => t.tierId === 'premium'
    )!
    nextTierThreshold = {
      tier: 'premium',
      minimumBalance: premiumConfig.requirements.minimumBalance,
      balanceGap: Math.max(
        0,
        premiumConfig.requirements.minimumBalance - rollingBalance
      ),
      minimumAutopay: premiumConfig.requirements.minimumAutopay,
      autopayGap: Math.max(
        0,
        premiumConfig.requirements.minimumAutopay -
          member.autopayStatus.totalCount
      ),
    }
  }

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId: member.memberId,
          currentTier: member.currentTier,
          tierChangeDate: member.tierChangeDate,
          annualBenefitValue: Math.round(annualBenefitValue * 100) / 100,
          totalQualifyingBalance: totalBalance,
          autopayStatus: {
            totalCount: member.autopayStatus.totalCount,
            loanAutopay: member.autopayStatus.loanAutopay,
            creditCardAutopay: member.autopayStatus.creditCardAutopay,
            expirationDate: new Date('2026-05-31'),
          },
          nextTierThreshold,
          benefits,
        }),
      300
    )
  })
}

/**
 * Benefit Details API
 */

export interface BenefitDetailItem {
  benefitId: string
  benefitName: string
  benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  description: string
  rules: string
  formula: string
  calculatedAnnualValue: number
  monthlyValue: number
  memberValues: {
    balance?: number
    apyPercentage?: number
    transfersPerMonth?: number
    feePerTransfer?: number
    monthlySpend?: number
    pointsPerDollar?: number
    pointsMultiplier?: number
    cashValuePerPoint?: number
  }
  steps: { label: string; value: string }[]
  comparisonToOtherTiers: {
    classic: { label: string; value: number }
    plus: { label: string; value: number }
    premium: { label: string; value: number }
  }
  proofData: {
    pastYearEarnings: number
    period: string
    recentExamples?: {
      date: string
      description: string
      amount: number
      benefitApplied: string
    }[]
  }
  partnerName?: string
  partnerURL?: string
}

export interface BenefitDetailsResponse {
  memberId: string
  currentTier: TierType
  totalAnnualBenefitValue: number
  benefits: BenefitDetailItem[]
  annualSummary: {
    breakdown: { benefitType: string; benefitName: string; value: number; percentage: number }[]
    tierComparison: { tier: TierType; tierName: string; totalValue: number }[]
  }
}

export async function getBenefitDetails(
  memberId: string
): Promise<BenefitDetailsResponse> {
  const member = await getMemberProfile(memberId)
  const totalBalance = member.qualifyingAccounts.reduce(
    (sum, acc) => sum + acc.currentBalance,
    0
  )

  const tierConfig = TIER_CONFIGURATIONS.find(
    (t) => t.tierId === member.currentTier
  )!

  // Build detailed benefit items
  const benefits: BenefitDetailItem[] = tierConfig.benefits.map((b) => {
    if (b.benefitType === 'apy-boost') {
      const annualValue = (totalBalance * (b.apyBoostPercentage || 0)) / 100
      const classicApy = TIER_CONFIGURATIONS.find((t) => t.tierId === 'classic')!.benefits.find((x) => x.benefitType === 'apy-boost')?.apyBoostPercentage || 0
      const plusApy = TIER_CONFIGURATIONS.find((t) => t.tierId === 'plus')!.benefits.find((x) => x.benefitType === 'apy-boost')?.apyBoostPercentage || 0
      const premiumApy = TIER_CONFIGURATIONS.find((t) => t.tierId === 'premium')!.benefits.find((x) => x.benefitType === 'apy-boost')?.apyBoostPercentage || 0

      return {
        benefitId: b.benefitId,
        benefitName: b.benefitName,
        benefitType: b.benefitType,
        description: `Earn +${b.apyBoostPercentage}% annual interest on qualifying savings accounts`,
        rules: 'Applies to savings and money market accounts',
        formula: 'Balance × APY % ÷ 100',
        calculatedAnnualValue: Math.round(annualValue * 100) / 100,
        monthlyValue: Math.round((annualValue / 12) * 100) / 100,
        memberValues: {
          balance: totalBalance,
          apyPercentage: b.apyBoostPercentage,
        },
        steps: [
          { label: 'Your current balance', value: `$${totalBalance.toLocaleString()}` },
          { label: `${tierConfig.tierName} tier APY boost`, value: `+${b.apyBoostPercentage}%` },
          { label: 'Annual value', value: `$${totalBalance.toLocaleString()} × ${b.apyBoostPercentage}% = $${annualValue.toFixed(2)}` },
          { label: 'Monthly value', value: `~$${(annualValue / 12).toFixed(2)}` },
        ],
        comparisonToOtherTiers: {
          classic: { label: `+${classicApy}%`, value: Math.round((totalBalance * classicApy) / 100 * 100) / 100 },
          plus: { label: `+${plusApy}%`, value: Math.round((totalBalance * plusApy) / 100 * 100) / 100 },
          premium: { label: `+${premiumApy}%`, value: Math.round((totalBalance * premiumApy) / 100 * 100) / 100 },
        },
        proofData: {
          pastYearEarnings: Math.round(annualValue * 100) / 100,
          period: '2025-02-21 to 2026-02-21',
        },
      }
    }

    if (b.benefitType === 'fee-waiver') {
      const transfersPerMonth = 2
      const feePerTransfer = b.feeAmount || 2.5
      const annualValue = transfersPerMonth * 12 * feePerTransfer
      const classicFee = TIER_CONFIGURATIONS.find((t) => t.tierId === 'classic')!.benefits.find((x) => x.benefitType === 'fee-waiver')
      const premiumFee = TIER_CONFIGURATIONS.find((t) => t.tierId === 'premium')!.benefits.find((x) => x.benefitType === 'fee-waiver')

      return {
        benefitId: b.benefitId,
        benefitName: b.benefitName,
        benefitType: b.benefitType,
        description: 'Waived transfer fees on your ' + tierConfig.tierName + ' tier',
        rules: 'All transfers between your accounts, to other members, and ACH transfers are free',
        formula: 'Transfers/month × 12 months × Fee per transfer',
        calculatedAnnualValue: annualValue,
        monthlyValue: Math.round((annualValue / 12) * 100) / 100,
        memberValues: {
          transfersPerMonth,
          feePerTransfer,
        },
        steps: [
          { label: 'Your transfer frequency', value: `~${transfersPerMonth} transfers/month` },
          { label: 'Fee per transfer without tier', value: `$${feePerTransfer.toFixed(2)}` },
          { label: 'Annual savings', value: `${transfersPerMonth} × 12 × $${feePerTransfer.toFixed(2)} = $${annualValue.toFixed(2)}` },
          { label: 'Monthly savings', value: `~$${(annualValue / 12).toFixed(2)}` },
        ],
        comparisonToOtherTiers: {
          classic: { label: 'Standard waivers', value: (classicFee ? 2 * 12 * (classicFee.feeAmount || 0) : 0) },
          plus: { label: 'Transfer waivers', value: annualValue },
          premium: { label: 'Transfer + ATM waivers', value: (premiumFee ? 2 * 12 * (premiumFee.feeAmount || 0) + 36 : 0) },
        },
        proofData: {
          pastYearEarnings: annualValue,
          period: '2025-02-21 to 2026-02-21',
          recentExamples: [
            {
              date: '2026-02-19',
              description: 'Transfer to savings — $1,000',
              amount: 2.50,
              benefitApplied: 'Fee waived with ' + tierConfig.tierName + ' tier',
            },
            {
              date: '2026-02-05',
              description: 'ACH transfer — $500',
              amount: 2.50,
              benefitApplied: 'Fee waived with ' + tierConfig.tierName + ' tier',
            },
          ],
        },
      }
    }

    // third-party-rewards
    const monthlySpend = 500
    const pointsPerDollar = 2.0
    const multiplier = member.currentTier === 'premium' ? 3.0 : member.currentTier === 'plus' ? 2.0 : 1.0
    const cashValuePerPoint = 0.01
    const rawAnnual = monthlySpend * pointsPerDollar * 12 * cashValuePerPoint
    const annualValue = Math.round(rawAnnual * (multiplier / 2) * 100) / 100
    const classicReward = 0
    const plusReward = Math.round(rawAnnual * 100) / 100
    const premiumReward = Math.round(rawAnnual * 1.5 * 100) / 100

    return {
      benefitId: b.benefitId,
      benefitName: b.benefitName,
      benefitType: b.benefitType,
      description: 'Earn bonus points with partner retailers',
      rules: `Earn ${multiplier}X points on qualifying purchases at partner retailers (groceries, gas, dining). Points redeemable for cash back, gift cards, or charitable donations.`,
      formula: 'Monthly spend × Points/dollar × 12 × Cash value/point',
      calculatedAnnualValue: annualValue,
      monthlyValue: Math.round((annualValue / 12) * 100) / 100,
      memberValues: {
        monthlySpend,
        pointsPerDollar,
        pointsMultiplier: multiplier,
        cashValuePerPoint,
      },
      steps: [
        { label: 'Estimated monthly spend', value: `$${monthlySpend.toLocaleString()}` },
        { label: 'Points earned per dollar', value: `${pointsPerDollar}` },
        { label: 'Points multiplier', value: `${multiplier}X` },
        { label: 'Cash value per point', value: `$${cashValuePerPoint}` },
        { label: 'Annual rewards value', value: `$${annualValue.toFixed(2)}` },
      ],
      comparisonToOtherTiers: {
        classic: { label: '1X points', value: classicReward },
        plus: { label: '2X points', value: plusReward },
        premium: { label: '3X points', value: premiumReward },
      },
      proofData: {
        pastYearEarnings: annualValue,
        period: '2025-02-21 to 2026-02-21',
        recentExamples: [
          {
            date: '2026-02-15',
            description: 'Whole Foods Market — $145.32',
            amount: 2.91,
            benefitApplied: `${multiplier}X points (290 points earned)`,
          },
          {
            date: '2026-02-12',
            description: 'Shell Gas Station — $65.00',
            amount: 1.30,
            benefitApplied: `${multiplier}X points (130 points earned)`,
          },
        ],
      },
      partnerName: 'RetailPoints Partnership Network',
      partnerURL: 'https://example.com/partners',
    }
  })

  const totalAnnualBenefitValue = Math.round(
    benefits.reduce((sum, b) => sum + b.calculatedAnnualValue, 0) * 100
  ) / 100

  // Build annual summary
  const breakdown = benefits.map((b) => ({
    benefitType: b.benefitType,
    benefitName: b.benefitName,
    value: b.calculatedAnnualValue,
    percentage: totalAnnualBenefitValue > 0
      ? Math.round((b.calculatedAnnualValue / totalAnnualBenefitValue) * 1000) / 10
      : 0,
  }))

  // Compute total for each tier
  const tierComparison: BenefitDetailsResponse['annualSummary']['tierComparison'] = TIER_CONFIGURATIONS.map((tc) => {
    const tierTotal = tc.benefits.reduce((sum, b) => {
      if (b.benefitType === 'apy-boost') return sum + (totalBalance * (b.apyBoostPercentage || 0)) / 100
      if (b.benefitType === 'fee-waiver') return sum + 2 * 12 * (b.feeAmount || 0)
      if (b.benefitType === 'third-party-rewards') return sum + 15000 * (b.rewardRate || 0)
      return sum
    }, 0)
    return {
      tier: tc.tierId,
      tierName: tc.tierName,
      totalValue: Math.round(tierTotal * 100) / 100,
    }
  })

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId: member.memberId,
          currentTier: member.currentTier,
          totalAnnualBenefitValue,
          benefits,
          annualSummary: {
            breakdown,
            tierComparison,
          },
        }),
      300
    )
  })
}

/**
 * Benefit Calculation Functions
 */

export function calculateBenefitValue(
  tier: TierType,
  memberBalance: number,
  _autopayStatus: AutopayStatus
): MemberBenefitCalculation {
  const tierConfig = TIER_CONFIGURATIONS.find((t) => t.tierId === tier)!

  const benefitBreakdown = tierConfig.benefits.map((benefit) => {
    let value = 0
    if (benefit.benefitType === 'apy-boost') {
      value = (memberBalance * (benefit.apyBoostPercentage || 0)) / 100
    } else if (benefit.benefitType === 'fee-waiver') {
      value = 2 * 12 * (benefit.feeAmount || 0)
    } else if (benefit.benefitType === 'third-party-rewards') {
      value = 15000 * (benefit.rewardRate || 0)
    }

    return {
      benefitId: benefit.benefitId,
      benefitName: benefit.benefitName,
      apyBoost: benefit.apyBoostPercentage,
      memberBalance:
        benefit.benefitType === 'apy-boost' ? memberBalance : undefined,
      estimatedTransfersPerMonth:
        benefit.benefitType === 'fee-waiver' ? 2 : undefined,
      calculatedAnnualValue: value,
      calculationBasis: 'local-calculation',
      isEstimate: benefit.benefitType !== 'apy-boost',
      lastUpdated: new Date(),
    }
  })

  const totalValue = benefitBreakdown.reduce(
    (sum, b) => sum + b.calculatedAnnualValue,
    0
  )

  return {
    memberId: 'MEMBER-001',
    tier,
    calculationDate: new Date(),
    benefitBreakdown,
    totalAnnualBenefitValue: totalValue,
  }
}

/**
 * Notification API Functions
 */

export async function getNotifications(
  memberId: string
): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 300)
  })
}

export async function sendNotification(
  memberId: string,
  notification: Omit<Notification, 'notificationId' | 'createdDate'>
): Promise<Notification> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...notification,
        notificationId: `NOTIF-${Date.now()}`,
        createdDate: new Date(),
      })
    }, 300)
  })
}

/**
 * FAQ API Functions
 */

export async function getFAQItems(
  category?: string,
  searchQuery?: string
): Promise<FAQItem[]> {
  return new Promise((resolve) => {
    let results = mockFAQItems

    if (category) {
      results = results.filter((item) => item.category === category)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
      )
    }

    setTimeout(() => resolve(results), 300)
  })
}

/**
 * Support Status API
 */

export interface SupportStatus {
  phone: {
    number: string
    isAvailable: boolean
    hoursToday: string
    nextAvailability: string
  }
  email: {
    address: string
    isAvailable: boolean
    avgResponseTime: string
  }
  chat: {
    isAvailable: boolean
    hoursToday: string
    nextAvailability: string
  }
}

export async function getSupportStatus(): Promise<SupportStatus> {
  return new Promise((resolve) => {
    const now = new Date()
    const hour = now.getHours()
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
    setTimeout(
      () =>
        resolve({
          phone: {
            number: '1-800-555-0100',
            isAvailable: isWeekday && hour >= 8 && hour < 18,
            hoursToday: 'Mon-Fri 8am-6pm ET',
            nextAvailability: hour < 8 ? '8am ET today' : '8am ET tomorrow',
          },
          email: {
            address: 'support@creditunion.example.com',
            isAvailable: true,
            avgResponseTime: '24 hours',
          },
          chat: {
            isAvailable: isWeekday && hour >= 9 && hour < 17,
            hoursToday: 'Mon-Fri 9am-5pm ET',
            nextAvailability: hour < 9 ? '9am ET today' : '9am ET tomorrow',
          },
        }),
      200
    )
  })
}

/**
 * Autopay API Functions
 */

export async function getAutopays(memberId: string): Promise<AutopayDetail[]> {
  const member = await getMemberProfile(memberId)
  return new Promise((resolve) => {
    setTimeout(() => resolve(member.autopayStatus.autopayDetails), 300)
  })
}

export async function createAutopay(
  memberId: string,
  autopayData: Omit<AutopayDetail, 'autopayId'>
): Promise<AutopayDetail> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...autopayData,
        autopayId: `AP-${Date.now()}`,
      })
    }, 300)
  })
}

export async function deleteAutopay(
  memberId: string,
  autopayId: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300)
  })
}

/**
 * Transaction API Functions
 */

export async function getTransactions(
  memberId: string,
  accountId?: string,
  limit: number = 5
): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          transactionId: 'TXN-1005',
          accountId: 'CHK-9876',
          date: new Date('2026-02-21'),
          merchant: 'Local Grocery Store',
          amount: 75.50,
          transactionType: 'debit',
          category: 'Groceries',
          description: 'Debit card purchase',
        },
        {
          transactionId: 'TXN-1004',
          accountId: 'CHK-9876',
          date: new Date('2026-02-20'),
          merchant: 'Starbucks Coffee',
          amount: 5.50,
          transactionType: 'debit',
          category: 'Food & Dining',
          description: 'Debit card purchase',
        },
        {
          transactionId: 'TXN-1003',
          accountId: 'CHK-9876',
          date: new Date('2026-02-19'),
          merchant: 'Transfer to Savings',
          amount: 1000,
          transactionType: 'transfer',
          category: 'Transfer',
          description: 'Account transfer',
          tierBenefit: {
            benefitType: 'fee-waiver',
            benefitValue: 2.50,
            description: 'Fee waived with Plus tier',
          },
        },
        {
          transactionId: 'TXN-1002',
          accountId: 'SAV-5432',
          date: new Date('2026-02-18'),
          merchant: 'Interest Payment',
          amount: 4.38,
          transactionType: 'interest',
          category: 'Interest',
          description: 'Monthly interest earned',
          tierBenefit: {
            benefitType: 'apy-boost',
            benefitValue: 1.77,
            description: '+0.25% APY boost earned',
          },
        },
        {
          transactionId: 'TXN-1001',
          accountId: 'CHK-9876',
          date: new Date('2026-02-17'),
          merchant: 'City Water Utility',
          amount: 62.00,
          transactionType: 'debit',
          category: 'Bills & Utilities',
          description: 'Bill payment',
        },
      ]

      const filtered = accountId
        ? mockTransactions.filter((t) => t.accountId === accountId)
        : mockTransactions

      resolve(filtered.slice(0, limit))
    }, 300)
  })
}

/**
 * Account Detail API Functions
 */

export interface AccountDetail {
  accountId: string
  memberId: string
  accountName: string
  accountType: 'checking' | 'savings' | 'money-market'
  maskedAccountNumber: string
  currentBalance: number
  availableBalance: number
  accountStatus: 'active' | 'closed' | 'dormant'
  openedDate: string
  interestRate: number
  apy: number
  tierAPYBoost: number
  effectiveAPY: number
  lastStatementDate: string
  nextStatementDate: string
  currency: string
}

export interface AccountTransaction {
  transactionId: string
  accountId: string
  date: string
  merchant: string
  amount: number
  description: string
  category: string
  runningBalance: number
  status: 'completed' | 'pending' | 'failed'
  tierBenefit?: {
    benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
    benefitValue: number
    description: string
  }
}

export interface AccountTierContext {
  accountId: string
  accountBalance: number
  rollingBalance3Month: number
  contributesToTier: string[]
  currentTierFromAllAccounts: string
  allAccountsTotalBalance: number
  nextTierThreshold: {
    tier: string
    minimumBalance: number
    minimumAutopay: number
    balanceShortfall: number
  }
  tierBenefitsOnThisAccount: {
    apyBoost: number
    feeWaiverApplied: boolean
    thirdPartyRewardsEligible: boolean
  }
}

const mockAccountDetails: Record<string, AccountDetail> = {
  'CHK-9876': {
    accountId: 'CHK-9876',
    memberId: 'MEMBER-001',
    accountName: 'Checking',
    accountType: 'checking',
    maskedAccountNumber: '****9876',
    currentBalance: 15000,
    availableBalance: 15000,
    accountStatus: 'active',
    openedDate: '2015-06-15',
    interestRate: 0.01,
    apy: 0.01,
    tierAPYBoost: 0.0025,
    effectiveAPY: 0.0125,
    lastStatementDate: '2026-01-31',
    nextStatementDate: '2026-02-28',
    currency: 'USD',
  },
  'SAV-5432': {
    accountId: 'SAV-5432',
    memberId: 'MEMBER-001',
    accountName: 'Savings',
    accountType: 'savings',
    maskedAccountNumber: '****5432',
    currentBalance: 8500,
    availableBalance: 8500,
    accountStatus: 'active',
    openedDate: '2015-06-15',
    interestRate: 0.015,
    apy: 0.015,
    tierAPYBoost: 0.0025,
    effectiveAPY: 0.04,
    lastStatementDate: '2026-01-31',
    nextStatementDate: '2026-02-28',
    currency: 'USD',
  },
}

const mockAccountTransactions: Record<string, AccountTransaction[]> = {
  'CHK-9876': [
    { transactionId: 'TXN-2001', accountId: 'CHK-9876', date: '2026-02-21', merchant: 'Local Grocery Store', amount: -75.50, description: 'Debit card purchase', category: 'Groceries', runningBalance: 15000, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2002', accountId: 'CHK-9876', date: '2026-02-20', merchant: 'Transfer to Savings', amount: -1000, description: 'Account Transfer', category: 'Transfer', runningBalance: 15075.50, status: 'completed', tierBenefit: { benefitType: 'fee-waiver', benefitValue: 2.50, description: 'Fee waived with Plus tier' } },
    { transactionId: 'TXN-2003', accountId: 'CHK-9876', date: '2026-02-19', merchant: 'Starbucks Coffee', amount: -5.50, description: 'Debit card purchase', category: 'Food & Dining', runningBalance: 16075.50, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2004', accountId: 'CHK-9876', date: '2026-02-18', merchant: 'Amazon.com', amount: -42.99, description: 'Online purchase', category: 'Shopping', runningBalance: 16081.00, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2005', accountId: 'CHK-9876', date: '2026-02-17', merchant: 'City Water Utility', amount: -62.00, description: 'Bill payment', category: 'Bills & Utilities', runningBalance: 16123.99, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2006', accountId: 'CHK-9876', date: '2026-02-15', merchant: 'Direct Deposit', amount: 2500, description: 'Payroll deposit', category: 'Income', runningBalance: 16185.99, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2007', accountId: 'CHK-9876', date: '2026-02-14', merchant: 'Shell Gas Station', amount: -48.00, description: 'Debit card purchase', category: 'Transportation', runningBalance: 13685.99, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2008', accountId: 'CHK-9876', date: '2026-02-12', merchant: 'Transfer to Savings', amount: -500, description: 'Account Transfer', category: 'Transfer', runningBalance: 13733.99, status: 'completed', tierBenefit: { benefitType: 'fee-waiver', benefitValue: 2.50, description: 'Fee waived with Plus tier' } },
    { transactionId: 'TXN-2009', accountId: 'CHK-9876', date: '2026-02-10', merchant: 'Whole Foods Market', amount: -145.32, description: 'Debit card purchase', category: 'Groceries', runningBalance: 14233.99, status: 'completed', tierBenefit: { benefitType: 'third-party-rewards', benefitValue: 2.91, description: '2X points earned (290 pts)' } },
    { transactionId: 'TXN-2010', accountId: 'CHK-9876', date: '2026-02-08', merchant: 'Netflix', amount: -15.99, description: 'Subscription', category: 'Entertainment', runningBalance: 14379.31, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2011', accountId: 'CHK-9876', date: '2026-02-05', merchant: 'ACH Transfer', amount: -500, description: 'ACH Transfer Out', category: 'Transfer', runningBalance: 14395.30, status: 'completed', tierBenefit: { benefitType: 'fee-waiver', benefitValue: 2.50, description: 'Fee waived with Plus tier' } },
    { transactionId: 'TXN-2012', accountId: 'CHK-9876', date: '2026-02-03', merchant: 'CVS Pharmacy', amount: -23.47, description: 'Debit card purchase', category: 'Health', runningBalance: 14895.30, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-2013', accountId: 'CHK-9876', date: '2026-02-01', merchant: 'Direct Deposit', amount: 2500, description: 'Payroll deposit', category: 'Income', runningBalance: 14918.77, status: 'completed', tierBenefit: undefined },
  ],
  'SAV-5432': [
    { transactionId: 'TXN-3001', accountId: 'SAV-5432', date: '2026-02-20', merchant: 'Transfer from Checking', amount: 1000, description: 'Account Transfer', category: 'Transfer', runningBalance: 8500, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-3002', accountId: 'SAV-5432', date: '2026-02-18', merchant: 'Interest Payment', amount: 4.38, description: 'Monthly interest earned', category: 'Interest', runningBalance: 7500, status: 'completed', tierBenefit: { benefitType: 'apy-boost', benefitValue: 1.77, description: '+0.25% APY boost earned' } },
    { transactionId: 'TXN-3003', accountId: 'SAV-5432', date: '2026-02-12', merchant: 'Transfer from Checking', amount: 500, description: 'Account Transfer', category: 'Transfer', runningBalance: 7495.62, status: 'completed', tierBenefit: undefined },
    { transactionId: 'TXN-3004', accountId: 'SAV-5432', date: '2026-01-31', merchant: 'Interest Payment', amount: 3.12, description: 'Monthly interest earned', category: 'Interest', runningBalance: 6995.62, status: 'completed', tierBenefit: { benefitType: 'apy-boost', benefitValue: 1.45, description: '+0.25% APY boost earned' } },
    { transactionId: 'TXN-3005', accountId: 'SAV-5432', date: '2026-01-15', merchant: 'Transfer from Checking', amount: 1000, description: 'Account Transfer', category: 'Transfer', runningBalance: 6992.50, status: 'completed', tierBenefit: undefined },
  ],
}

export async function getAccountDetail(accountId: string): Promise<AccountDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = mockAccountDetails[accountId]
      if (!account) {
        reject(new Error('Account not found'))
        return
      }
      resolve(account)
    }, 300)
  })
}

export async function getAccountTransactions(
  accountId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ accountId: string; transactions: AccountTransaction[]; totalCount: number; hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allTxns = mockAccountTransactions[accountId] || []
      const paginated = allTxns.slice(offset, offset + limit)
      resolve({
        accountId,
        transactions: paginated,
        totalCount: allTxns.length,
        hasMore: offset + limit < allTxns.length,
      })
    }, 250)
  })
}

export async function getAccountTierContext(accountId: string): Promise<AccountTierContext> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const account = mockAccountDetails[accountId]
      const allAccounts = Object.values(mockAccountDetails)
      const totalBalance = allAccounts.reduce((sum, a) => sum + a.currentBalance, 0)

      const rollingBalances: Record<string, number> = {
        'CHK-9876': 14500,
        'SAV-5432': 8200,
      }

      resolve({
        accountId,
        accountBalance: account?.currentBalance || 0,
        rollingBalance3Month: rollingBalances[accountId] || 0,
        contributesToTier: ['classic', 'plus', 'premium'],
        currentTierFromAllAccounts: 'plus',
        allAccountsTotalBalance: totalBalance,
        nextTierThreshold: {
          tier: 'premium',
          minimumBalance: 25000,
          minimumAutopay: 3,
          balanceShortfall: Math.max(0, 25000 - totalBalance),
        },
        tierBenefitsOnThisAccount: {
          apyBoost: 0.0025,
          feeWaiverApplied: true,
          thirdPartyRewardsEligible: true,
        },
      })
    }, 200)
  })
}

/**
 * Transaction Detail API (Shard 09)
 */

export interface TransactionDetail {
  transactionId: string
  accountId: string
  date: string
  postingDate: string
  merchant: string
  merchantAddress: string
  description: string
  amount: number
  category: string
  status: 'completed' | 'pending' | 'failed'
  runningBalance: number
  balanceBeforeTransaction: number
  type: string
  relatedAccount?: {
    accountId: string
    accountName: string
    maskedNumber: string
  }
  tierBenefit?: {
    benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
    benefitValue: number
    description: string
  }
}

// All transactions combined for the transaction list page
function getAllMockAccountTransactions(): AccountTransaction[] {
  const all: AccountTransaction[] = []
  for (const txns of Object.values(mockAccountTransactions)) {
    all.push(...txns)
  }
  // Sort by date DESC
  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return all
}

export async function getAllTransactions(
  filters?: {
    search?: string
    category?: string
    accountId?: string
    status?: string
  },
  limit: number = 20,
  offset: number = 0
): Promise<{ transactions: AccountTransaction[]; totalCount: number; hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = getAllMockAccountTransactions()

      if (filters?.accountId) {
        results = results.filter((t) => t.accountId === filters.accountId)
      }
      if (filters?.category) {
        results = results.filter((t) => t.category.toLowerCase() === filters.category!.toLowerCase())
      }
      if (filters?.status) {
        results = results.filter((t) => t.status === filters.status)
      }
      if (filters?.search && filters.search.trim().length >= 2) {
        const q = filters.search.toLowerCase().trim()
        results = results.filter(
          (t) =>
            t.merchant.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        )
      }

      const totalCount = results.length
      const paginated = results.slice(offset, offset + limit)

      resolve({
        transactions: paginated,
        totalCount,
        hasMore: offset + limit < totalCount,
      })
    }, 300)
  })
}

export async function getTransactionDetail(
  transactionId: string
): Promise<TransactionDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find the transaction across all accounts
      const all = getAllMockAccountTransactions()
      const txn = all.find((t) => t.transactionId === transactionId)
      if (!txn) {
        reject(new Error('Transaction not found'))
        return
      }

      // Build related account info for transfers
      let relatedAccount: TransactionDetail['relatedAccount'] = undefined
      if (txn.category === 'Transfer') {
        if (txn.accountId === 'CHK-9876') {
          relatedAccount = { accountId: 'SAV-5432', accountName: 'Savings', maskedNumber: '****5432' }
        } else {
          relatedAccount = { accountId: 'CHK-9876', accountName: 'Checking', maskedNumber: '****9876' }
        }
      }

      // Determine type
      let type = 'purchase'
      if (txn.category === 'Transfer') type = 'transfer'
      else if (txn.category === 'Income') type = 'deposit'
      else if (txn.category === 'Interest') type = 'interest'

      const accountName = mockAccountDetails[txn.accountId]?.accountName || 'Account'
      const maskedNum = mockAccountDetails[txn.accountId]?.maskedAccountNumber || ''

      resolve({
        transactionId: txn.transactionId,
        accountId: txn.accountId,
        date: txn.date,
        postingDate: txn.date,
        merchant: txn.merchant,
        merchantAddress: type === 'transfer' ? 'Online Transfer' : type === 'deposit' ? 'Direct Deposit' : txn.merchant,
        description: txn.description,
        amount: txn.amount,
        category: txn.category,
        status: txn.status,
        runningBalance: txn.runningBalance,
        balanceBeforeTransaction: txn.runningBalance - txn.amount,
        type,
        relatedAccount: relatedAccount || {
          accountId: txn.accountId,
          accountName: `${accountName} ${maskedNum}`,
          maskedNumber: maskedNum,
        },
        tierBenefit: txn.tierBenefit,
      })
    }, 250)
  })
}

/**
 * Transfer API Functions
 */

/**
 * Legacy Migration API (Shard 15)
 */

export interface LegacyBenefit {
  benefitId: string
  name: string
  description: string
  annualValue: number
}

export interface BenefitComparisonItem {
  benefitId: string
  name: string
  legacyName?: string
  newName?: string
  legacyValue?: number
  newValue?: number
  oldValue?: number
  replacement?: string
  change: 'upgrade' | 'new' | 'discontinued'
}

export interface LegacyMigrationResponse {
  memberId: string
  migrationStatus: 'pending' | 'completed'
  legacyProgram: {
    tierName: string
    benefitsList: LegacyBenefit[]
  }
  newProgram: {
    mappedTier: TierType
    tierName: string
    displayColor: string
    qualificationStatus: {
      balanceQualified: boolean
      autopayQualified: boolean
      qualifyingBalance: number
      autopayCount: number
    }
    benefits: LegacyBenefit[]
  }
  benefitComparison: {
    keep: BenefitComparisonItem[]
    gain: BenefitComparisonItem[]
    lose: BenefitComparisonItem[]
  }
  narrativeText: string
  hasCompletedMigration: boolean
  completionTimestamp: string | null
}

export async function getLegacyMigration(
  memberId: string
): Promise<LegacyMigrationResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId,
          migrationStatus: 'pending',
          legacyProgram: {
            tierName: 'Silver Member',
            benefitsList: [
              {
                benefitId: 'legacy-apy-boost',
                name: 'APY Boost',
                description: 'Earn +0.1% on savings',
                annualValue: 14.5,
              },
              {
                benefitId: 'legacy-referral',
                name: 'Referral Bonus',
                description: 'Earn $25 per successful referral',
                annualValue: 50,
              },
            ],
          },
          newProgram: {
            mappedTier: 'plus',
            tierName: 'Plus',
            displayColor: '#D4A574',
            qualificationStatus: {
              balanceQualified: true,
              autopayQualified: true,
              qualifyingBalance: 14500,
              autopayCount: 2,
            },
            benefits: [
              {
                benefitId: 'apy-boost-plus',
                name: 'APY Boost',
                description: 'Earn +0.25% on savings',
                annualValue: 21.75,
              },
              {
                benefitId: 'fee-waiver-transfer',
                name: 'Transfer Fee Waiver',
                description: 'Unlimited transfers with zero fee',
                annualValue: 60,
              },
              {
                benefitId: 'rewards-plus',
                name: 'Partner Rewards',
                description: 'Cash back on partner purchases',
                annualValue: 8,
              },
            ],
          },
          benefitComparison: {
            keep: [
              {
                benefitId: 'apy-boost-plus',
                legacyName: 'APY Boost',
                newName: 'APY Boost',
                name: 'APY Boost',
                legacyValue: 14.5,
                newValue: 21.75,
                change: 'upgrade',
              },
            ],
            gain: [
              {
                benefitId: 'fee-waiver-transfer',
                name: 'Transfer Fee Waiver',
                newValue: 60,
                change: 'new',
              },
              {
                benefitId: 'rewards-plus',
                name: 'Partner Rewards',
                newValue: 8,
                change: 'new',
              },
            ],
            lose: [
              {
                benefitId: 'legacy-referral',
                name: 'Referral Bonus',
                oldValue: 50,
                replacement:
                  'Fee waiver ($60 annual value)',
                change: 'discontinued',
              },
            ],
          },
          narrativeText:
            "We've simplified our loyalty rewards program to make it easier to earn benefits. You're automatically part of our new program based on your account activity. Here's what that means for you.",
          hasCompletedMigration: false,
          completionTimestamp: null,
        }),
      300
    )
  })
}

export async function markMigrationComplete(
  memberId: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 200)
  })
}

/**
 * Retrogression Status API (Shard 16)
 */

export interface RetrogressionStatusResponse {
  memberId: string
  isAtRisk: boolean
  severity: '30-day' | '14-day' | 'final'
  currentTier: TierType
  riskReason: 'balance' | 'autopay' | 'both'
  qualificationStatus: {
    balanceQualified: boolean
    autopayQualified: boolean
    currentBalance: number
    requiredBalance: number
    balanceGap: number
    currentAutopayCount: number
    requiredAutopayCount: number
  }
  gracePeriod: {
    startDate: string
    endDate: string
    daysRemaining: number
    qualificationLossDate: string
  }
  benefitsAtRisk: {
    benefitId: string
    name: string
    annualValue: number
    description: string
  }[]
  totalAnnualValueAtRisk: number
  recoveryActions: {
    action: 'transfer' | 'autopay'
    amountNeeded?: number
    slotsAvailable?: number
    description: string
  }[]
}

export async function getRetrogressionStatus(
  memberId: string
): Promise<RetrogressionStatusResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId,
          isAtRisk: true,
          severity: '30-day',
          currentTier: 'plus',
          riskReason: 'balance',
          qualificationStatus: {
            balanceQualified: false,
            autopayQualified: true,
            currentBalance: 9500,
            requiredBalance: 10000,
            balanceGap: -500,
            currentAutopayCount: 2,
            requiredAutopayCount: 2,
          },
          gracePeriod: {
            startDate: '2026-02-10',
            endDate: '2026-03-12',
            daysRemaining: 19,
            qualificationLossDate: '2026-03-13',
          },
          benefitsAtRisk: [
            {
              benefitId: 'apy-boost-plus',
              name: 'APY Boost',
              annualValue: 21.75,
              description: 'Earn +0.25% on savings',
            },
            {
              benefitId: 'fee-waiver-transfer',
              name: 'Transfer Fee Waiver',
              annualValue: 60,
              description: 'Unlimited transfers with zero fee',
            },
            {
              benefitId: 'rewards-plus',
              name: 'Partner Rewards',
              annualValue: 8,
              description: 'Cash back on partner purchases',
            },
          ],
          totalAnnualValueAtRisk: 89.75,
          recoveryActions: [
            {
              action: 'transfer',
              amountNeeded: 500,
              description: 'Transfer $500 to your checking account',
            },
          ],
        }),
      300
    )
  })
}

/**
 * Notification Preferences API (Shard 17)
 */

export interface NotificationPreference {
  enabled: boolean
  channels: ('in_app' | 'email' | 'sms')[]
}

export interface NotificationPreferencesResponse {
  memberId: string
  preferences: {
    tierStatus: {
      tierAchievement: NotificationPreference
      tierAtRisk: NotificationPreference
      tierLost: NotificationPreference
    }
    benefits: {
      benefitEarned: NotificationPreference
      newBenefitsAdded: NotificationPreference
      benefitExpiration: NotificationPreference
    }
    account: {
      autopayExpiring: NotificationPreference
      unusualActivity: NotificationPreference
    }
    marketing: {
      newProducts: NotificationPreference
      promotions: NotificationPreference
    }
  }
  deliveryChannels: {
    inApp: { enabled: boolean }
    email: { enabled: boolean; address: string }
    sms: { enabled: boolean; phone: string }
  }
  emailFrequency: 'as-it-happens' | 'daily' | 'weekly'
  updatedAt: string
}

export async function getNotificationPreferences(
  memberId: string
): Promise<NotificationPreferencesResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          memberId,
          preferences: {
            tierStatus: {
              tierAchievement: { enabled: true, channels: ['in_app', 'email'] },
              tierAtRisk: { enabled: true, channels: ['in_app', 'email', 'sms'] },
              tierLost: { enabled: true, channels: ['in_app', 'email'] },
            },
            benefits: {
              benefitEarned: { enabled: true, channels: ['in_app', 'email'] },
              newBenefitsAdded: { enabled: false, channels: [] },
              benefitExpiration: { enabled: true, channels: ['in_app', 'email'] },
            },
            account: {
              autopayExpiring: { enabled: true, channels: ['in_app', 'email'] },
              unusualActivity: { enabled: true, channels: ['in_app', 'email', 'sms'] },
            },
            marketing: {
              newProducts: { enabled: false, channels: [] },
              promotions: { enabled: false, channels: [] },
            },
          },
          deliveryChannels: {
            inApp: { enabled: true },
            email: { enabled: true, address: 'patricia.johnson@example.com' },
            sms: { enabled: false, phone: '+1-555-0101' },
          },
          emailFrequency: 'daily',
          updatedAt: '2026-02-10T15:30:00Z',
        }),
      300
    )
  })
}

export async function updateNotificationPreferences(
  memberId: string,
  _preferences: Partial<NotificationPreferencesResponse>
): Promise<{ success: boolean; message: string; updatedAt: string }> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          success: true,
          message: 'Your notification preferences have been saved.',
          updatedAt: new Date().toISOString(),
        }),
      300
    )
  })
}

export async function sendTestNotification(
  memberId: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500)
  })
}

/**
 * Transfer API Functions
 */

export async function initiateTransfer(
  memberId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number
): Promise<{ transferId: string; fee: number; tierBenefit?: string }> {
  const member = await getMemberProfile(memberId)
  const fee = member.currentTier === 'classic' ? 2.5 : 0

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transferId: `TFR-${Date.now()}`,
        fee,
        tierBenefit: fee === 0 ? 'Fee waived by Plus tier' : undefined,
      })
    }, 300)
  })
}
