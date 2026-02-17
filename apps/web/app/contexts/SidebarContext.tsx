'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SidebarContextType {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Load sidebar state from localStorage for desktop
    const savedState = localStorage.getItem('sidebar-open')
    if (savedState !== null && !isMobile) {
      setIsOpen(JSON.parse(savedState))
    }
  }, [isMobile])

  useEffect(() => {
    // Handle responsive behavior
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false) // Close sidebar on mobile by default
      } else {
        // Restore desktop state from localStorage
        const savedState = localStorage.getItem('sidebar-open')
        if (savedState !== null) {
          setIsOpen(JSON.parse(savedState))
        } else {
          setIsOpen(true) // Default open on desktop
        }
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    
    // Save to localStorage for desktop
    if (!isMobile) {
      localStorage.setItem('sidebar-open', JSON.stringify(newState))
    }
  }

  const close = () => {
    setIsOpen(false)
    if (!isMobile) {
      localStorage.setItem('sidebar-open', 'false')
    }
  }

  const open = () => {
    setIsOpen(true)
    if (!isMobile) {
      localStorage.setItem('sidebar-open', 'true')
    }
  }

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggle, close, open }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}