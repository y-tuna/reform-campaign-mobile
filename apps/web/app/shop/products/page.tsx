'use client'

import React, { useState } from 'react'
import { ShoppingOutlined, FileTextOutlined, PrinterOutlined, TagOutlined, InfoCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Product {
  id: string
  name: string
  product_type: 'print' | 'promo'
  description: string
  price: number
  min_qty: number
  image_url?: string
  requires_party_hq_copy: boolean
  has_options: boolean
  option_count?: number
  estimated_days: string
}

// Mock 데이터 (실제로는 API에서 가져옴)
const mockProducts: Product[] = [
  // 인쇄물 (print)
  {
    id: 'prod_001',
    name: '선거 벽보',
    product_type: 'print',
    description: '선거 벽보 제작 (A1 사이즈, 무광코팅)',
    price: 15000,
    min_qty: 10,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '3-5일'
  },
  {
    id: 'prod_002',
    name: '선거 공보 (전단지)',
    product_type: 'print',
    description: 'A4 전단지 형태의 선거 공보물',
    price: 180000,
    min_qty: 5000,
    requires_party_hq_copy: true,
    has_options: true,
    option_count: 3,
    estimated_days: '5-7일'
  },
  {
    id: 'prod_003',
    name: '선거 공보 (책자)',
    product_type: 'print',
    description: 'A4 4P 책자 형태의 선거 공보물',
    price: 250000,
    min_qty: 5000,
    requires_party_hq_copy: true,
    has_options: true,
    option_count: 2,
    estimated_days: '5-7일'
  },
  {
    id: 'prod_004',
    name: '선거 후보 명함',
    product_type: 'print',
    description: '후보자 명함 (일반 명함 사이즈)',
    price: 80000,
    min_qty: 5000,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '3-5일'
  },
  {
    id: 'prod_005',
    name: '캠페인용 스티커',
    product_type: 'print',
    description: '방수 스티커 (원형/사각형)',
    price: 120000,
    min_qty: 1000,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 3,
    estimated_days: '3-5일'
  },
  // 홍보물 (promo)
  {
    id: 'prod_006',
    name: '현수막 (소형)',
    product_type: 'promo',
    description: '현수막 소형 (1m x 0.7m)',
    price: 25000,
    min_qty: 5,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '3-5일'
  },
  {
    id: 'prod_007',
    name: '현수막 (중형)',
    product_type: 'promo',
    description: '현수막 중형 (3m x 1m)',
    price: 45000,
    min_qty: 3,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '3-5일'
  },
  {
    id: 'prod_008',
    name: '대형 현수막',
    product_type: 'promo',
    description: '대형 현수막 (10m x 1.5m)',
    price: 120000,
    min_qty: 1,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 1,
    estimated_days: '5-7일'
  },
  {
    id: 'prod_009',
    name: '숄더백',
    product_type: 'promo',
    description: '캔버스 숄더백 (에코백)',
    price: 5500,
    min_qty: 100,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '7-10일'
  },
  {
    id: 'prod_010',
    name: '어깨띠',
    product_type: 'promo',
    description: '유세용 어깨띠 (새틴 소재)',
    price: 12000,
    min_qty: 10,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 2,
    estimated_days: '5-7일'
  },
  {
    id: 'prod_011',
    name: '선거후보 미니깃발',
    product_type: 'promo',
    description: '손잡이형 미니 깃발',
    price: 3000,
    min_qty: 100,
    requires_party_hq_copy: false,
    has_options: true,
    option_count: 1,
    estimated_days: '5-7일'
  }
]

export default function ShopProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'print' | 'promo'>('all')
  const [searchText, setSearchText] = useState('')

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.product_type === categoryFilter
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getTypeInfo = (type: 'print' | 'promo') => {
    if (type === 'print') {
      return {
        label: '인쇄물',
        color: 'bg-blue-100 text-blue-700',
        icon: <PrinterOutlined />
      }
    }
    return {
      label: '홍보물',
      color: 'bg-green-100 text-green-700',
      icon: <TagOutlined />
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">유세몰</h1>
            <p className="text-sm text-muted-foreground">
              선거 캠페인에 필요한 인쇄물과 홍보물을 주문하세요
            </p>
          </div>
          <Link
            href="/shop/orders"
            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <ShoppingOutlined />
            주문내역
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setCategoryFilter('print')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'print'
                  ? 'bg-blue-600 text-white'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              <PrinterOutlined className="mr-1" />
              인쇄물
            </button>
            <button
              onClick={() => setCategoryFilter('promo')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === 'promo'
                  ? 'bg-green-600 text-white'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              <TagOutlined className="mr-1" />
              홍보물
            </button>
          </div>
          <div className="flex-1 md:max-w-md">
            <input
              type="text"
              placeholder="상품명 또는 설명 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-blue-600 text-lg mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">공보물 배송 안내</p>
              <p className="text-xs text-blue-700">
                선거 공보물(전단지/책자)은 선관위 제출용으로 중앙당에 1부가 별도 배송됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const typeInfo = getTypeInfo(product.product_type)

            return (
              <Link
                key={product.id}
                href={`/shop/products/${product.id}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all h-full flex flex-col">
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <ShoppingOutlined className="text-6xl text-primary/30" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Type Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      {product.requires_party_hq_copy && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                          중앙당 1부 배송
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Details */}
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">가격</span>
                        <span className="font-semibold text-foreground">
                          {product.price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">최소 수량</span>
                        <span className="text-foreground">{product.min_qty.toLocaleString()}개</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">제작 기간</span>
                        <span className="text-foreground">{product.estimated_days}</span>
                      </div>
                      {product.has_options && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">옵션</span>
                          <span className="text-primary">{product.option_count}가지 템플릿</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          <FileTextOutlined className="mr-1" />
                          주문 제작
                        </span>
                        <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                          선택하기 →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingOutlined className="text-6xl text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground">다른 검색어를 입력해보세요</p>
          </div>
        )}

        {/* Result Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            총 {filteredProducts.length}개 상품
          </div>
        )}
      </div>
    </div>
  )
}
