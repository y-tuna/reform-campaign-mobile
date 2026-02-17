'use client'

import React, { useState } from 'react'
import { UploadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface BusinessCardData {
  name: string
  party: string
  position: string
  district: string
  phone: string
  email: string
  slogan: string
  photoUrl: string | null
}

export default function BusinessCardEditorPage() {
  const [formData, setFormData] = useState<BusinessCardData>({
    name: '',
    party: '개혁신당',
    position: '구의원 예비후보',
    district: '',
    phone: '',
    email: '',
    slogan: '',
    photoUrl: null
  })
  const [quantity, setQuantity] = useState(100)

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.position) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    alert('주문 정보가 준비되었습니다. 결제 페이지로 이동합니다.')
  }

  const prices: Record<number, number> = {
    100: 25000,
    200: 45000,
    500: 100000,
    1000: 180000
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/templates" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">명함 제작</h1>
          <p className="text-sm text-muted-foreground">정보를 입력하고 미리보기를 확인하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>
            <div className="aspect-[1.8/1] bg-white border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col justify-between">
              {/* Card Front Preview */}
              <div>
                <div className="text-xs text-orange-500 font-bold mb-1">{formData.party}</div>
                <div className="text-xl font-bold text-gray-900 mb-1">{formData.name || '후보자 이름'}</div>
                <div className="text-sm text-gray-600">{formData.position || '직책'}</div>
                {formData.district && (
                  <div className="text-sm text-gray-500">{formData.district}</div>
                )}
              </div>
              <div>
                {formData.slogan && (
                  <div className="text-sm text-orange-600 italic mb-2">"{formData.slogan}"</div>
                )}
                <div className="text-xs text-gray-500 space-y-0.5">
                  {formData.phone && <div>TEL. {formData.phone}</div>}
                  {formData.email && <div>E. {formData.email}</div>}
                </div>
              </div>
            </div>

            <div className="border-t border-border my-5"></div>

            {/* Quantity & Price */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">수량 선택</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={100}>100장</option>
                  <option value={200}>200장</option>
                  <option value={500}>500장</option>
                  <option value={1000}>1,000장</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
                <span className="text-sm text-muted-foreground">예상 금액</span>
                <span className="text-xl font-bold text-primary">
                  {prices[quantity]?.toLocaleString()}원
                </span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <ShoppingCartOutlined />
                주문하기
              </button>

              <p className="text-xs text-muted-foreground text-center">
                결제 시 광고천하 결제 페이지로 이동합니다.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">정보 입력</h2>
              <div className="space-y-5">
                {/* Photo Upload */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    사진 업로드 <span className="text-muted-foreground">(선택)</span>
                  </label>
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <UploadOutlined className="text-2xl text-gray-400" />
                    <div className="mt-2 text-xs text-gray-500">사진 업로드</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG 형식, 최대 5MB
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    직책 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="구의원 예비후보"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    선거구
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="서울특별시 강남구 가선거구"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@reform-party.kr"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Slogan */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    슬로건
                  </label>
                  <textarea
                    value={formData.slogan}
                    onChange={(e) => handleInputChange('slogan', e.target.value)}
                    placeholder="함께 만드는 새로운 강남"
                    rows={2}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.slogan.length}/50</p>
                </div>
              </div>
            </div>

            {/* Specs Info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-sm font-medium text-foreground mb-3">명함 규격</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 사이즈: 90 x 50mm</li>
                <li>• 용지: 250g 고급 아트지</li>
                <li>• 인쇄: 양면 컬러</li>
                <li>• 코팅: 무광 코팅</li>
                <li>• 제작 기간: 결제 후 3~5일</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
