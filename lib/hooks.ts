'use client'

import { useContext } from 'react'
import { MemberContext } from '@/context/MemberContext'
import { TierContext } from '@/context/TierContext'
import { NotificationContext } from '@/context/NotificationContext'

export function useMember() {
  const context = useContext(MemberContext)
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider')
  }
  return context
}

export function useTiers() {
  const context = useContext(TierContext)
  if (context === undefined) {
    throw new Error('useTiers must be used within a TierProvider')
  }
  return context
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
