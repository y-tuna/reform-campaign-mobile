import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { POIType } from '../types'

// Mock 데이터
const mockStats = {
  totalVisits: 12,
  totalExposure: 1240,
  totalDistance: 45,
  categoryBreakdown: {
    subway: 45,
    market: 30,
    school: 25,
  } as Record<string, number>,
}

const categoryLabels: Record<POIType, string> = {
  subway: '지하철',
  bus: '버스환승',
  market: '시장',
  school: '학원가',
  facility: '시설',
  religious: '종교시설',
  other: '기타',
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value.toLocaleString()}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function CategoryBar({
  category,
  percentage,
}: {
  category: POIType
  percentage: number
}) {
  return (
    <View style={styles.categoryRow}>
      <Text style={styles.categoryLabel}>{categoryLabels[category]}</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${percentage}%`,
              backgroundColor: colors.poi[category],
            },
          ]}
        />
      </View>
      <Text style={styles.categoryPercentage}>{percentage}%</Text>
    </View>
  )
}

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>내 활동 현황</Text>
          <Text style={styles.period}>이번 주</Text>
        </View>

        {/* Module A: 활동 통계 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>활동 통계</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="유세 횟수"
              value={mockStats.totalVisits}
              unit="회"
            />
            <StatCard
              label="예상 접촉"
              value={mockStats.totalExposure}
              unit="명"
            />
            <StatCard
              label="이동 거리"
              value={mockStats.totalDistance}
              unit="km"
            />
          </View>
        </View>

        {/* 방문 카테고리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>방문 카테고리</Text>
          <View style={styles.categoryContainer}>
            {Object.entries(mockStats.categoryBreakdown).map(
              ([category, percentage]) => (
                <CategoryBar
                  key={category}
                  category={category as POIType}
                  percentage={percentage}
                />
              )
            )}
          </View>
        </View>

        {/* Module B: GPS 히트맵 (플레이스홀더) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유세 히트맵</Text>
          <View style={styles.heatmapPlaceholder}>
            <Text style={styles.placeholderText}>GPS 히트맵</Text>
            <Text style={styles.placeholderSubtext}>
              (POI 알고리즘 연동 후 활성화)
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  period: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
  },
  section: {
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  statUnit: {
    fontSize: fontSize.sm,
    fontWeight: 'normal',
    color: colors.neutral[500],
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  categoryContainer: {
    gap: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryLabel: {
    width: 60,
    fontSize: fontSize.sm,
    color: colors.neutral[600],
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  categoryPercentage: {
    width: 40,
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    textAlign: 'right',
  },
  heatmapPlaceholder: {
    height: 200,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
  },
  placeholderSubtext: {
    fontSize: fontSize.sm,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
})
