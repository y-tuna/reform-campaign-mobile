'use client'

import React, { useState } from 'react'
import { UploadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface PosterData {
  name: string
  party: string
  position: string
  number: string
  slogan: string
  photoUrl: string | null
  backgroundColor: string
  accentColor: string
}

export default function PosterEditorPage() {
  const [formData, setFormData] = useState<PosterData>({
    name: '',
    party: '개혁신당',
    position: '구의원 예비후보',
    number: '',
    slogan: '',
    photoUrl: null,
    backgroundColor: '#FFFFFF',
    accentColor: '#FF6B00'
  })
  const [quantity, setQuantity] = useState(50)

  const handleInputChange = (field: keyof PosterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.position) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    alert('주문 정보가 준비되었습니다. 결제 페이지로 이동합니다.')
  }

  const prices: Record<number, number> = {
    50: 75000,
    100: 130000,
    200: 240000,
    500: 550000
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
          <h1 className="text-2xl font-bold text-foreground mb-2">포스터 제작</h1>
          <p className="text-sm text-muted-foreground">정보를 입력하고 미리보기를 확인하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>
            <div
              className="aspect-[2/3] rounded-lg p-6 flex flex-col border-4"
              style={{
                backgroundColor: formData.backgroundColor,
                borderColor: formData.accentColor
              }}
            >
              {/* Header */}
              <div
                className="text-center py-2 rounded-t-lg -mx-6 -mt-6 mb-4"
                style={{ backgroundColor: formData.accentColor }}
              >
                <span className="text-white font-bold">{formData.party}</span>
              </div>

              {/* Photo Area */}
              <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                <div className="text-center text-gray-400">
                  <UploadOutlined className="text-4xl" />
                  <p className="mt-2 text-sm">후보자 사진</p>
                </div>
              </div>

              {/* Info Section */}
              <div className="text-center">
                {formData.number && (
                  <div
                    className="inline-block px-4 py-1 rounded-full text-white font-bold mb-2"
                    style={{ backgroundColor: formData.accentColor }}
                  >
                    기호 {formData.number}번
                  </div>
                )}
                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  {formData.name || '후보자 이름'}
                </h2>
                <p className="text-gray-600 mb-2">{formData.position}</p>
                {formData.slogan && (
                  <p
                    className="text-sm font-medium mt-2"
                    style={{ color: formData.accentColor }}
                  >
                    "{formData.slogan}"
                  </p>
                )}
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
                  <option value={50}>50장</option>
                  <option value={100}>100장</option>
                  <option value={200}>200장</option>
                  <option value={500}>500장</option>
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
                    후보자 사진 <span className="text-red-500">*</span>
                  </label>
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <UploadOutlined className="text-2xl text-gray-400" />
                    <div className="mt-2 text-xs text-gray-500">사진 업로드</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG 형식, 고해상도 권장 (300dpi 이상)
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

                {/* Candidate Number */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    기호 번호
                  </label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="1"
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
                    placeholder="함께 만드는 새로운 미래"
                    rows={2}
                    maxLength={40}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.slogan.length}/40</p>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      배경색
                    </label>
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      강조색
                    </label>
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-sm font-medium text-foreground mb-3">포스터 규격 안내</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 사이즈: A3 (297 × 420mm)</li>
                <li>• 용지: 150g 코팅지</li>
                <li>• 인쇄: 양면 컬러</li>
                <li>• 코팅: 유광 또는 무광 선택</li>
                <li>• 제작 기간: 결제 후 3~5일</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
