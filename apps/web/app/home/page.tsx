'use client'

import { FileTextOutlined, BookOutlined, ShopOutlined, TeamOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function CandidateDashboard() {
  // 선거 일정 데이터
  const electionSchedule = [
    {
      id: 1,
      title: '예비후보자 등록',
      description: '선거일 120일 전부터',
      date: '2026.02.06'
    },
    {
      id: 2,
      title: '후보자 등록',
      description: '선거일 23일 전까지',
      date: '2026.05.14~15'
    },
    {
      id: 3,
      title: '제9회 지방선거',
      description: '투표일',
      date: '2026.06.03'
    }
  ]

  // 중앙당 공지
  const announcements = [
    { id: 1, title: '중앙당 주간 전술 브리핑 (12/23)', isNew: true },
    { id: 2, title: '선거법 주요 변경사항 안내', isNew: true },
    { id: 3, title: '유세 차량 운영 가이드 업데이트', isNew: false }
  ]

  // 빠른 메뉴 항목
  const quickMenuItems = [
    {
      href: '/guides',
      icon: BookOutlined,
      title: '가이드라인',
      description: '선거법 Q&A, 유세 체크리스트, 출마자 교육 자료',
      color: 'green'
    },
    {
      href: '/shop/products',
      icon: ShopOutlined,
      title: '유세몰',
      description: '명함, 현수막, 포스터 및 유세용품 제작/구매',
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
      green: { bg: 'bg-green-50', icon: 'text-green-600' },
      orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">안녕하세요, 김후보님!</h1>
          <p className="text-sm text-muted-foreground mb-4">
            선거 준비에 필요한 모든 것을 한 곳에서 관리하세요.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            공천 확정 · 구의원 서울특별시 강남구 가
          </span>
        </div>

        {/* 빠른 메뉴 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">빠른 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickMenuItems.map((item) => {
              const colorClasses = getColorClasses(item.color)
              return (
                <Link key={item.href} href={item.href}>
                  <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 ${colorClasses.bg} rounded-lg`}>
                          <item.icon className={`text-2xl ${colorClasses.icon}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <RightOutlined className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 주요 일정 & 중앙당 공지 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 주요 일정 */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarOutlined className="text-lg text-primary" />
              <h2 className="text-lg font-bold text-foreground">주요 일정</h2>
            </div>
            <div className="space-y-4">
              {electionSchedule.map((schedule, index) => (
                <div key={schedule.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{schedule.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{schedule.description}</p>
                    </div>
                    <p className="text-sm font-medium text-primary">{schedule.date}</p>
                  </div>
                  {index < electionSchedule.length - 1 && (
                    <div className="border-b border-border mt-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 중앙당 공지 */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">중앙당 공지</h2>
              <Link href="/announcements" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-accent/50 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-start gap-2">
                    {announcement.isNew && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-danger/10 text-danger text-xs font-semibold rounded border border-danger/20">
                        NEW
                      </span>
                    )}
                    <p className="text-sm text-foreground flex-1 leading-relaxed">{announcement.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
