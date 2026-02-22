'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { TierType } from '@/lib/types'

export interface TransferFormData {
  fromAccountId: string
  toAccountId: string
  amount: number
  memo: string
}

export interface TransferSession {
  formData: TransferFormData
  createdAt: Date
  memberTier: TierType
  feeWaiverApplied: boolean
  normalFee: number
}

interface TransferContextValue {
  session: TransferSession | null
  setSession: (session: TransferSession) => void
  clearSession: () => void
}

const TransferContext = createContext<TransferContextValue>({
  session: null,
  setSession: () => {},
  clearSession: () => {},
})

export function TransferProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<TransferSession | null>(null)

  const clearSession = () => setSession(null)

  return (
    <TransferContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </TransferContext.Provider>
  )
}

export function useTransfer() {
  return useContext(TransferContext)
}
