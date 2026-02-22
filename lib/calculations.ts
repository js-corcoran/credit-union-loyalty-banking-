import { TierType, Member, AutopayStatus } from './types'
import { TIER_CONFIGURATIONS } from './constants'

/**
 * Calculate rolling balance: average of balance on last day of month for past 3 months
 */
export function calculateRollingBalance(monthEndBalances: number[]): number {
  if (monthEndBalances.length === 0) return 0
  return monthEndBalances.reduce((sum, bal) => sum + bal, 0) / monthEndBalances.length
}

/**
 * Determine tier qualification based on balance and autopay criteria
 */
export function getTierQualification(params: {
  balance: number
  autopayCount: number
  creditCardAutopayCount?: number
}): TierType | null {
  const { balance, autopayCount, creditCardAutopayCount = 0 } = params

  const premium = TIER_CONFIGURATIONS.find((t) => t.tierId === 'premium')!
  const plus = TIER_CONFIGURATIONS.find((t) => t.tierId === 'plus')!
  const classic = TIER_CONFIGURATIONS.find((t) => t.tierId === 'classic')!

  if (
    balance >= premium.requirements.minimumBalance &&
    autopayCount >= premium.requirements.minimumAutopay &&
    creditCardAutopayCount <= premium.requirements.creditCardAutopayLimit
  ) {
    return 'premium'
  }

  if (
    balance >= plus.requirements.minimumBalance &&
    autopayCount >= plus.requirements.minimumAutopay &&
    creditCardAutopayCount <= plus.requirements.creditCardAutopayLimit
  ) {
    return 'plus'
  }

  if (
    balance >= classic.requirements.minimumBalance &&
    autopayCount >= classic.requirements.minimumAutopay
  ) {
    return 'classic'
  }

  return null
}

/**
 * Calculate APY boost benefit value in dollars
 */
export function calculateApyBoostValue(balance: number, apyBoostPercentage: number): number {
  return (balance * apyBoostPercentage) / 100
}

/**
 * Calculate fee waiver benefit value in dollars
 */
export function calculateFeeWaiverValue(
  estimatedTransfersPerMonth: number,
  feeAmount: number
): number {
  return estimatedTransfersPerMonth * 12 * feeAmount
}

/**
 * Calculate days until tier loss based on grace period
 */
export function calculateDaysUntilTierLoss(
  gracePeriodStartDate: Date,
  gracePeriodDays: number
): number {
  const now = new Date()
  const endDate = new Date(gracePeriodStartDate)
  endDate.setDate(endDate.getDate() + gracePeriodDays)
  const diffMs = endDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}
