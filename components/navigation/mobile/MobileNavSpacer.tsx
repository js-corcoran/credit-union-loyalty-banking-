'use client'

/**
 * Spacer component that prevents page content from being obscured
 * by the fixed mobile bottom tab bar.
 * Hidden on desktop (md:hidden) where there's no bottom bar.
 */
export function MobileNavSpacer() {
  return (
    <div
      className="h-14 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-hidden="true"
    />
  )
}
