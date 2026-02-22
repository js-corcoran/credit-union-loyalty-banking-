'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import {
  LoyaltyTransferContext as LoyaltyTransferContextType,
  TierQualificationGap,
  TransferFormState,
  TransferFormError,
  TransferFormWarning,
  AccountInfo,
  TierLevel,
} from '@/lib/loyalty-transfer/types'
import {
  createTierService,
  createAccountService,
  ITierService,
  IAccountService,
} from '@/lib/loyalty-transfer/services'
import {
  validateTransferAmount,
  validateDestinationAccount,
  validateMemo,
  isDataStale,
} from '@/lib/loyalty-transfer/utils'

// Context value interface
interface LoyaltyTransferProviderValue {
  // Loyalty context
  loyaltyContext: LoyaltyTransferContextType | null
  setLoyaltyContext: (ctx: LoyaltyTransferContextType) => void
  clearLoyaltyContext: () => void

  // Tier gap
  tierGap: TierQualificationGap | null
  tierGapLoading: boolean
  tierGapError: Error | null
  refreshTierGap: () => Promise<void>

  // Accounts
  accounts: AccountInfo[]
  accountsLoading: boolean

  // Form state
  formState: TransferFormState
  updateFormField: <K extends keyof TransferFormState>(
    field: K,
    value: TransferFormState[K]
  ) => void
  resetForm: () => void
  validateForm: () => { errors: TransferFormError[]; warnings: TransferFormWarning[]; isValid: boolean }

  // Services
  tierService: ITierService
  accountService: IAccountService
}

const defaultFormState: TransferFormState = {
  fromAccountId: '',
  fromAccountName: '',
  fromAccountBalance: 0,
  fromAccountType: 'checking',
  toAccountId: '',
  toAccountName: '',
  toAccountBalance: 0,
  toAccountType: 'savings',
  toAccountPreFilled: false,
  toAccountEdited: false,
  amount: 0,
  amountPreFilled: 0,
  amountEdited: false,
  memo: '',
  memoPreFilled: '',
  memoEdited: false,
  errors: [],
  warnings: [],
  isValid: false,
  isLoyaltyTransfer: false,
  isSubmitting: false,
  isLoading: false,
}

const LoyaltyTransferCtx = createContext<LoyaltyTransferProviderValue>({
  loyaltyContext: null,
  setLoyaltyContext: () => {},
  clearLoyaltyContext: () => {},
  tierGap: null,
  tierGapLoading: false,
  tierGapError: null,
  refreshTierGap: async () => {},
  accounts: [],
  accountsLoading: false,
  formState: defaultFormState,
  updateFormField: () => {},
  resetForm: () => {},
  validateForm: () => ({ errors: [], warnings: [], isValid: false }),
  tierService: createTierService(),
  accountService: createAccountService(),
})

const CONTEXT_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes

export function LoyaltyTransferProvider({ children }: { children: ReactNode }) {
  const [tierService] = useState<ITierService>(() => createTierService())
  const [accountService] = useState<IAccountService>(() => createAccountService())

  const [loyaltyContext, setLoyaltyContextState] =
    useState<LoyaltyTransferContextType | null>(null)
  const [tierGap, setTierGap] = useState<TierQualificationGap | null>(null)
  const [tierGapLoading, setTierGapLoading] = useState(false)
  const [tierGapError, setTierGapError] = useState<Error | null>(null)
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [formState, setFormState] = useState<TransferFormState>(defaultFormState)

  // Auto-expire context after 30 minutes
  useEffect(() => {
    if (!loyaltyContext) return
    const timer = setTimeout(() => {
      setLoyaltyContextState(null)
      setFormState(defaultFormState)
    }, CONTEXT_EXPIRY_MS)
    return () => clearTimeout(timer)
  }, [loyaltyContext])

  const setLoyaltyContext = useCallback(
    (ctx: LoyaltyTransferContextType) => {
      setLoyaltyContextState(ctx)
      // Initialize form with pre-filled values
      setFormState((prev) => ({
        ...prev,
        toAccountId: ctx.destinationAccountId,
        toAccountName: ctx.destinationAccountName,
        toAccountBalance: ctx.destinationBalance,
        toAccountPreFilled: true,
        toAccountEdited: false,
        amount: ctx.tierGapAmount,
        amountPreFilled: ctx.tierGapAmount,
        amountEdited: false,
        memo: 'Loyalty tier qualification transfer',
        memoPreFilled: 'Loyalty tier qualification transfer',
        memoEdited: false,
        loyaltyTransferContext: ctx,
        isLoyaltyTransfer: true,
        errors: [],
        warnings: [],
        isValid: false,
      }))
    },
    []
  )

  const clearLoyaltyContext = useCallback(() => {
    setLoyaltyContextState(null)
    setFormState(defaultFormState)
  }, [])

  const refreshTierGap = useCallback(async () => {
    setTierGapLoading(true)
    setTierGapError(null)
    try {
      const gap = await tierService.getTierGap('current-member', {
        forceRefresh: true,
      })
      setTierGap(gap)

      // Update stale detection on context
      if (loyaltyContext) {
        const stale = isDataStale(gap.calculatedAt)
        if (stale !== loyaltyContext.isStale) {
          setLoyaltyContextState((prev) =>
            prev ? { ...prev, isStale: stale } : null
          )
        }
      }
    } catch (err) {
      setTierGapError(
        err instanceof Error ? err : new Error('Failed to fetch tier gap')
      )
    } finally {
      setTierGapLoading(false)
    }
  }, [tierService, loyaltyContext])

  // Fetch accounts on mount
  useEffect(() => {
    let cancelled = false
    const fetchAccounts = async () => {
      setAccountsLoading(true)
      try {
        const accts = await accountService.listAccounts('current-member')
        if (!cancelled) setAccounts(accts)
      } catch {
        // silently fail for mock
      } finally {
        if (!cancelled) setAccountsLoading(false)
      }
    }
    fetchAccounts()
    return () => {
      cancelled = true
    }
  }, [accountService])

  // Fetch tier gap on mount
  useEffect(() => {
    refreshTierGap()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateFormField = useCallback(
    <K extends keyof TransferFormState>(
      field: K,
      value: TransferFormState[K]
    ) => {
      setFormState((prev) => {
        const next = { ...prev, [field]: value }

        // Track edits vs pre-filled
        if (field === 'amount' && prev.isLoyaltyTransfer) {
          next.amountEdited = value !== prev.amountPreFilled
        }
        if (field === 'toAccountId' && prev.isLoyaltyTransfer) {
          next.toAccountEdited = true
        }
        if (field === 'memo' && prev.isLoyaltyTransfer) {
          next.memoEdited = value !== prev.memoPreFilled
        }

        // Update from-account info when changed
        if (field === 'fromAccountId') {
          const acct = accounts.find((a) => a.accountId === value)
          if (acct) {
            next.fromAccountName = acct.accountName
            next.fromAccountBalance = acct.balance
            next.fromAccountType = acct.accountType as 'checking' | 'savings' | 'money_market'
          }
        }

        // Update to-account info when changed
        if (field === 'toAccountId') {
          const acct = accounts.find((a) => a.accountId === value)
          if (acct) {
            next.toAccountName = acct.accountName
            next.toAccountBalance = acct.balance
            next.toAccountType = acct.accountType as 'checking' | 'savings' | 'money_market'
          }
        }

        return next
      })
    },
    [accounts]
  )

  const resetForm = useCallback(() => {
    setFormState(defaultFormState)
  }, [])

  const validateForm = useCallback((): {
    errors: TransferFormError[]
    warnings: TransferFormWarning[]
    isValid: boolean
  } => {
    const allErrors: TransferFormError[] = []
    const allWarnings: TransferFormWarning[] = []

    // From account validation
    if (!formState.fromAccountId) {
      allErrors.push({
        field: 'fromAccount',
        message: 'Please select a source account.',
        severity: 'error',
      })
    }

    // Amount validation
    const tierGapAmount = loyaltyContext?.tierGapAmount ?? 0
    const amountResult = validateTransferAmount(
      formState.amount,
      formState.fromAccountBalance,
      tierGapAmount
    )
    allErrors.push(...amountResult.errors)
    allWarnings.push(...amountResult.warnings)

    // Destination account
    const destAccount = accounts.find(
      (a) => a.accountId === formState.toAccountId
    )
    const destResult = validateDestinationAccount(
      formState.toAccountId,
      destAccount?.countsTowardTier ?? true
    )
    if (!destResult.isValid) {
      allErrors.push({
        field: 'toAccount',
        message: destResult.message || 'Invalid destination account.',
        severity: 'error',
      })
    } else if (destResult.message) {
      allWarnings.push({
        field: 'toAccount',
        message: destResult.message,
        severity: 'warning',
      })
    }

    // Memo validation
    const memoResult = validateMemo(formState.memo)
    if (!memoResult.isValid) {
      allErrors.push({
        field: 'memo',
        message: memoResult.message || 'Invalid memo.',
        severity: 'error',
      })
    }

    // Same account check
    if (
      formState.fromAccountId &&
      formState.fromAccountId === formState.toAccountId
    ) {
      allErrors.push({
        field: 'toAccount',
        message: 'Source and destination accounts must be different.',
        severity: 'error',
      })
    }

    const isValid = allErrors.length === 0

    setFormState((prev) => ({
      ...prev,
      errors: allErrors,
      warnings: allWarnings,
      isValid,
      lastValidatedAt: new Date().toISOString(),
    }))

    return { errors: allErrors, warnings: allWarnings, isValid }
  }, [formState, loyaltyContext, accounts])

  const value: LoyaltyTransferProviderValue = {
    loyaltyContext,
    setLoyaltyContext,
    clearLoyaltyContext,
    tierGap,
    tierGapLoading,
    tierGapError,
    refreshTierGap,
    accounts,
    accountsLoading,
    formState,
    updateFormField,
    resetForm,
    validateForm,
    tierService,
    accountService,
  }

  return (
    <LoyaltyTransferCtx.Provider value={value}>
      {children}
    </LoyaltyTransferCtx.Provider>
  )
}

// Hooks

export function useLoyaltyTransfer() {
  const ctx = useContext(LoyaltyTransferCtx)
  return {
    loyaltyContext: ctx.loyaltyContext,
    setLoyaltyContext: ctx.setLoyaltyContext,
    clearLoyaltyContext: ctx.clearLoyaltyContext,
  }
}

export function useTransferForm() {
  const ctx = useContext(LoyaltyTransferCtx)
  return {
    formState: ctx.formState,
    updateFormField: ctx.updateFormField,
    resetForm: ctx.resetForm,
    validateForm: ctx.validateForm,
    accounts: ctx.accounts,
    accountsLoading: ctx.accountsLoading,
  }
}

export function useTierGap() {
  const ctx = useContext(LoyaltyTransferCtx)
  return {
    gap: ctx.tierGap,
    isLoading: ctx.tierGapLoading,
    error: ctx.tierGapError,
    refresh: ctx.refreshTierGap,
  }
}

export function useLoyaltyTransferServices() {
  const ctx = useContext(LoyaltyTransferCtx)
  return {
    tierService: ctx.tierService,
    accountService: ctx.accountService,
  }
}
