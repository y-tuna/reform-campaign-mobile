import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ContentCategory = 'policy' | 'election_law' | 'faq' | 'case_study' | 'guide'
export type ContentPriority = 'high' | 'medium' | 'low'

export interface PolicyContent {
  id: string
  title: string
  summary: string
  category: ContentCategory
  priority: ContentPriority
  content: string // Markdown content
  tags: string[]
  lastUpdated: string
  author: string
  isBookmarked: boolean
  viewCount: number
  relatedContentIds: string[]
}

export interface ContentFilter {
  category: ContentCategory | 'all'
  priority: ContentPriority | 'all'
  searchTerm: string
  tags: string[]
  bookmarkedOnly: boolean
}

export interface PoliciesState {
  contents: PolicyContent[]
  filters: ContentFilter
  selectedContent: PolicyContent | null
  recentlyViewed: string[]
  bookmarkedIds: string[]
}

interface PoliciesActions {
  // Content management
  addContent: (content: Omit<PolicyContent, 'id' | 'viewCount'>) => void
  updateContent: (id: string, updates: Partial<PolicyContent>) => void
  deleteContent: (id: string) => void
  getContentById: (id: string) => PolicyContent | undefined
  
  // View management
  viewContent: (id: string) => void
  setSelectedContent: (content: PolicyContent | null) => void
  
  // Bookmarks
  toggleBookmark: (id: string) => void
  
  // Filtering and search
  setSearchTerm: (term: string) => void
  setCategoryFilter: (category: ContentCategory | 'all') => void
  setPriorityFilter: (priority: ContentPriority | 'all') => void
  setTagFilter: (tags: string[]) => void
  setBookmarkedOnly: (bookmarkedOnly: boolean) => void
  clearFilters: () => void
  
  // Computed data
  getFilteredContents: () => PolicyContent[]
  getContentsByCategory: () => Record<ContentCategory, PolicyContent[]>
  getPopularContent: (limit: number) => PolicyContent[]
  getRelatedContent: (contentId: string) => PolicyContent[]
}

// Korean election and campaign policy data
const mockPolicyContents: PolicyContent[] = [
  {
    id: 'policy-1',
    title: '개혁신당 핵심 정책 가이드',
    summary: '개혁신당의 주요 정책 방향과 공약사항 종합 가이드',
    category: 'policy',
    priority: 'high',
    content: `# 개혁신당 핵심 정책 가이드

## 경제정책
### 중소기업 지원 확대
- 창업 지원금 확대: 최대 5,000만원
- 세제 혜택 강화: 법인세 감면 3년 연장
- 규제 완화: 원스톱 허가 시스템 도입

### 일자리 창출
- 청년 취업 지원 프로그램 확대
- 직업훈련 기회 확산
- 근로시간 단축을 통한 일자리 나누기

## 사회정책
### 교육개혁
- 사교육비 부담 경감
- 공교육 질 개선
- 대학 등록금 부담 완화

### 주거안정
- 공공주택 공급 확대
- 청년 주거지원 강화
- 전월세 안정화 정책

## 환경정책
- 탄소중립 2050 달성
- 신재생 에너지 확대
- 녹색교통 인프라 구축`,
    tags: ['정책', '공약', '경제', '사회', '환경'],
    lastUpdated: '2024-01-15T10:00:00Z',
    author: '개혁신당 정책위원회',
    isBookmarked: true,
    viewCount: 245,
    relatedContentIds: ['policy-2', 'faq-1']
  },
  {
    id: 'law-1',
    title: '공직선거법 주요 조항 해설',
    summary: '선거 운동 중 준수해야 할 공직선거법의 핵심 내용',
    category: 'election_law',
    priority: 'high',
    content: `# 공직선거법 주요 조항 해설

## 제58조 (선거운동의 정의)
선거운동이란 당선되거나 되게 하거나 되지 못하게 하기 위한 행위를 말합니다.

### 허용되는 선거운동
- 정당한 정치활동
- 선거공보 배포
- 합법적인 연설회 개최
- SNS를 통한 정책 홍보

### 금지되는 행위
- 매수행위 및 기부행위
- 허위사실 유포
- 미성년자 선거운동 참여
- 국가기관의 선거개입

## 제90조 (기부행위의 제한)
후보자와 그 가족은 선거에 관하여 어떠한 기부행위도 할 수 없습니다.

### 예외 사항
- 본인 또는 가족의 관혼상제
- 종교적·도덕적 의무에 따른 기부 (10만원 이하)

## 제255조 (벌칙)
이 법을 위반한 경우의 처벌 규정

### 주요 처벌 내용
- 당선무효형: 당선된 경우에도 무효
- 선거권·피선거권 제한
- 벌금 및 징역형`,
    tags: ['선거법', '법령', '준수사항', '처벌'],
    lastUpdated: '2024-01-12T15:30:00Z',
    author: '중앙선거관리위원회',
    isBookmarked: false,
    viewCount: 186,
    relatedContentIds: ['law-2', 'faq-3']
  },
  {
    id: 'faq-1',
    title: '선거운동 관련 자주 묻는 질문',
    summary: '후보자들이 가장 많이 문의하는 선거운동 관련 FAQ',
    category: 'faq',
    priority: 'high',
    content: `# 선거운동 관련 자주 묻는 질문

## Q1. SNS를 통한 선거운동이 가능한가요?
**A.** 네, 가능합니다. 다만 다음 사항을 준수해야 합니다:
- 실명 사용 필수
- 허위사실 유포 금지
- 비방·모독 금지
- 영상물의 경우 선관위 신고 필요

## Q2. 선거기간 중 현수막 게시는 어떻게 하나요?
**A.** 다음 절차를 따라주세요:
1. 관할 선관위에 사전 신고
2. 지정된 장소에만 게시 가능
3. 규격 준수 (가로 10m 이하)
4. 선거일 후 7일 이내 철거

## Q3. 유권자에게 명함을 나눠줄 수 있나요?
**A.** 선거운동 기간 중에는 선거법에 따른 선거공보만 배포 가능합니다.
일반 명함 배포는 기부행위로 간주될 수 있으니 주의하세요.

## Q4. 선거사무소 설치는 언제부터 가능한가요?
**A.** 후보자 등록일부터 가능합니다:
- 주된 선거사무소 1개소
- 보조선거사무소는 선거구 규모에 따라 제한
- 설치신고서 제출 필수

## Q5. 개인방송을 통한 선거운동은 어떻게 하나요?
**A.** 인터넷을 이용한 선거운동으로 가능하지만:
- 실명 확인 필수
- 선관위 홈페이지 신고
- 영상 저장 및 보관 의무
- 선거일 0시부터 투표마감시까지 중단`,
    tags: ['FAQ', '선거운동', '질문', '답변'],
    lastUpdated: '2024-01-10T09:00:00Z',
    author: '개혁신당 선거대책위원회',
    isBookmarked: true,
    viewCount: 312,
    relatedContentIds: ['law-1', 'guide-1']
  },
  {
    id: 'case-1',
    title: '성공적인 디지털 선거운동 사례',
    summary: '해외 및 국내의 성공적인 디지털 선거운동 사례 분석',
    category: 'case_study',
    priority: 'medium',
    content: `# 성공적인 디지털 선거운동 사례

## 국내 사례: A 후보자의 SNS 마케팅
### 전략 개요
- 플랫폼별 차별화된 콘텐츠 제작
- 양방향 소통 중심의 캠페인
- 데이터 기반 타겟팅

### 주요 성과
- 팔로워 증가율: 300%
- 참여율(engagement): 8.5%
- 청년층 지지율 상승: 15%

### 성공 요인
1. **진정성 있는 소통**
   - 후보자 직접 답변
   - 일상적 모습 공유
   - 정책을 쉽게 설명

2. **크리에이티브한 콘텐츠**
   - 인포그래픽 활용
   - 짧은 영상 제작
   - 챌린지 이벤트

## 해외 사례: 영국 B 의원의 TikTok 활용
### 전략 개요
- 젊은 세대 대상 정책 홍보
- 트렌드에 맞춘 콘텐츠 제작
- 바이럴 효과 극대화

### 주요 성과  
- 조회수: 500만 회 돌파
- 청년층 인지도: 85% 상승
- 선거 결과: 20대 지지율 1위

## 교훈 및 시사점
1. 플랫폼별 특성 이해 필요
2. 타겟 오디언스 명확화
3. 지속적인 모니터링과 개선
4. 법적 가이드라인 준수`,
    tags: ['사례연구', 'SNS', '디지털캠페인', '성공사례'],
    lastUpdated: '2024-01-08T14:20:00Z',
    author: '정치커뮤니케이션연구소',
    isBookmarked: false,
    viewCount: 89,
    relatedContentIds: ['guide-2', 'policy-1']
  },
  {
    id: 'guide-1',
    title: '후보자를 위한 미디어 대응 가이드',
    summary: '언론 인터뷰, 토론회, 기자회견 등 미디어 대응 실무 가이드',
    category: 'guide',
    priority: 'medium',
    content: `# 후보자를 위한 미디어 대응 가이드

## 언론 인터뷰 준비사항
### 사전 준비
1. **메시지 포인트 정리**
   - 핵심 메시지 3개 이내
   - 예상 질문과 답변 준비
   - 어려운 질문 대응 시나리오

2. **배경 지식 숙지**
   - 최신 이슈 파악
   - 상대 후보 정책 분석
   - 지역 현안 이해

### 인터뷰 진행 시 유의사항
- 침착하고 자신감 있는 태도
- 간결하고 명확한 답변
- 감정적 대응 자제
- 사실에 기반한 발언

## 토론회 참여 전략
### 준비 단계
1. 토론 형식 파악
2. 참여자 분석
3. 핵심 어필 포인트 설정
4. 모의 토론 연습

### 토론 중 전략
- 공격보다는 정책 중심 접근
- 구체적 수치와 사례 활용
- 상대방 존중하는 자세
- 시청자를 의식한 발언

## 기자회견 운영법
### 회견 준비
- 발표 자료 사전 배포
- Q&A 예상 문답 준비
- 장소와 시간 선정
- 보도자료 작성

### 회견 진행
1. 모두발언 (5분 이내)
2. 질의응답 (20-30분)
3. 마무리 멘트

## 위기 상황 대응
### 즉각 대응이 필요한 상황
- 허위 정보 유포
- 인신공격성 비판
- 과거 이슈 재제기

### 대응 원칙
1. 신속한 사실 확인
2. 명확한 입장 표명
3. 적극적 해명
4. 재발 방지 약속`,
    tags: ['가이드', '미디어', '인터뷰', '토론회'],
    lastUpdated: '2024-01-05T11:45:00Z',
    author: '미디어 전략 컨설팅',
    isBookmarked: false,
    viewCount: 156,
    relatedContentIds: ['case-1', 'faq-1']
  }
]

export const usePoliciesStore = create<PoliciesState & PoliciesActions>()( 
  persist(
    (set, get) => ({
      contents: mockPolicyContents,
      filters: {
        category: 'all',
        priority: 'all',
        searchTerm: '',
        tags: [],
        bookmarkedOnly: false
      },
      selectedContent: null,
      recentlyViewed: [],
      bookmarkedIds: ['policy-1', 'faq-1'],

      // Content management
      addContent: (content) => {
        const newContent: PolicyContent = {
          ...content,
          id: `content-${Date.now()}`,
          viewCount: 0
        }
        set((state) => ({
          contents: [newContent, ...state.contents]
        }))
      },

      updateContent: (id, updates) =>
        set((state) => ({
          contents: state.contents.map(content =>
            content.id === id ? { ...content, ...updates } : content
          )
        })),

      deleteContent: (id) =>
        set((state) => ({
          contents: state.contents.filter(content => content.id !== id),
          bookmarkedIds: state.bookmarkedIds.filter(bookmarkId => bookmarkId !== id),
          recentlyViewed: state.recentlyViewed.filter(viewId => viewId !== id)
        })),

      getContentById: (id) => {
        const { contents } = get()
        return contents.find(content => content.id === id)
      },

      // View management
      viewContent: (id) => {
        const { updateContent } = get()
        set((state) => {
          const recentlyViewed = [id, ...state.recentlyViewed.filter(viewId => viewId !== id)].slice(0, 10)
          return { recentlyViewed }
        })
        
        // Increment view count
        const content = get().getContentById(id)
        if (content) {
          updateContent(id, { viewCount: content.viewCount + 1 })
        }
      },

      setSelectedContent: (content) => set({ selectedContent: content }),

      // Bookmarks
      toggleBookmark: (id) =>
        set((state) => {
          const isBookmarked = state.bookmarkedIds.includes(id)
          const bookmarkedIds = isBookmarked
            ? state.bookmarkedIds.filter(bookmarkId => bookmarkId !== id)
            : [...state.bookmarkedIds, id]
          
          // Update content bookmark status
          const contents = state.contents.map(content =>
            content.id === id ? { ...content, isBookmarked: !isBookmarked } : content
          )
          
          return { bookmarkedIds, contents }
        }),

      // Filtering and search
      setSearchTerm: (searchTerm) =>
        set((state) => ({
          filters: { ...state.filters, searchTerm }
        })),

      setCategoryFilter: (category) =>
        set((state) => ({
          filters: { ...state.filters, category }
        })),

      setPriorityFilter: (priority) =>
        set((state) => ({
          filters: { ...state.filters, priority }
        })),

      setTagFilter: (tags) =>
        set((state) => ({
          filters: { ...state.filters, tags }
        })),

      setBookmarkedOnly: (bookmarkedOnly) =>
        set((state) => ({
          filters: { ...state.filters, bookmarkedOnly }
        })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            category: 'all',
            priority: 'all', 
            searchTerm: '',
            tags: [],
            bookmarkedOnly: false
          }
        })),

      // Computed data
      getFilteredContents: () => {
        const { contents, filters } = get()
        
        return contents.filter(content => {
          // Category filter
          if (filters.category !== 'all' && content.category !== filters.category) {
            return false
          }
          
          // Priority filter
          if (filters.priority !== 'all' && content.priority !== filters.priority) {
            return false
          }
          
          // Search term filter
          if (filters.searchTerm && !content.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
              !content.summary.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
              !content.content.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false
          }
          
          // Tags filter
          if (filters.tags.length > 0 && !filters.tags.some(tag => content.tags.includes(tag))) {
            return false
          }
          
          // Bookmarked only filter
          if (filters.bookmarkedOnly && !content.isBookmarked) {
            return false
          }
          
          return true
        })
      },

      getContentsByCategory: () => {
        const { contents } = get()
        const categories: ContentCategory[] = ['policy', 'election_law', 'faq', 'case_study', 'guide']
        
        return categories.reduce((acc, category) => {
          acc[category] = contents.filter(content => content.category === category)
          return acc
        }, {} as Record<ContentCategory, PolicyContent[]>)
      },

      getPopularContent: (limit = 5) => {
        const { contents } = get()
        return [...contents]
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, limit)
      },

      getRelatedContent: (contentId) => {
        const { contents, getContentById } = get()
        const content = getContentById(contentId)
        
        if (!content) return []
        
        return contents.filter(c => 
          content.relatedContentIds.includes(c.id) ||
          c.relatedContentIds.includes(contentId) ||
          (c.id !== contentId && c.category === content.category)
        ).slice(0, 3)
      }
    }),
    {
      name: 'policies-storage',
      partialize: (state) => ({
        bookmarkedIds: state.bookmarkedIds,
        recentlyViewed: state.recentlyViewed,
        filters: state.filters
      })
    }
  )
)