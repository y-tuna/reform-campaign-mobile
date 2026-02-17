'use client'

import React, { useState } from 'react'
import { SearchOutlined, PlayCircleOutlined, CheckCircleOutlined, FileTextOutlined, TruckOutlined, PlusOutlined } from '@ant-design/icons'
import Navigation from '../../components/Navigation'
import { Modal, message } from 'antd'

interface VendorOrder {
  order_id: string
  candidate_name: string
  product_name: string
  option_name: string
  quantity: number
  status: 'sent_to_vendor' | 'in_production' | 'production_done_waiting_ship' | 'shipped' | 'delivered'
  final_ai_url?: string
  final_pdf_url?: string
  approved_at: string
  shipments: Shipment[]
}

interface Shipment {
  leg_id: string
  leg_type: 'candidate' | 'party_hq'
  destination: string
  qty: number
  trackings: Tracking[]
  status: 'pending' | 'shipped' | 'delivered'
}

interface Tracking {
  tracking_id: string
  carrier: string
  tracking_number: string
}

const mockOrders: VendorOrder[] = [
  {
    order_id: 'ord_sh_001',
    candidate_name: '김철수',
    product_name: '선거 공보 (전단지)',
    option_name: '기본형 A',
    quantity: 10000,
    status: 'sent_to_vendor',
    final_ai_url: '/mock-final.ai',
    final_pdf_url: '/mock-final.pdf',
    approved_at: '2024-01-20 15:00',
    shipments: [
      {
        leg_id: 'leg_001_candidate',
        leg_type: 'candidate',
        destination: '후보자 (서울 강남구)',
        qty: 9999,
        trackings: [],
        status: 'pending'
      },
      {
        leg_id: 'leg_001_party',
        leg_type: 'party_hq',
        destination: '중앙당 보관용',
        qty: 1,
        trackings: [],
        status: 'pending'
      }
    ]
  },
  {
    order_id: 'ord_sh_002',
    candidate_name: '이영희',
    product_name: '선거 후보 명함',
    option_name: '이미지형 B',
    quantity: 5000,
    status: 'in_production',
    final_ai_url: '/mock-final.ai',
    approved_at: '2024-01-20 12:00',
    shipments: [
      {
        leg_id: 'leg_002_candidate',
        leg_type: 'candidate',
        destination: '후보자 (경기 수원시)',
        qty: 5000,
        trackings: [],
        status: 'pending'
      }
    ]
  },
  {
    order_id: 'ord_sh_003',
    candidate_name: '박민수',
    product_name: '현수막 (중형)',
    option_name: '기본형',
    quantity: 10,
    status: 'shipped',
    approved_at: '2024-01-19 17:00',
    shipments: [
      {
        leg_id: 'leg_003_candidate',
        leg_type: 'candidate',
        destination: '후보자 (부산 해운대구)',
        qty: 10,
        trackings: [
          { tracking_id: 'tr_001', carrier: 'CJ대한통운', tracking_number: '123456789012' }
        ],
        status: 'shipped'
      }
    ]
  }
]

export default function VendorOrdersPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedLeg, setSelectedLeg] = useState<Shipment | null>(null)
  const [newTracking, setNewTracking] = useState({ carrier: 'CJ대한통운', tracking_number: '' })

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.candidate_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.order_id.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      sent_to_vendor: { bg: 'bg-blue-100', text: 'text-blue-700', label: '제작 대기' },
      in_production: { bg: 'bg-orange-100', text: 'text-orange-700', label: '제작 중' },
      production_done_waiting_ship: { bg: 'bg-purple-100', text: 'text-purple-700', label: '출고 대기' },
      shipped: { bg: 'bg-green-100', text: 'text-green-700', label: '배송 중' },
      delivered: { bg: 'bg-gray-100', text: 'text-gray-600', label: '배송 완료' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const handleProductionStart = async (order: VendorOrder) => {
    message.loading('제작 시작 처리 중...', 0)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.destroy()
      message.success('제작이 시작되었습니다')
    } catch (error) {
      message.destroy()
      message.error('처리 실패')
    }
  }

  const handleProductionDone = async (order: VendorOrder) => {
    message.loading('제작 완료 처리 중...', 0)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.destroy()
      message.success('제작이 완료되었습니다')
    } catch (error) {
      message.destroy()
      message.error('처리 실패')
    }
  }

  const handleAddTracking = async () => {
    if (!newTracking.tracking_number.trim()) {
      message.error('송장번호를 입력해주세요')
      return
    }

    message.loading('송장 등록 중...', 0)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.destroy()
      message.success('송장이 등록되었습니다')
      setShowTrackingModal(false)
      setNewTracking({ carrier: 'CJ대한통운', tracking_number: '' })
    } catch (error) {
      message.destroy()
      message.error('등록 실패')
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="vendor" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">주문 관리</h1>
          <p className="text-sm text-muted-foreground">승인된 주문의 제작 및 배송을 관리합니다</p>
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
              <option value="sent_to_vendor">제작 대기</option>
              <option value="in_production">제작 중</option>
              <option value="production_done_waiting_ship">출고 대기</option>
              <option value="shipped">배송 중</option>
              <option value="delivered">배송 완료</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.order_id} className="border border-border rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">{order.order_id}</code>
                      {getStatusBadge(order.status)}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{order.candidate_name}</h3>
                    <p className="text-sm text-muted-foreground">{order.product_name} - {order.option_name}</p>
                    <p className="text-sm text-muted-foreground">수량: {order.quantity.toLocaleString()}개</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'sent_to_vendor' && (
                      <button
                        onClick={() => handleProductionStart(order)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <PlayCircleOutlined />
                        제작 시작
                      </button>
                    )}
                    {order.status === 'in_production' && (
                      <button
                        onClick={() => handleProductionDone(order)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircleOutlined />
                        제작 완료
                      </button>
                    )}
                    {order.final_ai_url && (
                      <a
                        href={order.final_ai_url}
                        download
                        className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <FileTextOutlined />
                        완성본 AI
                      </a>
                    )}
                  </div>
                </div>

                {/* Shipment Legs */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">배송 정보</h4>
                  <div className="space-y-3">
                    {order.shipments.map((leg) => (
                      <div key={leg.leg_id} className="bg-accent/30 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <TruckOutlined className="text-primary" />
                              <span className="font-medium text-sm">{leg.destination}</span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                leg.leg_type === 'party_hq' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {leg.leg_type === 'party_hq' ? '중앙당' : '후보자'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">수량: {leg.qty.toLocaleString()}개</p>
                          </div>
                          {leg.status === 'pending' && order.status !== 'sent_to_vendor' && order.status !== 'in_production' && (
                            <button
                              onClick={() => {
                                setSelectedLeg(leg)
                                setShowTrackingModal(true)
                              }}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                              <PlusOutlined />
                              송장 등록
                            </button>
                          )}
                        </div>
                        {leg.trackings.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {leg.trackings.map((tracking) => (
                              <div key={tracking.tracking_id} className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">{tracking.carrier}</span>
                                <code className="bg-muted px-2 py-0.5 rounded">{tracking.tracking_number}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">주문이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Tracking Modal */}
      <Modal
        title="송장 등록"
        open={showTrackingModal}
        onCancel={() => {
          setShowTrackingModal(false)
          setNewTracking({ carrier: 'CJ대한통운', tracking_number: '' })
        }}
        onOk={handleAddTracking}
        okText="등록"
        cancelText="취소"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">택배사</label>
            <select
              value={newTracking.carrier}
              onChange={(e) => setNewTracking(prev => ({ ...prev, carrier: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>CJ대한통운</option>
              <option>우체국택배</option>
              <option>한진택배</option>
              <option>로젠택배</option>
              <option>롯데택배</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">송장번호</label>
            <input
              type="text"
              value={newTracking.tracking_number}
              onChange={(e) => setNewTracking(prev => ({ ...prev, tracking_number: e.target.value }))}
              placeholder="123456789012"
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
