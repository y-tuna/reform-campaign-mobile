'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useSidebar } from '@/app/contexts/SidebarContext'
import { useAuth } from '@/app/lib/auth'
import { cn } from '@/app/lib/utils'

// Path to readable label mapping
const pathLabels: Record<string, string> = {
  '/home': '홈',
  '/documents': '서류 제출',
  '/proofs': '증빙 업로드', 
  '/policies': '정책 및 법률',
  '/education': '교육 자료',
  '/templates': '홍보 템플릿',
  '/broadcasts': '공지사항',
  '/onboarding': '프로필 완성'
}

function Breadcrumbs() {
  const pathname = usePathname()
  
  // Skip breadcrumbs for home (root)
  if (pathname === '/home') {
    return null
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = [
    { href: '/home', label: '홈' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      const label = pathLabels[href] || segment
      return { href, label }
    })
  ]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-neutral-500 mx-1" />
          )}
          <Link
            href={item.href as any}
            className={cn(
              "hover:text-text-primary transition-colors",
              index === breadcrumbItems.length - 1
                ? "text-text-primary font-medium"
                : "text-neutral-400"
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

function NotificationBadge() {
  // In a real app, this would show actual notification count
  const notificationCount = 2
  
  return (
    <button className="relative p-2 text-neutral-400 hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">
      <BellIcon className="h-5 w-5" />
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </button>
  )
}

function UserMenu() {
  const { user } = useAuth()
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-400">
        {user?.name || user?.phone || '사용자'}
      </span>
      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
        <UserIcon className="h-4 w-4 text-white" />
      </div>
    </div>
  )
}

export function Header() {
  const { toggle, isOpen, isMobile } = useSidebar()
  
  return (
    <header className="sticky top-0 z-30 bg-bg-surface/80 backdrop-blur-md border-b border-border-muted">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu toggle + Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggle}
            className="p-2 text-neutral-400 hover:text-text-primary transition-colors rounded-lg hover:bg-white/5 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          
          {/* Desktop sidebar collapse button */}
          <button
            onClick={toggle}
            className={cn(
              "hidden md:flex p-2 text-neutral-400 hover:text-text-primary transition-colors rounded-lg hover:bg-white/5",
              isOpen ? "rotate-0" : "rotate-180"
            )}
            aria-label="Toggle sidebar"
          >
            <svg className="h-4 w-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="border-l border-border-muted pl-4">
            <Breadcrumbs />
          </div>
        </div>
        
        {/* Center - Search (future expansion) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="search"
              placeholder="검색..."
              className="w-full pl-10 pr-4 py-2 bg-bg-elevated border border-border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Right side - Notifications + User */}
        <div className="flex items-center gap-2">
          <NotificationBadge />
          <div className="border-l border-border-muted pl-4 ml-2">
            <UserMenu />
          </div>
        </div>
      </div>
      
      {/* Notice ribbon (shows when there are critical broadcasts) */}
      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-300">중요 공지: 서류 제출 마감이 3일 남았습니다.</span>
          </div>
          <Link href="/broadcasts" className="text-red-400 hover:text-red-300 text-xs underline">
            자세히 보기
          </Link>
        </div>
      </div>
    </header>
  )
}