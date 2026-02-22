'use client'

/**
 * Accessibility skip-to-content link.
 * Visually hidden until focused via keyboard (Tab key).
 * Allows keyboard and screen reader users to bypass navigation.
 */
export function SkipToContentLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-3 focus:rounded-lg focus:text-base focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}
