import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TemplateCategory = 'banner' | 'business_card' | 'flyer' | 'poster' | 'brochure' | 'digital' | 'sticker'
export type TemplateFormat = 'ai' | 'psd' | 'pdf' | 'jpg' | 'png' | 'svg' | 'docx' | 'hwp'
export type TemplateSize = 'A4' | 'A3' | 'A2' | 'A1' | 'B4' | 'B3' | '90x50mm' | '85x55mm' | 'custom'

export interface TemplateFile {
  format: TemplateFormat
  size: string // File size in MB
  downloadUrl: string
  previewUrl: string
}

export interface Template {
  id: string
  title: string
  description: string
  category: TemplateCategory
  tags: string[]
  thumbnail: string
  files: TemplateFile[]
  dimensions: TemplateSize
  isPopular: boolean
  downloadCount: number
  rating: number
  createdAt: string
  updatedAt: string
  author: string
  regulations: string[] // Regulation points to check
  sampleText?: string // For copy samples
  colorScheme: string[]
  isCompliant: boolean // Pre-checked for regulation compliance
}

export interface RegulationGuideline {
  id: string
  title: string
  category: TemplateCategory | 'general'
  description: string
  rules: string[]
  examples: string[]
  penalties: string[]
  references: string[]
}

export interface TemplatesState {
  templates: Template[]
  guidelines: RegulationGuideline[]
  filters: {
    category: TemplateCategory | 'all'
    format: TemplateFormat | 'all'
    size: TemplateSize | 'all'
    popularOnly: boolean
    compliantOnly: boolean
  }
  downloadHistory: string[]
  favoriteTemplates: string[]
}

interface TemplatesActions {
  // Template management
  downloadTemplate: (templateId: string, format: TemplateFormat) => void
  toggleFavorite: (templateId: string) => void
  rateTemplate: (templateId: string, rating: number) => void
  
  // Filters
  setCategoryFilter: (category: TemplateCategory | 'all') => void
  setFormatFilter: (format: TemplateFormat | 'all') => void
  setSizeFilter: (size: TemplateSize | 'all') => void
  setPopularOnlyFilter: (popularOnly: boolean) => void
  setCompliantOnlyFilter: (compliantOnly: boolean) => void
  clearFilters: () => void
  
  // Computed data
  getFilteredTemplates: () => Template[]
  getTemplatesByCategory: () => Record<TemplateCategory, Template[]>
  getPopularTemplates: (limit?: number) => Template[]
  getRecommendedTemplates: () => Template[]
  getGuidelinesByCategory: (category: TemplateCategory | 'general') => RegulationGuideline[]
}

// Mock Korean campaign template data
const mockTemplates: Template[] = [
  {
    id: 'banner-001',
    title: '개혁신당 기본 현수막 템플릿',
    description: '표준 규격에 맞는 개혁신당 현수막 디자인 템플릿',
    category: 'banner',
    tags: ['현수막', '개혁신당', '기본형', '표준규격'],
    thumbnail: '/mock-templates/banner-basic.jpg',
    files: [
      {
        format: 'ai',
        size: '15.2',
        downloadUrl: '/templates/banner-basic.ai',
        previewUrl: '/mock-templates/banner-basic-preview.jpg'
      },
      {
        format: 'pdf',
        size: '8.5',
        downloadUrl: '/templates/banner-basic.pdf',
        previewUrl: '/mock-templates/banner-basic-preview.jpg'
      }
    ],
    dimensions: 'A1',
    isPopular: true,
    downloadCount: 156,
    rating: 4.8,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    author: '개혁신당 디자인팀',
    regulations: [
      '후보자명과 기호 필수 표시',
      '정당명 표기 의무',
      '선거관리위원회 승인필 표시',
      '게시기간 준수 (선거일 전 23일부터 선거일까지)'
    ],
    colorScheme: ['#1890ff', '#ffffff', '#f0f0f0'],
    isCompliant: true
  },
  {
    id: 'card-001', 
    title: '후보자 명함 템플릿 - 클래식',
    description: '정통적인 디자인의 후보자 명함 템플릿',
    category: 'business_card',
    tags: ['명함', '후보자', '클래식', '정통'],
    thumbnail: '/mock-templates/card-classic.jpg',
    files: [
      {
        format: 'ai',
        size: '5.1',
        downloadUrl: '/templates/card-classic.ai',
        previewUrl: '/mock-templates/card-classic-preview.jpg'
      },
      {
        format: 'psd',
        size: '12.3',
        downloadUrl: '/templates/card-classic.psd',
        previewUrl: '/mock-templates/card-classic-preview.jpg'
      }
    ],
    dimensions: '90x50mm',
    isPopular: true,
    downloadCount: 89,
    rating: 4.6,
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
    author: '정치 디자인 스튜디오',
    regulations: [
      '개인정보 최소 표기',
      '정당 로고 사용 승인 확인',
      '선거운동 기간 외 배포 금지'
    ],
    colorScheme: ['#2f54eb', '#ffffff', '#8c8c8c'],
    isCompliant: true
  },
  {
    id: 'flyer-001',
    title: '정책 홍보 전단지 템플릿',
    description: '주요 정책을 효과적으로 전달하는 전단지 디자인',
    category: 'flyer',
    tags: ['전단지', '정책홍보', 'A4', '양면'],
    thumbnail: '/mock-templates/flyer-policy.jpg',
    files: [
      {
        format: 'ai',
        size: '18.7',
        downloadUrl: '/templates/flyer-policy.ai', 
        previewUrl: '/mock-templates/flyer-policy-preview.jpg'
      },
      {
        format: 'hwp',
        size: '2.1',
        downloadUrl: '/templates/flyer-policy.hwp',
        previewUrl: '/mock-templates/flyer-policy-preview.jpg'
      }
    ],
    dimensions: 'A4',
    isPopular: false,
    downloadCount: 34,
    rating: 4.2,
    createdAt: '2024-01-03T11:30:00Z',
    updatedAt: '2024-01-08T13:20:00Z',
    author: '캠페인 컨설팅',
    regulations: [
      '선거공보 신고 의무',
      '배포 장소 및 방법 제한',
      '내용의 사실 확인 필수',
      '상대 후보 비방 금지'
    ],
    sampleText: `개혁신당 ○○○ 후보가 약속드립니다

주요 공약
1. 청년 일자리 창출 - 스타트업 지원 확대
2. 주거 안정 - 청년 전세자금 지원
3. 교육 개혁 - 사교육비 부담 경감
4. 복지 확대 - 기초연금 인상

여러분의 소중한 한 표로 변화를 만들어가겠습니다.`,
    colorScheme: ['#52c41a', '#ffffff', '#1890ff'],
    isCompliant: true
  },
  {
    id: 'poster-001',
    title: '선거 포스터 템플릿 - 모던',
    description: '현대적 감각의 선거 포스터 디자인',
    category: 'poster',
    tags: ['포스터', '모던', '젊은감각', 'A2'],
    thumbnail: '/mock-templates/poster-modern.jpg',
    files: [
      {
        format: 'ai',
        size: '25.4',
        downloadUrl: '/templates/poster-modern.ai',
        previewUrl: '/mock-templates/poster-modern-preview.jpg'
      },
      {
        format: 'pdf',
        size: '12.8',
        downloadUrl: '/templates/poster-modern.pdf',
        previewUrl: '/mock-templates/poster-modern-preview.jpg'
      }
    ],
    dimensions: 'A2',
    isPopular: true,
    downloadCount: 67,
    rating: 4.7,
    createdAt: '2024-01-04T14:00:00Z',
    updatedAt: '2024-01-12T10:15:00Z',
    author: '비주얼 커뮤니케이션',
    regulations: [
      '게시 장소 사전 허가 필수',
      '규격 및 개수 제한 준수',
      '훼손 시 즉시 교체 의무',
      '선거일 후 7일 이내 철거'
    ],
    colorScheme: ['#722ed1', '#ffffff', '#faad14'],
    isCompliant: true
  },
  {
    id: 'digital-001',
    title: 'SNS 배너 템플릿 세트',
    description: '페이스북, 인스타그램용 SNS 배너 템플릿',
    category: 'digital',
    tags: ['SNS', '페이스북', '인스타그램', '디지털'],
    thumbnail: '/mock-templates/sns-banner.jpg',
    files: [
      {
        format: 'psd',
        size: '32.1',
        downloadUrl: '/templates/sns-banner-set.psd',
        previewUrl: '/mock-templates/sns-banner-preview.jpg'
      },
      {
        format: 'jpg',
        size: '4.2',
        downloadUrl: '/templates/sns-banner-set.jpg',
        previewUrl: '/mock-templates/sns-banner-preview.jpg'
      }
    ],
    dimensions: 'custom',
    isPopular: true,
    downloadCount: 123,
    rating: 4.9,
    createdAt: '2024-01-05T16:30:00Z',
    updatedAt: '2024-01-14T09:45:00Z',
    author: '디지털 마케팅팀',
    regulations: [
      'SNS 실명 사용 의무',
      '선거관리위원회 신고 필수',
      '허위정보 유포 금지',
      '온라인 선거운동 시간 제한'
    ],
    colorScheme: ['#1890ff', '#52c41a', '#ffffff'],
    isCompliant: true
  },
  {
    id: 'brochure-001',
    title: '정책 브로셔 템플릿',
    description: '상세한 정책 설명을 위한 3단 브로셔',
    category: 'brochure',
    tags: ['브로셔', '정책설명', '3단접지', 'A4'],
    thumbnail: '/mock-templates/brochure-policy.jpg',
    files: [
      {
        format: 'ai',
        size: '28.9',
        downloadUrl: '/templates/brochure-policy.ai',
        previewUrl: '/mock-templates/brochure-policy-preview.jpg'
      }
    ],
    dimensions: 'A4',
    isPopular: false,
    downloadCount: 21,
    rating: 4.1,
    createdAt: '2024-01-06T13:15:00Z',
    updatedAt: '2024-01-09T11:30:00Z',
    author: '정책 커뮤니케이션',
    regulations: [
      '선거공보 범위 내 제작',
      '정확한 정보 제공 의무',
      '제작비 선거비용 포함',
      '배포 방법 제한 준수'
    ],
    colorScheme: ['#13c2c2', '#ffffff', '#595959'],
    isCompliant: true
  }
]

const mockGuidelines: RegulationGuideline[] = [
  {
    id: 'guide-general',
    title: '선거 홍보물 제작 일반 원칙',
    category: 'general',
    description: '모든 선거 홍보물 제작 시 반드시 준수해야 할 기본 원칙',
    rules: [
      '선거관리위원회 승인 또는 신고 필수',
      '정당 및 후보자 정보 정확 표기',
      '허위사실 유포 절대 금지',
      '상대 후보 비방 및 모독 금지',
      '선거비용 한도 내 제작',
      '제작업체 및 비용 투명 공개'
    ],
    examples: [
      '✅ "○○○ 후보, 개혁신당 기호 ○번"',
      '✅ "주요 공약: 청년 일자리 창출 정책"',
      '❌ "△△△ 후보는 부적절한 과거가 있다"',
      '❌ 선관위 미신고 온라인 배너 게시'
    ],
    penalties: [
      '선거법 위반 시 당선 무효',
      '3년 이하 징역 또는 600만원 이하 벌금',
      '5년간 피선거권 제한',
      '정당 활동 제한 조치'
    ],
    references: [
      '공직선거법 제93조(선거공보)',
      '공직선거법 제90조(기부행위의 제한)',
      '선거관리위원회 선거공보 제작 가이드라인'
    ]
  },
  {
    id: 'guide-banner',
    title: '현수막 제작 및 게시 규정',
    category: 'banner',
    description: '선거 현수막 제작 및 게시에 관한 세부 규정',
    rules: [
      '지정된 장소에만 게시 가능',
      '규격: 세로 1m 이하, 가로 10m 이하',
      '개수 제한: 선거구별 상한선 준수',
      '게시 기간: 선거일 전 23일부터 선거일까지',
      '내용: 정당명, 후보자명, 기호 필수 표기',
      '철거: 선거일 후 7일 이내'
    ],
    examples: [
      '✅ 지정된 가로등에 규격에 맞게 부착',
      '✅ "개혁신당 김○○ 기호 3번"',
      '❌ 사유지에 무단 부착',
      '❌ 제한 개수 초과 게시'
    ],
    penalties: [
      '불법 게시 시 300만원 이하 벌금',
      '미철거 시 50만원 이하 과태료',
      '규격 위반 시 경고 및 철거 명령'
    ],
    references: [
      '공직선거법 제84조(선거벽보)',
      '각 지역 선거관리위원회 현수막 게시 규정'
    ]
  },
  {
    id: 'guide-digital',
    title: '온라인 선거운동 규정',
    category: 'digital',
    description: 'SNS 및 온라인 플랫폼에서의 선거운동 규정',
    rules: [
      '실명 사용 의무',
      '선거관리위원회 홈페이지 신고',
      '영상물의 경우 사전 승인 필수',
      '선거일 0시부터 투표마감까지 중단',
      '허위정보 및 흑색선전 금지',
      '미성년자 선거운동 참여 금지'
    ],
    examples: [
      '✅ 실명으로 SNS 계정 운영',
      '✅ 정책 설명 영상 선관위 신고',
      '❌ 가명으로 온라인 활동',
      '❌ 선거일 투표 중 SNS 게시'
    ],
    penalties: [
      '허위정보 유포 시 7년 이하 징역',
      '미신고 영상 게시 시 500만원 이하 벌금',
      '실명 미사용 시 300만원 이하 벌금'
    ],
    references: [
      '공직선거법 제82조의4(인터넷선거운동)',
      '공직선거법 제82조의6(정보통신망선거운동)'
    ]
  }
]

export const useTemplatesStore = create<TemplatesState & TemplatesActions>()(
  persist(
    (set, get) => ({
      templates: mockTemplates,
      guidelines: mockGuidelines,
      filters: {
        category: 'all',
        format: 'all',
        size: 'all',
        popularOnly: false,
        compliantOnly: false
      },
      downloadHistory: [],
      favoriteTemplates: [],

      // Template management
      downloadTemplate: (templateId, format) => {
        set((state) => ({
          downloadHistory: [templateId, ...state.downloadHistory.filter(id => id !== templateId)].slice(0, 50),
          templates: state.templates.map(template =>
            template.id === templateId
              ? { ...template, downloadCount: template.downloadCount + 1 }
              : template
          )
        }))
      },

      toggleFavorite: (templateId) => {
        set((state) => {
          const isFavorite = state.favoriteTemplates.includes(templateId)
          return {
            favoriteTemplates: isFavorite
              ? state.favoriteTemplates.filter(id => id !== templateId)
              : [...state.favoriteTemplates, templateId]
          }
        })
      },

      rateTemplate: (templateId, rating) => {
        set((state) => ({
          templates: state.templates.map(template =>
            template.id === templateId
              ? { ...template, rating: (template.rating + rating) / 2 }
              : template
          )
        }))
      },

      // Filters
      setCategoryFilter: (category) =>
        set((state) => ({ filters: { ...state.filters, category } })),

      setFormatFilter: (format) =>
        set((state) => ({ filters: { ...state.filters, format } })),

      setSizeFilter: (size) =>
        set((state) => ({ filters: { ...state.filters, size } })),

      setPopularOnlyFilter: (popularOnly) =>
        set((state) => ({ filters: { ...state.filters, popularOnly } })),

      setCompliantOnlyFilter: (compliantOnly) =>
        set((state) => ({ filters: { ...state.filters, compliantOnly } })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            category: 'all',
            format: 'all',
            size: 'all',
            popularOnly: false,
            compliantOnly: false
          }
        })),

      // Computed data
      getFilteredTemplates: () => {
        const { templates, filters } = get()
        
        return templates.filter(template => {
          if (filters.category !== 'all' && template.category !== filters.category) return false
          if (filters.format !== 'all' && !template.files.some(file => file.format === filters.format)) return false
          if (filters.size !== 'all' && template.dimensions !== filters.size) return false
          if (filters.popularOnly && !template.isPopular) return false
          if (filters.compliantOnly && !template.isCompliant) return false
          
          return true
        })
      },

      getTemplatesByCategory: () => {
        const { templates } = get()
        const categories: TemplateCategory[] = ['banner', 'business_card', 'flyer', 'poster', 'brochure', 'digital', 'sticker']
        
        return categories.reduce((acc, category) => {
          acc[category] = templates.filter(template => template.category === category)
          return acc
        }, {} as Record<TemplateCategory, Template[]>)
      },

      getPopularTemplates: (limit = 5) => {
        const { templates } = get()
        return [...templates]
          .filter(template => template.isPopular)
          .sort((a, b) => b.downloadCount - a.downloadCount)
          .slice(0, limit)
      },

      getRecommendedTemplates: () => {
        const { templates, downloadHistory } = get()
        
        // Recommend based on download history and rating
        return templates
          .filter(template => !downloadHistory.includes(template.id))
          .sort((a, b) => {
            // Sort by rating and popularity
            const aScore = a.rating * (a.isPopular ? 1.2 : 1)
            const bScore = b.rating * (b.isPopular ? 1.2 : 1)
            return bScore - aScore
          })
          .slice(0, 4)
      },

      getGuidelinesByCategory: (category) => {
        const { guidelines } = get()
        return guidelines.filter(guideline => 
          guideline.category === category || guideline.category === 'general'
        )
      }
    }),
    {
      name: 'templates-storage',
      partialize: (state) => ({
        downloadHistory: state.downloadHistory,
        favoriteTemplates: state.favoriteTemplates,
        filters: state.filters
      })
    }
  )
)