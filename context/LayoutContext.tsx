'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'

interface LayoutContextType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 480)
      setIsTablet(width >= 480 && width < 1025)
      setIsDesktop(width >= 1025)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <LayoutContext.Provider
      value={{ isMobile, isTablet, isDesktop, sidebarOpen, toggleSidebar }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
