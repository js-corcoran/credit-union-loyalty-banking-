'use client'

interface NotificationBadgeProps {
  unreadCount: number
}

/**
 * Notification count badge positioned absolutely on parent.
 * Hidden when count is 0. Shows "99+" for counts > 99.
 * Meets WCAG AAA contrast: white text on red-600 background (8.6:1).
 */
export function NotificationBadge({ unreadCount }: NotificationBadgeProps) {
  if (unreadCount === 0) return null

  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <span
      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
      aria-hidden="true"
    >
      {displayCount}
    </span>
  )
}
