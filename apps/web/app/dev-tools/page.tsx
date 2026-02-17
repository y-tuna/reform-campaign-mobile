'use client'

import React from 'react'
import Link from 'next/link'
import { BugOutlined, UserOutlined, TeamOutlined, ToolOutlined, ShoppingOutlined } from '@ant-design/icons'

export default function DevToolsPage() {
  const routes = {
    candidate: {
      title: '후보자 (Candidate)',
      icon: <UserOutlined />,
      color: 'bg-blue-500',
      routes: [
        { path: '/home', name: '홈', desc: '빠른 메뉴, 선거 일정' },
        { path: '/guides', name: '가이드라인', desc: '체크리스트, 교육, 선거법' },
        { path: '/guides/checklist', name: '체크리스트', desc: '단계별 체크리스트' },
        { path: '/guides/education', name: '교육 자료', desc: '교육 콘텐츠' },
        { path: '/guides/election-law', name: '선거법 Q&A', desc: '선거법 챗봇' },
        { path: '/shop/products', name: '유세몰 상품 목록', desc: '인쇄물/홍보물 11종' },
        { path: '/shop/products/prod_002', name: '유세몰 상품 상세', desc: '주문 입력 폼 (예시)' },
        { path: '/shop/orders', name: '주문내역', desc: '모든 주문 상태 확인' },
        { path: '/announcements', name: '공지게시판', desc: '공지사항 목록' },
        { path: '/documents', name: '서류 가이드', desc: '서류 제출 안내', invalid: true },
        { path: '/voter-crm', name: '유권자 CRM', desc: '유권자 관리' },
        { path: '/proofs', name: '증빙 자료', desc: '활동 증빙', invalid: true },
        { path: '/shop', name: '유세용품 몰 (구버전)', desc: '유세용품 상품 목록', invalid: true },
        { path: '/shop/cart', name: '장바구니 (구버전)', desc: '쇼핑 카트 페이지', invalid: true },
        { path: '/campaign-shop', name: '유세몰·공보물 (구버전)', desc: '템플릿/상품 탭 방식', invalid: true },
      ]
    },
    party_admin: {
      title: '중앙당 관리자 (Party Admin)',
      icon: <TeamOutlined />,
      color: 'bg-green-500',
      routes: [
        { path: '/admin/dashboard', name: '대시보드', desc: '전체 현황' },
        { path: '/admin/candidates', name: '후보자 관리', desc: '후보자 리스트, 활동 현황' },
        { path: '/admin/shop-orders', name: '주문 승인', desc: '유세몰 주문 승인/반려' },
        { path: '/admin/materials', name: '물품 승인', desc: '물품 발주 승인' },
        { path: '/admin/announcements', name: '공지사항', desc: '공지 관리' },
        { path: '/admin/broadcasts', name: '공지 관리', desc: '공지 CRUD' },
        { path: '/admin/documents', name: '서류 검토', desc: '서류 승인/반려' },
        { path: '/admin/education', name: '교육 관리', desc: '교육 자료 관리' },
        { path: '/admin/tactics', name: '중앙 전술', desc: '전술 가이드 배포' },
      ]
    },
    super_admin: {
      title: '슈퍼 관리자 (Super Admin)',
      icon: <ToolOutlined />,
      color: 'bg-red-500',
      routes: [
        { path: '/super-admin/dashboard', name: '대시보드', desc: '시스템 전체 관리' },
        { path: '/super-admin/products', name: '상품 관리', desc: '상품/옵션/가격 관리 (미구현)' },
        { path: '/super-admin/templates', name: '템플릿 관리', desc: 'AI 파일/JSON 등록 (미구현)' },
        { path: '/super-admin/order-exceptions', name: '주문 예외처리', desc: '완성본 오버라이드, 재전송 (미구현)' },
        { path: '/super-admin/settings', name: '시스템 설정', desc: '미리보기 정책, 쿨타임 (미구현)' },
      ]
    },
    vendor: {
      title: '인쇄업체 (Vendor)',
      icon: <ShoppingOutlined />,
      color: 'bg-purple-500',
      routes: [
        { path: '/vendor/orders', name: '주문 관리', desc: '제작/배송 관리' },
        { path: '/vendor/production', name: '제작 현황', desc: '제작 진행 상황 (미구현)' },
        { path: '/vendor/shipping', name: '배송 관리', desc: '송장 등록/배송 현황 (미구현)' },
      ]
    }
  }

  const orderStates = [
    { state: 'draft_saved', desc: '임시저장 (Draft)' },
    { state: 'preview_generating', desc: '미리보기 생성 중' },
    { state: 'preview_ready', desc: '미리보기 준비됨' },
    { state: 'preview_failed', desc: '미리보기 실패' },
    { state: 'payment_pending', desc: '결제 진행 중' },
    { state: 'paid_waiting_admin_review', desc: '결제 완료, 승인 대기' },
    { state: 'rejected_refunded', desc: '반려됨 + 환불' },
    { state: 'approved_final_generating', desc: '승인됨, 완성본 생성 중' },
    { state: 'sent_to_vendor', desc: '업체 전송 완료' },
    { state: 'vendor_send_failed', desc: '업체 전송 실패' },
    { state: 'in_production', desc: '제작 중' },
    { state: 'production_done_waiting_ship', desc: '제작 완료, 출고 대기' },
    { state: 'shipped', desc: '배송 중' },
    { state: 'delivered', desc: '배송 완료' },
    { state: 'completed', desc: '주문 완료' },
  ]

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-600 text-white rounded-lg">
              <BugOutlined className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">개발자 도구</h1>
              <p className="text-sm text-muted-foreground">유세관리 시스템 전체 라우트 및 상태 정보</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              ⚠️ 이 페이지는 개발 환경에서만 표시됩니다. 프로덕션 빌드에서는 자동으로 숨겨집니다.
            </p>
          </div>
        </div>

        {/* Routes by Role */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold text-foreground">역할별 페이지 라우트</h2>

          {Object.entries(routes).map(([role, data]) => (
            <div key={role} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${data.color} text-white p-2 rounded-lg`}>
                  {data.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{data.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="block p-3 border border-border rounded-lg hover:border-primary hover:bg-accent transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <code className="text-xs text-primary font-mono">{route.path}</code>
                      <span className="text-xs text-primary">→</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground">{route.name}</p>
                      {route.invalid && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded border border-red-300">
                          유효하지 않음
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{route.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order States */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">주문 상태 (Order State Machine)</h2>
          <p className="text-sm text-muted-foreground mb-4">PRD 기준 주문 플로우 전체 상태</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {orderStates.map((state, idx) => (
              <div
                key={state.state}
                className="p-3 border border-border rounded-lg bg-accent/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">#{idx + 1}</span>
                  <code className="text-xs font-mono text-foreground">{state.state}</code>
                </div>
                <p className="text-sm text-muted-foreground">{state.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Matrix */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">RBAC 권한 매트릭스</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">기능</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">후보자</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">중앙당</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">슈퍼</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">벤더</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: '주문 생성', candidate: '✅', party: '❌', super: '❌', vendor: '❌' },
                  { feature: '미리보기 요청', candidate: '✅', party: '❌', super: '❌', vendor: '❌' },
                  { feature: '주문 승인', candidate: '❌', party: '✅', super: '✅', vendor: '❌' },
                  { feature: '주문 반려', candidate: '❌', party: '✅', super: '✅', vendor: '❌' },
                  { feature: '상품 관리', candidate: '❌', party: '❌', super: '✅', vendor: '❌' },
                  { feature: '템플릿 관리', candidate: '❌', party: '❌', super: '✅', vendor: '❌' },
                  { feature: '완성본 오버라이드', candidate: '❌', party: '❌', super: '✅', vendor: '❌' },
                  { feature: '제작 시작/완료', candidate: '❌', party: '❌', super: '❌', vendor: '✅' },
                  { feature: '송장 등록', candidate: '❌', party: '❌', super: '✅', vendor: '✅' },
                  { feature: '배송 완료 처리', candidate: '❌', party: '❌', super: '✅', vendor: '✅' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{row.candidate}</td>
                    <td className="py-3 px-4 text-center">{row.party}</td>
                    <td className="py-3 px-4 text-center">{row.super}</td>
                    <td className="py-3 px-4 text-center">{row.vendor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
