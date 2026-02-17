'use client'

import React, { useState } from 'react'
import { SearchOutlined, ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, FileImageOutlined } from '@ant-design/icons'
import Navigation from '../../components/Navigation'

interface MaterialOrder {
  key: string
  id: string
  candidateName: string
  region: string
  itemType: string
  itemName: string
  quantity: string
  designStatus: 'pending' | 'approved' | 'revision'
  orderStatus: 'pending' | 'approved' | 'rejected' | 'completed'
  requestedAt: string
  estimatedPrice: string
}

const mockOrders: MaterialOrder[] = [
  {
    key: '1',
    id: 'ord_001',
    candidateName: '김철수',
    region: '서울 강남구',
    itemType: '인쇄물',
    itemName: '명함 (5,000매)',
    quantity: '5,000매',
    designStatus: 'pending',
    orderStatus: 'pending',
    requestedAt: '2024-01-20 14:30',
    estimatedPrice: '150,000원'
  },
  {
    key: '2',
    id: 'ord_002',
    candidateName: '이영희',
    region: '경기 수원시',
    itemType: '현수막',
    itemName: '거점 현수막 (대형)',
    quantity: '20개',
    designStatus: 'approved',
    orderStatus: 'pending',
    requestedAt: '2024-01-20 11:00',
    estimatedPrice: '800,000원'
  },
  {
    key: '3',
    id: 'ord_003',
    candidateName: '박민수',
    region: '부산 해운대구',
    itemType: '홍보물',
    itemName: '어깨띠',
    quantity: '50개',
    designStatus: 'revision',
    orderStatus: 'pending',
    requestedAt: '2024-01-19 16:45',
    estimatedPrice: '250,000원'
  },
  {
    key: '4',
    id: 'ord_004',
    candidateName: '정수연',
    region: '인천 남동구',
    itemType: '인쇄물',
    itemName: '브로슈어 (A4 접지)',
    quantity: '10,000부',
    designStatus: 'approved',
    orderStatus: 'approved',
    requestedAt: '2024-01-18 09:30',
    estimatedPrice: '1,200,000원'
  },
  {
    key: '5',
    id: 'ord_005',
    candidateName: '최동욱',
    region: '대구 수성구',
    itemType: '배너',
    itemName: 'X배너 스탠드',
    quantity: '10개',
    designStatus: 'approved',
    orderStatus: 'completed',
    requestedAt: '2024-01-17 14:00',
    estimatedPrice: '300,000원'
  }
]

export default function AdminMaterialsPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredData = mockOrders.filter(item => {
    const matchesSearch = item.candidateName.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.itemName.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.orderStatus === statusFilter
    const matchesType = typeFilter === 'all' || item.itemType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const pendingCount = mockOrders.filter(o => o.orderStatus === 'pending').length
  const itemTypes = [...new Set(mockOrders.map(o => o.itemType))]

  const getDesignBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '디자인 검토중' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '디자인 승인' },
      revision: { bg: 'bg-red-100', text: 'text-red-700', label: '수정 요청' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getOrderBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '승인 대기' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: '발주 승인' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '반려' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: '발주 완료' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">물품 발주 승인</h1>
            <p className="text-sm text-muted-foreground">후보자의 유세 물품 발주를 검토하고 승인합니다</p>
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
                placeholder="후보자명 또는 품목 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 품목</option>
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="pending">승인 대기</option>
              <option value="approved">발주 승인</option>
              <option value="rejected">반려</option>
              <option value="completed">발주 완료</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">후보자</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">품목</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">수량</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">예상 금액</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">디자인</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주 상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">요청 시간</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((order) => (
                  <tr key={order.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{order.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{order.region}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ShoppingOutlined className="text-primary" />
                        <div>
                          <p className="text-foreground">{order.itemName}</p>
                          <p className="text-xs text-muted-foreground">{order.itemType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{order.quantity}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{order.estimatedPrice}</td>
                    <td className="py-3 px-4">{getDesignBadge(order.designStatus)}</td>
                    <td className="py-3 px-4">{getOrderBadge(order.orderStatus)}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{order.requestedAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="디자인 보기">
                          <FileImageOutlined />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="상세 보기">
                          <EyeOutlined />
                        </button>
                        {order.orderStatus === 'pending' && (
                          <>
                            <button className="p-1.5 text-green-600 hover:text-green-700 transition-colors" title="승인">
                              <CheckCircleOutlined />
                            </button>
                            <button className="p-1.5 text-red-500 hover:text-red-600 transition-colors" title="반려">
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
            총 {filteredData.length}건
          </div>
        </div>
      </div>
    </div>
  )
}
