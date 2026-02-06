import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { CampaignSchedule, POIType } from '../types'
import { useManualScheduleStore, ManualSchedule } from '../stores'
import {
  ParkIcon,
  SchoolIcon,
  TransitIcon,
  ShopIcon,
  CultureIcon,
  ReligiousIcon,
  PublicIcon,
  ManualAddIcon,
  SunriseIcon,
  NoonIcon,
  SunsetIcon,
  MoonIcon,
  PlusIcon,
  LocationIcon,
  CalendarIcon,
  ClockIcon,
} from '../components/icons'

// 색상 옵션
const colorOptions = [
  '#818CF8', // indigo
  '#F87171', // red
  '#34D399', // green (checked)
  '#FBBF24', // yellow
  '#60A5FA', // blue
  '#F472B6', // pink
  '#2DD4BF', // teal
  '#94A3B8', // gray
]

// POI 카테고리 타입
type POICategory = 'all' | 'transit' | 'school' | 'shop' | 'park' | 'culture' | 'religious' | 'public' | 'manual'
type TimeCategory = 'all' | 'morning' | 'noon' | 'evening' | 'night'

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

const poiTypeLabel: Record<POIType | 'manual', string> = {
  subway: '대중교통',
  bus: '대중교통',
  market: '시장',
  school: '학교',
  facility: '공원',
  religious: '종교시설',
  other: '기타',
  manual: '직접추가',
}

// 시간대별 분류
function getTimeSlot(time: string): TimeCategory {
  const hour = parseInt(time.split(':')[0], 10)
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'noon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

// POI 유형별 분류
function getPOICategory(type: POIType): POICategory {
  if (type === 'subway' || type === 'bus') return 'transit'
  if (type === 'school') return 'school'
  if (type === 'market') return 'shop'
  if (type === 'facility') return 'park'
  if (type === 'religious') return 'religious'
  if (type === 'other') return 'public'
  return 'all'
}

// 칩 컴포넌트
function FilterChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      {icon && <View style={styles.chipIcon}>{icon}</View>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

function ScheduleCard({ schedule }: { schedule: CampaignSchedule & { isManual?: boolean; color?: string; memo?: string } }) {
  const timeSlot = getTimeSlot(schedule.startTime)
  const isManual = schedule.isManual

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{schedule.startTime}</Text>
          {isManual ? (
            <View
              style={[
                styles.poiTypeBadge,
                { backgroundColor: (schedule.color || '#6B7280') + '20' },
              ]}
            >
              <Text
                style={[
                  styles.poiTypeText,
                  { color: schedule.color || '#6B7280' },
                ]}
              >
                직접추가
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.poiTypeBadge,
                { backgroundColor: colors.poi[schedule.poi.type] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.poiTypeText,
                  { color: colors.poi[schedule.poi.type] },
                ]}
              >
                {poiTypeLabel[schedule.poi.type]}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.timeBadge,
              {
                backgroundColor:
                  timeSlot === 'morning'
                    ? '#FEF3C7'
                    : timeSlot === 'noon'
                      ? '#FFEDD5'
                      : timeSlot === 'evening'
                        ? '#FED7AA'
                        : '#E0E7FF',
              },
            ]}
          >
            {timeSlot === 'morning' && <SunriseIcon size={12} />}
            {timeSlot === 'noon' && <NoonIcon size={12} />}
            {timeSlot === 'evening' && <SunsetIcon size={12} />}
            {timeSlot === 'night' && <MoonIcon size={12} />}
            <Text
              style={[
                styles.timeBadgeText,
                {
                  color:
                    timeSlot === 'morning'
                      ? '#D97706'
                      : timeSlot === 'noon'
                        ? '#EA580C'
                        : timeSlot === 'evening'
                          ? '#C2410C'
                          : '#4F46E5',
                },
              ]}
            >
              {timeSlot === 'morning'
                ? '출근'
                : timeSlot === 'noon'
                  ? '점심'
                  : timeSlot === 'evening'
                    ? '퇴근'
                    : '심야'}
            </Text>
          </View>
        </View>
        {!isManual && (
          <Text style={styles.exposure}>
            예상 {schedule.estimatedExposure}명
          </Text>
        )}
      </View>

      <Text style={styles.poiName}>{schedule.poi.name}</Text>
      {isManual && schedule.memo && (
        <Text style={styles.memoText}>{schedule.memo}</Text>
      )}
    </TouchableOpacity>
  )
}

// 직접 일정 추가 모달 컴포넌트
function AddScheduleModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean
  onClose: () => void
  onAdd: (data: {
    title: string
    date: string
    startTime: string
    endTime: string
    location: { name: string; address: string } | null
    color: string
    memo: string
  }) => void
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('09:30')
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; address: string } | null>(null)
  const [selectedColor, setSelectedColor] = useState(colorOptions[2])
  const [memo, setMemo] = useState('')

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`
  }

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      location: selectedLocation,
      color: selectedColor,
      memo: memo.trim(),
    })
    // Reset form
    setTitle('')
    setSelectedLocation(null)
    setMemo('')
    onClose()
  }

  const canSubmit = title.trim().length > 0

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={addModalStyles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={addModalStyles.keyboardView}
        >
          {/* 헤더 */}
          <View style={addModalStyles.header}>
            <TouchableOpacity onPress={onClose} style={addModalStyles.closeButton}>
              <Text style={addModalStyles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={addModalStyles.headerTitle}>새 일정 추가</Text>
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!canSubmit}
            >
              <Text style={[addModalStyles.addText, !canSubmit && addModalStyles.addTextDisabled]}>
                추가
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={addModalStyles.content}>
            {/* 제목 */}
            <View style={addModalStyles.fieldGroup}>
              <Text style={addModalStyles.label}>제목 <Text style={addModalStyles.required}>*</Text></Text>
              <TextInput
                style={addModalStyles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="수동 일정 예시"
                placeholderTextColor={colors.neutral[400]}
              />
            </View>

            {/* 날짜 */}
            <View style={addModalStyles.fieldGroup}>
              <Text style={addModalStyles.label}>날짜 <Text style={addModalStyles.required}>*</Text></Text>
              <TouchableOpacity style={addModalStyles.inputRow}>
                <Text style={addModalStyles.inputText}>{formatDate(date)}</Text>
                <CalendarIcon size={20} color={colors.neutral[400]} />
              </TouchableOpacity>
            </View>

            {/* 시작/종료 시간 */}
            <View style={addModalStyles.timeRow}>
              <View style={addModalStyles.timeField}>
                <Text style={addModalStyles.label}>시작 <Text style={addModalStyles.required}>*</Text></Text>
                <TouchableOpacity style={addModalStyles.inputRow}>
                  <Text style={addModalStyles.inputText}>오전 {startTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
              <View style={addModalStyles.timeField}>
                <Text style={addModalStyles.label}>종료 <Text style={addModalStyles.required}>*</Text></Text>
                <TouchableOpacity style={addModalStyles.inputRow}>
                  <Text style={addModalStyles.inputText}>오전 {endTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 장소 */}
            <View style={addModalStyles.fieldGroup}>
              <Text style={addModalStyles.label}>장소</Text>
              {selectedLocation ? (
                <View style={addModalStyles.locationSelected}>
                  <View style={addModalStyles.locationIconWrapper}>
                    <LocationIcon size={20} color={colors.primary[500]} />
                  </View>
                  <View style={addModalStyles.locationInfo}>
                    <Text style={addModalStyles.locationName}>{selectedLocation.name}</Text>
                    <Text style={addModalStyles.locationAddress}>{selectedLocation.address}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                    <Text style={addModalStyles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={addModalStyles.inputRow}
                  onPress={() => {
                    // Mock location selection
                    setSelectedLocation({
                      name: '정돈 강남점',
                      address: '서울 강남구 강남대로110길 19-1',
                    })
                  }}
                >
                  <View style={addModalStyles.locationPlaceholder}>
                    <LocationIcon size={20} color={colors.neutral[400]} />
                    <Text style={addModalStyles.placeholderText}>장소 검색</Text>
                  </View>
                  <Text style={addModalStyles.chevron}>›</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 색상 */}
            <View style={addModalStyles.fieldGroup}>
              <Text style={addModalStyles.label}>색상 <Text style={addModalStyles.required}>*</Text></Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={addModalStyles.colorScroll}
              >
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      addModalStyles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && addModalStyles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={addModalStyles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 메모 */}
            <View style={addModalStyles.fieldGroup}>
              <Text style={addModalStyles.label}>메모</Text>
              <TextInput
                style={[addModalStyles.input, addModalStyles.memoInput]}
                value={memo}
                onChangeText={(text) => setMemo(text.slice(0, 30))}
                placeholder="메모를 입력하세요 (30자 이내)"
                placeholderTextColor={colors.neutral[400]}
                multiline
                maxLength={30}
              />
              <Text style={addModalStyles.charCount}>{memo.length}/30</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

export default function HomeScreen() {
  const [selectedPOI, setSelectedPOI] = useState<POICategory>('all')
  const [selectedTime, setSelectedTime] = useState<TimeCategory>('all')
  const [addModalVisible, setAddModalVisible] = useState(false)

  // Manual schedule store
  const { schedules: manualSchedules, addSchedule } = useManualScheduleStore()

  const today = new Date()
  const dateString = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const handleAddSchedule = (data: {
    title: string
    date: string
    startTime: string
    endTime: string
    location: { name: string; address: string } | null
    color: string
    memo: string
  }) => {
    addSchedule(data)
  }

  // Manual schedules를 CampaignSchedule 형식으로 변환
  const convertedManualSchedules: CampaignSchedule[] = useMemo(() => {
    return manualSchedules.map((ms) => ({
      id: ms.id,
      userId: 'user1',
      poi: {
        id: `poi-${ms.id}`,
        name: ms.location?.name || ms.title,
        type: 'other' as POIType, // 'manual' 카테고리로 표시하기 위해 나중에 필터링에서 처리
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
      isManual: true, // 수동 일정 구분용
      color: ms.color,
      memo: ms.memo,
    }))
  }, [manualSchedules])

  // 모든 일정 (mock + manual)
  const allSchedules = useMemo(() => {
    return [...mockSchedules, ...convertedManualSchedules]
  }, [convertedManualSchedules])

  // 필터링된 일정
  const filteredSchedules = allSchedules.filter((schedule) => {
    const isManual = (schedule as CampaignSchedule & { isManual?: boolean }).isManual
    const poiCategory = isManual ? 'manual' : getPOICategory(schedule.poi.type)
    const poiMatch = selectedPOI === 'all' || poiCategory === selectedPOI
    const timeMatch =
      selectedTime === 'all' || getTimeSlot(schedule.startTime) === selectedTime
    return poiMatch && timeMatch
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.date}>{dateString}</Text>
          <Text style={styles.subtitle}>
            오늘의 유세 {filteredSchedules.length}곳
          </Text>
        </View>

        {/* POI 카테고리 필터 칩 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>장소</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContainer}
          >
            <FilterChip
              label="전체"
              selected={selectedPOI === 'all'}
              onPress={() => setSelectedPOI('all')}
            />
            <FilterChip
              label="대중교통"
              icon={<TransitIcon size={16} color={selectedPOI === 'transit' ? '#FFF' : '#0891B2'} />}
              selected={selectedPOI === 'transit'}
              onPress={() => setSelectedPOI('transit')}
            />
            <FilterChip
              label="학교"
              icon={<SchoolIcon size={16} color={selectedPOI === 'school' ? '#FFF' : '#7C3AED'} />}
              selected={selectedPOI === 'school'}
              onPress={() => setSelectedPOI('school')}
            />
            <FilterChip
              label="상권"
              icon={<ShopIcon size={16} color={selectedPOI === 'shop' ? '#FFF' : '#F97316'} />}
              selected={selectedPOI === 'shop'}
              onPress={() => setSelectedPOI('shop')}
            />
            <FilterChip
              label="공원"
              icon={<ParkIcon size={16} color={selectedPOI === 'park' ? '#FFF' : '#16A34A'} />}
              selected={selectedPOI === 'park'}
              onPress={() => setSelectedPOI('park')}
            />
            <FilterChip
              label="문화시설"
              icon={<CultureIcon size={16} color={selectedPOI === 'culture' ? '#FFF' : '#EC4899'} />}
              selected={selectedPOI === 'culture'}
              onPress={() => setSelectedPOI('culture')}
            />
            <FilterChip
              label="종교시설"
              icon={<ReligiousIcon size={16} color={selectedPOI === 'religious' ? '#FFF' : '#8B5CF6'} />}
              selected={selectedPOI === 'religious'}
              onPress={() => setSelectedPOI('religious')}
            />
            <FilterChip
              label="공공시설"
              icon={<PublicIcon size={16} color={selectedPOI === 'public' ? '#FFF' : '#0EA5E9'} />}
              selected={selectedPOI === 'public'}
              onPress={() => setSelectedPOI('public')}
            />
            <FilterChip
              label="직접추가"
              icon={<ManualAddIcon size={16} color={selectedPOI === 'manual' ? '#FFF' : '#6B7280'} />}
              selected={selectedPOI === 'manual'}
              onPress={() => setSelectedPOI('manual')}
            />
          </ScrollView>
        </View>

        {/* 시간대 카테고리 필터 칩 */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>시간대</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContainer}
          >
            <FilterChip
              label="전체"
              selected={selectedTime === 'all'}
              onPress={() => setSelectedTime('all')}
            />
            <FilterChip
              label="출근"
              icon={<SunriseIcon size={16} color={selectedTime === 'morning' ? '#FFF' : '#F59E0B'} />}
              selected={selectedTime === 'morning'}
              onPress={() => setSelectedTime('morning')}
            />
            <FilterChip
              label="점심"
              icon={<NoonIcon size={16} color={selectedTime === 'noon' ? '#FFF' : '#F97316'} />}
              selected={selectedTime === 'noon'}
              onPress={() => setSelectedTime('noon')}
            />
            <FilterChip
              label="퇴근"
              icon={<SunsetIcon size={16} color={selectedTime === 'evening' ? '#FFF' : '#EA580C'} />}
              selected={selectedTime === 'evening'}
              onPress={() => setSelectedTime('evening')}
            />
            <FilterChip
              label="심야"
              icon={<MoonIcon size={16} color={selectedTime === 'night' ? '#FFF' : '#6366F1'} />}
              selected={selectedTime === 'night'}
              onPress={() => setSelectedTime('night')}
            />
          </ScrollView>
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
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>해당 조건의 일정이 없습니다</Text>
            </View>
          )}
        </View>

        {/* 일정 추가 버튼 */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <PlusIcon size={20} color={colors.neutral[400]} />
          <Text style={styles.addButtonText}>일정 추가</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 직접 일정 추가 모달 */}
      <AddScheduleModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddSchedule}
      />
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
  filterSection: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  filterLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chipContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    gap: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary[500],
  },
  chipIcon: {
    marginRight: 2,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.white,
  },
  mapPlaceholder: {
    height: 180,
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
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    flexWrap: 'wrap',
  },
  time: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  poiTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  poiTypeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  exposure: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
  },
  poiName: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  memoText: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.neutral[400],
  },
  addButton: {
    flexDirection: 'row',
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addButtonText: {
    color: colors.neutral[500],
    fontSize: fontSize.md,
  },
})

// 일정 추가 모달 스타일
const addModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeText: {
    fontSize: fontSize.xl,
    color: colors.neutral[500],
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  addText: {
    fontSize: fontSize.md,
    color: colors.primary[500],
    fontWeight: '600',
  },
  addTextDisabled: {
    color: colors.neutral[300],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.primary[500],
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.neutral[800],
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
  },
  inputText: {
    fontSize: fontSize.md,
    color: colors.neutral[800],
  },
  placeholderText: {
    fontSize: fontSize.md,
    color: colors.neutral[400],
  },
  chevron: {
    fontSize: fontSize.xl,
    color: colors.neutral[400],
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  timeField: {
    flex: 1,
  },
  locationPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[300],
    padding: spacing.md,
    gap: spacing.sm,
  },
  locationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  locationAddress: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginTop: 2,
  },
  removeText: {
    fontSize: fontSize.lg,
    color: colors.neutral[400],
    padding: spacing.xs,
  },
  colorScroll: {
    marginTop: spacing.xs,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmark: {
    fontSize: fontSize.lg,
    color: colors.white,
    fontWeight: 'bold',
  },
  memoInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
})
