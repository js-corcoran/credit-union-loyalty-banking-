'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreMenuItem, NavigationUserData } from '@/lib/navigation/types'
import { BellIcon, UserIcon } from '@/lib/navigation/icons'
import { TierBadgeIndicator } from '../utilities/TierBadgeIndicator'
import { NotificationBadge } from '../utilities/NotificationBadge'

interface TopNavUtilitiesProps {
  user?: NavigationUserData
  unreadCount: number
  moreMenuItems: MoreMenuItem[]
}

/**
 * Desktop utility area: notification bell, tier badge, and profile dropdown.
 */
export function TopNavUtilities({
  user,
  unreadCount,
  moreMenuItems,
}: TopNavUtilitiesProps) {
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)

  const closeProfile = useCallback(() => {
    setProfileOpen(false)
    profileButtonRef.current?.focus()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeProfile()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileOpen, closeProfile])

  return (
    <div className="flex items-center space-x-2 lg:space-x-3 ml-auto">
      {/* Notification Bell */}
      <Link
        href="/notifications"
        className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <BellIcon className="w-6 h-6" />
        <NotificationBadge unreadCount={unreadCount} />
      </Link>

      {/* Tier Badge */}
      {user && <TierBadgeIndicator tier={user.tier} />}

      {/* Profile Dropdown */}
      <div ref={profileRef} className="relative">
        <button
          ref={profileButtonRef}
          onClick={() => setProfileOpen(!profileOpen)}
          aria-label={user ? `User menu for ${user.name}` : 'User menu'}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          {user ? (
            <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
              {user.initials}
            </span>
          ) : (
            <UserIcon className="w-6 h-6" />
          )}
        </button>

        {profileOpen && (
          <div
            role="menu"
            aria-label="User options"
            className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200"
          >
            {moreMenuItems.map((item) => (
              <button
                key={item.id}
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false)
                  router.push(item.route)
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-blue-50 focus:text-blue-600 focus:outline-none min-h-[44px] flex items-center"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
