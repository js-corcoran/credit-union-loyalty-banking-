'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import { Member } from '@/lib/types'
import { getMemberProfile } from '@/lib/api'

interface MemberContextType {
  member: Member | null
  loading: boolean
  error: string | null
  updateMember: (updates: Partial<Member>) => Promise<void>
  refreshMember: () => Promise<void>
}

export const MemberContext = createContext<MemberContextType | undefined>(undefined)

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshMember = async () => {
    try {
      setLoading(true)
      const data = await getMemberProfile('MEMBER-001')
      setMember(data)
      setError(null)
    } catch (err) {
      setError('Failed to load member profile')
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (updates: Partial<Member>) => {
    if (member) {
      setMember({ ...member, ...updates })
    }
  }

  useEffect(() => {
    refreshMember()
  }, [])

  return (
    <MemberContext.Provider
      value={{ member, loading, error, updateMember, refreshMember }}
    >
      {children}
    </MemberContext.Provider>
  )
}
