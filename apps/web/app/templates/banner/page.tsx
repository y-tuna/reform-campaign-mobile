'use client'

import React, { useState } from 'react'
import { UploadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface BannerData {
  name: string
  party: string
  position: string
  number: string
  slogan: string
  photoUrl: string | null
  backgroundColor: string
  textColor: string
}

export default function BannerEditorPage() {
  const [formData, setFormData] = useState<BannerData>({
    name: '',
    party: '개혁신당',
    position: '구의원 예비후보',
    number: '',
    slogan: '',
    photoUrl: null,
    backgroundColor: '#FF6B00',
    textColor: '#FFFFFF'
  })
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')

  const handleInputChange = (field: keyof BannerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.position) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    alert('주문 정보가 준비되었습니다. 결제 페이지로 이동합니다.')
  }

  const sizeOptions = {
    small: { width: '50cm', height: '150cm', price: 35000 },
    medium: { width: '90cm', height: '150cm', price: 55000 },
    large: { width: '90cm', height: '200cm', price: 75000 }
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
          <h1 className="text-2xl font-bold text-foreground mb-2">현수막 제작</h1>
          <p className="text-sm text-muted-foreground">정보를 입력하고 미리보기를 확인하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>
            <div
              className="aspect-[1/3] rounded-lg p-6 flex flex-col justify-between items-center text-center"
              style={{
                backgroundColor: formData.backgroundColor,
                color: formData.textColor
              }}
            >
              {/* Top Section */}
              <div>
                <div className="text-sm font-bold mb-2 opacity-90">{formData.party}</div>
                {formData.number && (
                  <div className="text-4xl font-black mb-2">기호 {formData.number}번</div>
                )}
              </div>

              {/* Middle Section - Photo placeholder */}
              <div className="w-24 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm opacity-70">사진</span>
              </div>

              {/* Bottom Section */}
              <div>
                <div className="text-3xl font-black mb-2">{formData.name || '후보자 이름'}</div>
                <div className="text-lg mb-4">{formData.position || '직책'}</div>
                {formData.slogan && (
                  <div className="text-base italic opacity-90">"{formData.slogan}"</div>
                )}
              </div>
            </div>

            <div className="border-t border-border my-5"></div>

            {/* Size & Price */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">규격 선택</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as 'small' | 'medium' | 'large')}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="small">소형 ({sizeOptions.small.width} × {sizeOptions.small.height})</option>
                  <option value="medium">중형 ({sizeOptions.medium.width} × {sizeOptions.medium.height})</option>
                  <option value="large">대형 ({sizeOptions.large.width} × {sizeOptions.large.height})</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
                <span className="text-sm text-muted-foreground">예상 금액 (1장)</span>
                <span className="text-xl font-bold text-primary">
                  {sizeOptions[size].price.toLocaleString()}원
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
                    JPG, PNG 형식, 최대 10MB, 고해상도 권장
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
                    기호 번호 <span className="text-muted-foreground">(후보자 등록 후)</span>
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
                    maxLength={30}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.slogan.length}/30</p>
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
                      글자색
                    </label>
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-sm font-medium text-foreground mb-3">현수막 규격 안내</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 선거법상 규격: 가로 50cm × 세로 150cm 이내</li>
                <li>• 재질: 방수 천 (실외용)</li>
                <li>• 인쇄: 고해상도 잉크젯</li>
                <li>• 마감: 열재단 + 고리 포함</li>
                <li>• 제작 기간: 결제 후 3~5일</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
