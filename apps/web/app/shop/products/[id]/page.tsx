'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SaveOutlined, EyeOutlined, ShoppingCartOutlined, InfoCircleOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import Navigation from '../../../components/Navigation'
import { message } from 'antd'

interface TemplateOption {
  option_key: string
  option_name: string
  description: string
  preview_url?: string
}

interface FormField {
  field_id: string
  field_type: 'text' | 'textarea' | 'table' | 'image' | 'list' | 'select'
  label: string
  placeholder?: string
  max_chars?: number
  max_lines?: number
  required: boolean
  options?: string[]
}

// Mock 데이터
const mockProductDetail = {
  id: 'prod_002',
  name: '선거 공보 (전단지)',
  description: 'A4 전단지 형태의 선거 공보물',
  price: 180000,
  min_qty: 5000,
  requires_party_hq_copy: true,
  product_type: 'print' as const,
  estimated_days: '5-7일',
  template_options: [
    {
      option_key: 'A',
      option_name: '기본형 A',
      description: '텍스트 중심 레이아웃',
      preview_url: '/templates/flyer-a-preview.jpg'
    },
    {
      option_key: 'B',
      option_name: '이미지형 B',
      description: '후보자 사진 강조 레이아웃',
      preview_url: '/templates/flyer-b-preview.jpg'
    },
    {
      option_key: 'C',
      option_name: '공약형 C',
      description: '공약 나열 중심 레이아웃',
      preview_url: '/templates/flyer-c-preview.jpg'
    }
  ] as TemplateOption[]
}

const mockTemplateFields: Record<string, FormField[]> = {
  'A': [
    { field_id: 'candidate_name', field_type: 'text', label: '후보자 이름', placeholder: '홍길동', max_chars: 10, required: true },
    { field_id: 'party_name', field_type: 'text', label: '정당명', placeholder: '개혁신당', max_chars: 20, required: true },
    { field_id: 'district', field_type: 'text', label: '지역구', placeholder: '서울 강남구', max_chars: 30, required: true },
    { field_id: 'slogan', field_type: 'textarea', label: '슬로건', placeholder: '변화와 혁신을 약속합니다', max_chars: 100, max_lines: 3, required: true },
    { field_id: 'bio', field_type: 'textarea', label: '약력', placeholder: '주요 경력을 입력하세요', max_chars: 500, max_lines: 10, required: true },
    { field_id: 'promises', field_type: 'list', label: '공약 (최대 5개)', placeholder: '공약을 입력하세요', max_lines: 5, required: true },
    { field_id: 'candidate_photo', field_type: 'image', label: '후보자 사진', required: true },
    { field_id: 'contact', field_type: 'text', label: '연락처', placeholder: '010-1234-5678', max_chars: 20, required: false }
  ],
  'B': [
    { field_id: 'candidate_name', field_type: 'text', label: '후보자 이름', placeholder: '홍길동', max_chars: 10, required: true },
    { field_id: 'party_name', field_type: 'text', label: '정당명', placeholder: '개혁신당', max_chars: 20, required: true },
    { field_id: 'district', field_type: 'text', label: '지역구', placeholder: '서울 강남구', max_chars: 30, required: true },
    { field_id: 'candidate_photo_main', field_type: 'image', label: '메인 후보자 사진', required: true },
    { field_id: 'slogan', field_type: 'text', label: '슬로건', placeholder: '변화와 혁신', max_chars: 50, required: true },
    { field_id: 'top_promise', field_type: 'textarea', label: '핵심 공약', placeholder: '가장 중요한 공약', max_chars: 200, max_lines: 4, required: true }
  ],
  'C': [
    { field_id: 'candidate_name', field_type: 'text', label: '후보자 이름', placeholder: '홍길동', max_chars: 10, required: true },
    { field_id: 'party_name', field_type: 'text', label: '정당명', placeholder: '개혁신당', max_chars: 20, required: true },
    { field_id: 'district', field_type: 'text', label: '지역구', placeholder: '서울 강남구', max_chars: 30, required: true },
    { field_id: 'promises', field_type: 'list', label: '5대 공약', placeholder: '공약 항목', max_lines: 5, required: true },
    { field_id: 'candidate_photo', field_type: 'image', label: '후보자 사진', required: true }
  ]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product_id = params.id as string

  const [selectedOption, setSelectedOption] = useState<string>('A')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>({})
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [quantity, setQuantity] = useState(mockProductDetail.min_qty)

  const currentFields = mockTemplateFields[selectedOption] || []

  // Auto-save (mock)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        console.log('Auto-saving draft...', formData)
        setLastSaved(new Date())
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [formData])

  const handleFieldChange = (field_id: string, value: any) => {
    setFormData(prev => ({ ...prev, [field_id]: value }))
  }

  const handleImageUpload = (field_id: string, file: File) => {
    setUploadedImages(prev => ({ ...prev, [field_id]: file }))
    handleFieldChange(field_id, URL.createObjectURL(file))
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastSaved(new Date())
      message.success('임시저장되었습니다')
    } catch (error) {
      message.error('임시저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    // Validation
    const missingFields = currentFields
      .filter(field => field.required)
      .filter(field => !formData[field.field_id])
      .map(field => field.label)

    if (missingFields.length > 0) {
      message.error(`필수 항목을 입력해주세요: ${missingFields.join(', ')}`)
      return
    }

    message.loading('미리보기 생성 중...', 0)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.destroy()
      router.push(`/shop/orders/draft-preview?product_id=${product_id}&option=${selectedOption}`)
    } catch (error) {
      message.destroy()
      message.error('미리보기 생성 실패')
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.field_id] || ''

    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.field_id, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.max_chars}
            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        )

      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.field_id, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.max_chars}
              rows={field.max_lines || 4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            {field.max_chars && (
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {value.length} / {field.max_chars}자
              </div>
            )}
          </div>
        )

      case 'list':
        const listItems = value ? (Array.isArray(value) ? value : value.split('\n')) : ['']
        return (
          <div className="space-y-2">
            {listItems.map((item: string, idx: number) => (
              <input
                key={idx}
                type="text"
                value={item}
                onChange={(e) => {
                  const newList = [...listItems]
                  newList[idx] = e.target.value
                  handleFieldChange(field.field_id, newList.filter(i => i))
                }}
                placeholder={`${field.placeholder} ${idx + 1}`}
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ))}
            {listItems.length < (field.max_lines || 5) && (
              <button
                type="button"
                onClick={() => handleFieldChange(field.field_id, [...listItems, ''])}
                className="text-sm text-primary hover:underline"
              >
                + 항목 추가
              </button>
            )}
          </div>
        )

      case 'image':
        return (
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    message.error('파일 크기는 10MB 이하여야 합니다')
                    return
                  }
                  handleImageUpload(field.field_id, file)
                }
              }}
              className="hidden"
              id={`upload-${field.field_id}`}
            />
            <label
              htmlFor={`upload-${field.field_id}`}
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              {value ? (
                <div className="relative w-full h-full">
                  <img src={value} alt="Preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="text-center">
                  <UploadOutlined className="text-2xl text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">클릭하여 이미지 업로드</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG (최대 10MB)</p>
                </div>
              )}
            </label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            ← 목록으로 돌아가기
          </button>
          <h1 className="text-2xl font-bold text-foreground mb-2">{mockProductDetail.name}</h1>
          <p className="text-sm text-muted-foreground">{mockProductDetail.description}</p>
        </div>

        {/* Auto-save Status */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saving ? (
                <>
                  <LoadingOutlined className="text-primary" />
                  <span className="text-sm text-muted-foreground">저장 중...</span>
                </>
              ) : (
                <>
                  <SaveOutlined className="text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    {lastSaved ? `마지막 저장: ${lastSaved.toLocaleTimeString()}` : '자동 저장 대기'}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              수동 저장
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Options & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Options */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">템플릿 선택</h2>
              <div className="grid grid-cols-3 gap-4">
                {mockProductDetail.template_options.map((option) => (
                  <button
                    key={option.option_key}
                    onClick={() => setSelectedOption(option.option_key)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedOption === option.option_key
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">{option.option_key}</span>
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-1">{option.option_name}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">내용 입력</h2>
              <div className="space-y-5">
                {currentFields.map((field) => (
                  <div key={field.field_id}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary & Actions */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">주문 요약</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">단가</span>
                  <span className="font-medium">{mockProductDetail.price.toLocaleString()}원</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">수량</span>
                  </div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || mockProductDetail.min_qty)}
                    min={mockProductDetail.min_qty}
                    step={mockProductDetail.min_qty}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    최소 {mockProductDetail.min_qty.toLocaleString()}개
                  </p>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-border">
                  <span className="font-semibold">총 금액</span>
                  <span className="font-bold text-lg text-primary">
                    {(mockProductDetail.price * quantity).toLocaleString()}원
                  </span>
                </div>
              </div>

              {mockProductDetail.requires_party_hq_copy && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-800">
                    <InfoCircleOutlined className="mr-1" />
                    중앙당 1부 별도 배송
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handlePreview}
                  className="w-full px-4 py-3 bg-card border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <EyeOutlined />
                  미리보기
                </button>
                <button
                  onClick={handlePreview}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartOutlined />
                  주문하기
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <p>• 제작 기간: {mockProductDetail.estimated_days}</p>
                <p>• 미리보기는 Draft당 2회 무료</p>
                <p>• 입력 내용은 자동 저장됩니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
