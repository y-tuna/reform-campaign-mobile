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

interface ManualScheduleState {
  schedules: ManualSchedule[]
  addSchedule: (schedule: Omit<ManualSchedule, 'id' | 'createdAt'>) => void
  removeSchedule: (id: string) => void
  clearAllSchedules: () => void
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
    (set) => ({
      schedules: [],
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
      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),
      clearAllSchedules: () => set({ schedules: [] }),
    }),
    {
      name: 'manual-schedules',
      storage: createJSONStorage(() => webStorage),
    }
  )
)
