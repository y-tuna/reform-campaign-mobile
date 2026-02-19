import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MobilityType } from '../types'

// Notification 타입
export interface Notification {
  id: string
  title: string
  message: string
  type: 'schedule' | 'system' | 'gps_verify'
  isRead: boolean
  createdAt: string
}

interface SettingsState {
  // 접근성 설정
  fontScale: number // 0.8 - 1.4
  darkMode: boolean

  // 유세 설정
  mobility: MobilityType

  // 알림
  notifications: Notification[]
  unreadCount: number

  // AI 추천 쿨타임
  aiCooldownStart: number | null
  aiUsedCount: number

  // Computed
  isSeniorMode: () => boolean

  // Actions
  setFontScale: (scale: number) => void
  setDarkMode: (enabled: boolean) => void
  setMobility: (mobility: MobilityType) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  useAiRecommend: () => void
  resetAiCooldown: () => void
}

// Web용 localStorage 스토리지
const webStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    const value = localStorage.getItem(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(name)
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 초기값
      fontScale: 1.0,
      darkMode: false,
      mobility: 'walk' as MobilityType,
      notifications: [
        // 샘플 알림 데이터
        {
          id: 'notif-1',
          title: '오늘 유세 일정',
          message: '강남역 광장에서 오후 2시 유세가 예정되어 있습니다.',
          type: 'schedule',
          isRead: false,
          createdAt: new Date(Date.now() - 900000).toISOString(), // 15분 전
        },
        {
          id: 'notif-2',
          title: '시스템 공지',
          message: '앱이 새로운 버전으로 업데이트되었습니다.',
          type: 'system',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
        },
        {
          id: 'notif-3',
          title: '유세 위치 인증',
          message: '강남역 3번출구 일정을 소화 중이신가요? 위치 인증을 진행해주세요. (1/3)',
          type: 'gps_verify',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        },
      ],
      unreadCount: 2,

      // AI 추천 쿨타임
      aiCooldownStart: null,
      aiUsedCount: 0,

      // Computed: 큰 글씨 모드 여부
      isSeniorMode: () => get().fontScale >= 1.2,

      // Actions
      setFontScale: (scale) =>
        set({ fontScale: Math.max(0.8, Math.min(1.4, scale)) }),

      setDarkMode: (enabled) => set({ darkMode: enabled }),

      setMobility: (mobility) => set({ mobility }),

      addNotification: (notification) =>
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            isRead: false,
            createdAt: new Date().toISOString(),
          }
          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }
        }),

      markAsRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
          const unreadCount = notifications.filter((n) => !n.isRead).length
          return { notifications, unreadCount }
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      useAiRecommend: () =>
        set((state) => {
          const now = Date.now()
          // 30분 경과 시 리셋
          if (state.aiCooldownStart && now - state.aiCooldownStart >= 30 * 60 * 1000) {
            return { aiCooldownStart: now, aiUsedCount: 1 }
          }
          return {
            aiCooldownStart: state.aiCooldownStart ?? now,
            aiUsedCount: state.aiUsedCount + 1,
          }
        }),

      resetAiCooldown: () => set({ aiCooldownStart: null, aiUsedCount: 0 }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => webStorage),
      partialize: (state) => ({
        fontScale: state.fontScale,
        darkMode: state.darkMode,
        mobility: state.mobility,
        // notifications는 persist하지 않음 (매번 새로 로드)
      }),
    }
  )
)
