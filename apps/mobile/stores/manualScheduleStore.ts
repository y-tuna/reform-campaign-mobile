import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Platform } from 'react-native'

// Manual Schedule 타입
export interface ManualSchedule {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: { name: string; address: string } | null
  color: string
  memo: string
  createdAt: string
}

// 방문 기록 타입
export interface VisitRecord {
  scheduleId: string
  scheduleName: string
  category: string
  visitedAt: string
  date: string
}

interface ManualScheduleState {
  schedules: ManualSchedule[]
  visitRecords: VisitRecord[]
  addSchedule: (schedule: Omit<ManualSchedule, 'id' | 'createdAt'>) => void
  updateSchedule: (id: string, data: Partial<Omit<ManualSchedule, 'id' | 'createdAt'>>) => void
  removeSchedule: (id: string) => void
  clearAllSchedules: () => void
  // 방문 기록
  addVisitRecord: (record: Omit<VisitRecord, 'visitedAt'>) => void
  getVisitCountByCategory: (category: string) => number
  getTotalVisitCount: () => number
}

// Web용 localStorage 스토리지 (Expo Web / Vercel 배포용)
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

export const useManualScheduleStore = create<ManualScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      visitRecords: [],

      addSchedule: (scheduleData) =>
        set((state) => ({
          schedules: [
            ...state.schedules,
            {
              ...scheduleData,
              id: `manual-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSchedule: (id, data) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),

      clearAllSchedules: () => set({ schedules: [], visitRecords: [] }),

      // 방문 기록 추가
      addVisitRecord: (record) =>
        set((state) => {
          // 중복 체크 (같은 일정 같은 날짜)
          const exists = state.visitRecords.some(
            (r) => r.scheduleId === record.scheduleId && r.date === record.date
          )
          if (exists) return state

          return {
            visitRecords: [
              ...state.visitRecords,
              {
                ...record,
                visitedAt: new Date().toISOString(),
              },
            ],
          }
        }),

      // 카테고리별 방문 횟수
      getVisitCountByCategory: (category) => {
        const records = get().visitRecords
        return records.filter((r) => r.category === category).length
      },

      // 총 방문 횟수
      getTotalVisitCount: () => {
        return get().visitRecords.length
      },
    }),
    {
      name: 'manual-schedules',
      storage: createJSONStorage(() => webStorage),
    }
  )
)
