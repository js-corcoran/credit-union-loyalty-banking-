import { describe, it, expect } from '@jest/globals'
import {
  calculateRollingBalance,
  getTierQualification,
  calculateApyBoostValue,
  calculateFeeWaiverValue,
} from '@/lib/calculations'

describe('Tier Qualification', () => {
  it('qualifies for Classic with $2,500 balance + 1 autopay', () => {
    const result = getTierQualification({ balance: 2500, autopayCount: 1 })
    expect(result).toBe('classic')
  })

  it('qualifies for Plus with $10,000 balance + 2 autopays', () => {
    const result = getTierQualification({ balance: 10000, autopayCount: 2 })
    expect(result).toBe('plus')
  })

  it('qualifies for Premium with $25,000 balance + 2 autopays', () => {
    const result = getTierQualification({ balance: 25000, autopayCount: 2 })
    expect(result).toBe('premium')
  })

  it('returns null when below Classic minimum', () => {
    const result = getTierQualification({ balance: 2400, autopayCount: 1 })
    expect(result).toBeNull()
  })
})

describe('Rolling Balance', () => {
  it('calculates average of 3-month end-of-day balances', () => {
    const rolling = calculateRollingBalance([2600, 2500, 2400])
    expect(rolling).toBe(2500)
  })

  it('returns 0 for empty array', () => {
    expect(calculateRollingBalance([])).toBe(0)
  })
})

describe('Benefit Calculations', () => {
  it('calculates APY boost value correctly', () => {
    const value = calculateApyBoostValue(10000, 0.25)
    expect(value).toBe(25)
  })

  it('calculates fee waiver value correctly', () => {
    const value = calculateFeeWaiverValue(2, 2.5)
    expect(value).toBe(60)
  })
})
