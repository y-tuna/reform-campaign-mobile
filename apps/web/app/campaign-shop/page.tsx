'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import {
  IdcardOutlined,
  PictureOutlined,
  FileImageOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  RightOutlined
} from '@ant-design/icons'

// 공보물 템플릿 데이터
const templates = [
  {
    href: '/templates/business-card',
    icon: IdcardOutlined,
    title: '명함',
    description: '후보자 정보가 담긴 명함을 제작합니다.',
    specs: ['90x50mm', '양면 인쇄', '250g 고급지'],
    price: '100장 25,000원~'
  },
  {
    href: '/templates/banner',
    icon: PictureOutlined,
    title: '현수막',
    description: '거리 유세용 현수막을 제작합니다.',
    specs: ['900x1800mm', '900x3600mm', '천 소재'],
    price: '1장 35,000원~'
  },
  {
    href: '/templates/poster',
    icon: FileImageOutlined,
    title: '포스터',
    description: '선거 포스터를 제작합니다.',
    specs: ['A2', 'A3', '150g 고급지'],
    price: '100장 45,000원~'
  },
  {
    href: '/templates/brochure',
    icon: BookOutlined,
    title: '공보물 (리플렛)',
    description: '선거공보물을 제작합니다. 선관위 규격 준수.',
    specs: ['8p', '16p', '선관위 규격'],
    price: '1,000부 150,000원~'
  }
]

// 유세용품 데이터
const products = [
  {
    id: '1',
    name: '후보자 어깨띠',
    category: 'uniform',
    price: '15,000원',
    description: '고급 새틴 소재, 이름 인쇄 포함',
    inStock: true,
    isPopular: true
  },
  {
    id: '2',
    name: '유세 조끼',
    category: 'uniform',
    price: '35,000원',
    description: '통기성 좋은 메쉬 소재, 로고 인쇄',
    inStock: true,
    isPopular: true
  },
  {
    id: '3',
    name: '휴대용 확성기',
    category: 'equipment',
    price: '89,000원',
    description: '15W 출력, 충전식 배터리',
    inStock: true,
    isPopular: false
  },
  {
    id: '4',
    name: '손피켓 세트 (10개)',
    category: 'materials',
    price: '25,000원',
    description: '방수 코팅, 맞춤 디자인',
    inStock: true,
    isPopular: false
  },
  {
    id: '5',
    name: '차량용 자석시트',
    category: 'vehicle',
    price: '45,000원',
    description: '600x300mm, 탈부착 간편',
    inStock: true,
    isPopular: false
  },
  {
    id: '6',
    name: '배너 스탠드',
    category: 'materials',
    price: '55,000원',
    description: 'X배너 스탠드 + 인쇄물 포함',
    inStock: true,
    isPopular: true
  }
]

export default function CampaignShopPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'products'>('templates')

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">유세몰 · 공보물 제작</h1>
          <p className="text-sm text-muted-foreground">
            명함, 현수막, 포스터 및 유세용품을 간편하게 제작/구매하세요.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            공보물 제작
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            유세용품 구매
          </button>
        </div>

        {/* 공보물 제작 탭 */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Link key={template.href} href={template.href}>
                  <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group h-full">
                    <div className="flex gap-4">
                      {/* Preview Area */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <template.icon className="text-3xl text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-semibold text-foreground">{template.title}</h3>
                          <RightOutlined className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.specs.map((spec) => (
                            <span key={spec} className="px-2 py-0.5 bg-accent text-xs text-muted-foreground rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-primary">{template.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Process Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">제작 프로세스</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-xl font-bold text-primary mb-2">1</div>
                  <p className="text-sm font-medium text-foreground">템플릿 선택</p>
                  <p className="text-xs text-muted-foreground mt-1">원하는 공보물 선택</p>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-xl font-bold text-primary mb-2">2</div>
                  <p className="text-sm font-medium text-foreground">정보 입력</p>
                  <p className="text-xs text-muted-foreground mt-1">이름, 사진, 슬로건 등</p>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-xl font-bold text-primary mb-2">3</div>
                  <p className="text-sm font-medium text-foreground">결제</p>
                  <p className="text-xs text-muted-foreground mt-1">광고천하 결제 페이지</p>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-xl font-bold text-primary mb-2">4</div>
                  <p className="text-sm font-medium text-foreground">배송</p>
                  <p className="text-xs text-muted-foreground mt-1">전문 디자인 후 배송</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 유세용품 구매 탭 */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image Placeholder */}
                  <div className="h-36 bg-gray-100 flex items-center justify-center relative">
                    <ShoppingCartOutlined className="text-4xl text-gray-300" />
                    {product.isPopular && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-danger text-white text-xs font-medium rounded">
                        인기
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-primary">{product.price}</p>
                      <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                        담기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* More Products Link */}
            <div className="text-center">
              <Link href="/shop" className="text-sm text-primary hover:text-primary/80 font-medium">
                더 많은 상품 보기 →
              </Link>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl text-amber-500">
              <BookOutlined />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                광고천하 제휴 안내
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                입력하신 정보는 광고천하로 전송되어 전문 디자이너가 제작합니다.
                결제 시 광고천하 결제 페이지로 이동하며, 세금계산서는 선관위 기준에 맞춰 발행됩니다.
              </p>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>• 제작 기간: 결제 후 3~5일</li>
                <li>• 수정 횟수: 2회 무료</li>
                <li>• 배송비: 3만원 이상 무료</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
