'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MoreMenuItem as MoreMenuItemType } from '@/lib/navigation/types'
import { MoreMenuItem } from './MoreMenuItem'
import { XIcon } from '@/lib/navigation/icons'

interface MoreMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  moreMenuItems: MoreMenuItemType[]
}

/**
 * Mobile half-sheet drawer for More menu items.
 * Slides up from bottom with backdrop overlay.
 * Focus-trapped while open. Closes on Escape, backdrop click, or item selection.
 */
export function MoreMenuDrawer({
  isOpen,
  onClose,
  moreMenuItems,
}: MoreMenuDrawerProps) {
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    // Focus the close button when drawer opens
    closeButtonRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap within drawer
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    // Prevent body scroll while drawer is open
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleItemSelect = useCallback(
    (route: string) => {
      onClose()
      router.push(route)
    },
    [onClose, router]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 block md:hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer sheet */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-menu-title"
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg animate-slide-up"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 id="more-menu-title" className="text-lg font-semibold text-gray-900">
            More Options
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div role="menu" className="overflow-y-auto max-h-[70vh] py-2">
          {moreMenuItems.map((item, index) => (
            <MoreMenuItem
              key={item.id}
              item={item}
              onSelect={handleItemSelect}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
