'use client'

import { MoreHorizontalIcon } from '@/lib/navigation/icons'

interface MoreMenuButtonProps {
  isActive: boolean
  onPress: () => void
}

/**
 * "More" tab button in the bottom tab bar.
 * Opens the More menu drawer instead of navigating.
 */
export function MoreMenuButton({ isActive, onPress }: MoreMenuButtonProps) {
  return (
    <button
      onClick={onPress}
      aria-label="More options"
      aria-haspopup="dialog"
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
      <MoreHorizontalIcon className="w-6 h-6" />
      <span className="text-xs truncate">More</span>
    </button>
  )
}
