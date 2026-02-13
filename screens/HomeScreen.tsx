import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { CampaignSchedule, POIType } from '../types'
import { useManualScheduleStore, ManualSchedule, useSettingsStore } from '../stores'
import AppHeader from '../components/AppHeader'
import HomeScreenSenior from '../components/HomeScreenSenior'
import ScheduleDetailModal from '../components/ScheduleDetailModal'
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
  SparkleIcon,
  LocationIcon,
  CalendarIcon,
  ClockIcon,
} from '../components/icons'

// 색상 옵션
const colorOptions = [
  '#F87171', // red
  '#60A5FA', // blue
  '#FBBF24', // amber
  '#818CF8', // indigo
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

// AI 추천용 카테고리별 POI 풀
type AiCategory = 'transit' | 'school' | 'shop' | 'park' | 'culture' | 'religious' | 'public'

const aiCategoryInfo: { key: AiCategory; label: string; color: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: 'transit', label: '대중교통', color: '#0891B2', icon: TransitIcon },
  { key: 'school', label: '학교', color: '#7C3AED', icon: SchoolIcon },
  { key: 'shop', label: '상권', color: '#F97316', icon: ShopIcon },
  { key: 'park', label: '공원', color: '#16A34A', icon: ParkIcon },
  { key: 'culture', label: '문화시설', color: '#EC4899', icon: CultureIcon },
  { key: 'religious', label: '종교시설', color: '#92400E', icon: ReligiousIcon },
  { key: 'public', label: '공공시설', color: '#0EA5E9', icon: PublicIcon },
]

const aiPOIPool: Record<AiCategory, { name: string; type: POIType; lat: number; lng: number; exposure: number }[]> = {
  transit: [
    { name: '강남역 3번출구', type: 'subway', lat: 37.4979, lng: 127.0276, exposure: 120 },
    { name: '삼성역 환승통로', type: 'subway', lat: 37.5089, lng: 127.0631, exposure: 85 },
    { name: '선릉역 1번출구', type: 'subway', lat: 37.5047, lng: 127.0492, exposure: 90 },
  ],
  school: [
    { name: '대치동 학원가', type: 'school', lat: 37.5006, lng: 127.0566, exposure: 95 },
    { name: '목동 학원가', type: 'school', lat: 37.5248, lng: 126.8735, exposure: 80 },
  ],
  shop: [
    { name: '강남역 상권', type: 'market', lat: 37.4979, lng: 127.0276, exposure: 110 },
    { name: '홍대입구 상권', type: 'market', lat: 37.5573, lng: 126.9258, exposure: 100 },
  ],
  park: [
    { name: '역삼공원', type: 'facility', lat: 37.5006, lng: 127.0366, exposure: 65 },
    { name: '양재시민의숲', type: 'facility', lat: 37.4713, lng: 127.0380, exposure: 55 },
  ],
  culture: [
    { name: '코엑스', type: 'other', lat: 37.5117, lng: 127.0590, exposure: 90 },
    { name: '예술의전당', type: 'other', lat: 37.4812, lng: 127.0129, exposure: 70 },
  ],
  religious: [
    { name: '봉은사', type: 'religious', lat: 37.5146, lng: 127.0577, exposure: 50 },
    { name: '명동성당', type: 'religious', lat: 37.5633, lng: 126.9872, exposure: 60 },
  ],
  public: [
    { name: '강남구청', type: 'other', lat: 37.5172, lng: 127.0473, exposure: 55 },
    { name: '역삼1동 주민센터', type: 'other', lat: 37.5003, lng: 127.0365, exposure: 40 },
  ],
}

const poiTypeLabel: Record<POIType | 'manual', string> = {
  subway: '대중교통',
  bus: '대중교통',
  market: '상권',
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

function ScheduleCard({
  schedule,
  onPress,
}: {
  schedule: CampaignSchedule & { isManual?: boolean; color?: string; memo?: string; scheduleTitle?: string }
  onPress?: () => void
}) {
  const timeSlot = getTimeSlot(schedule.startTime)
  const isManual = schedule.isManual

  return (
    <TouchableOpacity
      style={[styles.card, isManual && { flexDirection: 'row', padding: 0, overflow: 'hidden' }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* 수동 일정 왼쪽 색상 바 */}
      {isManual && (
        <View style={{ width: 5, backgroundColor: schedule.color || '#6B7280', borderTopLeftRadius: borderRadius.lg, borderBottomLeftRadius: borderRadius.lg }} />
      )}
      <View style={isManual ? { flex: 1, padding: spacing.md } : { flex: 1 }}>
      <View style={styles.cardHeader}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{schedule.startTime}</Text>
          {isManual ? (
            <View
              style={[
                styles.poiTypeBadge,
                { backgroundColor: '#6B728020' },
              ]}
            >
              <Text
                style={[
                  styles.poiTypeText,
                  { color: '#6B7280' },
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

      {/* 장소명 */}
      <Text style={styles.poiName}>{schedule.poi.name}</Text>

      {/* 메모 (수동 일정만) */}
      {isManual && schedule.memo && (
        <Text style={styles.memoText}>{schedule.memo}</Text>
      )}
      </View>
    </TouchableOpacity>
  )
}

// AI 추천 일정 모달
function AiRecommendModal({
  visible,
  onClose,
  onGenerate,
}: {
  visible: boolean
  onClose: () => void
  onGenerate: (category: AiCategory) => void
}) {
  const [selectedCat, setSelectedCat] = useState<AiCategory | null>(null)

  const handleGenerate = () => {
    if (!selectedCat) return
    onGenerate(selectedCat)
    setSelectedCat(null)
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={aiModalStyles.overlay}>
        <View style={aiModalStyles.content}>
          <TouchableOpacity style={aiModalStyles.closeBtn} onPress={onClose}>
            <Text style={aiModalStyles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={aiModalStyles.title}>AI에게 일정 추천받기!</Text>
          <Text style={aiModalStyles.desc}>
            지금 어디를 가야할지 모르겠다면?{'\n'}
            방문하고 싶은 장소 카테고리를 선택해주시면{'\n'}
            지금부터 2시간의 추천일정이 생성됩니다.
          </Text>

          <View style={aiModalStyles.categoryGrid}>
            {aiCategoryInfo.map((cat) => {
              const isActive = selectedCat === cat.key
              const IconComp = cat.icon
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    aiModalStyles.categoryBtn,
                    isActive && { borderColor: cat.color, backgroundColor: cat.color + '15' },
                  ]}
                  onPress={() => setSelectedCat(cat.key)}
                >
                  <IconComp size={20} color={isActive ? cat.color : colors.neutral[400]} />
                  <Text style={[aiModalStyles.categoryLabel, isActive && { color: cat.color, fontWeight: '600' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View style={aiModalStyles.warningBox}>
            <Text style={aiModalStyles.warningText}>
              AI 추천일정은 30분 간 2건만 생성 가능합니다.
            </Text>
          </View>

          <TouchableOpacity
            style={[aiModalStyles.generateBtn, !selectedCat && { opacity: 0.4 }]}
            onPress={handleGenerate}
            disabled={!selectedCat}
          >
            <SparkleIcon size={16} color={colors.white} />
            <Text style={aiModalStyles.generateBtnText}>AI에게 일정 추천받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const aiModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  desc: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
  },
  warningBox: {
    backgroundColor: colors.warning[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  warningText: {
    fontSize: fontSize.xs,
    color: colors.warning[700],
    textAlign: 'center',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  generateBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },
})

// 시간 선택 인라인 컴포넌트
const TIME_HOURS = Array.from({ length: 18 }, (_, i) => String(i + 6).padStart(2, '0')) // 06~23
const TIME_MINUTES = ['00', '30']

function TimePickerInline({
  value,
  onSelect,
  onClose,
}: {
  value: string
  onSelect: (time: string) => void
  onClose: () => void
}) {
  const [h, m] = value.split(':')
  const [selectedHour, setSelectedHour] = useState(h)
  const [selectedMinute, setSelectedMinute] = useState(TIME_MINUTES.includes(m) ? m : '00')

  return (
    <View style={timePickerStyles.container}>
      <View style={timePickerStyles.header}>
        <Text style={timePickerStyles.title}>시간 선택</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={timePickerStyles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>
      <Text style={timePickerStyles.sectionLabel}>시</Text>
      <View style={timePickerStyles.grid}>
        {TIME_HOURS.map((hour) => (
          <TouchableOpacity
            key={hour}
            style={[timePickerStyles.cell, selectedHour === hour && timePickerStyles.cellActive]}
            onPress={() => setSelectedHour(hour)}
          >
            <Text style={[timePickerStyles.cellText, selectedHour === hour && timePickerStyles.cellTextActive]}>
              {hour}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={timePickerStyles.sectionLabel}>분</Text>
      <View style={timePickerStyles.grid}>
        {TIME_MINUTES.map((minute) => (
          <TouchableOpacity
            key={minute}
            style={[timePickerStyles.cell, selectedMinute === minute && timePickerStyles.cellActive]}
            onPress={() => setSelectedMinute(minute)}
          >
            <Text style={[timePickerStyles.cellText, selectedMinute === minute && timePickerStyles.cellTextActive]}>
              {minute}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={timePickerStyles.confirmBtn}
        onPress={() => onSelect(`${selectedHour}:${selectedMinute}`)}
      >
        <Text style={timePickerStyles.confirmText}>{selectedHour}:{selectedMinute} 선택</Text>
      </TouchableOpacity>
    </View>
  )
}

const timePickerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  cancelText: {
    fontSize: fontSize.sm,
    color: colors.neutral[400],
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cell: {
    width: 44,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  cellActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  cellText: {
    fontSize: fontSize.sm,
    color: colors.neutral[700],
  },
  cellTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  confirmBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },
})

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
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [memo, setMemo] = useState('')
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null)

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
                placeholder="수동 일정"
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
                <TouchableOpacity style={addModalStyles.inputRow} onPress={() => setTimePickerTarget('start')}>
                  <Text style={addModalStyles.inputText}>{startTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
              <View style={addModalStyles.timeField}>
                <Text style={addModalStyles.label}>종료 <Text style={addModalStyles.required}>*</Text></Text>
                <TouchableOpacity style={addModalStyles.inputRow} onPress={() => setTimePickerTarget('end')}>
                  <Text style={addModalStyles.inputText}>{endTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 시간 선택 */}
            {timePickerTarget && (
              <TimePickerInline
                value={timePickerTarget === 'start' ? startTime : endTime}
                onSelect={(time) => {
                  if (timePickerTarget === 'start') setStartTime(time)
                  else setEndTime(time)
                  setTimePickerTarget(null)
                }}
                onClose={() => setTimePickerTarget(null)}
              />
            )}

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
                      name: '나이키 강남점',
                      address: '서울특별시 강남구 강남대로 446',
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

// 직접 일정 수정 모달 컴포넌트
function EditScheduleModal({
  visible,
  schedule,
  onClose,
  onUpdate,
}: {
  visible: boolean
  schedule: ManualSchedule | null
  onClose: () => void
  onUpdate: (id: string, data: {
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
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [memo, setMemo] = useState('')
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null)

  // 스케줄 데이터로 폼 초기화
  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title)
      setDate(new Date(schedule.date))
      setStartTime(schedule.startTime)
      setEndTime(schedule.endTime)
      setSelectedLocation(schedule.location)
      setSelectedColor(schedule.color)
      setMemo(schedule.memo)
    }
  }, [schedule])

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`
  }

  const handleUpdate = () => {
    if (!title.trim() || !schedule) return
    onUpdate(schedule.id, {
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      location: selectedLocation,
      color: selectedColor,
      memo: memo.trim(),
    })
    onClose()
  }

  const canSubmit = title.trim().length > 0

  if (!schedule) return null

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
            <Text style={addModalStyles.headerTitle}>일정 수정</Text>
            <TouchableOpacity
              onPress={handleUpdate}
              disabled={!canSubmit}
            >
              <Text style={[addModalStyles.addText, !canSubmit && addModalStyles.addTextDisabled]}>
                저장
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
                placeholder="일정 제목"
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
                <TouchableOpacity style={addModalStyles.inputRow} onPress={() => setTimePickerTarget('start')}>
                  <Text style={addModalStyles.inputText}>{startTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
              <View style={addModalStyles.timeField}>
                <Text style={addModalStyles.label}>종료 <Text style={addModalStyles.required}>*</Text></Text>
                <TouchableOpacity style={addModalStyles.inputRow} onPress={() => setTimePickerTarget('end')}>
                  <Text style={addModalStyles.inputText}>{endTime}</Text>
                  <ClockIcon size={20} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 시간 선택 */}
            {timePickerTarget && (
              <TimePickerInline
                value={timePickerTarget === 'start' ? startTime : endTime}
                onSelect={(time) => {
                  if (timePickerTarget === 'start') setStartTime(time)
                  else setEndTime(time)
                  setTimePickerTarget(null)
                }}
                onClose={() => setTimePickerTarget(null)}
              />
            )}

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
                    setSelectedLocation({
                      name: '나이키 강남점',
                      address: '서울특별시 강남구 강남대로 446',
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
  const [aiModalVisible, setAiModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [scheduleToEdit, setScheduleToEdit] = useState<ManualSchedule | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<
    (CampaignSchedule & { isManual?: boolean; color?: string; memo?: string }) | null
  >(null)

  // Settings store for large font mode (fontScale >= 1.2)
  const fontScale = useSettingsStore((state) => state.fontScale)
  const isLargeFontMode = fontScale >= 1.2

  // 알림 생성
  const addNotification = useSettingsStore((state) => state.addNotification)

  // AI 쿨타임 상태
  const aiCooldownStart = useSettingsStore((state) => state.aiCooldownStart)
  const aiUsedCount = useSettingsStore((state) => state.aiUsedCount)
  const useAiRecommend = useSettingsStore((state) => state.useAiRecommend)
  const resetAiCooldown = useSettingsStore((state) => state.resetAiCooldown)

  const [cooldownDisplay, setCooldownDisplay] = useState('')

  // 쿨타임 자동 리셋 + 카운트다운 표시
  useEffect(() => {
    if (!aiCooldownStart) return
    const interval = setInterval(() => {
      const elapsed = Date.now() - aiCooldownStart
      const remaining = 30 * 60 * 1000 - elapsed
      if (remaining <= 0) {
        resetAiCooldown()
        setCooldownDisplay('')
      } else {
        const mins = Math.floor(remaining / 60000)
        const secs = Math.floor((remaining % 60000) / 1000)
        setCooldownDisplay(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [aiCooldownStart, resetAiCooldown])

  const aiRemaining = aiCooldownStart && Date.now() - aiCooldownStart < 30 * 60 * 1000
    ? 2 - aiUsedCount
    : 2
  const aiExhausted = aiRemaining <= 0

  // AI 일정 생성 핸들러
  const [aiGeneratedSchedules, setAiGeneratedSchedules] = useState<CampaignSchedule[]>([])

  const handleAiGenerate = useCallback((category: AiCategory) => {
    if (aiExhausted) return
    const pool = aiPOIPool[category]
    const poi = pool[Math.floor(Math.random() * pool.length)]
    const now = new Date()
    const startHour = String(now.getHours()).padStart(2, '0')
    const startMin = String(now.getMinutes()).padStart(2, '0')
    const endHour = String(Math.min(now.getHours() + 2, 23)).padStart(2, '0')

    const newSchedule: CampaignSchedule = {
      id: `ai-${Date.now()}`,
      userId: 'user1',
      poi: {
        id: `poi-ai-${Date.now()}`,
        name: poi.name,
        type: poi.type,
        location: { lat: poi.lat, lng: poi.lng },
        baseExposure: poi.exposure * 2,
        timeWeights: { morning: 1, noon: 1, evening: 1 },
        accessibility: 0.8,
      },
      date: now.toISOString().split('T')[0],
      startTime: `${startHour}:${startMin}`,
      endTime: `${endHour}:${startMin}`,
      estimatedExposure: poi.exposure,
      status: 'planned',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    setAiGeneratedSchedules((prev) => [...prev, newSchedule])
    useAiRecommend()
    Alert.alert('일정 생성 완료', `${poi.name} 일정이 추가되었습니다.`)
  }, [aiExhausted, useAiRecommend])

  // Manual schedule store - 모든 훅은 조건부 리턴 전에 호출해야 함 (React Hooks 규칙)
  const { schedules: manualSchedules, addSchedule, updateSchedule, removeSchedule, addVisitRecord } = useManualScheduleStore()

  // Manual schedules를 CampaignSchedule 형식으로 변환 - useMemo도 훅이므로 조건부 리턴 전에 호출
  const convertedManualSchedules: (CampaignSchedule & { isManual: boolean; color: string; memo: string; scheduleTitle: string })[] = useMemo(() => {
    return manualSchedules.map((ms) => ({
      id: ms.id,
      userId: 'user1',
      poi: {
        id: `poi-${ms.id}`,
        name: ms.location?.name || '', // 장소명
        type: 'other' as POIType,
        location: ms.location?.name === '나이키 강남점'
          ? { lat: 37.4979, lng: 127.0283 }
          : { lat: 0, lng: 0 },
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
      scheduleTitle: ms.title, // 일정 제목 보존
    }))
  }, [manualSchedules])

  // 모든 일정 (mock + AI generated + manual)
  const allSchedules = useMemo(() => {
    return [...mockSchedules, ...aiGeneratedSchedules, ...convertedManualSchedules]
  }, [convertedManualSchedules, aiGeneratedSchedules])

  // GPS 인증 알림 생성 (데모: 마운트 시 각 일정별 3회 알림)
  useEffect(() => {
    mockSchedules.forEach(schedule => {
      for (let i = 0; i < 3; i++) {
        addNotification({
          title: '유세 위치 인증',
          message: `${schedule.poi.name} 일정을 소화 중이신가요? 위치 인증을 진행해주세요. (${i + 1}/3)`,
          type: 'gps_verify',
        })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 큰 글씨 모드: 완전히 다른 UI 렌더링
  if (isLargeFontMode) {
    return <HomeScreenSenior />
  }

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

  const handleUpdateSchedule = (id: string, data: {
    title: string
    date: string
    startTime: string
    endTime: string
    location: { name: string; address: string } | null
    color: string
    memo: string
  }) => {
    updateSchedule(id, data)
  }

  // 수정 모달 열기
  const handleEditSchedule = (schedule: CampaignSchedule) => {
    // manual schedule 찾기
    const manualSchedule = manualSchedules.find((ms) => ms.id === schedule.id)
    if (manualSchedule) {
      setScheduleToEdit(manualSchedule)
      setEditModalVisible(true)
      setDetailModalVisible(false)
    }
  }

  // 필터링 및 시간순 정렬된 일정
  const filteredSchedules = allSchedules
    .filter((schedule) => {
      const isManual = (schedule as CampaignSchedule & { isManual?: boolean }).isManual
      const poiCategory = isManual ? 'manual' : getPOICategory(schedule.poi.type)
      const poiMatch = selectedPOI === 'all' || poiCategory === selectedPOI
      const timeMatch =
        selectedTime === 'all' || getTimeSlot(schedule.startTime) === selectedTime
      return poiMatch && timeMatch
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="홈" />
      <ScrollView style={styles.scrollView}>
        {/* 날짜 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.date}>{dateString}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.aiAddButton, aiExhausted && { opacity: 0.4 }]}
                onPress={() => !aiExhausted && setAiModalVisible(true)}
                disabled={aiExhausted}
              >
                <SparkleIcon size={14} color="#F97316" />
                <Text style={styles.aiAddButtonText}>
                  {aiExhausted && cooldownDisplay
                    ? cooldownDisplay
                    : `AI 추천받기(${aiRemaining}/2)`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manualAddButton}
                onPress={() => setAddModalVisible(true)}
              >
                <ManualAddIcon size={14} color="#6B7280" />
                <Text style={styles.manualAddButtonText}>직접추가</Text>
              </TouchableOpacity>
            </View>
          </View>
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
              icon={<ReligiousIcon size={16} color={selectedPOI === 'religious' ? '#FFF' : '#92400E'} />}
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
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onPress={() => {
                  setSelectedSchedule(schedule)
                  setDetailModalVisible(true)
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>해당 조건의 일정이 없습니다</Text>
            </View>
          )}

          {/* 일정 직접 추가 버튼 (리스트 하단) */}
          <TouchableOpacity
            style={styles.bottomAddButton}
            onPress={() => setAddModalVisible(true)}
          >
            <ManualAddIcon size={16} color="#6B7280" />
            <Text style={styles.bottomAddButtonText}>일정 직접 추가</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 직접 일정 추가 모달 */}
      <AddScheduleModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddSchedule}
      />

      {/* AI 추천 일정 모달 */}
      <AiRecommendModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onGenerate={handleAiGenerate}
      />

      {/* 일정 상세 팝업 모달 */}
      <ScheduleDetailModal
        visible={detailModalVisible}
        schedule={selectedSchedule}
        onClose={() => {
          setDetailModalVisible(false)
          setSelectedSchedule(null)
        }}
        onDelete={(id) => {
          removeSchedule(id)
          setDetailModalVisible(false)
          setSelectedSchedule(null)
        }}
        onVerifyLocation={(id, verified) => {
          if (verified && selectedSchedule) {
            const isManual = (selectedSchedule as CampaignSchedule & { isManual?: boolean }).isManual
            addVisitRecord({
              scheduleId: id,
              scheduleName: selectedSchedule.poi.name,
              category: isManual ? 'manual' : selectedSchedule.poi.type,
              date: selectedSchedule.date,
            })
          }
        }}
        onEdit={handleEditSchedule}
      />

      {/* 일정 수정 모달 */}
      <EditScheduleModal
        visible={editModalVisible}
        schedule={scheduleToEdit}
        onClose={() => {
          setEditModalVisible(false)
          setScheduleToEdit(null)
        }}
        onUpdate={handleUpdateSchedule}
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
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[800],
    marginBottom: spacing.xs,
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
  bottomAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderStyle: 'dashed',
    backgroundColor: colors.neutral[50],
  },
  bottomAddButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: '#6B7280',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  aiAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#F97316',
    backgroundColor: '#F973161A',
  },
  aiAddButtonText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#F97316',
  },
  manualAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#6B7280',
    backgroundColor: '#6B72801A',
  },
  manualAddButtonText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#6B7280',
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
