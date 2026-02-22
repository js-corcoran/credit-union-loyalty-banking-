'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/shared/Button'

interface NotificationItem {
  notificationId: string
  type: string
  title: string
  message: string
  category: 'tier_status' | 'benefits' | 'account' | 'system'
  timestamp: Date
  isRead: boolean
  actionUrl: string
  icon: string
}

const categoryLabels: Record<string, { label: string; className: string }> = {
  tier_status: { label: 'Tier Status', className: 'bg-purple-100 text-purple-700' },
  benefits: { label: 'Benefits', className: 'bg-emerald-100 text-emerald-700' },
  account: { label: 'Account', className: 'bg-blue-100 text-blue-700' },
  system: { label: 'System', className: 'bg-gray-100 text-gray-600' },
}

const CATEGORIES = ['all', 'tier_status', 'benefits', 'account', 'system'] as const
const DATE_RANGES = ['7', '30', 'all'] as const

const mockNotifications: NotificationItem[] = [
  {
    notificationId: 'NOTIF-001',
    type: 'tier_achievement',
    title: 'Congratulations! You reached Plus Tier',
    message: 'Your balance exceeded the Plus tier minimum. You now qualify for APY boost and fee waivers.',
    category: 'tier_status',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    actionUrl: '/loyalty',
    icon: 'tier-badge',
  },
  {
    notificationId: 'NOTIF-002',
    type: 'benefit_earned',
    title: 'You saved $2.50 in fee waivers',
    message: 'Your transfer fee was waived as a Plus tier member.',
    category: 'benefits',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    actionUrl: '/loyalty/benefits',
    icon: 'dollar-sign',
  },
  {
    notificationId: 'NOTIF-003',
    type: 'benefit_earned',
    title: 'You earned $1.77 in APY boost',
    message: 'Your monthly interest was enhanced by your Plus tier APY boost of +0.25%.',
    category: 'benefits',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    isRead: true,
    actionUrl: '/loyalty/benefits',
    icon: 'dollar-sign',
  },
  {
    notificationId: 'NOTIF-004',
    type: 'autopay_expiring',
    title: 'Autopay renewing in 60 days',
    message: 'Your auto loan payment autopay will renew on May 31, 2026.',
    category: 'account',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    isRead: true,
    actionUrl: '/autopay',
    icon: 'calendar',
  },
  {
    notificationId: 'NOTIF-005',
    type: 'tier_status',
    title: 'Your Plus tier is secure',
    message: 'Your monthly tier review is complete. Your balance and autopays meet Plus requirements.',
    category: 'tier_status',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isRead: true,
    actionUrl: '/loyalty/account-status',
    icon: 'shield',
  },
  {
    notificationId: 'NOTIF-006',
    type: 'benefit_earned',
    title: 'You saved $2.50 in fee waivers',
    message: 'Your ACH transfer fee was waived with your Plus tier.',
    category: 'benefits',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    isRead: true,
    actionUrl: '/loyalty/benefits',
    icon: 'dollar-sign',
  },
  {
    notificationId: 'NOTIF-007',
    type: 'system',
    title: 'Welcome to the new loyalty program',
    message: 'Your credit union has launched a new 3-tier loyalty program. Visit the Loyalty Hub to learn more.',
    category: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    isRead: true,
    actionUrl: '/loyalty/migration',
    icon: 'info',
  },
]

function formatTimestamp(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function NotificationIcon({ type }: { type: string }) {
  if (type === 'tier_achievement' || type === 'tier_status') {
    return (
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
    )
  }
  if (type === 'benefit_earned') {
    return (
      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  }
  if (type === 'autopay_expiring') {
    return (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let result = notifications

    if (categoryFilter !== 'all') {
      result = result.filter((n) => n.category === categoryFilter)
    }

    if (dateRange !== 'all') {
      const days = parseInt(dateRange)
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      result = result.filter((n) => n.timestamp.getTime() >= cutoff)
    }

    if (search.trim().length >= 2) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      )
    }

    return result
  }, [notifications, categoryFilter, dateRange, search])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id))
  }

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Notifications</span></li>
          </ol>
        </nav>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Notifications</h1>
            <p className="text-base text-gray-600">
              Your loyalty and account alerts
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm">Settings</Button>
          </Link>
        </div>

        {/* Filters */}
        {!loading && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search notifications"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="tier_status">Tier Status</option>
              <option value="benefits">Benefits</option>
              <option value="account">Account</option>
              <option value="system">System</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by date range"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="all">All time</option>
            </select>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[40px] whitespace-nowrap"
              >
                Mark all as read
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-pulse space-y-3" aria-busy="true">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-base text-gray-600 mb-2">
              {search || categoryFilter !== 'all' ? 'No notifications match your filters.' : "You're all caught up! No new notifications."}
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll see tier updates, benefits earned, and important alerts here.
            </p>
          </div>
        )}

        {/* Notification List */}
        {!loading && filtered.length > 0 && (
          <ul className="space-y-2" role="list" aria-label="Notification list">
            {filtered.map((notification) => {
              const cat = categoryLabels[notification.category]
              return (
                <li key={notification.notificationId} role="listitem">
                  <div
                    className={`bg-white border rounded-xl p-4 flex items-start gap-3 transition-colors ${
                      notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                    }`}
                  >
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={notification.actionUrl}
                          onClick={() => handleRead(notification.notificationId)}
                          className="hover:underline"
                        >
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" aria-label="Unread" />
                            )}
                            {notification.title}
                          </h3>
                        </Link>
                        <button
                          onClick={() => handleDelete(notification.notificationId)}
                          className="text-gray-400 hover:text-red-500 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={`Delete notification: ${notification.title}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {cat && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.className}`}>
                            {cat.label}
                          </span>
                        )}
                        <time
                          dateTime={notification.timestamp.toISOString()}
                          className="text-xs text-gray-400"
                        >
                          {formatTimestamp(notification.timestamp)}
                        </time>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Footer */}
        {!loading && (
          <div className="mt-8 text-center">
            <Link
              href="/settings"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[44px] inline-flex items-center"
            >
              Manage notification preferences
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
