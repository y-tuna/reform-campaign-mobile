'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { LogoutOutlined } from '@ant-design/icons'

interface NavigationProps {
  role: 'candidate' | 'admin' | 'party_admin' | 'super_admin' | 'vendor'
}

export default function Navigation({ role }: NavigationProps) {
  const { data: session } = useSession()
  const isDev = process.env.NODE_ENV === 'development'

  const candidateLinks = [
    { href: '/home', label: '홈' },
    { href: '/guides', label: '가이드라인' },
    { href: '/shop/products', label: '유세몰' },
    { href: '/announcements', label: '공지게시판' },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: '대시보드' },
    { href: '/admin/candidates', label: '후보자 관리' },
    { href: '/admin/shop-orders', label: '주문 승인' },
    { href: '/admin/materials', label: '물품 승인' },
    { href: '/admin/announcements', label: '공지사항' },
  ]

  const superAdminLinks = [
    { href: '/super-admin/dashboard', label: '대시보드' },
    { href: '/super-admin/products', label: '상품 관리' },
    { href: '/super-admin/templates', label: '템플릿 관리' },
    { href: '/super-admin/order-exceptions', label: '주문 예외처리' },
  ]

  const vendorLinks = [
    { href: '/vendor/orders', label: '주문 관리' },
    { href: '/vendor/production', label: '제작 현황' },
    { href: '/vendor/shipping', label: '배송 관리' },
  ]

  const getLinks = () => {
    if (role === 'super_admin') return superAdminLinks
    if (role === 'vendor') return vendorLinks
    if (role === 'admin' || role === 'party_admin') return adminLinks
    return candidateLinks
  }

  const links = getLinks()
  const homeHref = role === 'super_admin' ? '/super-admin/dashboard' :
                   role === 'vendor' ? '/vendor/orders' :
                   role === 'admin' || role === 'party_admin' ? '/admin/dashboard' :
                   '/home'

  const title = role === 'super_admin' ? '유세관리 시스템 [슈퍼관리자]' :
                role === 'vendor' ? '유세관리 시스템 [인쇄업체]' :
                role === 'admin' || role === 'party_admin' ? '유세관리 시스템 [중앙당]' :
                '유세관리 시스템'

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'admin':
      case 'party_admin':
        return '중앙당 관리자'
      case 'super_admin':
        return '슈퍼 관리자'
      case 'vendor':
        return '인쇄업체'
      case 'candidate':
        return '후보자'
      default:
        return userRole
    }
  }

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={homeHref} className="hover:opacity-80 transition-opacity">
              <Image
                src="/reform-party-logo.svg"
                alt="개혁신당 로고"
                width={120}
                height={30}
                priority
              />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <span className="text-sm font-semibold text-foreground hidden sm:block">{title}</span>
            {isDev && (
              <>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <Link
                  href="/dev-tools"
                  className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors"
                  title="개발자 도구"
                >
                  [DEV]
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <div className="flex items-center gap-3 ml-2 pl-6 border-l border-border">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{session.user.name}</strong>님
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded border border-primary/20">
                    {getRoleLabel(session.user.role)}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogoutOutlined />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
