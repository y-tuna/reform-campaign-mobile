import React from 'react'
import Svg, { Path, Rect, Circle } from 'react-native-svg'

interface IconProps {
  size?: number
  color?: string
  focused?: boolean
}

// 파스텔 오렌지 색상
const PASTEL_ORANGE = '#FDBA74' // primary[300]
const ACTIVE_ORANGE = '#F97316' // primary[500]
const INACTIVE_GRAY = '#D1D5DB' // neutral[300]

// 홈 아이콘 - 부드러운 라인 스타일
export function HomeIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12L12 5L20 12"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 10.5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V10.5"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {focused && (
        <Path
          d="M10 20V15C10 14.4477 10.4477 14 11 14H13C13.5523 14 14 14.4477 14 15V20"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  )
}

// 스케줄/캘린더 아이콘 - 참고 이미지 스타일 (부드러운 라인)
export function ScheduleIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  const fillColor = focused ? PASTEL_ORANGE : 'none'

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <Path
        d="M4 9H20"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <Path
        d="M8 3V6"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16 3V6"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

// 챗봇 아이콘 - 말풍선 스타일 (부드러운 라인)
export function ChatIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  const fillColor = focused ? PASTEL_ORANGE : 'none'

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12C21 16.4183 17.4183 20 13 20H5L8 17H6C4.34315 17 3 15.6569 3 14V8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8V12Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
      />
      {focused && (
        <>
          <Circle cx="8" cy="11" r="1" fill={strokeColor} />
          <Circle cx="12" cy="11" r="1" fill={strokeColor} />
          <Circle cx="16" cy="11" r="1" fill={strokeColor} />
        </>
      )}
    </Svg>
  )
}

// 대시보드 아이콘 - 그래프/차트 스타일 (부드러운 라인)
export function DashboardIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <Path
        d="M8 16V12"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 16V8"
        stroke={focused ? ACTIVE_ORANGE : strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M16 16V10"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  )
}

// 설정 아이콘 - 톱니바퀴 스타일 (부드러운 라인)
export function SettingsIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <Path
        d="M12 2V5M12 19V22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M2 12H5M19 12H22M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

// 알림 아이콘 - 벨 스타일 (부드러운 라인)
export function NotificationIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

// 프로필 아이콘 - 사람 모양 (부드러운 라인)
export function ProfileIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <Path
        d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

// ===== 앱 전체에서 사용할 추가 아이콘 =====

// 로봇/챗봇 아이콘
export function BotIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="8" width="16" height="12" rx="2" stroke={color} strokeWidth={1.5} />
      <Circle cx="9" cy="14" r="1.5" fill={color} />
      <Circle cx="15" cy="14" r="1.5" fill={color} />
      <Path d="M12 4V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="3" r="1" fill={color} />
    </Svg>
  )
}

// 사용자 아이콘
export function UserIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 알림 - 긴급 (빨간 점)
export function AlertIcon({ size = 24, color = '#DC2626' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
      <Path d="M12 8V12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1" fill={color} />
    </Svg>
  )
}

// 일정 아이콘
export function CalendarIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="5" width="16" height="15" rx="2" stroke={color} strokeWidth={1.5} />
      <Path d="M4 9H20" stroke={color} strokeWidth={1.5} />
      <Path d="M8 3V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 3V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 공원 아이콘
export function ParkIcon({ size = 24, color = '#16A34A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L17 10H7L12 3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12 8L18 17H6L12 8Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12 17V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 학교 아이콘
export function SchoolIcon({ size = 24, color = '#7C3AED' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L3 8L12 13L21 8L12 3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M3 8V16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M7 10V18L12 21L17 18V10" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  )
}

// 대중교통 아이콘
export function TransitIcon({ size = 24, color = '#0891B2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="4" width="14" height="14" rx="3" stroke={color} strokeWidth={1.5} />
      <Path d="M5 10H19" stroke={color} strokeWidth={1.5} />
      <Circle cx="8" cy="14" r="1" fill={color} />
      <Circle cx="16" cy="14" r="1" fill={color} />
      <Path d="M7 18V20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M17 18V20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 해 아이콘 (출근 시간대)
export function SunriseIcon({ size = 24, color = '#F59E0B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.93 4.93L6.34 6.34" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19.07 4.93L17.66 6.34" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3 12H5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 12H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 16C6 12.6863 8.68629 10 12 10C15.3137 10 18 12.6863 18 16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M2 18H22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 점심 아이콘 (한낮)
export function NoonIcon({ size = 24, color = '#F97316' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
      <Path d="M12 2V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 20V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.93 4.93L6.34 6.34" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M17.66 17.66L19.07 19.07" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M2 12H4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M20 12H22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.93 19.07L6.34 17.66" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M17.66 6.34L19.07 4.93" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 달 아이콘 (심야 시간대)
export function MoonIcon({ size = 24, color = '#6366F1' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88299 19.5345 5.67421 18.3258C4.46544 17.117 3.6258 15.589 3.25382 13.9205C2.88183 12.252 2.99269 10.5121 3.57346 8.9043C4.15422 7.2965 5.18082 5.88743 6.53321 4.84175C7.88559 3.79608 9.50779 3.15731 11.21 3C10.2134 4.34827 9.73384 6.00945 9.85853 7.68141C9.98321 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

// 공지 아이콘
export function AnnouncementIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8C18 6.4 17.4 4.9 16.2 3.8C15 2.6 13.5 2 12 2C10.5 2 8.9 2.6 7.8 3.8C6.6 4.9 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.7 21C13.5 21.3 13.3 21.6 13 21.7C12.7 21.9 12.4 22 12 22C11.6 22 11.3 21.9 11 21.7C10.7 21.6 10.4 21.3 10.3 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 정보 아이콘
export function InfoIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
      <Path d="M12 16V12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="8" r="1" fill={color} />
    </Svg>
  )
}

// 도움말 아이콘
export function HelpIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
      <Path d="M9.09 9C9.3 8.4 9.7 7.9 10.2 7.6C10.7 7.3 11.4 7.1 12 7.3C12.6 7.4 13.2 7.8 13.5 8.3C13.8 8.9 13.9 9.5 13.7 10.1C13.4 11 12.7 11.5 12 12V13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="17" r="1" fill={color} />
    </Svg>
  )
}

// 로그아웃 아이콘
export function LogoutIcon({ size = 24, color = '#DC2626' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 자동차 아이콘
export function CarIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 11L6.5 6C6.7 5.4 7.2 5 7.8 5H16.2C16.8 5 17.3 5.4 17.5 6L19 11" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 14H21V18C21 18.6 20.6 19 20 19H19C18.4 19 18 18.6 18 18V17H6V18C6 18.6 5.6 19 5 19H4C3.4 19 3 18.6 3 18V14Z" stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M3 14V11H21V14" stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <Circle cx="7" cy="14.5" r="1" fill={strokeColor} />
      <Circle cx="17" cy="14.5" r="1" fill={strokeColor} />
    </Svg>
  )
}

// 픽업 트럭 아이콘
export function PickupIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10V16H5" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 16H21V11L18 7H13V16H15" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 10H13" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="7" cy="16" r="2" stroke={strokeColor} strokeWidth={1.5} />
      <Circle cx="17" cy="16" r="2" stroke={strokeColor} strokeWidth={1.5} />
    </Svg>
  )
}

// 자전거 아이콘
export function BikeIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="17" r="3" stroke={strokeColor} strokeWidth={1.5} />
      <Circle cx="19" cy="17" r="3" stroke={strokeColor} strokeWidth={1.5} />
      <Path d="M5 17L8 9H14L17 17" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 9L15 5H18" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 17L14 9" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 도보 아이콘
export function WalkIcon({ size = 24, color = INACTIVE_GRAY, focused }: IconProps) {
  const strokeColor = focused ? ACTIVE_ORANGE : color
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="4" r="2" stroke={strokeColor} strokeWidth={1.5} />
      <Path d="M14 10L17 21" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 10L7 21" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 10V15L14 17V10" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 전송 아이콘
export function SendIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 키보드 아이콘
export function KeyboardIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth={1.5} />
      <Path d="M6 8H8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M11 8H13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 8H18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 12H8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M11 12H13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 12H18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M8 16H16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 플러스 아이콘
export function PlusIcon({ size = 24, color = INACTIVE_GRAY }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 12H19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 위치 아이콘
export function LocationIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 19 14.5 19 9C19 5.13 15.87 2 12 2C8.13 2 5 5.13 5 9C5 14.5 12 21 12 21Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={1.5} />
    </Svg>
  )
}

// 시계 아이콘
export function ClockIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <Path d="M12 6V12L15 15" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 상권 아이콘 (쇼핑백)
export function ShopIcon({ size = 24, color = '#F97316' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6H18L19 20H5L6 6Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M9 6V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 10V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M15 10V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 문화시설 아이콘 (박물관/극장)
export function CultureIcon({ size = 24, color = '#EC4899' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 21V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 21V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 21V17H15V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 11L12 4L21 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 종교시설 아이콘 (교회/사원)
export function ReligiousIcon({ size = 24, color = '#8B5CF6' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 4H14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 22V12L12 7L18 12V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 22H18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 22V18H14V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// 퇴근 아이콘 (석양)
export function SunsetIcon({ size = 24, color = '#EA580C' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 10V2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.93 10.93L6.34 9.52" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19.07 10.93L17.66 9.52" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3 18H5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 18H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 18C6 14.69 8.69 12 12 12C15.31 12 18 14.69 18 18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M2 22H22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

// 공공시설 아이콘 (관공서/주민센터)
export function PublicIcon({ size = 24, color = '#0EA5E9' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 21V9L12 4L19 9V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V15H15V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 4V2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="11" r="2" stroke={color} strokeWidth={1.5} />
    </Svg>
  )
}

// 직접추가 아이콘 (연필/편집)
export function ManualAddIcon({ size = 24, color = '#6B7280' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 6L18 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

