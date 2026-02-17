'use client'

import React from 'react'
import { ShoppingOutlined, FileTextOutlined, ToolOutlined, DatabaseOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function SuperAdminDashboard() {
  const stats = [
    { label: '전체 상품', value: '11', icon: <ShoppingOutlined />, color: 'bg-blue-50 text-blue-600' },
    { label: '활성 템플릿', value: '24', icon: <FileTextOutlined />, color: 'bg-green-50 text-green-600' },
    { label: '금일 주문', value: '8', icon: <BarChartOutlined />, color: 'bg-orange-50 text-orange-600' },
    { label: '승인 대기', value: '3', icon: <ToolOutlined />, color: 'bg-amber-50 text-amber-600' }
  ]

  const quickActions = [
    {
      title: '상품 관리',
      description: '상품/옵션/가격/최소수량 관리',
      href: '/super-admin/products',
      icon: <ShoppingOutlined />,
      color: 'bg-blue-500'
    },
    {
      title: '템플릿 관리',
      description: 'AI 파일 및 JSON 스키마 등록',
      href: '/super-admin/templates',
      icon: <FileTextOutlined />,
      color: 'bg-green-500'
    },
    {
      title: '주문 예외 처리',
      description: '완성본 오버라이드, 재전송',
      href: '/super-admin/order-exceptions',
      icon: <ToolOutlined />,
      color: 'bg-orange-500'
    },
    {
      title: '시스템 설정',
      description: '미리보기 정책, 쿨타임 설정',
      href: '/super-admin/settings',
      icon: <SettingOutlined />,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="super_admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">슈퍼 관리자 대시보드</h1>
          <p className="text-sm text-muted-foreground">
            유세몰 시스템 전체를 관리합니다
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">빠른 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.href}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <div className={`${action.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl`}>
                    {action.icon}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">최근 활동</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              {[
                { action: '템플릿 등록', detail: '선거 공보 (전단지) - 템플릿 D', time: '10분 전', type: 'template' },
                { action: '주문 오버라이드', detail: 'ord_sh_005 - 완성본 AI 파일 교체', time: '1시간 전', type: 'override' },
                { action: '상품 가격 수정', detail: '현수막 (중형) - 45,000원으로 변경', time: '2시간 전', type: 'product' },
                { action: '벤더 재전송', detail: 'ord_sh_003 - 인쇄업체 API 재전송', time: '3시간 전', type: 'resend' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'template' ? 'bg-green-500' :
                      activity.type === 'override' ? 'bg-red-500' :
                      activity.type === 'product' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
