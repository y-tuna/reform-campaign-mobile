'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import Navigation from '../components/Navigation'

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  inStock: boolean
  tags: string[]
}

const products: Product[] = [
  {
    id: '1',
    name: '후보자 어깨띠',
    category: 'uniform',
    price: 15000,
    description: '고급 새틴 소재, 이름 인쇄 포함',
    inStock: true,
    tags: ['인기', '필수']
  },
  {
    id: '2',
    name: '유세 조끼',
    category: 'uniform',
    price: 35000,
    description: '통기성 좋은 메쉬 소재, 로고 인쇄',
    inStock: true,
    tags: ['인기']
  },
  {
    id: '3',
    name: '휴대용 확성기',
    category: 'equipment',
    price: 89000,
    description: '15W 출력, 충전식 배터리',
    inStock: true,
    tags: []
  },
  {
    id: '4',
    name: '손피켓 세트 (10개)',
    category: 'materials',
    price: 25000,
    description: '방수 코팅, 맞춤 디자인',
    inStock: true,
    tags: ['세트']
  },
  {
    id: '5',
    name: '차량용 자석시트',
    category: 'vehicle',
    price: 45000,
    description: '600x300mm, 탈부착 간편',
    inStock: false,
    tags: []
  },
  {
    id: '6',
    name: '배너 스탠드',
    category: 'materials',
    price: 55000,
    description: 'X배너 스탠드 + 인쇄물 포함',
    inStock: true,
    tags: ['인기']
  }
]

const categories = [
  { value: 'all', label: '전체' },
  { value: 'uniform', label: '유세복' },
  { value: 'equipment', label: '장비' },
  { value: 'materials', label: '홍보물' },
  { value: 'vehicle', label: '차량용품' }
]

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        <ShoppingCartOutlined className="text-4xl text-gray-300" />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">품절</span>
          </div>
        )}
        {product.tags.includes('인기') && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-danger text-white text-xs font-medium rounded">
            인기
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex gap-1 mb-2">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-accent text-xs text-muted-foreground rounded">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
        <p className="text-base font-bold text-primary mb-3">{product.price.toLocaleString()}원</p>

        <div className="flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            {liked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
          </button>
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="flex-1 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCartOutlined />
            담기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [cartCount, setCartCount] = useState(0)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: Product) => {
    setCartCount(prev => prev + 1)
    alert(`${product.name}을(를) 장바구니에 담았습니다.`)
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">유세용품 몰</h1>
            <p className="text-sm text-muted-foreground">
              캠페인에 필요한 유세복, 홍보물, 장비를 한 곳에서 구매하세요.
            </p>
          </div>
          <Link href="/shop/cart">
            <button className="relative px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
              <ShoppingCartOutlined />
              장바구니
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="상품명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl text-blue-500">
              <ShoppingCartOutlined />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                광고천하 제휴 안내
              </h3>
              <p className="text-sm text-muted-foreground">
                모든 상품은 광고천하를 통해 제작/배송됩니다.
                결제 시 광고천하 결제 페이지로 이동하며, 세금계산서는 선관위 기준에 맞춰 발행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
