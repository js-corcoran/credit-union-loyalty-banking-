'use client'

import Link from 'next/link'
import { NavigationItem } from '@/lib/navigation/types'
import { ICON_MAP } from '@/lib/navigation/icons'

interface BottomTabItemProps {
  item: NavigationItem
  isActive: boolean
  index: number
}

/**
 * Individual bottom tab item with icon and label.
 * 56px height, evenly distributed width.
 * Active state: blue color + semibold weight (multiple cues for WCAG AAA).
 */
export function BottomTabItem({ item, isActive }: BottomTabItemProps) {
  const Icon = ICON_MAP[item.icon]

  return (
    <Link
      href={item.route}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex flex-col items-center justify-center flex-1 h-14 gap-1
        text-xs font-medium transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600
        ${
          isActive
            ? 'text-blue-600 font-semibold'
            : 'text-gray-700 active:bg-gray-100'
        }
      `}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span className="text-xs truncate">{item.label}</span>
    </Link>
  )
}
