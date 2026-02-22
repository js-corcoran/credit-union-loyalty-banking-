import {
  LoyaltyTransferContext,
  TierLevel,
  TransferFormError,
  TransferFormWarning,
} from './types'

const VALID_TIERS: TierLevel[] = ['classic', 'plus', 'premium']
const STALE_THRESHOLD_MS = 15 * 60 * 1000 // 15 minutes

// URL parameter parsing

export function parseLoyaltyTransferParams(
  searchParams: URLSearchParams
): LoyaltyTransferContext | null {
  const loyalty = searchParams.get('loyalty')
  if (loyalty !== 'true') return null

  const targetTier = searchParams.get('targetTier') as TierLevel
  if (!targetTier || !VALID_TIERS.includes(targetTier)) return null

  const amountStr = searchParams.get('amount')
  const amount = amountStr ? parseFloat(amountStr) : NaN
  if (isNaN(amount) || amount <= 0) return null

  const toAccountId = searchParams.get('toAccountId')
  if (!toAccountId) return null

  const sourceTier = (searchParams.get('sourceTier') as TierLevel) || 'classic'
  const memo = searchParams.get('memo') || 'Loyalty tier qualification transfer'
  const initiatingPage =
    (searchParams.get('initiatingPage') as
      | 'tier-details'
      | 'loyalty-hub'
      | 'unknown') || 'unknown'

  const currentBalance = parseFloat(
    searchParams.get('currentBalance') || '0'
  )
  const tierThreshold = parseFloat(
    searchParams.get('tierThreshold') || '0'
  )
  const destinationBalance = parseFloat(
    searchParams.get('destinationBalance') || '0'
  )

  const calculatedAt =
    searchParams.get('calculatedAt') || new Date().toISOString()

  return {
    sourceTier,
    targetTier,
    currentBalance,
    tierThreshold,
    tierGapAmount: amount,
    destinationAccountId: toAccountId,
    destinationAccountName: searchParams.get('destinationAccountName') || '',
    destinationBalance,
    tierBenefits: [],
    calculatedAt,
    isStale: isDataStale(calculatedAt),
    initiatingPage,
    sessionId:
      searchParams.get('sessionId') || crypto.randomUUID?.() || Date.now().toString(),
  }
}

export function generateLoyaltyTransferUrl(
  context: LoyaltyTransferContext
): string {
  const params = new URLSearchParams({
    loyalty: 'true',
    targetTier: context.targetTier,
    amount: context.tierGapAmount.toString(),
    toAccountId: context.destinationAccountId,
    sourceTier: context.sourceTier,
    currentBalance: context.currentBalance.toString(),
    tierThreshold: context.tierThreshold.toString(),
    destinationBalance: context.destinationBalance.toString(),
    destinationAccountName: context.destinationAccountName,
    calculatedAt: context.calculatedAt,
    initiatingPage: context.initiatingPage,
    sessionId: context.sessionId,
  })

  return `/transfer?${params.toString()}`
}

// Tier gap calculation

export function calculateTierGap(
  currentBalance: number,
  tierThreshold: number
): number {
  return Math.max(0, tierThreshold - currentBalance)
}

export function isDataStale(timestamp: string): boolean {
  const calculatedTime = new Date(timestamp).getTime()
  const now = Date.now()
  return now - calculatedTime > STALE_THRESHOLD_MS
}

export function getMinutesSinceCalculation(timestamp: string): number {
  const calculatedTime = new Date(timestamp).getTime()
  const now = Date.now()
  return Math.floor((now - calculatedTime) / (1000 * 60))
}

// Transfer validation

export function validateTransferAmount(
  amount: number,
  sourceBalance: number,
  tierGap: number
): { isValid: boolean; errors: TransferFormError[]; warnings: TransferFormWarning[] } {
  const errors: TransferFormError[] = []
  const warnings: TransferFormWarning[] = []

  if (amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Amount must be greater than $0',
      severity: 'error',
    })
  }

  if (amount > sourceBalance) {
    errors.push({
      field: 'amount',
      message: `Insufficient funds. Available balance: $${sourceBalance.toLocaleString()}`,
      severity: 'error',
    })
  }

  if (tierGap > 0 && amount < tierGap) {
    warnings.push({
      field: 'amount',
      message: `This amount won't reach the tier threshold. You need $${tierGap.toLocaleString()} to qualify.`,
      severity: 'warning',
    })
  }

  if (tierGap > 0 && amount > tierGap) {
    const excess = amount - tierGap
    warnings.push({
      field: 'amount',
      message: `You're transferring $${excess.toLocaleString()} more than the minimum needed ($${tierGap.toLocaleString()}).`,
      severity: 'warning',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateDestinationAccount(
  accountId: string,
  countsTowardTier: boolean
): { isValid: boolean; message: string | null } {
  if (!accountId) {
    return { isValid: false, message: 'Please select a destination account.' }
  }

  if (!countsTowardTier) {
    return {
      isValid: true,
      message:
        'This account does not count toward tier qualification. Consider selecting a qualifying account.',
    }
  }

  return { isValid: true, message: null }
}

export function validateMemo(memo: string): {
  isValid: boolean
  message: string | null
} {
  if (memo.length > 50) {
    return { isValid: false, message: 'Memo must be 50 characters or fewer.' }
  }
  return { isValid: true, message: null }
}

// Tier display helpers

const TIER_DISPLAY_NAMES: Record<TierLevel, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function getTierDisplayName(tier: TierLevel): string {
  return TIER_DISPLAY_NAMES[tier] || tier
}

const TIER_ORDER: Record<TierLevel, number> = {
  classic: 0,
  plus: 1,
  premium: 2,
}

export function getNextTier(currentTier: TierLevel): TierLevel | null {
  if (currentTier === 'premium') return null
  if (currentTier === 'plus') return 'premium'
  return 'plus'
}

export function isTierUpgrade(from: TierLevel, to: TierLevel): boolean {
  return TIER_ORDER[to] > TIER_ORDER[from]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
