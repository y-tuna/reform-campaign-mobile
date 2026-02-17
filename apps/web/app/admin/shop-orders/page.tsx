'use client'

import React, { useState } from 'react'
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, ShoppingOutlined } from '@ant-design/icons'
import Navigation from '../../components/Navigation'
import { Modal, message } from 'antd'

interface ShopOrder {
  order_id: string
  candidate_name: string
  region: string
  product_name: string
  option_name: string
  quantity: number
  total_price: number
  status: 'paid_waiting_admin_review' | 'approved_final_generating' | 'rejected_refunded'
  payment_id: string
  paid_at: string
  preview_url?: string
  preview_pdf_url?: string
}

const mockOrders: ShopOrder[] = [
  {
    order_id: 'ord_sh_001',
    candidate_name: '김철수',
    region: '서울 강남구',
    product_name: '선거 공보 (전단지)',
    option_name: '기본형 A',
    quantity: 10000,
    total_price: 360000,
    status: 'paid_waiting_admin_review',
    payment_id: 'pay_001',
    paid_at: '2024-01-20 14:30',
    preview_url: '/mock-preview.jpg',
    preview_pdf_url: '/mock-preview.pdf'
  },
  {
    order_id: 'ord_sh_002',
    candidate_name: '이영희',
    region: '경기 수원시',
    product_name: '선거 후보 명함',
    option_name: '이미지형 B',
    quantity: 5000,
    total_price: 80000,
    status: 'paid_waiting_admin_review',
    payment_id: 'pay_002',
    paid_at: '2024-01-20 11:00',
    preview_url: '/mock-preview.jpg'
  },
  {
    order_id: 'ord_sh_003',
    candidate_name: '박민수',
    region: '부산 해운대구',
    product_name: '현수막 (중형)',
    option_name: '기본형',
    quantity: 10,
    total_price: 450000,
    status: 'approved_final_generating',
    payment_id: 'pay_003',
    paid_at: '2024-01-19 16:45'
  },
  {
    order_id: 'ord_sh_004',
    candidate_name: '정수연',
    region: '인천 남동구',
    product_name: '선거 공보 (책자)',
    option_name: '공약형 C',
    quantity: 5000,
    total_price: 250000,
    status: 'rejected_refunded',
    payment_id: 'pay_004',
    paid_at: '2024-01-18 09:30'
  }
]

export default function AdminShopOrdersPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.candidate_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.order_id.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = mockOrders.filter(o => o.status === 'paid_waiting_admin_review').length

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      paid_waiting_admin_review: { bg: 'bg-amber-100', text: 'text-amber-700', label: '승인 대기' },
      approved_final_generating: { bg: 'bg-blue-100', text: 'text-blue-700', label: '완성본 생성 중' },
      rejected_refunded: { bg: 'bg-red-100', text: 'text-red-700', label: '반려됨' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const handleApprove = async (order: ShopOrder) => {
    Modal.confirm({
      title: '주문 승인',
      content: `${order.candidate_name}님의 ${order.product_name} 주문을 승인하시겠습니까?`,
      okText: '승인',
      cancelText: '취소',
      onOk: async () => {
        message.loading('승인 처리 중...', 0)
        try {
          await new Promise(resolve => setTimeout(resolve, 1500))
          message.destroy()
          message.success('주문이 승인되었습니다')
        } catch (error) {
          message.destroy()
          message.error('승인 실패')
        }
      }
    })
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('반려 사유를 입력해주세요')
      return
    }

    message.loading('반려 처리 중...', 0)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      message.destroy()
      message.success('주문이 반려되었습니다')
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedOrder(null)
    } catch (error) {
      message.destroy()
      message.error('반려 실패')
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">유세몰 주문 관리</h1>
            <p className="text-sm text-muted-foreground">후보자의 공보물/홍보물 주문을 검토하고 승인합니다</p>
          </div>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">
              승인 대기 {pendingCount}건
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="후보자명, 상품명, 주문번호 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="paid_waiting_admin_review">승인 대기</option>
              <option value="approved_final_generating">제작 진행</option>
              <option value="rejected_refunded">반려됨</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">주문번호</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">후보자</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상품</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">수량</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">금액</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">결제일시</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">{order.order_id}</code>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{order.candidate_name}</p>
                        <p className="text-xs text-muted-foreground">{order.region}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ShoppingOutlined className="text-primary" />
                        <div>
                          <p className="text-foreground">{order.product_name}</p>
                          <p className="text-xs text-muted-foreground">{order.option_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{order.quantity.toLocaleString()}개</td>
                    <td className="py-3 px-4 font-medium text-foreground">{order.total_price.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{order.paid_at}</td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-primary hover:text-primary/80 transition-colors"
                          title="상세 보기"
                        >
                          <EyeOutlined />
                        </button>
                        {order.status === 'paid_waiting_admin_review' && (
                          <>
                            <button
                              onClick={() => handleApprove(order)}
                              className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
                              title="승인"
                            >
                              <CheckCircleOutlined />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowRejectModal(true)
                              }}
                              className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                              title="반려"
                            >
                              <CloseCircleOutlined />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-sm text-muted-foreground">
            총 {filteredOrders.length}건
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        title="주문 상세"
        open={!!selectedOrder && !showRejectModal}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">후보자</p>
                <p className="font-medium">{selectedOrder.candidate_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">지역구</p>
                <p className="font-medium">{selectedOrder.region}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">상품</p>
                <p className="font-medium">{selectedOrder.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">옵션</p>
                <p className="font-medium">{selectedOrder.option_name}</p>
              </div>
            </div>

            {selectedOrder.preview_url && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">미리보기</p>
                <div className="border border-border rounded-lg p-4 bg-muted">
                  <img src={selectedOrder.preview_url} alt="Preview" className="w-full rounded" />
                </div>
                {selectedOrder.preview_pdf_url && (
                  <a
                    href={selectedOrder.preview_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:underline"
                  >
                    <FileTextOutlined />
                    PDF 미리보기 보기
                  </a>
                )}
              </div>
            )}

            {selectedOrder.status === 'paid_waiting_admin_review' && (
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleApprove(selectedOrder)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckCircleOutlined className="mr-2" />
                  승인
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(true)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <CloseCircleOutlined className="mr-2" />
                  반려
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="주문 반려"
        open={showRejectModal}
        onCancel={() => {
          setShowRejectModal(false)
          setRejectReason('')
        }}
        onOk={handleReject}
        okText="반려 확정"
        cancelText="취소"
        okButtonProps={{ danger: true }}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            반려 사유를 입력해주세요. 후보자에게 전달됩니다.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="예: 선거법 위반 문구가 포함되어 있습니다. (구체적 내용 명시)"
            rows={6}
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            반려 시 결제가 자동으로 취소되며, 후보자는 수정 후 재주문할 수 있습니다.
          </p>
        </div>
      </Modal>
    </div>
  )
}
