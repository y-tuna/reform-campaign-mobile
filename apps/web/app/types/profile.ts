import { z } from 'zod'

// Profile schema matching PRD requirements
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, '이름을 입력해주세요').max(100, '이름은 100자 이하로 입력해주세요'),
  phone: z.string().min(8, '올바른 전화번호를 입력해주세요').max(20, '전화번호가 너무 깁니다'),
  intensity: z.enum(['hard', 'normal', 'light'], {
    errorMap: () => ({ message: '활동 강도를 선택해주세요' })
  }),
  religion_pref: z.string().max(100, '종교는 100자 이하로 입력해주세요').optional(),
  mobility: z.enum(['car', 'pickup', 'trike', 'bike', 'walk'], {
    errorMap: () => ({ message: '이동 수단을 선택해주세요' })
  }),
  font_scale: z.enum(['default', 'large'], {
    errorMap: () => ({ message: '폰트 크기를 선택해주세요' })
  }),
  role: z.enum(['admin', 'candidate', 'viewer']),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const ProfileUpdateSchema = ProfileSchema.omit({ 
  id: true, 
  role: true, 
  created_at: true, 
  updated_at: true 
})

export type Profile = z.infer<typeof ProfileSchema>
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>

// Helper for display labels
export const INTENSITY_LABELS = {
  hard: '고강도',
  normal: '보통',
  light: '저강도'
} as const

export const MOBILITY_LABELS = {
  car: '승용차',
  pickup: '트럭',
  trike: '삼륜차',
  bike: '자전거',
  walk: '도보'
} as const

export const FONT_SCALE_LABELS = {
  default: '기본',
  large: '큰 글씨'
} as const

// Utility functions
export function getIntensityLabel(intensity: Profile['intensity']): string {
  return INTENSITY_LABELS[intensity]
}

export function getMobilityLabel(mobility: Profile['mobility']): string {
  return MOBILITY_LABELS[mobility]
}

export function getFontScaleLabel(fontScale: Profile['font_scale']): string {
  return FONT_SCALE_LABELS[fontScale]
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 8) return phone
  
  // Format: 010-1234-5678 -> 010-****-5678
  if (phone.includes('-')) {
    const parts = phone.split('-')
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`
    }
  }
  
  // Format: 01012345678 -> 010****5678
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`
  }
  
  // Fallback: mask middle part
  const start = phone.slice(0, 3)
  const end = phone.slice(-4)
  return `${start}****${end}`
}

// Default profile values
export const DEFAULT_PROFILE_VALUES: Partial<ProfileUpdate> = {
  intensity: 'normal',
  religion_pref: '',
  mobility: 'car',
  font_scale: 'default'
}