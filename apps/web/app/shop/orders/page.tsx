'use client'

import React, { useState } from 'react'
import { ShoppingOutlined, EyeOutlined, DownloadOutlined, EditOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, RightOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Order {
  order_id: string
  product_name: string
  option_name: string
  quantity: number
  total_price: number
  status: string
  status_label: string
  status_color: string
  created_at: string
  preview_url?: string
  final_pdf_url?: string
  reject_reason?: string
  tracking_info?: {
    carrier: string
    tracking_number: string
  }[]
}

// PRD의 모든 주문 상태를 포함한 Mock 데이터
const mockOrders: Order[] = [
  {
    order_id: 'ord_001',
    product_name: '선거 공보 (전단지)',
    option_name: '기본형 A',
    quantity: 10000,
    total_price: 360000,
    status: 'draft_saved',
    status_label: '임시저장',
    status_color: 'bg-gray-100 text-gray-600',
    created_at: '2024-01-21 10:00'
  },
  {
    order_id: 'ord_002',
    product_name: '선거 후보 명함',
    option_name: '이미지형 B',
    quantity: 5000,
    total_price: 80000,
    status: 'preview_generating',
    status_label: '미리보기 생성 중',
    status_color: 'bg-blue-100 text-blue-700',
    created_at: '2024-01-21 09:30'
  },
  {
    order_id: 'ord_003',
    product_name: '현수막 (중형)',
    option_name: '기본형',
    quantity: 10,
    total_price: 450000,
    status: 'preview_ready',
    status_label: '미리보기 준비됨',
    status_color: 'bg-green-100 text-green-700',
    created_at: '2024-01-21 09:00',
    preview_url: '/mock-preview.jpg'
  },
  {
    order_id: 'ord_004',
    product_name: '선거 벽보',
    option_name: '기본형',
    quantity: 20,
    total_price: 300000,
    status: 'preview_failed',
    status_label: '미리보기 실패',
    status_color: 'bg-red-100 text-red-700',
    created_at: '2024-01-21 08:30'
  },
  {
    order_id: 'ord_005',
    product_name: '어깨띠',
    option_name: '새틴 소재',
    quantity: 50,
    total_price: 600000,
    status: 'payment_pending',
    status_label: '결제 진행 중',
    status_color: 'bg-amber-100 text-amber-700',
    created_at: '2024-01-20 16:00'
  },
  {
    order_id: 'ord_006',
    product_name: '선거 공보 (책자)',
    option_name: '공약형 C',
    quantity: 5000,
    total_price: 250000,
    status: 'paid_waiting_admin_review',
    status_label: '승인 대기',
    status_color: 'bg-yellow-100 text-yellow-700',
    created_at: '2024-01-20 15:00'
  },
  {
    order_id: 'ord_007',
    product_name: '숄더백',
    option_name: '에코백',
    quantity: 200,
    total_price: 1100000,
    status: 'rejected_refunded',
    status_label: '반려됨',
    status_color: 'bg-red-100 text-red-700',
    created_at: '2024-01-20 14:00',
    reject_reason: '선거법 위반 문구가 포함되어 있습니다. "지역 주민 여러분"이라는 표현은 사용할 수 없습니다.'
  },
  {
    order_id: 'ord_008',
    product_name: '캠페인용 스티커',
    option_name: '원형',
    quantity: 2000,
    total_price: 240000,
    status: 'approved_final_generating',
    status_label: '완성본 생성 중',
    status_color: 'bg-blue-100 text-blue-700',
    created_at: '2024-01-20 13:00'
  },
  {
    order_id: 'ord_009',
    product_name: '미니깃발',
    option_name: '손잡이형',
    quantity: 300,
    total_price: 900000,
    status: 'sent_to_vendor',
    status_label: '업체 전송됨',
    status_color: 'bg-purple-100 text-purple-700',
    created_at: '2024-01-20 11:00'
  },
  {
    order_id: 'ord_010',
    product_name: '현수막 (대형)',
    option_name: '기본형',
    quantity: 2,
    total_price: 240000,
    status: 'vendor_send_failed',
    status_label: '업체 전송 실패',
    status_color: 'bg-red-100 text-red-700',
    created_at: '2024-01-19 17:00'
  },
  {
    order_id: 'ord_011',
    product_name: '선거 후보 명함',
    option_name: '기본형 A',
    quantity: 5000,
    total_price: 80000,
    status: 'in_production',
    status_label: '제작 중',
    status_color: 'bg-orange-100 text-orange-700',
    created_at: '2024-01-19 15:00'
  },
  {
    order_id: 'ord_012',
    product_name: '선거 공보 (전단지)',
    option_name: '이미지형 B',
    quantity: 10000,
    total_price: 360000,
    status: 'production_done_waiting_ship',
    status_label: '출고 대기',
    status_color: 'bg-purple-100 text-purple-700',
    created_at: '2024-01-19 10:00'
  },
  {
    order_id: 'ord_013',
    product_name: '현수막 (소형)',
    option_name: '기본형',
    quantity: 15,
    total_price: 375000,
    status: 'shipped',
    status_label: '배송 중',
    status_color: 'bg-green-100 text-green-700',
    created_at: '2024-01-18 14:00',
    tracking_info: [
      { carrier: 'CJ대한통운', tracking_number: '123456789012' }
    ]
  },
  {
    order_id: 'ord_014',
    product_name: '선거 벽보',
    option_name: '기본형',
    quantity: 30,
    total_price: 450000,
    status: 'delivered',
    status_label: '배송 완료',
    status_color: 'bg-green-100 text-green-700',
    created_at: '2024-01-17 10:00',
    tracking_info: [
      { carrier: '우체국택배', tracking_number: '987654321098' }
    ],
    final_pdf_url: '/mock-final.pdf'
  },
  {
    order_id: 'ord_015',
    product_name: '어깨띠',
    option_name: '새틴 소재',
    quantity: 50,
    total_price: 600000,
    status: 'completed',
    status_label: '주문 완료',
    status_color: 'bg-gray-100 text-gray-600',
    created_at: '2024-01-15 09:00',
    final_pdf_url: '/mock-final.pdf'
  }
]

export default function ShopOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'card' | 'list'>('list') // 뷰 모드 토글 (기본: 리스트)
  const isDev = process.env.NODE_ENV === 'development'

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.order_id.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    if (status.includes('failed') || status.includes('rejected')) {
      return <CloseCircleOutlined className="text-red-500" />
    }
    if (status.includes('completed') || status.includes('delivered')) {
      return <CheckCircleOutlined className="text-green-500" />
    }
    if (status.includes('generating') || status.includes('pending') || status.includes('production')) {
      return <ClockCircleOutlined className="text-blue-500" />
    }
    return <ShoppingOutlined className="text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">주문내역</h1>
          <p className="text-sm text-muted-foreground">유세몰 주문 현황을 확인하세요</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 md:max-w-md">
            <input
              type="text"
              placeholder="상품명 또는 주문번호 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">전체 상태</option>
            <option value="draft_saved">임시저장</option>
            <option value="preview_generating">미리보기 생성 중</option>
            <option value="preview_ready">미리보기 준비됨</option>
            <option value="preview_failed">미리보기 실패</option>
            <option value="payment_pending">결제 진행 중</option>
            <option value="paid_waiting_admin_review">승인 대기</option>
            <option value="rejected_refunded">반려됨</option>
            <option value="approved_final_generating">완성본 생성 중</option>
            <option value="sent_to_vendor">업체 전송됨</option>
            <option value="vendor_send_failed">업체 전송 실패</option>
            <option value="in_production">제작 중</option>
            <option value="production_done_waiting_ship">출고 대기</option>
            <option value="shipped">배송 중</option>
            <option value="delivered">배송 완료</option>
            <option value="completed">주문 완료</option>
          </select>

          {/* View Mode Toggle - Dev Only */}
          {isDev && (
            <div className="flex gap-2 border border-border rounded-lg p-1 bg-card">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                테이블
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                카드
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                리스트
              </button>
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
        <>
        {/* Orders Table - Desktop */}
        <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">주문번호</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">상품명</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">옵션</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">수량</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">금액</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">상태</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">주문일시</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.order_id}>
                  <tr className="hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">#{order.order_id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{order.product_name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">{order.option_name}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <p className="text-sm text-foreground">{order.quantity.toLocaleString()}개</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="text-sm font-semibold text-foreground">{order.total_price.toLocaleString()}원</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap inline-flex items-center gap-1 ${order.status_color}`}>
                        {getStatusIcon(order.status)}
                        {order.status_label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{order.created_at}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        {order.status === 'draft_saved' && (
                          <Link
                            href={`/shop/products/${order.order_id}`}
                            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                            title="이어서 작성"
                          >
                            <EditOutlined />
                          </Link>
                        )}
                        {order.status === 'preview_ready' && (
                          <>
                            <button
                              className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors"
                              title="미리보기"
                            >
                              <EyeOutlined />
                            </button>
                            <button
                              className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                              title="결제하기"
                            >
                              결제
                            </button>
                          </>
                        )}
                        {order.status === 'rejected_refunded' && (
                          <Link
                            href={`/shop/products/${order.order_id}/copy`}
                            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                            title="수정 후 재주문"
                          >
                            재주문
                          </Link>
                        )}
                        {order.final_pdf_url && (
                          <a
                            href={order.final_pdf_url}
                            download
                            className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors"
                            title="완성본 PDF 다운로드"
                          >
                            <DownloadOutlined />
                          </a>
                        )}
                        <Link
                          href={`/shop/orders/${order.order_id}`}
                          className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors"
                          title="상세보기"
                        >
                          <RightOutlined />
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {/* Expandable Details Row */}
                  {(order.reject_reason || (order.tracking_info && order.tracking_info.length > 0)) && (
                    <tr className="bg-accent/30">
                      <td colSpan={8} className="py-2 px-4">
                        {order.reject_reason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                            <p className="text-xs font-medium text-red-900 mb-1">반려 사유</p>
                            <p className="text-xs text-red-700">{order.reject_reason}</p>
                          </div>
                        )}
                        {order.tracking_info && order.tracking_info.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <p className="text-xs font-medium text-blue-900 mb-1">배송 정보</p>
                            {order.tracking_info.map((tracking, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className="text-blue-700">{tracking.carrier}</span>
                                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{tracking.tracking_number}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders List - Mobile */}
        <div className="md:hidden space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.order_id} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">#{order.order_id}</span>
                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded inline-flex items-center gap-1 ${order.status_color}`}>
                      {getStatusIcon(order.status)}
                      {order.status_label}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{order.product_name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{order.option_name}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-foreground">{order.quantity.toLocaleString()}개</span>
                    <span className="font-semibold text-foreground">{order.total_price.toLocaleString()}원</span>
                    <span className="text-muted-foreground">{order.created_at}</span>
                  </div>
                </div>
              </div>

              {order.reject_reason && (
                <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                  <p className="text-xs font-medium text-red-900 mb-0.5">반려 사유</p>
                  <p className="text-xs text-red-700">{order.reject_reason}</p>
                </div>
              )}

              {order.tracking_info && order.tracking_info.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                  <p className="text-xs font-medium text-blue-900 mb-1">배송 정보</p>
                  {order.tracking_info.map((tracking, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="text-blue-700">{tracking.carrier}</span>
                      <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">{tracking.tracking_number}</code>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-1 pt-2 border-t border-border">
                {order.status === 'draft_saved' && (
                  <Link
                    href={`/shop/products/${order.order_id}`}
                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    <EditOutlined />
                    작성
                  </Link>
                )}
                {order.status === 'preview_ready' && (
                  <>
                    <button className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors">
                      <EyeOutlined />
                    </button>
                    <button className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                      결제
                    </button>
                  </>
                )}
                {order.status === 'rejected_refunded' && (
                  <Link
                    href={`/shop/products/${order.order_id}/copy`}
                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    재주문
                  </Link>
                )}
                {order.final_pdf_url && (
                  <a
                    href={order.final_pdf_url}
                    download
                    className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors"
                    title="완성본 PDF"
                  >
                    <DownloadOutlined />
                  </a>
                )}
                <Link
                  href={`/shop/orders/${order.order_id}`}
                  className="px-2 py-1 bg-card border border-border text-foreground rounded text-xs font-medium hover:bg-accent transition-colors flex-1 text-center"
                >
                  상세
                </Link>
              </div>
            </div>
          ))}
        </div>
        </>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.order_id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground">주문번호 #{order.order_id}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${order.status_color}`}>
                      {getStatusIcon(order.status)}
                      {order.status_label}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{order.product_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{order.option_name}</span>
                    <span>·</span>
                    <span>{order.quantity.toLocaleString()}개</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <ClockCircleOutlined />
                    <span>주문일시 : {order.created_at}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs text-muted-foreground mb-1">주문 금액</div>
                  <div className="text-lg font-bold text-foreground mb-3">{order.total_price.toLocaleString()}원</div>
                  <Link
                    href={`/shop/orders/${order.order_id}`}
                    className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors inline-block"
                  >
                    상세보기
                  </Link>
                </div>
              </div>

              {/* Expandable Details */}
              {(order.reject_reason || (order.tracking_info && order.tracking_info.length > 0)) && (
                <div className="pt-3 border-t border-border space-y-2">
                  {order.reject_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-900 mb-1">반려 사유</p>
                      <p className="text-sm text-red-700">{order.reject_reason}</p>
                    </div>
                  )}
                  {order.tracking_info && order.tracking_info.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-2">배송 정보</p>
                      {order.tracking_info.map((tracking, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-blue-700 font-medium">{tracking.carrier}</span>
                          <code className="bg-blue-100 px-2 py-1 rounded text-blue-900 font-mono">{tracking.tracking_number}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <div key={order.order_id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status Badge (Color Dot) */}
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className={`w-2 h-2 rounded-full ${
                        order.status.includes('failed') || order.status.includes('rejected') ? 'bg-red-500' :
                        order.status.includes('completed') || order.status.includes('delivered') ? 'bg-green-500' :
                        order.status.includes('shipped') ? 'bg-blue-500' :
                        order.status.includes('production') || order.status.includes('generating') ? 'bg-orange-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="text-xs text-muted-foreground">{order.status_label}</span>
                    </div>

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-foreground">#{order.order_id}</span>
                        <span className="text-sm text-foreground">{order.product_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{order.option_name}</span>
                        <span>수량: {order.quantity.toLocaleString()}개</span>
                        <span className="font-semibold text-foreground">{order.total_price.toLocaleString()}원</span>
                        <span>{order.created_at}</span>
                      </div>

                      {/* Additional Info */}
                      {order.reject_reason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <span className="font-medium">반려 사유:</span> {order.reject_reason}
                        </div>
                      )}
                      {order.tracking_info && order.tracking_info.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">배송:</span>
                          {order.tracking_info.map((tracking, idx) => (
                            <span key={idx} className="text-foreground">
                              {tracking.carrier} {tracking.tracking_number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/shop/orders/${order.order_id}`}
                    className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingOutlined className="text-6xl text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">주문 내역이 없습니다</p>
            <Link
              href="/shop/products"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              유세몰 둘러보기
            </Link>
          </div>
        )}

        {/* Result Count */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            총 {filteredOrders.length}개 주문
          </div>
        )}
      </div>
    </div>
  )
}
