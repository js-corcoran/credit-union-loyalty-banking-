'use client'

import { TierType } from '@/lib/types'

interface TierBadgeProps {
  tier: TierType
  size?: 'small' | 'medium' | 'large'
  variant?: 'solid' | 'outline'
  showLabel?: boolean
  className?: string
  onClick?: () => void
}

const tierConfig: Record<TierType, { label: string; color: string; bgColor: string; borderColor: string; textColor: string }> = {
  classic: {
    label: 'Classic',
    color: '#6B7280',
    bgColor: 'bg-gray-500',
    borderColor: 'border-gray-500',
    textColor: 'text-white',
  },
  plus: {
    label: 'Plus',
    color: '#D4A574',
    bgColor: 'bg-[#D4A574]',
    borderColor: 'border-[#D4A574]',
    textColor: 'text-white',
  },
  premium: {
    label: 'Premium',
    color: '#6B7280',
    bgColor: 'bg-gray-200',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-800',
  },
}

const sizeStyles: Record<string, { container: string; icon: string; text: string }> = {
  small: {
    container: 'w-8 h-8 gap-1',
    icon: 'w-5 h-5',
    text: 'text-xs',
  },
  medium: {
    container: 'w-16 h-16 gap-1.5',
    icon: 'w-8 h-8',
    text: 'text-sm font-semibold',
  },
  large: {
    container: 'w-20 h-20 gap-2',
    icon: 'w-10 h-10',
    text: 'text-base font-bold',
  },
}

function TierIcon({ tier, className }: { tier: TierType; className: string }) {
  if (tier === 'classic') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
      </svg>
    )
  }
  if (tier === 'plus') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="currentColor" />
      <path d="M19 19H5C4.45 19 4 18.55 4 18C4 17.45 4.45 17 5 17H19C19.55 17 20 17.45 20 18C20 18.55 19.55 19 19 19Z" fill="currentColor" />
    </svg>
  )
}

export function TierBadge({
  tier,
  size = 'medium',
  variant = 'solid',
  showLabel = true,
  className = '',
  onClick,
}: TierBadgeProps) {
  const config = tierConfig[tier]
  const sizes = sizeStyles[size]
  const isClickable = !!onClick

  const badgeContent = (
    <>
      <span className={`${sizes.icon} flex items-center justify-center`}>
        <TierIcon tier={tier} className="w-full h-full" />
      </span>
      {showLabel && size !== 'small' && (
        <span className={sizes.text}>{config.label}</span>
      )}
    </>
  )

  const baseClasses = `
    inline-flex flex-col items-center justify-center rounded-full
    ${variant === 'solid' ? `${config.bgColor} ${config.textColor}` : `bg-white border-2 ${config.borderColor}`}
    ${sizes.container}
    ${isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
    ${className}
  `.trim()

  if (isClickable) {
    return (
      <button
        className={baseClasses}
        onClick={onClick}
        aria-label={`${config.label} tier. Click to view loyalty benefits`}
        type="button"
      >
        {badgeContent}
      </button>
    )
  }

  return (
    <span
      className={baseClasses}
      aria-label={`${config.label} tier`}
      role="img"
    >
      {badgeContent}
    </span>
  )
}
