import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { CampaignSchedule, POIType } from '../types'

// Mock 데이터
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
      name: '역삼동 먹자골목',
      type: 'market',
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
]

const poiTypeLabel: Record<POIType, string> = {
  subway: '지하철',
  bus: '버스환승',
  market: '시장',
  school: '학원가',
  facility: '시설',
  religious: '종교시설',
  other: '기타',
}

function ScheduleCard({ schedule }: { schedule: CampaignSchedule }) {
  const handleStart = () => {
    console.log('Start:', schedule.id)
  }

  const handleNav = () => {
    console.log('Navigate:', schedule.poi.name)
  }

  const handleDefer = () => {
    console.log('Defer:', schedule.id)
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{schedule.startTime}</Text>
          <View
            style={[
              styles.poiTypeBadge,
              { backgroundColor: colors.poi[schedule.poi.type] },
            ]}
          >
            <Text style={styles.poiTypeText}>
              {poiTypeLabel[schedule.poi.type]}
            </Text>
          </View>
        </View>
        <Text style={styles.exposure}>
          예상 {schedule.estimatedExposure}명
        </Text>
      </View>

      <Text style={styles.poiName}>{schedule.poi.name}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleStart}
        >
          <Text style={styles.primaryButtonText}>시작</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleNav}
        >
          <Text style={styles.secondaryButtonText}>네비</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleDefer}
        >
          <Text style={styles.secondaryButtonText}>미루기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.date}>{dateString}</Text>
          <Text style={styles.subtitle}>
            오늘의 유세 {mockSchedules.length}곳
          </Text>
        </View>

        {/* 지도 영역 (플레이스홀더) */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>지도 뷰</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            (react-native-maps 연동 예정)
          </Text>
        </View>

        {/* 일정 카드 목록 */}
        <View style={styles.scheduleList}>
          {mockSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </View>

        {/* 일정 추가 버튼 */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 일정 추가</Text>
        </TouchableOpacity>
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
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  date: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.neutral[200],
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: fontSize.lg,
    color: colors.neutral[500],
  },
  mapPlaceholderSubtext: {
    fontSize: fontSize.sm,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
  scheduleList: {
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  poiTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  poiTypeText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '600',
  },
  exposure: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
  },
  poiName: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.neutral[100],
  },
  secondaryButtonText: {
    color: colors.neutral[700],
    fontWeight: '600',
  },
  addButton: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.neutral[500],
    fontSize: fontSize.md,
  },
})
