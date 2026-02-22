'use client'

import { Notification } from '@/lib/types'

interface NotificationModalProps {
  notification: Notification
  onDismiss: () => void
  onAction?: () => void
  className?: string
}

export function NotificationModal({
  notification,
  onDismiss,
  onAction,
  className,
}: NotificationModalProps) {
  // TODO: Implement NotificationModal (urgent alerts)
  return null
}
