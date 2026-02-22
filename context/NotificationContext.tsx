'use client'

import { createContext, useState, ReactNode } from 'react'
import { Notification, NotificationPreferences } from '@/lib/types'

interface NotificationContextType {
  notifications: Notification[]
  preferences: NotificationPreferences
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  dismissNotification: (notificationId: string) => void
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void
}

const defaultPreferences: NotificationPreferences = {
  frequencyPreference: 'weekly',
  preferredChannels: ['in-app', 'email'],
  notificationTypePreferences: {
    tierAchievement: true,
    retrogressionRisk: true,
    autopayExpiration: true,
    balanceThreshold: false,
  },
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences)

  const unreadCount = notifications.filter((n) => !n.readDate).length

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId
          ? { ...n, readDate: new Date() }
          : n
      )
    )
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.notificationId !== notificationId)
    )
  }

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        preferences,
        unreadCount,
        addNotification,
        markAsRead,
        dismissNotification,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
