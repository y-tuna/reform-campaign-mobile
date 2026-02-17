'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  CalendarIcon, 
  UsersIcon, 
  ReceiptRefundIcon, 
  DocumentTextIcon, 
  SpeakerWaveIcon,
  BookOpenIcon,
  LockClosedIcon,
  BellIcon,
  ClipboardDocumentIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useSidebar } from '@/app/contexts/SidebarContext'
import { cn } from '@/app/lib/utils'

const navigationItems = [
  {
    name: '홈',
    href: '/home',
    icon: CalendarIcon,
    description: '오늘의 캠페인 활동 현황'
  },
  {
    name: '서류 제출',
    href: '/documents', 
    icon: DocumentTextIcon,
    description: '서류 제출 및 가이드'
  },
  {
    name: '증빙 업로드',
    href: '/proofs',
    icon: LockClosedIcon,
    description: '증빙 자료 업로드 및 상태 확인'
  },
  {
    name: '정책 및 법률',
    href: '/policies',
    icon: BookOpenIcon,
    description: '정책 및 선거법 정보'
  },
  {
    name: '교육 자료',
    href: '/education', 
    icon: BookOpenIcon,
    description: '후보자 교육 가이드 및 영상'
  },
  {
    name: '홍보 템플릿',
    href: '/templates',
    icon: ClipboardDocumentIcon,
    description: '홍보물 템플릿 관리'
  },
  {
    name: '공지사항',
    href: '/broadcasts',
    icon: BellIcon,
    description: '공지 및 알림사항'
  },
  {
    name: '프로필 완성',
    href: '/onboarding',
    icon: UserIcon,
    description: '후보자 정보 등록'
  }
]

interface NavItemProps {
  item: typeof navigationItems[0]
  isActive: boolean
  onClick?: () => void
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={item.href as any}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 mx-3 rounded-lg text-sm font-medium transition-all duration-200",
        "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isActive 
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
          : "text-neutral-400 hover:text-neutral-200"
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col">
        <span>{item.name}</span>
        <span className="text-xs text-neutral-500 leading-tight">{item.description}</span>
      </div>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, close } = useSidebar()

  const handleNavClick = () => {
    if (isMobile) {
      close()
    }
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={close}
          />
        )}
        
        {/* Mobile Drawer */}
        <aside 
          className={cn(
            "fixed top-0 left-0 h-full w-80 bg-bg-surface border-r border-border-muted z-50 transition-transform duration-300 md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-muted">
              <h2 className="text-lg font-semibold text-text-primary">메뉴</h2>
              <button
                onClick={close}
                className="p-1 hover:bg-white/5 rounded-md"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1" role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={handleNavClick}
                />
              ))}
            </nav>
          </div>
        </aside>
      </>
    )
  }

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col bg-bg-surface border-r border-border-muted transition-all duration-300",
        isOpen ? "w-80" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1" role="navigation" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <div key={item.href} className="relative">
              {isOpen ? (
                <NavItem
                  item={item}
                  isActive={pathname === item.href}
                />
              ) : (
                // Collapsed state - icon only with tooltip
                <Link
                  href={item.href as any}
                  className={cn(
                    "flex items-center justify-center h-12 mx-2 rounded-lg transition-all duration-200",
                    "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    pathname === item.href
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-neutral-400 hover:text-neutral-200"
                  )}
                  title={item.name}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}