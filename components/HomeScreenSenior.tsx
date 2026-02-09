import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { CampaignSchedule, POIType } from '../types'
import { useManualScheduleStore } from '../stores'
import AppHeader from './AppHeader'
import { CalendarIcon, LocationIcon, ClockIcon, NavigationIcon, GpsIcon } from './icons'

// Mock 데이터 (HomeScreen과 동일)
const mockSchedules: CampaignSchedule[] = [
  {
    id: '1',
    userId: 'user1',
    poi: {
      id: 'poi1',
      name: '강남역 3번출구',
      type: 'subway',
      location: { lat: 37.4979, lng: 127.0276 },
      baseExposure: 300,
      timeWeights: { morning: 1.4, noon: 1.0, evening: 1.4 },
      accessibility: 0.9,
    },
    date: '2024-12-22',
    startTime: '09:00',
    estimatedExposure: 120,
    status: 'planned',
    createdAt: '2024-12-22T00:00:00Z',
    updatedAt: '2024-12-22T00:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    poi: {
      id: 'poi2',
      name: '삼성역 환승통로',
      type: 'subway',
      location: { lat: 37.5089, lng: 127.0631 },
      baseExposure: 250,
      timeWeights: { morning: 1.3, noon: 1.0, evening: 1.3 },
      accessibility: 0.85,
    },
    date: '2024-12-22',
    startTime: '11:00',
    estimatedExposure: 85,
    status: 'planned',
    createdAt: '2024-12-22T00:00:00Z',
    updatedAt: '2024-12-22T00:00:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    poi: {
      id: 'poi3',
      name: '역삼공원',
      type: 'facility',
      location: { lat: 37.5006, lng: 127.0366 },
      baseExposure: 150,
      timeWeights: { morning: 0.8, noon: 1.2, evening: 1.0 },
      accessibility: 0.7,
    },
    date: '2024-12-22',
    startTime: '14:00',
    estimatedExposure: 65,
    status: 'planned',
    createdAt: '2024-12-22T00:00:00Z',
    updatedAt: '2024-12-22T00:00:00Z',
  },
  {
    id: '4',
    userId: 'user1',
    poi: {
      id: 'poi4',
      name: '대치동 학원가',
      type: 'school',
      location: { lat: 37.5006, lng: 127.0566 },
      baseExposure: 200,
      timeWeights: { morning: 0.6, noon: 0.8, evening: 1.5 },
      accessibility: 0.8,
    },
    date: '2024-12-22',
    startTime: '22:00',
    estimatedExposure: 95,
    status: 'planned',
    createdAt: '2024-12-22T00:00:00Z',
    updatedAt: '2024-12-22T00:00:00Z',
  },
]

export default function HomeScreenSenior() {
  const { schedules: manualSchedules, addVisitRecord } = useManualScheduleStore()
  const [isVerifying, setIsVerifying] = useState(false)

  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  // Manual schedules를 CampaignSchedule 형식으로 변환
  const convertedManualSchedules: (CampaignSchedule & { isManual: boolean })[] = useMemo(() => {
    return manualSchedules.map((ms) => ({
      id: ms.id,
      userId: 'user1',
      poi: {
        id: `poi-${ms.id}`,
        name: ms.location?.name || ms.title,
        type: 'other' as POIType,
        location: { lat: 0, lng: 0 },
        baseExposure: 0,
        timeWeights: { morning: 1, noon: 1, evening: 1 },
        accessibility: 1,
      },
      date: ms.date,
      startTime: ms.startTime,
      estimatedExposure: 0,
      status: 'planned' as const,
      createdAt: ms.createdAt,
      updatedAt: ms.createdAt,
      isManual: true,
    }))
  }, [manualSchedules])

  // 큰 글씨 모드에서는 수동일정 제외 (자동 일정만 표시)
  const allSchedules = useMemo(() => {
    const autoSchedules = mockSchedules.map((s) => ({ ...s, isManual: false }))
    return autoSchedules.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [])

  // 현재 시간 이후 일정들 (시간순 정렬)
  const upcomingSchedules = useMemo(() => {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    return allSchedules.filter((s) => s.startTime >= currentTime)
  }, [allSchedules])

  const nextSchedule = upcomingSchedules[0]
  const remainingSchedules = upcomingSchedules.slice(1)
  const totalSchedules = allSchedules.length

  // 길찾기 핸들러
  const handleDirections = (schedule: CampaignSchedule) => {
    const { lat, lng } = schedule.poi.location
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(schedule.poi.name)},${lat},${lng}`
    Linking.openURL(url)
  }

  // 위치 인증 핸들러
  const handleVerifyLocation = (schedule: CampaignSchedule & { isManual: boolean }) => {
    setIsVerifying(true)

    // Mock GPS verification (실제로는 위치 권한 및 거리 계산 필요)
    setTimeout(() => {
      setIsVerifying(false)

      // 방문 기록 추가
      addVisitRecord({
        scheduleId: schedule.id,
        scheduleName: schedule.poi.name,
        category: schedule.isManual ? 'manual' : schedule.poi.type,
        date: schedule.date,
      })

      Alert.alert('위치 인증 완료', `${schedule.poi.name} 방문이 기록되었습니다.`)
    }, 1500)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="홈" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 오늘 날짜 + 유세 N곳 (한 섹션으로 통합) */}
        <View style={styles.dateSection}>
          <View style={styles.dateRow}>
            <CalendarIcon size={28} color={colors.primary[500]} />
            <Text style={styles.dateText} numberOfLines={1} adjustsFontSizeToFit>
              {dateString}
            </Text>
          </View>
          <Text style={styles.scheduleCountText}>
            오늘 유세 <Text style={styles.scheduleCountNumber}>{totalSchedules}</Text>곳
          </Text>
        </View>

        {/* 다음 일정 메인 카드 */}
        {nextSchedule ? (
          <View style={styles.mainScheduleCard}>
            <Text style={styles.cardTitle}>다음 일정</Text>
            <View style={styles.cardContent}>
              <View style={styles.timeRow}>
                <ClockIcon size={32} color={colors.primary[500]} />
                <Text style={styles.scheduleTime}>{nextSchedule.startTime}</Text>
              </View>
              <View style={styles.locationRow}>
                <LocationIcon size={32} color={colors.neutral[500]} />
                <Text style={styles.scheduleLocation} numberOfLines={2}>
                  {nextSchedule.poi.name}
                </Text>
              </View>
            </View>

            {/* 액션 버튼 */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => handleDirections(nextSchedule)}
              >
                <NavigationIcon size={24} color={colors.white} />
                <Text style={styles.buttonText}>길찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.verifyButton, isVerifying && styles.buttonDisabled]}
                onPress={() => handleVerifyLocation(nextSchedule)}
                disabled={isVerifying}
              >
                <GpsIcon size={24} color={colors.white} />
                <Text style={styles.buttonText}>
                  {isVerifying ? '확인 중...' : '위치 인증'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.mainScheduleCard}>
            <Text style={styles.cardTitle}>다음 일정</Text>
            <View style={styles.cardContent}>
              <Text style={styles.noScheduleText}>오늘 남은 일정이 없습니다</Text>
            </View>
          </View>
        )}

        {/* 이후 일정 리스트 */}
        {remainingSchedules.length > 0 && (
          <View style={styles.remainingSection}>
            <Text style={styles.remainingTitle}>이후 일정</Text>
            {remainingSchedules.map((schedule) => (
              <View key={schedule.id} style={styles.remainingCard}>
                <View style={styles.remainingTimeRow}>
                  <ClockIcon size={20} color={colors.primary[500]} />
                  <Text style={styles.remainingTime}>{schedule.startTime}</Text>
                </View>
                <View style={styles.remainingLocationRow}>
                  <LocationIcon size={20} color={colors.neutral[400]} />
                  <Text style={styles.remainingLocation} numberOfLines={1}>
                    {schedule.poi.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },

  // 날짜 + 유세 카운트 섹션
  dateSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateText: {
    fontSize: fontSize.senior.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
    flex: 1,
  },
  scheduleCountText: {
    fontSize: fontSize.senior.xl,
    fontWeight: '600',
    color: colors.neutral[600],
    textAlign: 'center',
  },
  scheduleCountNumber: {
    fontSize: fontSize.senior['2xl'],
    fontWeight: 'bold',
    color: colors.primary[500],
  },

  // 메인 일정 카드
  mainScheduleCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  cardTitle: {
    fontSize: fontSize.senior.md,
    fontWeight: '600',
    color: colors.primary[500],
    marginBottom: spacing.lg,
  },
  cardContent: {
    gap: spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  scheduleTime: {
    fontSize: fontSize.senior['2xl'],
    fontWeight: 'bold',
    color: colors.primary[500],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  scheduleLocation: {
    fontSize: fontSize.senior.xl,
    fontWeight: '500',
    color: colors.neutral[700],
    flex: 1,
    lineHeight: 36,
  },

  // 액션 버튼
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  verifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.success[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: fontSize.senior.md,
    fontWeight: '600',
    color: colors.white,
  },

  noScheduleText: {
    fontSize: fontSize.senior.lg,
    color: colors.neutral[400],
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },

  // 이후 일정 섹션
  remainingSection: {
    gap: spacing.md,
  },
  remainingTitle: {
    fontSize: fontSize.senior.md,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  remainingCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  remainingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  remainingTime: {
    fontSize: fontSize.senior.md,
    fontWeight: '600',
    color: colors.primary[500],
  },
  remainingLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  remainingLocation: {
    fontSize: fontSize.senior.md,
    color: colors.neutral[600],
    flex: 1,
  },
})
