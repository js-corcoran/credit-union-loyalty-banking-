'use client'

import { Notification } from '@/lib/types'

interface NotificationBannerProps {
  notification: Notification
  onDismiss: () => void
  onAction?: () => void
  className?: string
}

export function NotificationBanner({
  notification,
  onDismiss,
  onAction,
  className,
}: NotificationBannerProps) {
  // TODO: Implement NotificationBanner
  return null
}
