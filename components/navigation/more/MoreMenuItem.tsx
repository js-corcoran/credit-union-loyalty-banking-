'use client'

import { MoreMenuItem as MoreMenuItemType } from '@/lib/navigation/types'
import { ICON_MAP } from '@/lib/navigation/icons'

interface MoreMenuItemProps {
  item: MoreMenuItemType
  onSelect: (route: string) => void
  index: number
}

/**
 * Individual item in the More menu (drawer or dropdown).
 * Renders icon + label + optional description.
 * Minimum 48px tap target for WCAG AAA.
 */
export function MoreMenuItem({ item, onSelect }: MoreMenuItemProps) {
  const Icon = ICON_MAP[item.icon]

  return (
    <button
      role="menuitem"
      onClick={() => onSelect(item.route)}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-blue-50 focus:text-blue-600 focus:outline-none transition-colors duration-150 text-left min-h-[48px]"
    >
      {Icon && <Icon className="w-6 h-6 flex-shrink-0 text-gray-500" />}
      <div className="flex-1">
        <div>{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
        )}
      </div>
    </button>
  )
}
