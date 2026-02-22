'use client'

import Link from 'next/link'
import { NavigationItem } from '@/lib/navigation/types'
import { ICON_MAP } from '@/lib/navigation/icons'

interface TopNavItemProps {
  item: NavigationItem
  isActive: boolean
  index: number
}

/**
 * Individual desktop navigation item with icon and label.
 * Active state uses three visual cues: color, weight, and underline (WCAG AAA).
 */
export function TopNavItem({ item, isActive }: TopNavItemProps) {
  const Icon = ICON_MAP[item.icon]

  return (
    <Link
      href={item.route}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative inline-flex items-center gap-2 px-3 py-2 rounded-md
        text-base md:text-sm lg:text-base font-medium transition-colors duration-150
        min-h-[48px]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
        ${
          isActive
            ? 'font-semibold text-blue-600 border-b-[3px] border-blue-600'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{item.label}</span>
    </Link>
  )
}
