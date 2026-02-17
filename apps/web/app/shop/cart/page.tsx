'use client'

import React, { useState } from 'react'
import { ShoppingCartOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: string
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: '후보자 어깨띠',
    price: 15000,
    quantity: 2,
    options: '이름 인쇄: 홍길동'
  },
  {
    id: '2',
    name: '유세 조끼',
    price: 35000,
    quantity: 3,
    options: '사이즈: L, 로고 인쇄 포함'
  },
  {
    id: '4',
    name: '손피켓 세트 (10개)',
    price: 25000,
    quantity: 2,
    options: '맞춤 디자인'
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const handleClearCart = () => {
    if (confirm('장바구니의 모든 상품을 삭제하시겠습니까?')) {
      setCartItems([])
    }
  }

  const handleCheckout = () => {
    alert('결제 페이지로 이동합니다.')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 100000 ? 0 : 3000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              ← 돌아가기
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">장바구니</h1>
              <p className="text-sm text-muted-foreground">{cartItems.length}개 상품</p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-sm text-danger border border-danger/30 rounded-lg hover:bg-danger/10 transition-colors"
            >
              장바구니 비우기
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <ShoppingCartOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-muted-foreground mb-4">장바구니가 비어있습니다.</p>
            <Link href="/shop">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                쇼핑하러 가기
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`p-5 flex items-center gap-4 ${index !== cartItems.length - 1 ? 'border-b border-border' : ''}`}>
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCartOutlined className="text-2xl text-gray-300" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      {item.options && (
                        <p className="text-sm text-muted-foreground mt-1">{item.options}</p>
                      )}
                      <p className="text-primary font-semibold mt-1">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <MinusOutlined className="text-xs" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        <PlusOutlined className="text-xs" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right">
                      <p className="font-semibold text-foreground">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-muted-foreground hover:text-danger transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">주문 요약</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span className="font-medium">{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">배송비</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        `${shipping.toLocaleString()}원`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ※ 10만원 이상 구매 시 무료배송
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">총 결제금액</span>
                    <span className="text-xl font-bold text-primary">
                      {total.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartOutlined />
                  결제하기
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  결제 시 광고천하 결제 페이지로 이동합니다.
                </p>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-2">안내사항</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 모든 상품은 광고천하를 통해 배송됩니다.</li>
                  <li>• 세금계산서는 선관위 기준에 맞춰 발행됩니다.</li>
                  <li>• 주문 후 3~5일 내 배송됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
