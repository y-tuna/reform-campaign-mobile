import React, { useState, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { POIType } from '../types'
import { useManualScheduleStore } from '../stores'
import AppHeader from '../components/AppHeader'
import {
  TransitIcon,
  SchoolIcon,
  ShopIcon,
  ParkIcon,
  CultureIcon,
  ReligiousIcon,
  PublicIcon,
  ManualAddIcon,
} from '../components/icons'

// 카테고리 정의
type CategoryKey = 'transit' | 'school' | 'shop' | 'park' | 'culture' | 'religious' | 'public' | 'manual'

interface CategoryInfo {
  key: CategoryKey
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  color: string
  visitRate: number
}

const categories: CategoryInfo[] = [
  { key: 'transit', label: '대중교통', icon: TransitIcon, color: '#0891B2', visitRate: 45 },
  { key: 'school', label: '학교', icon: SchoolIcon, color: '#7C3AED', visitRate: 32 },
  { key: 'shop', label: '상권', icon: ShopIcon, color: '#F97316', visitRate: 28 },
  { key: 'park', label: '공원', icon: ParkIcon, color: '#16A34A', visitRate: 22 },
  { key: 'culture', label: '문화시설', icon: CultureIcon, color: '#EC4899', visitRate: 15 },
  { key: 'religious', label: '종교시설', icon: ReligiousIcon, color: '#8B5CF6', visitRate: 18 },
  { key: 'public', label: '공공시설', icon: PublicIcon, color: '#0EA5E9', visitRate: 12 },
  { key: 'manual', label: '직접추가', icon: ManualAddIcon, color: '#6B7280', visitRate: 8 },
]

// 카테고리별 Mock POI 데이터
const mockPOIsByCategory: Record<CategoryKey, { id: string; name: string; visits: number; exposure: number }[]> = {
  transit: [
    { id: 't1', name: '강남역 3번출구', visits: 8, exposure: 320 },
    { id: 't2', name: '삼성역 환승통로', visits: 6, exposure: 250 },
    { id: 't3', name: '선릉역 1번출구', visits: 5, exposure: 180 },
    { id: 't4', name: '역삼역 4번출구', visits: 4, exposure: 160 },
    { id: 't5', name: '교대역 환승통로', visits: 4, exposure: 150 },
    { id: 't6', name: '서초역 2번출구', visits: 3, exposure: 120 },
    { id: 't7', name: '방배역 1번출구', visits: 3, exposure: 110 },
    { id: 't8', name: '논현역 3번출구', visits: 2, exposure: 90 },
    { id: 't9', name: '신논현역 5번출구', visits: 2, exposure: 85 },
    { id: 't10', name: '언주역 2번출구', visits: 1, exposure: 45 },
  ],
  school: [
    { id: 's1', name: '대치동 학원가', visits: 7, exposure: 280 },
    { id: 's2', name: '목동 학원가', visits: 5, exposure: 200 },
    { id: 's3', name: '중계동 학원가', visits: 4, exposure: 160 },
    { id: 's4', name: '강남대성학원 앞', visits: 3, exposure: 120 },
    { id: 's5', name: '서초고등학교 앞', visits: 3, exposure: 110 },
    { id: 's6', name: '단대부고 앞', visits: 2, exposure: 80 },
    { id: 's7', name: '휘문고등학교 앞', visits: 2, exposure: 75 },
    { id: 's8', name: '서울대입구역 학원가', visits: 2, exposure: 70 },
    { id: 's9', name: '노량진 학원가', visits: 1, exposure: 50 },
    { id: 's10', name: '신림동 학원가', visits: 1, exposure: 45 },
  ],
  shop: [
    { id: 'sh1', name: '강남역 상권', visits: 6, exposure: 240 },
    { id: 'sh2', name: '홍대입구 상권', visits: 5, exposure: 200 },
    { id: 'sh3', name: '이태원 상권', visits: 4, exposure: 160 },
    { id: 'sh4', name: '명동 상권', visits: 4, exposure: 150 },
    { id: 'sh5', name: '건대입구 상권', visits: 3, exposure: 120 },
    { id: 'sh6', name: '신촌 상권', visits: 3, exposure: 110 },
    { id: 'sh7', name: '압구정 상권', visits: 2, exposure: 80 },
    { id: 'sh8', name: '잠실 상권', visits: 2, exposure: 75 },
    { id: 'sh9', name: '여의도 상권', visits: 1, exposure: 40 },
    { id: 'sh10', name: '종로 상권', visits: 1, exposure: 35 },
  ],
  park: [
    { id: 'p1', name: '역삼공원', visits: 5, exposure: 150 },
    { id: 'p2', name: '양재시민의숲', visits: 4, exposure: 120 },
    { id: 'p3', name: '올림픽공원', visits: 3, exposure: 100 },
    { id: 'p4', name: '서울숲', visits: 3, exposure: 95 },
    { id: 'p5', name: '한강공원 반포지구', visits: 2, exposure: 80 },
    { id: 'p6', name: '보라매공원', visits: 2, exposure: 75 },
    { id: 'p7', name: '여의도공원', visits: 2, exposure: 70 },
    { id: 'p8', name: '남산공원', visits: 1, exposure: 45 },
    { id: 'p9', name: '북서울꿈의숲', visits: 1, exposure: 40 },
    { id: 'p10', name: '월드컵공원', visits: 1, exposure: 35 },
  ],
  culture: [
    { id: 'c1', name: '코엑스', visits: 4, exposure: 160 },
    { id: 'c2', name: '예술의전당', visits: 3, exposure: 120 },
    { id: 'c3', name: '국립중앙박물관', visits: 3, exposure: 110 },
    { id: 'c4', name: '세종문화회관', visits: 2, exposure: 80 },
    { id: 'c5', name: 'DDP', visits: 2, exposure: 75 },
    { id: 'c6', name: '서울시립미술관', visits: 2, exposure: 70 },
    { id: 'c7', name: '국립현대미술관', visits: 1, exposure: 45 },
    { id: 'c8', name: '롯데콘서트홀', visits: 1, exposure: 40 },
    { id: 'c9', name: '블루스퀘어', visits: 1, exposure: 35 },
    { id: 'c10', name: 'CGV 용산아이파크몰', visits: 1, exposure: 30 },
  ],
  religious: [
    { id: 'r1', name: '명동성당', visits: 4, exposure: 140 },
    { id: 'r2', name: '조계사', visits: 3, exposure: 110 },
    { id: 'r3', name: '봉은사', visits: 3, exposure: 100 },
    { id: 'r4', name: '영락교회', visits: 2, exposure: 80 },
    { id: 'r5', name: '사랑의교회', visits: 2, exposure: 75 },
    { id: 'r6', name: '광화문교회', visits: 2, exposure: 70 },
    { id: 'r7', name: '서울중앙성원', visits: 1, exposure: 40 },
    { id: 'r8', name: '진관사', visits: 1, exposure: 35 },
    { id: 'r9', name: '원효로성당', visits: 1, exposure: 30 },
    { id: 'r10', name: '금란교회', visits: 1, exposure: 25 },
  ],
  public: [
    { id: 'pb1', name: '강남구청', visits: 3, exposure: 120 },
    { id: 'pb2', name: '역삼1동 주민센터', visits: 3, exposure: 100 },
    { id: 'pb3', name: '삼성1동 주민센터', visits: 2, exposure: 80 },
    { id: 'pb4', name: '서울시청', visits: 2, exposure: 75 },
    { id: 'pb5', name: '강남세무서', visits: 2, exposure: 70 },
    { id: 'pb6', name: '서초구청', visits: 1, exposure: 50 },
    { id: 'pb7', name: '강남경찰서', visits: 1, exposure: 45 },
    { id: 'pb8', name: '역삼동 우체국', visits: 1, exposure: 40 },
    { id: 'pb9', name: '강남구 보건소', visits: 1, exposure: 35 },
    { id: 'pb10', name: '서초1동 주민센터', visits: 1, exposure: 30 },
  ],
  manual: [
    { id: 'm1', name: '나이키 강남점', visits: 2, exposure: 60 },
    { id: 'm2', name: '스타벅스 역삼역점', visits: 2, exposure: 55 },
    { id: 'm3', name: '이디야커피 강남점', visits: 1, exposure: 30 },
    { id: 'm4', name: '맥도날드 삼성점', visits: 1, exposure: 25 },
    { id: 'm5', name: '파리바게뜨 선릉점', visits: 1, exposure: 20 },
  ],
}

// Mock 데이터 (누적 총계)
const mockStats = {
  totalVisits: 156,
  totalExposure: 18420,
  totalDistance: 287,
  overallVisitRate: 68, // 전체 카테고리 통합 방문율
}

/* ========== 활동시간 히트맵 섹션 시작 (주석처리로 숨기기 가능) ========== */

// 히트맵 Mock 데이터 생성 (3월 1일 ~ 6월 2일)
function generateHeatmapData(): { date: string; hours: number; schedules: number }[] {
  const data: { date: string; hours: number; schedules: number }[] = []
  const startDate = new Date(2025, 2, 1) // 3월 1일
  const endDate = new Date(2025, 5, 2) // 6월 2일

  const current = new Date(startDate)
  while (current <= endDate) {
    // 랜덤하게 활동 데이터 생성 (0~8시간, 가중치로 0이 더 많이 나오게)
    const random = Math.random()
    let hours = 0
    let schedules = 0

    if (random > 0.3) { // 70% 확률로 활동 있음
      if (random > 0.9) {
        hours = Math.floor(Math.random() * 3) + 6 // 6-8시간
        schedules = Math.floor(Math.random() * 3) + 4 // 4-6개
      } else if (random > 0.7) {
        hours = Math.floor(Math.random() * 2) + 4 // 4-5시간
        schedules = Math.floor(Math.random() * 2) + 3 // 3-4개
      } else if (random > 0.5) {
        hours = Math.floor(Math.random() * 2) + 2 // 2-3시간
        schedules = Math.floor(Math.random() * 2) + 2 // 2-3개
      } else {
        hours = Math.floor(Math.random() * 2) + 1 // 1-2시간
        schedules = Math.floor(Math.random() * 2) + 1 // 1-2개
      }
    }

    data.push({
      date: current.toISOString().split('T')[0],
      hours,
      schedules,
    })

    current.setDate(current.getDate() + 1)
  }

  return data
}

const heatmapData = generateHeatmapData()

// 히트맵 통계 계산
const heatmapStats = {
  totalHours: heatmapData.reduce((acc, d) => acc + d.hours, 0),
  totalSchedules: heatmapData.reduce((acc, d) => acc + d.schedules, 0),
}

// 활동 시간에 따른 색상 반환
function getHeatmapColor(hours: number): string {
  if (hours === 0) return colors.neutral[100]
  if (hours <= 1) return '#BBF7D0' // green-200
  if (hours <= 2) return '#86EFAC' // green-300
  if (hours <= 4) return '#4ADE80' // green-400
  if (hours <= 6) return '#22C55E' // green-500
  return '#16A34A' // green-600
}

// 히트맵을 GitHub 스타일로 그룹화 (주 단위 컬럼, 요일 행)
function groupHeatmapByWeeks(data: { date: string; hours: number; schedules: number }[]) {
  const weeks: { date: string; hours: number; schedules: number }[][] = []
  let currentWeek: { date: string; hours: number; schedules: number }[] = []

  // 첫 번째 날짜의 요일 확인 (0 = 일요일)
  const firstDate = new Date(data[0].date)
  const firstDayOfWeek = firstDate.getDay()

  // 첫 주 앞에 빈 셀 추가
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', hours: -1, schedules: 0 })
  }

  data.forEach((item) => {
    const date = new Date(item.date)
    const dayOfWeek = date.getDay()

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    currentWeek.push(item)
  })

  // 마지막 주 처리
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}

const heatmapWeeks = groupHeatmapByWeeks(heatmapData)
const dayLabels = ['일', '월', '화', '수', '목', '금', '토']

// 히트맵 컴포넌트
function ActivityHeatmap() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>활동시간 히트맵</Text>

      {/* 기간 표시 */}
      <Text style={heatmapStyles.dateRange}>2025.3.1 ~ 2025.6.2</Text>

      {/* 통계 카드 */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {heatmapStats.totalHours}
            <Text style={styles.statUnit}>시간</Text>
          </Text>
          <Text style={styles.statLabel}>총 활동 시간</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {heatmapStats.totalSchedules}
            <Text style={styles.statUnit}>개</Text>
          </Text>
          <Text style={styles.statLabel}>소화 일정 수</Text>
        </View>
      </View>

      {/* 히트맵 그리드 */}
      <View style={heatmapStyles.heatmapWrapper}>
        <View style={heatmapStyles.heatmapContainer}>
          {/* 요일 라벨 */}
          <View style={heatmapStyles.dayLabelColumn}>
            {dayLabels.map((day) => (
              <Text
                key={day}
                style={heatmapStyles.dayLabel}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* 주별 컬럼 */}
          <View style={heatmapStyles.weeksContainer}>
            {heatmapWeeks.map((week, weekIndex) => (
              <View key={weekIndex} style={heatmapStyles.weekColumn}>
                {week.map((day, dayIndex) => (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    style={[
                      heatmapStyles.cell,
                      { backgroundColor: day.hours >= 0 ? getHeatmapColor(day.hours) : 'transparent' },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 범례 */}
      <View style={heatmapStyles.legend}>
        <Text style={heatmapStyles.legendText}>적음</Text>
        <View style={[heatmapStyles.legendCell, { backgroundColor: colors.neutral[100] }]} />
        <View style={[heatmapStyles.legendCell, { backgroundColor: '#BBF7D0' }]} />
        <View style={[heatmapStyles.legendCell, { backgroundColor: '#86EFAC' }]} />
        <View style={[heatmapStyles.legendCell, { backgroundColor: '#4ADE80' }]} />
        <View style={[heatmapStyles.legendCell, { backgroundColor: '#22C55E' }]} />
        <View style={[heatmapStyles.legendCell, { backgroundColor: '#16A34A' }]} />
        <Text style={heatmapStyles.legendText}>많음</Text>
      </View>
    </View>
  )
}

// 히트맵 전용 스타일
const heatmapStyles = StyleSheet.create({
  dateRange: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginBottom: spacing.md,
  },
  heatmapWrapper: {
    marginTop: spacing.md,
  },
  heatmapContainer: {
    flexDirection: 'row',
  },
  dayLabelColumn: {
    justifyContent: 'flex-start',
    marginRight: 4,
    gap: 2,
  },
  dayLabel: {
    height: 12,
    fontSize: 8,
    color: colors.neutral[500],
    lineHeight: 12,
  },
  weeksContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  weekColumn: {
    flex: 1,
    gap: 2,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: 4,
  },
  legendText: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
})

/* ========== 활동시간 히트맵 섹션 끝 ========== */

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
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value.toLocaleString()}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
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

function CategoryCard({
  category,
  onPress,
}: {
  category: CategoryInfo
  onPress: () => void
}) {
  const IconComponent = category.icon
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.categoryIconWrapper, { backgroundColor: category.color + '20' }]}>
        <IconComponent size={24} color={category.color} />
      </View>
      <Text style={styles.categoryCardLabel}>{category.label}</Text>
      <Text style={[styles.categoryCardRate, { color: category.color }]}>
        {category.visitRate}%
      </Text>
    </TouchableOpacity>
  )
}

export default function DashboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Manual schedule store
  const { schedules: manualSchedules, visitRecords, getTotalVisitCount } = useManualScheduleStore()

  // Manual schedules를 POI 데이터 형식으로 변환
  const manualPOIs = useMemo(() => {
    return manualSchedules.map((ms) => ({
      id: ms.id,
      name: ms.location?.name || ms.title,
      visits: 1,
      exposure: 0, // 수동 일정은 노출 예상 없음
    }))
  }, [manualSchedules])

  // 동적으로 업데이트되는 카테고리별 POI 데이터
  const poisByCategory = useMemo(() => {
    return {
      ...mockPOIsByCategory,
      manual: manualPOIs.length > 0 ? manualPOIs : mockPOIsByCategory.manual,
    }
  }, [manualPOIs])

  // 동적 카테고리 (실제 방문 기록 기반 방문율 업데이트)
  const dynamicCategories = useMemo(() => {
    // 카테고리별 방문 횟수 집계
    const visitCountByCategory: Record<string, number> = {}
    visitRecords.forEach((record) => {
      const cat = record.category === 'subway' || record.category === 'bus' ? 'transit' :
                  record.category === 'facility' ? 'park' :
                  record.category === 'other' ? 'manual' : record.category
      visitCountByCategory[cat] = (visitCountByCategory[cat] || 0) + 1
    })

    return categories.map((cat) => {
      const actualVisits = visitCountByCategory[cat.key] || 0
      // 기본 방문율 + 실제 방문 기록 반영
      const newVisitRate = cat.visitRate + actualVisits * 5
      return { ...cat, visitRate: Math.min(newVisitRate, 100) }
    })
  }, [visitRecords])

  const handleCategoryPress = (category: CategoryInfo) => {
    setSelectedCategory(category)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedCategory(null)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="대시보드" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>내 활동 현황</Text>
          <Text style={styles.period}>누적 총계</Text>
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
          <Text style={styles.sectionTitle}>전체 방문율</Text>
          <View style={styles.overallProgressContainer}>
            <View style={styles.overallProgressBar}>
              <View
                style={[
                  styles.overallProgressFill,
                  { width: `${mockStats.overallVisitRate}%` },
                ]}
              />
            </View>
            <Text style={styles.overallProgressText}>{mockStats.overallVisitRate}%</Text>
          </View>

          {/* 카테고리 카드 그리드 */}
          <View style={styles.categoryCardGrid}>
            {dynamicCategories.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* 활동시간 히트맵 (주석처리로 숨기기 가능 - ActivityHeatmap 컴포넌트) */}
        <ActivityHeatmap />

        {/* Module B: GPS 히트맵 (이미지) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유세 히트맵</Text>
          <Image
            source={require('../assets/gps-heatmap.png')}
            style={styles.heatmapImage}
            resizeMode="cover"
          />
        </View>

        {/* GPS 히트맵 플레이스홀더 (주석처리됨)
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유세 히트맵</Text>
          <View style={styles.heatmapPlaceholder}>
            <Text style={styles.placeholderText}>GPS 히트맵</Text>
            <Text style={styles.placeholderSubtext}>
              (POI 알고리즘 연동 후 활성화)
            </Text>
          </View>
        </View>
        */}
      </ScrollView>

      {/* 카테고리 상세 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <View style={[styles.modalIconWrapper, { backgroundColor: selectedCategory.color + '20' }]}>
                      {React.createElement(selectedCategory.icon, { size: 24, color: selectedCategory.color })}
                    </View>
                    <Text style={styles.modalTitle}>{selectedCategory.label}</Text>
                  </View>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>방문률</Text>
                    <Text style={[styles.modalStatValue, { color: selectedCategory.color }]}>
                      {selectedCategory.visitRate}%
                    </Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>총 방문</Text>
                    <Text style={styles.modalStatValue}>
                      {poisByCategory[selectedCategory.key].reduce((acc, poi) => acc + poi.visits, 0)}회
                    </Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>예상 접촉</Text>
                    <Text style={styles.modalStatValue}>
                      {selectedCategory.key === 'manual'
                        ? '-'
                        : `${poisByCategory[selectedCategory.key].reduce((acc, poi) => acc + poi.exposure, 0)}명`}
                    </Text>
                  </View>
                </View>

                <Text style={styles.poiListTitle}>방문 장소</Text>
                <FlatList
                  data={poisByCategory[selectedCategory.key]}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <View style={styles.poiItem}>
                      <Text style={styles.poiRank}>{index + 1}</Text>
                      <View style={styles.poiInfo}>
                        <Text style={styles.poiName}>{item.name}</Text>
                        <Text style={styles.poiMeta}>
                          방문 {item.visits}회 · 접촉 {selectedCategory.key === 'manual' ? '-' : `${item.exposure}명`}
                        </Text>
                      </View>
                    </View>
                  )}
                  style={styles.poiList}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 0,
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
    textAlign: 'center',
  },
  categoryContainer: {
    gap: spacing.sm,
  },
  overallProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  overallProgressBar: {
    flex: 1,
    height: 20,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  overallProgressText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary[500],
    minWidth: 50,
    textAlign: 'right',
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
  heatmapImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.md,
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
  // 카테고리 카드 그리드
  categoryCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryCardLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[700],
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryCardRate: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
  },
  modalStats: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  modalStatItem: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    marginBottom: 2,
  },
  modalStatValue: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  poiListTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  poiList: {
    paddingHorizontal: spacing.md,
  },
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  poiRank: {
    width: 24,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.neutral[400],
  },
  poiInfo: {
    flex: 1,
  },
  poiName: {
    fontSize: fontSize.md,
    color: colors.neutral[800],
    fontWeight: '500',
  },
  poiMeta: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginTop: 2,
  },
})
