'use client'

import React, { useState } from 'react'
import { UploadOutlined, ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface BrochureData {
  // Front page
  name: string
  party: string
  position: string
  number: string
  mainSlogan: string
  photoUrl: string | null
  // Back page - Profile
  education: string
  career: string
  // Pledges
  pledge1Title: string
  pledge1Content: string
  pledge2Title: string
  pledge2Content: string
  pledge3Title: string
  pledge3Content: string
  // Contact
  phone: string
  email: string
  website: string
  // Style
  primaryColor: string
}

export default function BrochureEditorPage() {
  const [activeTab, setActiveTab] = useState<'front' | 'profile' | 'pledges' | 'contact'>('front')
  const [formData, setFormData] = useState<BrochureData>({
    name: '',
    party: '개혁신당',
    position: '구의원 예비후보',
    number: '',
    mainSlogan: '',
    photoUrl: null,
    education: '',
    career: '',
    pledge1Title: '',
    pledge1Content: '',
    pledge2Title: '',
    pledge2Content: '',
    pledge3Title: '',
    pledge3Content: '',
    phone: '',
    email: '',
    website: '',
    primaryColor: '#FF6B00'
  })
  const [quantity, setQuantity] = useState(1000)

  const handleInputChange = (field: keyof BrochureData, value: string) => {
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
    1000: 350000,
    2000: 600000,
    5000: 1200000,
    10000: 2000000
  }

  const tabs = [
    { key: 'front', label: '1. 표지' },
    { key: 'profile', label: '2. 프로필' },
    { key: 'pledges', label: '3. 공약' },
    { key: 'contact', label: '4. 연락처' }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/templates" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">선거공보물 제작</h1>
          <p className="text-sm text-muted-foreground">선거공보물의 각 페이지 정보를 입력하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>

            {/* Preview Tabs */}
            <div className="flex gap-1 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Front Page Preview */}
            {activeTab === 'front' && (
              <div
                className="aspect-[3/4] rounded-lg p-6 flex flex-col border-2"
                style={{ borderColor: formData.primaryColor }}
              >
                <div
                  className="text-center py-2 -mx-6 -mt-6 mb-4"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <span className="text-white font-bold text-sm">{formData.party}</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-sm">사진</span>
                  </div>

                  {formData.number && (
                    <div
                      className="px-4 py-1 rounded-full text-white font-bold text-sm mb-2"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      기호 {formData.number}번
                    </div>
                  )}

                  <h2 className="text-xl font-black text-gray-900">
                    {formData.name || '후보자 이름'}
                  </h2>
                  <p className="text-gray-600 text-sm">{formData.position}</p>
                </div>

                {formData.mainSlogan && (
                  <div
                    className="text-center py-3 -mx-6 -mb-6 mt-4"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <span className="text-white font-bold text-sm">"{formData.mainSlogan}"</span>
                  </div>
                )}
              </div>
            )}

            {/* Profile Preview */}
            {activeTab === 'profile' && (
              <div className="aspect-[3/4] rounded-lg p-6 bg-white border-2 border-gray-200">
                <h3
                  className="text-base font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: formData.primaryColor, color: formData.primaryColor }}
                >
                  후보자 프로필
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">학력</h4>
                    <p className="text-xs text-gray-600 whitespace-pre-line">
                      {formData.education || '학력 정보를 입력하세요'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">경력</h4>
                    <p className="text-xs text-gray-600 whitespace-pre-line">
                      {formData.career || '경력 정보를 입력하세요'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pledges Preview */}
            {activeTab === 'pledges' && (
              <div className="aspect-[3/4] rounded-lg p-6 bg-white border-2 border-gray-200 overflow-auto">
                <h3
                  className="text-base font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: formData.primaryColor, color: formData.primaryColor }}
                >
                  핵심 공약
                </h3>

                <div className="space-y-3">
                  {[1, 2, 3].map((num) => {
                    const title = formData[`pledge${num}Title` as keyof BrochureData] as string
                    const content = formData[`pledge${num}Content` as keyof BrochureData] as string
                    return (
                      <div key={num} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            {num}
                          </span>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {title || `공약 ${num} 제목`}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 ml-7">
                          {content || '공약 내용을 입력하세요'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Contact Preview */}
            {activeTab === 'contact' && (
              <div className="aspect-[3/4] rounded-lg p-6 bg-white border-2 border-gray-200 flex flex-col">
                <h3
                  className="text-base font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: formData.primaryColor, color: formData.primaryColor }}
                >
                  연락처
                </h3>

                <div className="space-y-2 flex-1">
                  {formData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">📞</span>
                      <span className="text-gray-900">{formData.phone}</span>
                    </div>
                  )}
                  {formData.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">✉️</span>
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">🌐</span>
                      <span className="text-gray-900">{formData.website}</span>
                    </div>
                  )}
                </div>

                <div
                  className="text-center py-3 -mx-6 -mb-6 mt-auto"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <span className="text-white font-bold text-sm">{formData.party}</span>
                </div>
              </div>
            )}

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
                  <option value={1000}>1,000부</option>
                  <option value={2000}>2,000부</option>
                  <option value={5000}>5,000부</option>
                  <option value={10000}>10,000부</option>
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
          <div className="lg:col-span-3 space-y-4">
            {/* Tab Buttons */}
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Front Tab */}
            {activeTab === 'front' && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      후보자 사진 <span className="text-red-500">*</span>
                    </label>
                    <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <UploadOutlined className="text-2xl text-gray-400" />
                      <div className="mt-2 text-xs text-gray-500">사진 업로드</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

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

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      메인 슬로건
                    </label>
                    <input
                      type="text"
                      value={formData.mainSlogan}
                      onChange={(e) => handleInputChange('mainSlogan', e.target.value)}
                      placeholder="함께 만드는 새로운 미래"
                      maxLength={30}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.mainSlogan.length}/30</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      대표 색상
                    </label>
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-20 h-10 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      학력
                    </label>
                    <textarea
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="○○대학교 행정학과 졸업&#10;○○대학원 정책학 석사"
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      경력
                    </label>
                    <textarea
                      value={formData.career}
                      onChange={(e) => handleInputChange('career', e.target.value)}
                      placeholder="現 ○○ 위원회 위원&#10;前 ○○구 청년회 회장"
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pledges Tab */}
            {activeTab === 'pledges' && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="space-y-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-3">공약 {num}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">
                            제목
                          </label>
                          <input
                            type="text"
                            value={formData[`pledge${num}Title` as keyof BrochureData] as string}
                            onChange={(e) => handleInputChange(`pledge${num}Title` as keyof BrochureData, e.target.value)}
                            placeholder={`공약 ${num} 제목`}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">
                            내용
                          </label>
                          <textarea
                            value={formData[`pledge${num}Content` as keyof BrochureData] as string}
                            onChange={(e) => handleInputChange(`pledge${num}Content` as keyof BrochureData, e.target.value)}
                            placeholder="공약 세부 내용"
                            rows={2}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      연락처
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="candidate@example.com"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      웹사이트/SNS
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://instagram.com/candidate"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Specs Info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <FileTextOutlined />
                선거공보물 규격 안내
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 규격: 선관위 지정 규격 (A4 또는 지정 크기)</li>
                <li>• 페이지: 4~16면 (선거 종류에 따라 다름)</li>
                <li>• 용지: 선관위 지정 용지</li>
                <li>• 인쇄: 양면 컬러</li>
                <li>• 제출: 선관위 심사 후 배포</li>
                <li>• 제작 기간: 결제 후 5~7일</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
