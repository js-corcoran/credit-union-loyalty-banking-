// Member & Account Data

export type TierType = 'classic' | 'plus' | 'premium'

export interface Member {
  memberId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  currentTier: TierType
  tierChangeDate: Date
  joinDate: Date
  qualifyingAccounts: QualifyingAccount[]
  autopayStatus: AutopayStatus
  notificationPreferences: NotificationPreferences
  lastLoginDate: Date
}

export interface QualifyingAccount {
  accountId: string
  accountType: 'checking' | 'savings' | 'money-market' | 'line-of-credit'
  currentBalance: number
  rollingBalance3Month: number
  qualifiesForTier: boolean
  contributesToTier: TierType[]
}

export interface AutopayStatus {
  loanAutopay: boolean
  creditCardAutopay: boolean
  billPaymentAutopay: boolean
  totalCount: number
  autopayDetails: AutopayDetail[]
}

export interface AutopayDetail {
  autopayId: string
  accountId: string
  payeeType: 'loan' | 'credit-card' | 'bill'
  amount: number
  frequency: 'monthly' | 'bi-weekly' | 'quarterly'
  expirationDate: Date
  status: 'active' | 'paused' | 'expired'
  contributesToTier: TierType[]
}

// Tier Configuration

export interface TierConfiguration {
  tierId: TierType
  tierName: string
  displayColor: string
  iconName: string
  requirements: TierRequirements
  benefits: Benefit[]
  gracePeriodDays: number
  priority: number
}

export interface TierRequirements {
  minimumBalance: number
  minimumAutopay: number
  autopayTypes: ('loan' | 'credit-card' | 'bill')[]
  creditCardAutopayLimit: number
  rollingBalancePeriodMonths: number
}

// Benefit & Calculation

export interface Benefit {
  benefitId: string
  benefitName: string
  benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  description: string
  icon: string
  tier: TierType
  apyBoostPercentage?: number
  waivableFeesPerYear?: number
  feeAmount?: number
  partnerName?: string
  rewardRate?: number
}

export interface MemberBenefitCalculation {
  memberId: string
  tier: TierType
  calculationDate: Date
  benefitBreakdown: CalculatedBenefit[]
  totalAnnualBenefitValue: number
}

export interface CalculatedBenefit {
  benefitId: string
  benefitName: string
  apyBoost?: number
  memberBalance?: number
  estimatedTransfersPerMonth?: number
  calculatedAnnualValue: number
  calculationBasis: string
  isEstimate: boolean
  lastUpdated: Date
}

// Transactions & History

export interface Transaction {
  transactionId: string
  accountId: string
  date: Date
  merchant: string
  amount: number
  transactionType: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest'
  category: string
  description: string
  tierBenefit?: TransactionBenefit
}

export interface TransactionBenefit {
  benefitType: 'apy-boost' | 'fee-waiver' | 'third-party-rewards'
  benefitValue: number
  description: string
}

// Notifications

export type NotificationChannel = 'in-app' | 'email' | 'sms'

export interface Notification {
  notificationId: string
  memberId: string
  notificationType:
    | 'tier-achievement'
    | 'tier-loss-risk'
    | 'autopay-expiration'
    | 'balance-approaching-threshold'
    | 'retrogression-alert'
  title: string
  message: string
  severity: 'info' | 'warning' | 'urgent'
  actionUrl?: string
  actionText?: string
  createdDate: Date
  readDate?: Date
  expirationDate: Date
  channels: NotificationChannel[]
}

export interface NotificationPreferences {
  frequencyPreference: 'daily' | 'weekly' | 'alerts-only'
  preferredChannels: NotificationChannel[]
  notificationTypePreferences: {
    tierAchievement: boolean
    retrogressionRisk: boolean
    autopayExpiration: boolean
    balanceThreshold: boolean
  }
  timePreference?: string
}

// FAQ & Content

export interface FAQItem {
  faqId: string
  question: string
  answer: string
  category: 'qualification' | 'benefits' | 'retrogression' | 'legacy-migration' | 'troubleshooting'
  keywords: string[]
  relatedFAQIds: string[]
  visualExplanation?: {
    type: 'diagram' | 'flowchart' | 'image'
    url: string
    altText: string
  }
  relevantTiers: TierType[]
  exampleMember?: {
    balance: number
    autopayCount: number
    expectedTier: TierType
  }
}

// Tier Migration (Legacy Program)

export interface TierMigrationStatus {
  memberId: string
  legacyProgram: {
    tierName: string
    benefits: string[]
  }
  newProgram: {
    tierName: TierType
    benefits: Benefit[]
    annualValue: number
  }
  migrationDate: Date
  benefitComparison: {
    oldBenefitValue: number
    newBenefitValue: number
    improvementPercentage: number
  }
}

// Search & Analytics

export interface TierThresholdMonitor {
  memberId: string
  currentTier: TierType
  nextTierThreshold: number
  currentProgress: number
  daysUntilTierLoss: number
  riskFactors: string[]
  recommendedActions: string[]
  lastUpdatedDate: Date
}
