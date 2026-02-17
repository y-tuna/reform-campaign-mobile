import { create } from 'zustand'

// Dashboard data types
export interface TaskSummary {
  id: string
  title: string
  type: 'poi-visit' | 'facility-visit' | 'doc-check' | 'ad-purchase'
  status: 'planned' | 'started' | 'done' | 'failed'
  scheduled_at: string
  estimated_duration: number
  poi_name?: string
}

export interface ActivityStats {
  tasks_completed: number
  tasks_total: number
  contacts_made: number
  proofs_uploaded: number
  completion_rate: number
}

export interface FinanceSummary {
  credits_earned: number
  credits_spent: number
  credits_balance: number
  monthly_target: number
  expenses_this_month: number
}

export interface RankingData {
  current_rank: number
  total_candidates: number
  score: number
  monthly_improvement: number
  top_activities: Array<{
    activity: string
    points: number
    count: number
  }>
}

export interface DashboardData {
  tasks_today: TaskSummary[]
  activity_stats: ActivityStats
  finance_summary: FinanceSummary
  ranking: RankingData
  recent_achievements: Array<{
    id: string
    title: string
    description: string
    points: number
    date: string
  }>
  notifications: Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'error'
    date: string
    read: boolean
  }>
}

export interface DashboardStore {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  
  // Actions
  setData: (data: DashboardData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateTaskStatus: (taskId: string, status: TaskSummary['status']) => void
  markNotificationRead: (notificationId: string) => void
  refreshData: () => void
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  setData: (data) => set({
    data,
    lastUpdated: Date.now(),
    error: null
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  updateTaskStatus: (taskId, status) => {
    const currentData = get().data
    if (!currentData) return

    const updatedTasks = currentData.tasks_today.map(task =>
      task.id === taskId ? { ...task, status } : task
    )

    set({
      data: {
        ...currentData,
        tasks_today: updatedTasks
      }
    })
  },

  markNotificationRead: (notificationId) => {
    const currentData = get().data
    if (!currentData) return

    const updatedNotifications = currentData.notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    )

    set({
      data: {
        ...currentData,
        notifications: updatedNotifications
      }
    })
  },

  refreshData: () => {
    // This will trigger a refetch in components
    set({ lastUpdated: Date.now() })
  }
}))

// Mock data for development
export const mockDashboardData: DashboardData = {
  tasks_today: [
    {
      id: 't1',
      title: '강남역 아침 인사 캠페인',
      type: 'poi-visit',
      status: 'planned',
      scheduled_at: '2024-09-08T08:00:00Z',
      estimated_duration: 60,
      poi_name: '강남역 지하철역'
    },
    {
      id: 't2',
      title: '이마트 생활밀착 캠페인',
      type: 'facility-visit',
      status: 'planned',
      scheduled_at: '2024-09-08T12:00:00Z',
      estimated_duration: 90,
      poi_name: '이마트 강남점'
    },
    {
      id: 't3',
      title: '선거관리위원회 서류 제출',
      type: 'doc-check',
      status: 'planned',
      scheduled_at: '2024-09-08T15:00:00Z',
      estimated_duration: 30
    }
  ],
  activity_stats: {
    tasks_completed: 15,
    tasks_total: 20,
    contacts_made: 342,
    proofs_uploaded: 12,
    completion_rate: 75
  },
  finance_summary: {
    credits_earned: 1250,
    credits_spent: 450,
    credits_balance: 800,
    monthly_target: 2000,
    expenses_this_month: 850000
  },
  ranking: {
    current_rank: 3,
    total_candidates: 15,
    score: 1250,
    monthly_improvement: 12,
    top_activities: [
      { activity: 'POI 방문', points: 680, count: 8 },
      { activity: '증빙 업로드', points: 360, count: 12 },
      { activity: '서류 완료', points: 210, count: 5 }
    ]
  },
  recent_achievements: [
    {
      id: 'a1',
      title: '첫 주 완주!',
      description: '첫 번째 주간 목표를 달성했습니다',
      points: 100,
      date: '2024-09-07'
    },
    {
      id: 'a2',
      title: '증빙 마스터',
      description: '10개 이상의 증빙을 업로드했습니다',
      points: 50,
      date: '2024-09-06'
    }
  ],
  notifications: [
    {
      id: 'n1',
      title: '서류 제출 마감 임박',
      message: '예비후보자 등록 서류 제출이 3일 남았습니다.',
      type: 'warning',
      date: '2024-09-08T09:00:00Z',
      read: false
    },
    {
      id: 'n2',
      title: '새로운 캠페인 가이드',
      message: '업데이트된 캠페인 가이드라인을 확인하세요.',
      type: 'info',
      date: '2024-09-07T14:30:00Z',
      read: false
    }
  ]
}