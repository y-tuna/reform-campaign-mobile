// POI (유세 위치)
export interface POI {
  id: string
  name: string
  type: POIType
  location: {
    lat: number
    lng: number
  }
  baseExposure: number
  timeWeights: {
    morning: number
    noon: number
    evening: number
  }
  accessibility: number
  metadata?: {
    exits?: number
    crosswalks?: number
    stayArea?: boolean
  }
}

export type POIType =
  | 'subway'
  | 'bus'
  | 'market'
  | 'school'
  | 'facility'
  | 'religious'
  | 'other'

// 유세 일정
export interface CampaignSchedule {
  id: string
  userId: string
  poi: POI
  date: string
  startTime: string
  endTime?: string
  estimatedExposure: number
  status: ScheduleStatus
  gpsTrack?: GeoPoint[]
  memo?: string
  createdAt: string
  updatedAt: string
}

export type ScheduleStatus = 'planned' | 'started' | 'done' | 'skipped'

export interface GeoPoint {
  lat: number
  lng: number
  timestamp: string
}

// 프로필
export interface UserProfile {
  id: string
  name: string
  district: string
  candidateType: 'preliminary' | 'official'
  preferences: ProfilePreferences
  createdAt: string
  updatedAt: string
}

export interface ProfilePreferences {
  religion: ReligionPref
  mobility: MobilityType
  intensity: IntensityLevel
  fontSize: 'default' | 'large'
  darkMode: boolean
}

export type ReligionPref =
  | { type: 'none' }
  | { type: 'exclude'; list: string[] }
  | { type: 'only'; list: string[] }

export type MobilityType = 'car' | 'pickup' | 'bike' | 'walk'
export type IntensityLevel = 'hard' | 'normal' | 'light'

// 챗봇
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: LawReference[]
  createdAt: string
}

export interface LawReference {
  code: string
  title: string
  summary: string
  url?: string
}

// 알림
export interface Notification {
  id: string
  userId: string
  type: 'schedule_reminder' | 'broadcast' | 'system'
  title: string
  body: string
  severity: 'info' | 'warn' | 'critical'
  isRead: boolean
  createdAt: string
}

// 대시보드
export interface ActivityStats {
  period: 'week' | 'month'
  totalVisits: number
  totalExposure: number
  totalDistance: number
  categoryBreakdown: Partial<Record<POIType, number>>
  dailyStats: DailyStat[]
}

export interface DailyStat {
  date: string
  visits: number
  exposure: number
  distance: number
}

export interface HeatmapData {
  points: HeatmapPoint[]
}

export interface HeatmapPoint {
  lat: number
  lng: number
  weight: number
}
