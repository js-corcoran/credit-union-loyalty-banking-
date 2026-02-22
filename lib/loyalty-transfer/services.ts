import {
  TierLevel,
  TierSpecification,
  TierQualificationGap,
  AccountInfo,
  ISO8601Timestamp,
} from './types'

// Service interfaces

export interface ITierService {
  getTierGap(
    memberId: string,
    options?: { forceRefresh?: boolean }
  ): Promise<TierQualificationGap>

  getTierConfig(tierLevel: TierLevel): Promise<TierSpecification>

  getAllTierConfigs(): Promise<Record<TierLevel, TierSpecification>>
}

export interface IAccountService {
  listAccounts(memberId: string): Promise<AccountInfo[]>

  getAccount(accountId: string): Promise<AccountInfo>

  getBalance(
    accountId: string
  ): Promise<{ balance: number; lastUpdatedAt: ISO8601Timestamp }>
}

// Mock implementations

const TIER_CONFIGS: Record<TierLevel, TierSpecification> = {
  classic: {
    tierLevel: 'classic',
    displayName: 'Classic',
    minRollingAvgBalance: 2500,
    minActiveAutopays: 1,
    maxActiveCreditCards: 5,
    benefits: [
      { label: 'Standard APY', value: '0.25%', annualSavings: 2 },
      { label: 'Online Banking', value: 'Free', annualSavings: 0 },
    ],
    nextTier: 'plus',
    aprBenefit: 0.0025,
  },
  plus: {
    tierLevel: 'plus',
    displayName: 'Plus',
    minRollingAvgBalance: 10000,
    minActiveAutopays: 2,
    maxActiveCreditCards: 1,
    benefits: [
      { label: 'APY on Savings', value: '0.95%', annualSavings: 45 },
      { label: 'ATM Fee Waiver', value: '$0.50/mo', annualSavings: 6 },
      { label: 'Autopay Included', value: '2 free', annualSavings: 0 },
    ],
    nextTier: 'premium',
    aprBenefit: 0.0095,
  },
  premium: {
    tierLevel: 'premium',
    displayName: 'Premium',
    minRollingAvgBalance: 25000,
    minActiveAutopays: 3,
    maxActiveCreditCards: 2,
    benefits: [
      { label: 'APY on Savings', value: '1.25%', annualSavings: 125 },
      { label: 'ATM Fee Waiver', value: '$0.50/mo', annualSavings: 6 },
      { label: 'Autopay Included', value: 'Unlimited', annualSavings: 0 },
    ],
    nextTier: null,
    aprBenefit: 0.0125,
  },
}

const MOCK_ACCOUNTS: Record<string, AccountInfo> = {
  'CHK-9876': {
    accountId: 'CHK-9876',
    accountName: 'Checking',
    accountType: 'checking',
    balance: 15000,
    availableBalance: 15000,
    lastUpdatedAt: new Date().toISOString(),
    countsTowardTier: true,
    isActive: true,
  },
  'SAV-5432': {
    accountId: 'SAV-5432',
    accountName: 'Savings',
    accountType: 'savings',
    balance: 8500,
    availableBalance: 8500,
    lastUpdatedAt: new Date().toISOString(),
    countsTowardTier: true,
    isActive: true,
  },
  'MM-2468': {
    accountId: 'MM-2468',
    accountName: 'Money Market',
    accountType: 'money_market',
    balance: 1050,
    availableBalance: 1050,
    lastUpdatedAt: new Date().toISOString(),
    countsTowardTier: true,
    isActive: true,
  },
}

export class MockTierService implements ITierService {
  async getTierGap(
    memberId: string,
    _options?: { forceRefresh?: boolean }
  ): Promise<TierQualificationGap> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock member: Plus tier, $23,500 combined, needs $1,500 more for Premium
    return {
      memberId,
      currentTier: 'plus',
      nextTier: 'premium',
      currentBalance: 23500,
      currentRollingAverageBalance: 23500,
      nextTierThreshold: 25000,
      tierGapAmount: 1500,
      destinationAccountId: 'SAV-5432',
      destinationAccountType: 'savings',
      qualificationAccountType: 'savings',
      activeAutopays: 2,
      requiredAutopays: 3,
      activeCreditCards: 0,
      maxCreditCards: 2,
      calculatedAt: new Date().toISOString(),
      balanceFetchedAt: new Date().toISOString(),
      qualifiesNow: false,
      wouldQualifyWith: (amount: number) => 23500 + amount >= 25000,
    }
  }

  async getTierConfig(tierLevel: TierLevel): Promise<TierSpecification> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return TIER_CONFIGS[tierLevel]
  }

  async getAllTierConfigs(): Promise<Record<TierLevel, TierSpecification>> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return TIER_CONFIGS
  }
}

export class MockAccountService implements IAccountService {
  async listAccounts(_memberId: string): Promise<AccountInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return Object.values(MOCK_ACCOUNTS)
  }

  async getAccount(accountId: string): Promise<AccountInfo> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const account = MOCK_ACCOUNTS[accountId]
    if (!account) {
      throw new Error(`Account not found: ${accountId}`)
    }
    return account
  }

  async getBalance(
    accountId: string
  ): Promise<{ balance: number; lastUpdatedAt: ISO8601Timestamp }> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const account = MOCK_ACCOUNTS[accountId]
    return {
      balance: account?.balance || 0,
      lastUpdatedAt: new Date().toISOString(),
    }
  }
}

// Service factory
export function createTierService(): ITierService {
  return new MockTierService()
}

export function createAccountService(): IAccountService {
  return new MockAccountService()
}
