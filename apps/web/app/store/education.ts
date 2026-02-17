import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ContentType = 'guidebook' | 'video' | 'tutorial' | 'scenario' | 'manual'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type EducationCategory = 'behavior' | 'communication' | 'legal' | 'strategy' | 'etiquette' | 'crisis'

export interface VideoContent {
  url: string
  duration: number // in seconds
  thumbnail: string
  subtitles?: string
  quality: string[]
}

export interface EducationContent {
  id: string
  title: string
  description: string
  category: EducationCategory
  type: ContentType
  difficulty: DifficultyLevel
  content?: string // Markdown content for guides
  video?: VideoContent
  estimatedTime: number // in minutes
  tags: string[]
  prerequisites: string[]
  objectives: string[]
  createdAt: string
  updatedAt: string
  author: string
  isRequired: boolean
  isCompleted: boolean
  progress: number // 0-100
  rating: number
  viewCount: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  category: EducationCategory
  contents: string[] // Content IDs in order
  estimatedTotalTime: number
  difficulty: DifficultyLevel
  isCompleted: boolean
  progress: number
}

export interface EducationState {
  contents: EducationContent[]
  learningPaths: LearningPath[]
  currentContent: EducationContent | null
  completedContents: string[]
  bookmarkedContents: string[]
  filters: {
    category: EducationCategory | 'all'
    type: ContentType | 'all'
    difficulty: DifficultyLevel | 'all'
    completedOnly: boolean
    requiredOnly: boolean
  }
}

interface EducationActions {
  // Content management
  setCurrentContent: (content: EducationContent | null) => void
  markContentCompleted: (contentId: string, progress?: number) => void
  updateContentProgress: (contentId: string, progress: number) => void
  incrementViewCount: (contentId: string) => void
  
  // Bookmarks
  toggleBookmark: (contentId: string) => void
  
  // Filters
  setCategoryFilter: (category: EducationCategory | 'all') => void
  setTypeFilter: (type: ContentType | 'all') => void
  setDifficultyFilter: (difficulty: DifficultyLevel | 'all') => void
  setCompletedOnlyFilter: (completedOnly: boolean) => void
  setRequiredOnlyFilter: (requiredOnly: boolean) => void
  clearFilters: () => void
  
  // Computed data
  getFilteredContents: () => EducationContent[]
  getContentsByCategory: () => Record<EducationCategory, EducationContent[]>
  getRecommendedContent: () => EducationContent[]
  getLearningPathProgress: (pathId: string) => number
}

// Mock Korean candidate education content
const mockEducationContents: EducationContent[] = [
  {
    id: 'guide-behavior-1',
    title: '후보자 기본 매너와 에티켓',
    description: '선거 기간 중 후보자가 지켜야 할 기본적인 매너와 에티켓 가이드',
    category: 'etiquette',
    type: 'guidebook',
    difficulty: 'beginner',
    content: `# 후보자 기본 매너와 에티켓

## 인사와 악수법
### 올바른 인사법
- 상대방의 눈을 보며 진심 어린 미소
- 적절한 목소리 크기와 톤 유지
- 상황에 맞는 인사말 선택

### 악수 에티켓
- 적당한 힘으로 2-3초간 유지
- 먼저 손을 내미는 것이 적극적 이미지
- 양손 악수는 특별한 경우에만 사용

## 복장과 외모 관리
### 기본 복장 원칙
- 깔끔하고 단정한 차림
- 상황에 맞는 복장 선택
- 과도한 장신구나 화려한 색상 피하기

### 외모 관리
- 정기적인 헤어케어
- 적절한 메이크업과 스킨케어
- 건강한 체중 유지

## 대화와 소통 매너
### 경청의 자세
- 상대방 말을 끝까지 듣기
- 고개 끄덕이며 관심 표현
- 적절한 맞장구와 반응

### 대화 시 주의사항
- 정치적 논쟁보다는 정책 설명 중심
- 상대방의 의견 존중
- 감정적 대응 피하기`,
    estimatedTime: 15,
    tags: ['매너', '에티켓', '인사법', '복장'],
    prerequisites: [],
    objectives: [
      '올바른 인사법과 악수법 습득',
      '상황에 맞는 복장 선택 능력',
      '효과적인 대화 및 소통 기법 이해'
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    author: '정치 매너 컨설팅',
    isRequired: true,
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    viewCount: 245
  },
  {
    id: 'video-communication-1',
    title: '효과적인 연설과 발표 기법',
    description: '대중 앞에서의 연설과 발표 시 필요한 실전 기법과 노하우',
    category: 'communication',
    type: 'video',
    difficulty: 'intermediate',
    video: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Mock URL
      duration: 1200, // 20 minutes
      thumbnail: '/mock-videos/speech-techniques.jpg',
      subtitles: '/mock-videos/speech-subtitles.vtt',
      quality: ['1080p', '720p', '480p']
    },
    estimatedTime: 20,
    tags: ['연설', '발표', '대중연설', '보이스트레이닝'],
    prerequisites: ['guide-behavior-1'],
    objectives: [
      '효과적인 연설 구조 이해',
      '목소리와 제스처 활용법',
      '청중과의 소통 기법 습득'
    ],
    createdAt: '2024-01-02T14:00:00Z',
    updatedAt: '2024-01-02T14:00:00Z',
    author: '스피치 전문강사',
    isRequired: true,
    isCompleted: false,
    progress: 0,
    rating: 4.9,
    viewCount: 189
  },
  {
    id: 'scenario-crisis-1',
    title: '위기상황 대응 시뮬레이션',
    description: '선거 기간 중 발생할 수 있는 다양한 위기상황별 대응 시나리오',
    category: 'crisis',
    type: 'scenario',
    difficulty: 'advanced',
    content: `# 위기상황 대응 시뮬레이션

## 시나리오 1: 허위정보 유포 대응
### 상황 설정
온라인 커뮤니티에서 후보자에 대한 허위정보가 급속도로 확산되고 있는 상황

### 대응 단계
1. **즉시 대응팀 소집 (30분 이내)**
   - 선거대책위원장, 홍보팀장, 법무팀 참여
   - 상황 파악 및 사실관계 확인

2. **공식 입장 발표 (2시간 이내)**
   - 명확한 사실 정정
   - 증거자료 첨부
   - 법적 대응 예고

3. **적극적 해명 활동**
   - SNS를 통한 직접 해명
   - 언론사 대상 설명자료 배포
   - 지지자들의 올바른 정보 확산 요청

### 주의사항
- 감정적 대응 금지
- 상대 후보 비난 피하기
- 일관된 메시지 유지

## 시나리오 2: 기자회견 중 돌발질문
### 상황 설정
기자회견 중 예상하지 못한 민감한 질문이 제기된 상황

### 대응 기법
1. **침착함 유지**
   - 3초간 심호흡
   - 차분한 목소리 톤 유지
   - 당황하지 않는 표정 관리

2. **질문 재정리**
   - "질문을 정확히 이해했는지 확인하겠습니다"
   - 질문의 핵심 포인트 파악
   - 필요시 재질문 요청

3. **단계적 답변**
   - 알고 있는 사실부터 답변
   - 확인이 필요한 부분은 명확히 구분
   - 추후 보완 설명 약속

## 시나리오 3: 선거 유세 중 방해 행위
### 상황 설정
거리 유세 중 반대 세력의 조직적 방해 행위가 발생한 상황

### 대응 방법
1. **현장 안정화**
   - 선거사무원과 지지자들에게 진정 요청
   - 경찰 신고 및 협조 요청
   - 유세 일시 중단 결정

2. **상황 전환**
   - "민주주의는 다양한 의견을 존중합니다"
   - 건전한 정치문화 조성 강조
   - 차분한 대화 제안

3. **사후 관리**
   - 현장 상황 정확히 기록
   - 언론 대상 사실 설명
   - 법적 대응 검토`,
    estimatedTime: 45,
    tags: ['위기관리', '시뮬레이션', '대응매뉴얼', '상황대응'],
    prerequisites: ['guide-behavior-1', 'video-communication-1'],
    objectives: [
      '위기상황별 대응 프로세스 숙지',
      '침착한 상황 판단 능력 배양',
      '효과적인 위기 커뮤니케이션 기법'
    ],
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-03T09:00:00Z',
    author: '위기관리 전문가',
    isRequired: true,
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    viewCount: 156
  },
  {
    id: 'tutorial-legal-1',
    title: '선거법 준수 체크리스트',
    description: '일상적인 선거 활동에서 놓치기 쉬운 선거법 위반 사항 점검',
    category: 'legal',
    type: 'tutorial',
    difficulty: 'intermediate',
    content: `# 선거법 준수 체크리스트

## 일일 활동 체크포인트

### 오전 활동 전 점검사항
- [ ] 오늘 착용할 선거용품 합법성 확인
- [ ] 방문 예정 장소의 활동 제약 사항 확인
- [ ] 배포할 선거공보물 승인 여부 점검
- [ ] 동행자들의 선거법 숙지 여부 확인

### 거리 유세 시 주의사항
- [ ] 지정된 장소에서만 연설 진행
- [ ] 확성기 사용 시간 준수 (06:00-22:00)
- [ ] 교통 방해가 되지 않도록 주의
- [ ] 상업지역에서의 활동 제한 확인

### 선거사무소 운영
- [ ] 개방 시간 및 표시 사항 점검
- [ ] 방문자 대상 불법 행위 안내
- [ ] 선거 자료 보관 및 관리 상태 확인
- [ ] 자원봉사자 교육 실시 여부

### SNS 및 온라인 활동
- [ ] 게시물 내용의 선거법 적합성 검토
- [ ] 실명 사용 및 신고 의무 이행
- [ ] 허위사실 유포 방지 점검
- [ ] 온라인 광고 신고 여부 확인

### 기부행위 금지 사항
- [ ] 음식물 제공 금지
- [ ] 물품 배포 금지 (선거공보 제외)
- [ ] 금품 수수 절대 금지
- [ ] 후원회비 이외 기부 금지

## 주간 종합 점검

### 선거비용 관리
- [ ] 지출 내역 정확한 기록
- [ ] 영수증 및 증빙서류 보관
- [ ] 한도액 대비 지출 현황 확인
- [ ] 회계책임자 보고 완료

### 선거운동 조직 점검
- [ ] 선거사무원 신고 현황
- [ ] 자원봉사자 교육 실시
- [ ] 불법행위 예방 교육 완료
- [ ] 비상연락망 업데이트

### 홍보물 관리
- [ ] 현수막 설치 신고 및 규격 확인
- [ ] 선거공보 배포 현황 점검
- [ ] 철거 의무 이행 준비
- [ ] 훼손 시 즉시 교체 체계 구축`,
    estimatedTime: 30,
    tags: ['선거법', '체크리스트', '법적준수', '일일점검'],
    prerequisites: [],
    objectives: [
      '선거법 위반 요소 사전 발견',
      '체계적인 법적 준수 관리',
      '일상 활동의 적법성 확보'
    ],
    createdAt: '2024-01-04T11:00:00Z',
    updatedAt: '2024-01-04T11:00:00Z',
    author: '선거관리위원회 자문위원',
    isRequired: true,
    isCompleted: false,
    progress: 0,
    rating: 4.6,
    viewCount: 201
  },
  {
    id: 'video-strategy-1',
    title: '선거 전략 수립과 실행',
    description: '효과적인 선거 전략 기획부터 실행까지의 체계적 접근법',
    category: 'strategy',
    type: 'video',
    difficulty: 'advanced',
    video: {
      url: 'https://www.youtube.com/watch?v=example2',
      duration: 1800, // 30 minutes
      thumbnail: '/mock-videos/election-strategy.jpg',
      subtitles: '/mock-videos/strategy-subtitles.vtt',
      quality: ['1080p', '720p', '480p']
    },
    estimatedTime: 30,
    tags: ['전략수립', '선거기획', '실행방법', '효과측정'],
    prerequisites: ['guide-behavior-1'],
    objectives: [
      '선거 전략의 핵심 요소 이해',
      '단계별 실행 계획 수립 능력',
      '성과 측정 및 개선 방법론'
    ],
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
    author: '정치 전략 컨설턴트',
    isRequired: false,
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    viewCount: 132
  }
]

const mockLearningPaths: LearningPath[] = [
  {
    id: 'path-beginner',
    title: '신규 후보자 기초과정',
    description: '처음 선거에 출마하는 후보자를 위한 필수 교육과정',
    category: 'behavior',
    contents: ['guide-behavior-1', 'tutorial-legal-1', 'video-communication-1'],
    estimatedTotalTime: 65,
    difficulty: 'beginner',
    isCompleted: false,
    progress: 0
  },
  {
    id: 'path-advanced',
    title: '고급 전략 및 위기관리',
    description: '경험있는 후보자를 위한 고급 전략 및 위기관리 과정',
    category: 'crisis',
    contents: ['video-strategy-1', 'scenario-crisis-1'],
    estimatedTotalTime: 75,
    difficulty: 'advanced',
    isCompleted: false,
    progress: 0
  }
]

export const useEducationStore = create<EducationState & EducationActions>()(
  persist(
    (set, get) => ({
      contents: mockEducationContents,
      learningPaths: mockLearningPaths,
      currentContent: null,
      completedContents: [],
      bookmarkedContents: [],
      filters: {
        category: 'all',
        type: 'all',
        difficulty: 'all',
        completedOnly: false,
        requiredOnly: false
      },

      // Content management
      setCurrentContent: (content) => {
        if (content) {
          get().incrementViewCount(content.id)
        }
        set({ currentContent: content })
      },

      markContentCompleted: (contentId, progress = 100) => {
        set((state) => ({
          completedContents: state.completedContents.includes(contentId) 
            ? state.completedContents 
            : [...state.completedContents, contentId],
          contents: state.contents.map(content => 
            content.id === contentId 
              ? { ...content, isCompleted: true, progress: progress }
              : content
          )
        }))
      },

      updateContentProgress: (contentId, progress) => {
        set((state) => ({
          contents: state.contents.map(content =>
            content.id === contentId 
              ? { ...content, progress }
              : content
          )
        }))
      },

      incrementViewCount: (contentId) => {
        set((state) => ({
          contents: state.contents.map(content =>
            content.id === contentId
              ? { ...content, viewCount: content.viewCount + 1 }
              : content
          )
        }))
      },

      // Bookmarks
      toggleBookmark: (contentId) => {
        set((state) => {
          const isBookmarked = state.bookmarkedContents.includes(contentId)
          return {
            bookmarkedContents: isBookmarked
              ? state.bookmarkedContents.filter(id => id !== contentId)
              : [...state.bookmarkedContents, contentId]
          }
        })
      },

      // Filters
      setCategoryFilter: (category) => 
        set((state) => ({ filters: { ...state.filters, category } })),

      setTypeFilter: (type) =>
        set((state) => ({ filters: { ...state.filters, type } })),

      setDifficultyFilter: (difficulty) =>
        set((state) => ({ filters: { ...state.filters, difficulty } })),

      setCompletedOnlyFilter: (completedOnly) =>
        set((state) => ({ filters: { ...state.filters, completedOnly } })),

      setRequiredOnlyFilter: (requiredOnly) =>
        set((state) => ({ filters: { ...state.filters, requiredOnly } })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            category: 'all',
            type: 'all',
            difficulty: 'all',
            completedOnly: false,
            requiredOnly: false
          }
        })),

      // Computed data
      getFilteredContents: () => {
        const { contents, filters } = get()
        
        return contents.filter(content => {
          if (filters.category !== 'all' && content.category !== filters.category) return false
          if (filters.type !== 'all' && content.type !== filters.type) return false
          if (filters.difficulty !== 'all' && content.difficulty !== filters.difficulty) return false
          if (filters.completedOnly && !content.isCompleted) return false
          if (filters.requiredOnly && !content.isRequired) return false
          
          return true
        })
      },

      getContentsByCategory: () => {
        const { contents } = get()
        const categories: EducationCategory[] = ['behavior', 'communication', 'legal', 'strategy', 'etiquette', 'crisis']
        
        return categories.reduce((acc, category) => {
          acc[category] = contents.filter(content => content.category === category)
          return acc
        }, {} as Record<EducationCategory, EducationContent[]>)
      },

      getRecommendedContent: () => {
        const { contents, completedContents } = get()
        
        // Recommend based on prerequisites and rating
        return contents
          .filter(content => !completedContents.includes(content.id))
          .filter(content => 
            content.prerequisites.length === 0 || 
            content.prerequisites.some(prereq => completedContents.includes(prereq))
          )
          .sort((a, b) => {
            // Sort by required first, then rating
            if (a.isRequired && !b.isRequired) return -1
            if (!a.isRequired && b.isRequired) return 1
            return b.rating - a.rating
          })
          .slice(0, 5)
      },

      getLearningPathProgress: (pathId) => {
        const { learningPaths, completedContents } = get()
        const path = learningPaths.find(p => p.id === pathId)
        
        if (!path) return 0
        
        const completedInPath = path.contents.filter(contentId => 
          completedContents.includes(contentId)
        ).length
        
        return Math.round((completedInPath / path.contents.length) * 100)
      }
    }),
    {
      name: 'education-storage',
      partialize: (state) => ({
        completedContents: state.completedContents,
        bookmarkedContents: state.bookmarkedContents,
        filters: state.filters
      })
    }
  )
)