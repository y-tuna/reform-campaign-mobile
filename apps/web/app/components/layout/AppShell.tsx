'use client'

import React, { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SidebarProvider } from '@/app/contexts/SidebarContext'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}