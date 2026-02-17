import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BroadcastSeverity = 'info' | 'warning' | 'critical' | 'urgent'
export type BroadcastCategory = 'party' | 'election' | 'legal' | 'campaign' | 'event' | 'emergency'
export type BroadcastStatus = 'published' | 'draft' | 'archived'

export interface BroadcastAttachment {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface Broadcast {
  id: string
  title: string
  summary: string
  content: string
  category: BroadcastCategory
  severity: BroadcastSeverity
  status: BroadcastStatus
  publishedAt: string
  expiresAt?: string
  author: string
  department: string
  attachments: BroadcastAttachment[]
  tags: string[]
  isRead: boolean
  isBookmarked: boolean
  viewCount: number
  priority: number // Higher number = higher priority
  targetAudience: string[]
}

export interface BroadcastsState {
  broadcasts: Broadcast[]
  filters: {
    severity: BroadcastSeverity | 'all'
    category: BroadcastCategory | 'all'
    status: BroadcastStatus | 'all'
    unreadOnly: boolean
    bookmarkedOnly: boolean
    searchTerm: string
  }
  selectedBroadcast: Broadcast | null
  readBroadcasts: string[]
  bookmarkedBroadcasts: string[]
}

interface BroadcastsActions {
  // Broadcast management
  setSelectedBroadcast: (broadcast: Broadcast | null) => void
  markAsRead: (broadcastId: string) => void
  markAllAsRead: () => void
  toggleBookmark: (broadcastId: string) => void
  incrementViewCount: (broadcastId: string) => void
  
  // Filters
  setSeverityFilter: (severity: BroadcastSeverity | 'all') => void
  setCategoryFilter: (category: BroadcastCategory | 'all') => void
  setStatusFilter: (status: BroadcastStatus | 'all') => void
  setUnreadOnlyFilter: (unreadOnly: boolean) => void
  setBookmarkedOnlyFilter: (bookmarkedOnly: boolean) => void
  setSearchTerm: (searchTerm: string) => void
  clearFilters: () => void
  
  // Computed data
  getFilteredBroadcasts: () => Broadcast[]
  getUnreadCount: () => number
  getCriticalBroadcasts: () => Broadcast[]
  getBroadcastsByCategory: () => Record<BroadcastCategory, Broadcast[]>
  getRecentBroadcasts: (days?: number) => Broadcast[]
}

// Mock Korean political party broadcasts
const mockBroadcasts: Broadcast[] = [
  {
    id: 'broadcast-001',
    title: '【긴급】선거법 개정안 통과 - 온라인 선거운동 규정 변경',
    summary: '온라인 선거운동 관련 새로운 규정이 적용되니 모든 후보자는 즉시 확인 바랍니다.',
    content: `# 선거법 개정안 주요 변경사항

## 온라인 선거운동 규정 강화

### 변경된 주요 내용
1. **SNS 실명 인증 강화**
   - 모든 SNS 계정에서 실명 인증 필수
   - 위반 시 과태료 최대 500만원으로 상향

2. **영상 콘텐츠 사전 신고 의무화**
   - 1분 이상 선거 관련 영상은 선관위 사전 신고
   - 라이브 방송도 24시간 전 신고 필수

3. **허위정보 유포 처벌 강화**
   - 허위정보 유포 시 7년 이하 징역
   - 악의적 딥페이크 사용 시 10년 이하 징역

### 시행일
- **2024년 2월 1일부터 시행**
- 기존 운영 중인 계정도 30일 내 재인증 필요

### 주의사항
- 모든 후보자는 즉시 SNS 운영 방식 점검
- 선거사무원 대상 교육 실시 예정
- 위반 사례 발생 시 즉시 당본부 보고

문의사항은 개혁신당 선거대책위원회(02-123-4567)로 연락하시기 바랍니다.`,
    category: 'legal',
    severity: 'critical',
    status: 'published',
    publishedAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    author: '이정훈',
    department: '개혁신당 선거대책위원회',
    attachments: [
      {
        id: 'att-001',
        name: '선거법개정안_상세내용.pdf',
        url: '/attachments/election-law-amendment.pdf',
        size: 2048576,
        type: 'application/pdf'
      }
    ],
    tags: ['선거법', '온라인선거운동', '긴급공지', 'SNS규정'],
    isRead: false,
    isBookmarked: false,
    viewCount: 0,
    priority: 10,
    targetAudience: ['전체후보자', '선거사무원', '당원']
  },
  {
    id: 'broadcast-002',
    title: '개혁신당 정책공약 발표회 개최 안내',
    summary: '2월 20일 개최되는 정책공약 발표회 참석 및 준비사항을 안내드립니다.',
    content: `# 개혁신당 정책공약 발표회

## 행사 개요
- **일시**: 2024년 2월 20일(화) 오후 2시
- **장소**: 여의도 개혁신당 당사 대회의실
- **주제**: "새로운 대한민국을 위한 개혁 정책"

## 발표 내용
### 주요 정책 분야
1. **경제정책**
   - 중소기업 지원 확대 방안
   - 청년 창업 생태계 조성
   - 디지털 뉴딜 2.0 추진

2. **사회정책** 
   - 주거안정 종합대책
   - 교육격차 해소 방안
   - 저출산 대응 정책

3. **환경정책**
   - 탄소중립 실현 로드맵
   - 그린뉴딜 확산 방안

## 참석 대상
- 전국 지역위원장
- 당선 예정 후보자
- 정책위원회 위원
- 언론관계자

## 준비사항
- 참석 확인서는 2월 18일까지 제출
- 당일 명찰 및 자료집 지급
- 주차공간 제한으로 대중교통 이용 권장

## 문의처
개혁신당 정책위원회 사무국
- 전화: 02-789-1234
- 이메일: policy@reform.or.kr`,
    category: 'event',
    severity: 'info',
    status: 'published',
    publishedAt: '2024-01-10T14:30:00Z',
    author: '김수진',
    department: '개혁신당 정책위원회',
    attachments: [
      {
        id: 'att-002',
        name: '정책발표회_참석확인서.hwp',
        url: '/attachments/policy-event-form.hwp',
        size: 524288,
        type: 'application/x-hwp'
      }
    ],
    tags: ['정책발표회', '당원행사', '정책공약'],
    isRead: true,
    isBookmarked: true,
    viewCount: 45,
    priority: 6,
    targetAudience: ['당선예정후보자', '당원', '정책위원']
  },
  {
    id: 'broadcast-003',
    title: '⚠️ 선거비용 한도 초과 주의 - 3분기 점검 결과',
    summary: '일부 지역의 선거비용이 한도에 근접하고 있어 긴급 점검이 필요합니다.',
    content: `# 선거비용 한도 점검 결과 및 주의사항

## 점검 개요
2024년 1분기부터 3분기까지의 선거비용 집행 현황을 점검한 결과, 일부 지역에서 한도 초과 위험이 발견되었습니다.

## 주의 대상 지역
### 🔴 위험 (80% 이상 사용)
- 서울 강남구 (사용률 85%)
- 부산 해운대구 (사용률 82%)
- 대구 중구 (사용률 88%)

### 🟡 경고 (70-79% 사용)
- 인천 연수구 (사용률 75%)
- 광주 서구 (사용률 72%)
- 대전 유성구 (사용률 78%)

## 비용 절감 방안
### 즉시 적용 가능한 방안
1. **홍보비 최적화**
   - 온라인 광고 단가 재협상
   - 현수막 업체 비교견적
   - 인쇄물 수량 조정

2. **인건비 관리**
   - 자원봉사자 활용 확대
   - 업무 효율성 제고
   - 야근수당 관리 강화

3. **사무실 운영비 절약**
   - 공과금 절약 노력
   - 소모품 구매 통합
   - 차량 운영비 절감

## 필수 조치사항
### 위험 지역 후보자
- 즉시 회계책임자와 비용 재검토
- 향후 3개월 지출계획 수립
- 주간 비용 모니터링 체계 구축

### 전체 후보자 공통
- 매주 금요일 비용 현황 보고
- 고액 지출 시 사전 승인제 도입
- 영수증 관리 철저

## 후속 조치
- 매월 말 전체 현황 점검
- 위험 지역 개별 컨설팅 제공
- 우수 사례 공유 세미나 개최

**문의**: 개혁신당 회계관리팀 (02-456-7890)`,
    category: 'campaign',
    severity: 'warning',
    status: 'published',
    publishedAt: '2024-01-08T16:45:00Z',
    author: '박민수',
    department: '개혁신당 회계관리팀',
    attachments: [
      {
        id: 'att-003',
        name: '3분기_선거비용현황.xlsx',
        url: '/attachments/election-cost-q3.xlsx',
        size: 1048576,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      {
        id: 'att-004',
        name: '비용절감가이드.pdf',
        url: '/attachments/cost-saving-guide.pdf',
        size: 3145728,
        type: 'application/pdf'
      }
    ],
    tags: ['선거비용', '회계관리', '경고사항', '비용절감'],
    isRead: false,
    isBookmarked: false,
    viewCount: 23,
    priority: 8,
    targetAudience: ['전체후보자', '회계책임자', '선거사무원']
  },
  {
    id: 'broadcast-004',
    title: '당원 교육프로그램 신규 개설 안내',
    summary: '후보자 및 당원을 위한 맞춤형 교육프로그램이 새롭게 개설되었습니다.',
    content: `# 개혁신당 당원 교육프로그램

## 프로그램 소개
2024년 선거를 대비하여 체계적인 교육프로그램을 새롭게 준비했습니다.

## 교육과정 안내

### 📚 기초과정 (4주)
- **대상**: 신규 후보자, 신입 당원
- **내용**: 개혁신당 역사, 기본 정책 이해
- **일정**: 매주 화요일 오후 7시
- **방식**: 온라인 + 오프라인 병행

### 📈 중급과정 (6주)  
- **대상**: 기존 당원, 선거사무원
- **내용**: 선거전략, 유권자 소통법
- **일정**: 매주 목요일 오후 7시
- **방식**: 실습 중심 워크숍

### 🎯 고급과정 (8주)
- **대상**: 후보자, 선거대책위원장
- **내용**: 고급 전략, 위기관리, 리더십
- **일정**: 매주 토요일 오후 2시
- **방식**: 사례연구 + 토론

## 특별 프로그램

### 💻 디지털 마케팅 과정
- SNS 활용법, 온라인 광고 전략
- 4회차 집중교육
- 실무진 필수 참여

### 🎤 스피치 트레이닝
- 개인별 1:1 코칭
- 전문 강사진 운영
- 사전 예약제

## 신청 방법
1. 당원포털 접속 (www.reform.or.kr)
2. 교육신청 메뉴 선택
3. 희망과정 및 일정 선택
4. 신청서 작성 후 제출

## 수료 혜택
- 수료증 발급
- 우수 수료자 포상
- 당 주요 행사 우선 초청

**문의**: 교육기획팀 (02-321-6540)`,
    category: 'party',
    severity: 'info',
    status: 'published',
    publishedAt: '2024-01-05T11:20:00Z',
    author: '최영희',
    department: '개혁신당 교육기획팀',
    attachments: [
      {
        id: 'att-005',
        name: '교육프로그램_상세안내.pdf',
        url: '/attachments/education-program.pdf',
        size: 2621440,
        type: 'application/pdf'
      }
    ],
    tags: ['당원교육', '역량강화', '선거교육'],
    isRead: true,
    isBookmarked: false,
    viewCount: 67,
    priority: 4,
    targetAudience: ['전체당원', '후보자', '선거사무원']
  },
  {
    id: 'broadcast-005',
    title: '🚨 긴급: 코로나19 재확산 대응 선거운동 가이드라인',
    summary: '코로나19 재확산에 따른 선거운동 방식 조정 및 방역수칙 안내',
    content: `# 코로나19 재확산 대응 선거운동 가이드라인

## 현 상황
최근 코로나19 재확산으로 인해 대면 선거운동에 제약이 예상됩니다.

## 조정된 운동 방식

### 🏠 비대면 활동 강화
1. **온라인 간담회**
   - Zoom, Teams 활용
   - 참석자 100명 이하 권장
   - 사전 등록제 운영

2. **SNS 라이브 방송**
   - 정기적 소통 채널 운영
   - 정책 설명회 온라인 진행
   - 댓글을 통한 실시간 소통

### 🎪 대면 활동 시 준수사항
1. **거리두기 철저**
   - 2m 이상 간격 유지
   - 마스크 착용 의무
   - 손소독제 비치

2. **참석자 관리**
   - 사전 예약제 운영  
   - 발열체크 실시
   - 연락처 수집 (확진자 발생 대비)

3. **장소 제한**
   - 실내: 수용인원의 50% 이하
   - 실외: 100명 이하 권장
   - 환기 가능한 장소 우선

## 방역물품 지원
당에서 다음 물품을 지원합니다:
- 마스크 (KF94, 1인당 50매)
- 손소독제 (500ml, 지역당 10개)
- 체온계 (비접촉식, 지역당 2개)
- 방역안내 현수막

## 확진자 발생 시 대응
1. 즉시 당 본부 신고
2. 접촉자 파악 및 격리
3. 선거운동 일시 중단
4. 방역당국 협조

## 지원 요청
방역물품 또는 온라인 장비 지원이 필요한 지역은 즉시 연락바랍니다.

**긴급연락처**: 위기상황실 (24시간 운영)
- 전화: 02-999-1234
- 카카오톡: @개혁신당위기상황실`,
    category: 'emergency',
    severity: 'urgent',
    status: 'published',
    publishedAt: '2024-01-03T08:30:00Z',
    expiresAt: '2024-03-03T23:59:59Z',
    author: '김철민',
    department: '개혁신당 위기관리팀',
    attachments: [
      {
        id: 'att-006',
        name: '코로나19대응매뉴얼.pdf',
        url: '/attachments/covid19-response-manual.pdf',
        size: 4194304,
        type: 'application/pdf'
      }
    ],
    tags: ['코로나19', '방역수칙', '긴급공지', '선거운동조정'],
    isRead: false,
    isBookmarked: true,
    viewCount: 12,
    priority: 10,
    targetAudience: ['전체후보자', '선거사무원', '당원']
  }
]

export const useBroadcastsStore = create<BroadcastsState & BroadcastsActions>()(
  persist(
    (set, get) => ({
      broadcasts: mockBroadcasts,
      filters: {
        severity: 'all',
        category: 'all',
        status: 'all',
        unreadOnly: false,
        bookmarkedOnly: false,
        searchTerm: ''
      },
      selectedBroadcast: null,
      readBroadcasts: ['broadcast-002', 'broadcast-004'],
      bookmarkedBroadcasts: ['broadcast-002', 'broadcast-005'],

      // Broadcast management
      setSelectedBroadcast: (broadcast) => {
        if (broadcast) {
          get().incrementViewCount(broadcast.id)
          get().markAsRead(broadcast.id)
        }
        set({ selectedBroadcast: broadcast })
      },

      markAsRead: (broadcastId) => {
        set((state) => ({
          readBroadcasts: state.readBroadcasts.includes(broadcastId) 
            ? state.readBroadcasts 
            : [...state.readBroadcasts, broadcastId],
          broadcasts: state.broadcasts.map(broadcast =>
            broadcast.id === broadcastId
              ? { ...broadcast, isRead: true }
              : broadcast
          )
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          readBroadcasts: state.broadcasts.map(b => b.id),
          broadcasts: state.broadcasts.map(broadcast => ({ ...broadcast, isRead: true }))
        }))
      },

      toggleBookmark: (broadcastId) => {
        set((state) => {
          const isBookmarked = state.bookmarkedBroadcasts.includes(broadcastId)
          return {
            bookmarkedBroadcasts: isBookmarked
              ? state.bookmarkedBroadcasts.filter(id => id !== broadcastId)
              : [...state.bookmarkedBroadcasts, broadcastId],
            broadcasts: state.broadcasts.map(broadcast =>
              broadcast.id === broadcastId
                ? { ...broadcast, isBookmarked: !isBookmarked }
                : broadcast
            )
          }
        })
      },

      incrementViewCount: (broadcastId) => {
        set((state) => ({
          broadcasts: state.broadcasts.map(broadcast =>
            broadcast.id === broadcastId
              ? { ...broadcast, viewCount: broadcast.viewCount + 1 }
              : broadcast
          )
        }))
      },

      // Filters
      setSeverityFilter: (severity) =>
        set((state) => ({ filters: { ...state.filters, severity } })),

      setCategoryFilter: (category) =>
        set((state) => ({ filters: { ...state.filters, category } })),

      setStatusFilter: (status) =>
        set((state) => ({ filters: { ...state.filters, status } })),

      setUnreadOnlyFilter: (unreadOnly) =>
        set((state) => ({ filters: { ...state.filters, unreadOnly } })),

      setBookmarkedOnlyFilter: (bookmarkedOnly) =>
        set((state) => ({ filters: { ...state.filters, bookmarkedOnly } })),

      setSearchTerm: (searchTerm) =>
        set((state) => ({ filters: { ...state.filters, searchTerm } })),

      clearFilters: () =>
        set((state) => ({
          filters: {
            severity: 'all',
            category: 'all', 
            status: 'all',
            unreadOnly: false,
            bookmarkedOnly: false,
            searchTerm: ''
          }
        })),

      // Computed data
      getFilteredBroadcasts: () => {
        const { broadcasts, filters } = get()
        
        return broadcasts
          .filter(broadcast => {
            if (filters.severity !== 'all' && broadcast.severity !== filters.severity) return false
            if (filters.category !== 'all' && broadcast.category !== filters.category) return false
            if (filters.status !== 'all' && broadcast.status !== filters.status) return false
            if (filters.unreadOnly && broadcast.isRead) return false
            if (filters.bookmarkedOnly && !broadcast.isBookmarked) return false
            if (filters.searchTerm && 
                !broadcast.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
                !broadcast.summary.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
                !broadcast.content.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
            
            return true
          })
          .sort((a, b) => {
            // Sort by priority first, then by published date
            if (a.priority !== b.priority) {
              return b.priority - a.priority
            }
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          })
      },

      getUnreadCount: () => {
        const { broadcasts } = get()
        return broadcasts.filter(broadcast => !broadcast.isRead).length
      },

      getCriticalBroadcasts: () => {
        const { broadcasts } = get()
        return broadcasts
          .filter(broadcast => broadcast.severity === 'critical' || broadcast.severity === 'urgent')
          .sort((a, b) => b.priority - a.priority)
      },

      getBroadcastsByCategory: () => {
        const { broadcasts } = get()
        const categories: BroadcastCategory[] = ['party', 'election', 'legal', 'campaign', 'event', 'emergency']
        
        return categories.reduce((acc, category) => {
          acc[category] = broadcasts.filter(broadcast => broadcast.category === category)
          return acc
        }, {} as Record<BroadcastCategory, Broadcast[]>)
      },

      getRecentBroadcasts: (days = 7) => {
        const { broadcasts } = get()
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        
        return broadcasts
          .filter(broadcast => new Date(broadcast.publishedAt) >= cutoffDate)
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      }
    }),
    {
      name: 'broadcasts-storage',
      partialize: (state) => ({
        readBroadcasts: state.readBroadcasts,
        bookmarkedBroadcasts: state.bookmarkedBroadcasts,
        filters: state.filters
      })
    }
  )
)