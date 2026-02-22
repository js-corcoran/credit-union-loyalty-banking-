'use client'

import { TierType } from '@/lib/types'
import { formatCurrency } from '@/lib/formatting'

interface TierProgressBarProps {
  currentValue: number
  targetValue: number
  tier: TierType
  metric: 'balance' | 'autopay'
  showLabel?: boolean
  estimatedDays?: number
  className?: string
  onClick?: () => void
}

const tierBarColors: Record<TierType, string> = {
  classic: 'bg-gray-500',
  plus: 'bg-[#D4A574]',
  premium: 'bg-gray-400',
}

const tierTrackColors: Record<TierType, string> = {
  classic: 'bg-gray-200',
  plus: 'bg-[#D4A574]/20',
  premium: 'bg-gray-200',
}

const tierNames: Record<TierType, string> = {
  classic: 'Classic',
  plus: 'Plus',
  premium: 'Premium',
}

export function TierProgressBar({
  currentValue,
  targetValue,
  tier,
  metric,
  showLabel = true,
  estimatedDays,
  className = '',
  onClick,
}: TierProgressBarProps) {
  const percentage = Math.min((currentValue / targetValue) * 100, 100)
  const isComplete = currentValue >= targetValue

  const formatValue = (val: number) => {
    if (metric === 'balance') return formatCurrency(val)
    return `${val} autopay${val !== 1 ? 's' : ''}`
  }

  const progressLabel = isComplete
    ? `${tierNames[tier]} tier requirement met`
    : `${formatValue(currentValue)} of ${formatValue(targetValue)} to reach ${tierNames[tier]}`

  const Container = onClick ? 'button' : 'div'

  return (
    <Container
      className={`w-full ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      onClick={onClick}
      role="progressbar"
      aria-valuenow={currentValue}
      aria-valuemin={0}
      aria-valuemax={targetValue}
      aria-label={`Balance progress to ${tierNames[tier]} tier`}
      {...(onClick ? { type: 'button' as const } : {})}
    >
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {progressLabel}
          </span>
          {estimatedDays !== undefined && !isComplete && (
            <span className="text-sm text-gray-500">
              ~{estimatedDays} days
            </span>
          )}
        </div>
      )}
      <div className={`w-full h-3 rounded-full ${tierTrackColors[tier]} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${tierBarColors[tier]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{formatValue(0)}</span>
          <span className="text-xs text-gray-500">{formatValue(targetValue)}</span>
        </div>
      )}
    </Container>
  )
}
