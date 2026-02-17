import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define types based on data contracts
export type ProfileIntensity = 'hard' | 'normal' | 'light'
export type MobilityType = 'car' | 'pickup' | 'trike' | 'bike' | 'walk'

export interface ReligionPreference {
  preference: 'none' | 'exclude' | 'only'
  values: string[]
}

export interface ProfileData {
  // Basic info
  name?: string
  email?: string
  district?: string
  party_affiliation?: string
  
  // Campaign preferences  
  intensity: ProfileIntensity
  mobility: MobilityType
  religion_pref: ReligionPreference
  
  // UI preferences
  is_candidate_mode: boolean
  senior_ui_mode: boolean
  
  // Onboarding state
  onboarding_completed: boolean
  onboarding_step: number
}

export interface ProfileStore {
  profile: ProfileData
  isLoading: boolean
  error: string | null
  
  // Actions
  setProfile: (profile: Partial<ProfileData>) => void
  updateProfile: (updates: Partial<ProfileData>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetProfile: () => void
  completeOnboarding: () => void
  setOnboardingStep: (step: number) => void
}

const defaultProfile: ProfileData = {
  intensity: 'normal',
  mobility: 'car',
  religion_pref: { preference: 'none', values: [] },
  is_candidate_mode: false,
  senior_ui_mode: false,
  onboarding_completed: false,
  onboarding_step: 0,
  party_affiliation: '개혁신당'
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({
        profile: { ...get().profile, ...profile }
      }),

      updateProfile: (updates) => set({
        profile: { ...get().profile, ...updates }
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      resetProfile: () => set({
        profile: defaultProfile,
        error: null
      }),

      completeOnboarding: () => set({
        profile: { 
          ...get().profile, 
          onboarding_completed: true,
          onboarding_step: 0
        }
      }),

      setOnboardingStep: (step) => set({
        profile: { ...get().profile, onboarding_step: step }
      })
    }),
    {
      name: 'profile-storage',
      version: 1
    }
  )
)