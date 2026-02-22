'use client'

import { Card } from '@/components/shared/Card'

interface SupportCardProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  actionHref?: string
  isAvailable: boolean
  availabilityText: string
}

export function SupportCard({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  isAvailable,
  availabilityText,
}: SupportCardProps) {
  return (
    <Card
      as="article"
      className="p-5 flex flex-col items-center text-center"
      ariaLabel={`${title}. ${isAvailable ? 'Available now' : availabilityText}`}
    >
      <span className={`mb-3 ${isAvailable ? 'text-blue-600' : 'text-gray-400'}`}>
        {icon}
      </span>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">{description}</p>
      <p className={`text-xs font-medium mb-3 ${isAvailable ? 'text-emerald-600' : 'text-gray-500'}`}>
        {isAvailable ? 'Available now' : availabilityText}
      </p>
      {actionHref ? (
        <a
          href={actionHref}
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold min-h-[48px] transition-colors ${
            isAvailable
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
          }`}
          aria-disabled={!isAvailable}
          tabIndex={isAvailable ? 0 : -1}
        >
          {actionLabel}
        </a>
      ) : (
        <button
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold min-h-[48px] transition-colors ${
            isAvailable
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable}
        >
          {actionLabel}
        </button>
      )}
    </Card>
  )
}
