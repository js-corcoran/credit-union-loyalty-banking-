import { TierType } from '../types'

export type TierLevel = TierType
export type ISO8601Timestamp = string

export interface TierBenefit {
  label: string
  value: string
  annualSavings?: number
}

export interface LoyaltyTransferContext {
  sourceTier: TierLevel
  targetTier: TierLevel
  currentBalance: number
  tierThreshold: number
  tierGapAmount: number
  destinationAccountId: string
  destinationAccountName: string
  destinationBalance: number
  tierBenefits: TierBenefit[]
  calculatedAt: ISO8601Timestamp
  isStale: boolean
  initiatingPage: 'tier-details' | 'loyalty-hub' | 'unknown'
  sessionId: string
}

export interface TierQualificationGap {
  memberId: string
  currentTier: TierLevel
  nextTier: TierLevel | null
  currentBalance: number
  currentRollingAverageBalance: number
  nextTierThreshold: number
  tierGapAmount: number
  destinationAccountId: string
  destinationAccountType: 'checking' | 'savings' | 'money_market'
  qualificationAccountType: string
  activeAutopays: number
  requiredAutopays: number
  activeCreditCards: number
  maxCreditCards: number
  calculatedAt: ISO8601Timestamp
  balanceFetchedAt: ISO8601Timestamp
  qualifiesNow: boolean
  wouldQualifyWith: (amount: number) => boolean
}

export interface TierSpecification {
  tierLevel: TierLevel
  displayName: string
  minRollingAvgBalance: number
  minActiveAutopays: number
  maxActiveCreditCards: number
  benefits: TierBenefit[]
  nextTier: TierLevel | null
  aprBenefit?: number
}

export interface AccountInfo {
  accountId: string
  accountName: string
  accountType: 'checking' | 'savings' | 'money_market' | 'credit_card'
  balance: number
  availableBalance: number
  lastUpdatedAt: ISO8601Timestamp
  countsTowardTier: boolean
  dailyTransferLimit?: number
  dailyTransferUsed?: number
  hasLegalHold?: boolean
  isActive: boolean
}

export interface TransferFormState {
  fromAccountId: string
  fromAccountName: string
  fromAccountBalance: number
  fromAccountType: 'checking' | 'savings' | 'money_market'
  toAccountId: string
  toAccountName: string
  toAccountBalance: number
  toAccountType: 'checking' | 'savings' | 'money_market'
  toAccountPreFilled: boolean
  toAccountEdited: boolean
  amount: number
  amountPreFilled: number
  amountEdited: boolean
  memo: string
  memoPreFilled: string
  memoEdited: boolean
  errors: TransferFormError[]
  warnings: TransferFormWarning[]
  isValid: boolean
  loyaltyTransferContext?: LoyaltyTransferContext
  isLoyaltyTransfer: boolean
  isSubmitting: boolean
  isLoading: boolean
  lastValidatedAt?: ISO8601Timestamp
}

export interface TransferFormError {
  field: 'fromAccount' | 'toAccount' | 'amount' | 'memo'
  message: string
  severity: 'error' | 'warning'
}

export type TransferFormWarning = TransferFormError

export interface TransferRequest {
  fromAccountId: string
  toAccountId: string
  amount: number
  memo: string
  isLoyaltyTransfer?: boolean
  loyaltySessionId?: string
  loyaltySourceContext?: string
}

export interface TransferResponse {
  transferId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  fromAccount: AccountInfo
  toAccount: AccountInfo
  amount: number
  memo: string
  createdAt: ISO8601Timestamp
  estimatedCompletionAt: ISO8601Timestamp
  tierStatusAfterTransfer?: TierQualificationGap
  qualifiesForTier?: boolean
}

export interface LoyaltyTransferQueryParams {
  loyalty: string
  targetTier: string
  amount: string
  toAccountId: string
  memo?: string
  initiatingPage?: string
}
