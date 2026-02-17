'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  TruckOutlined,
  FileTextOutlined,
  CreditCardOutlined
} from '@ant-design/icons'
import Navigation from '../../../components/Navigation'

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
  payment_id?: string
  paid_at?: string
}

// Mock 데이터 (실제로는 API에서 가져옴)
const getMockOrder = (orderId: string): Order | null => {
  const orders: Record<string, Order> = {
    'ord_001': {
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
    'ord_002': {
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
    'ord_003': {
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
    'ord_006': {
      order_id: 'ord_006',
      product_name: '선거 공보 (책자)',
      option_name: '공약형 C',
      quantity: 5000,
      total_price: 250000,
      status: 'paid_waiting_admin_review',
      status_label: '승인 대기',
      status_color: 'bg-yellow-100 text-yellow-700',
      created_at: '2024-01-20 15:00',
      payment_id: 'pay_006',
      paid_at: '2024-01-20 15:30'
    },
    'ord_007': {
      order_id: 'ord_007',
      product_name: '숄더백',
      option_name: '에코백',
      quantity: 200,
      total_price: 1100000,
      status: 'rejected_refunded',
      status_label: '반려됨',
      status_color: 'bg-red-100 text-red-700',
      created_at: '2024-01-20 14:00',
      reject_reason: '선거법 위반 문구가 포함되어 있습니다. "지역 주민 여러분"이라는 표현은 사용할 수 없습니다.',
      payment_id: 'pay_007',
      paid_at: '2024-01-20 14:15'
    },
    'ord_008': {
      order_id: 'ord_008',
      product_name: '캠페인용 스티커',
      option_name: '원형',
      quantity: 2000,
      total_price: 240000,
      status: 'approved_final_generating',
      status_label: '완성본 생성 중',
      status_color: 'bg-blue-100 text-blue-700',
      created_at: '2024-01-20 13:00',
      payment_id: 'pay_008',
      paid_at: '2024-01-20 13:15'
    },
    'ord_011': {
      order_id: 'ord_011',
      product_name: '선거 후보 명함',
      option_name: '기본형 A',
      quantity: 5000,
      total_price: 80000,
      status: 'in_production',
      status_label: '제작 중',
      status_color: 'bg-orange-100 text-orange-700',
      created_at: '2024-01-19 15:00',
      payment_id: 'pay_011',
      paid_at: '2024-01-19 15:30'
    },
    'ord_013': {
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
      ],
      payment_id: 'pay_013',
      paid_at: '2024-01-18 14:30'
    },
    'ord_014': {
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
      final_pdf_url: '/mock-final.pdf',
      payment_id: 'pay_014',
      paid_at: '2024-01-17 10:30'
    }
  }
  return orders[orderId] || null
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const order = getMockOrder(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-muted">
        <Navigation role="candidate" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <ShoppingOutlined className="text-6xl text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">주문을 찾을 수 없습니다</p>
            <Link
              href="/shop/orders"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              주문내역으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  // 상태별 진행 단계
  const getProgressSteps = (status: string) => {
    const allSteps = [
      { key: 'draft', label: '주문 작성', statuses: ['draft_saved'] },
      { key: 'preview', label: '미리보기', statuses: ['preview_generating', 'preview_ready', 'preview_failed'] },
      { key: 'payment', label: '결제', statuses: ['payment_pending'] },
      { key: 'approval', label: '승인 대기', statuses: ['paid_waiting_admin_review'] },
      { key: 'final', label: '완성본 생성', statuses: ['approved_final_generating'] },
      { key: 'vendor', label: '업체 전송', statuses: ['sent_to_vendor', 'vendor_send_failed'] },
      { key: 'production', label: '제작', statuses: ['in_production', 'production_done_waiting_ship'] },
      { key: 'shipping', label: '배송', statuses: ['shipped'] },
      { key: 'complete', label: '완료', statuses: ['delivered', 'completed'] }
    ]

    const currentStepIndex = allSteps.findIndex(step => step.statuses.includes(status))

    return allSteps.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex,
      current: index === currentStepIndex,
      upcoming: index > currentStepIndex
    }))
  }

  const progressSteps = getProgressSteps(order.status)

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/shop/orders"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeftOutlined />
            주문내역으로 돌아가기
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">주문 상세</h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">주문번호: #{order.order_id}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${order.status_color}`}>
                  {getStatusIcon(order.status)}
                  {order.status_label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        {!order.status.includes('rejected') && !order.status.includes('draft') && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-4">주문 진행 상태</h2>
            <div className="flex items-start justify-between">
              {progressSteps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    {/* Icon/Number Circle - Fixed Height */}
                    <div className="h-8 flex items-center justify-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step.completed ? 'bg-green-500 text-white' :
                        step.current ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? <CheckCircleOutlined /> : index + 1}
                      </div>
                    </div>
                    {/* Label - Fixed Height with min-height */}
                    <div className="min-h-[2rem] flex items-start justify-center">
                      <p className={`text-xs text-center leading-tight ${
                        step.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                  {/* Connector Line - Aligned to icon center */}
                  {index < progressSteps.length - 1 && (
                    <div className="flex items-start pt-4 flex-1">
                      <div className={`h-0.5 w-full ${
                        step.completed ? 'bg-green-500' : 'bg-border'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reject Reason */}
        {order.reject_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CloseCircleOutlined className="text-red-500 text-xl mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">반려 사유</h3>
                <p className="text-sm text-red-700">{order.reject_reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Information */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">주문 정보</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <ShoppingOutlined className="text-2xl text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{order.product_name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{order.option_name}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">수량: <span className="text-foreground font-medium">{order.quantity.toLocaleString()}개</span></span>
                  <span className="text-muted-foreground">금액: <span className="text-foreground font-semibold">{order.total_price.toLocaleString()}원</span></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">주문 일시</p>
                <p className="text-foreground font-medium">{order.created_at}</p>
              </div>
              {order.paid_at && (
                <div>
                  <p className="text-muted-foreground mb-1">결제 일시</p>
                  <p className="text-foreground font-medium">{order.paid_at}</p>
                </div>
              )}
              {order.payment_id && (
                <div>
                  <p className="text-muted-foreground mb-1">결제 번호</p>
                  <p className="text-foreground font-mono text-xs">{order.payment_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        {order.preview_url && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>
            <div className="border border-border rounded-lg p-4 bg-muted">
              <img src={order.preview_url} alt="Preview" className="w-full rounded" />
            </div>
          </div>
        )}

        {/* Tracking Information */}
        {order.tracking_info && order.tracking_info.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <TruckOutlined className="text-primary" />
              배송 정보
            </h2>
            <div className="space-y-3">
              {order.tracking_info.map((tracking, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">{tracking.carrier}</p>
                      <code className="text-sm bg-blue-100 px-3 py-1 rounded text-blue-900 font-mono">{tracking.tracking_number}</code>
                    </div>
                    <a
                      href={`https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&inv_no=${tracking.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      배송 조회
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-wrap gap-3">
            {order.status === 'draft_saved' && (
              <Link
                href={`/shop/products/${order.order_id}`}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2"
              >
                <EditOutlined />
                이어서 작성하기
              </Link>
            )}

            {order.status === 'preview_ready' && (
              <>
                <button className="flex-1 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
                  <EyeOutlined />
                  미리보기 확인
                </button>
                <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <CreditCardOutlined />
                  결제하기
                </button>
              </>
            )}

            {order.status === 'rejected_refunded' && (
              <Link
                href={`/shop/products/${order.order_id}/copy`}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2"
              >
                <ShoppingOutlined />
                수정 후 재주문
              </Link>
            )}

            {order.final_pdf_url && (
              <a
                href={order.final_pdf_url}
                download
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center flex items-center justify-center gap-2"
              >
                <DownloadOutlined />
                완성본 PDF 다운로드
              </a>
            )}

            <Link
              href="/shop/orders"
              className="flex-1 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors text-center"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
