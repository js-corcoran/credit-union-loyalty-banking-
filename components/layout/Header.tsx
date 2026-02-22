'use client'

import Link from 'next/link'
import { useNotifications } from '@/lib/hooks'

export function Header() {
  const { unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-14">
      <div className="max-w-[900px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 hover:text-gray-700 min-h-[48px] flex items-center"
        >
          Home
        </Link>

        <nav className="flex items-center gap-2" aria-label="Utility navigation">
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/settings"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Settings"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
