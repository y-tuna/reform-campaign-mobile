import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { CampaignSchedule, POIType } from '../types'
import {
  LocationIcon,
  ClockIcon,
  NavigationIcon,
  TrashIcon,
  EditIcon,
  GpsIcon,
  SunriseIcon,
  NoonIcon,
  SunsetIcon,
  MoonIcon,
  SparkleIcon,
} from './icons'

// 텍스트 토큰 (쉬운 수정/삭제를 위해)
const TEXTS = {
  autoScheduleNote: 'AI로 생성된 일정은 수정 및 삭제가 불가능합니다.',
  verifyLocationTitle: '위치 인증',
  verifyLocationDesc: '현재 위치가 일정 장소 1km 이내인지 확인합니다.',
  verifySuccess: '위치 인증 완료! 방문이 기록되었습니다.',
  verifyFail: '현재 위치가 일정 장소와 1km 이상 떨어져 있습니다.',
  verifyError: '위치 정보를 가져올 수 없습니다. GPS를 확인해주세요.',
  deleteConfirm: '이 일정을 삭제하시겠습니까?',
  directions: '길찾기',
  verify: '위치 인증',
  close: '닫기',
  edit: '수정',
  delete: '삭제',
}

interface ScheduleDetailModalProps {
  visible: boolean
  schedule: (CampaignSchedule & { isManual?: boolean; color?: string; memo?: string; scheduleTitle?: string }) | null
  onClose: () => void
  onEdit?: (schedule: CampaignSchedule) => void
  onDelete?: (id: string) => void
  onVerifyLocation?: (id: string, verified: boolean) => void
}

// 시간대별 분류
function getTimeSlot(time: string): 'morning' | 'noon' | 'evening' | 'night' {
  const hour = parseInt(time.split(':')[0], 10)
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'noon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

// POI 타입 레이블
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

// 시간대 레이블
const timeSlotLabel = {
  morning: '출근',
  noon: '점심',
  evening: '퇴근',
  night: '심야',
}

// 두 좌표 간 거리 계산 (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // 지구 반경 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function ScheduleDetailModal({
  visible,
  schedule,
  onClose,
  onEdit,
  onDelete,
  onVerifyLocation,
}: ScheduleDetailModalProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  if (!schedule) return null

  const isManual = schedule.isManual
  const timeSlot = getTimeSlot(schedule.startTime)
  const poiType = isManual ? 'manual' : schedule.poi.type

  // 길찾기 열기
  const handleDirections = () => {
    const { lat, lng } = schedule.poi.location
    const label = encodeURIComponent(schedule.poi.name)

    let url: string
    if (Platform.OS === 'ios') {
      url = `maps:?q=${label}&ll=${lat},${lng}`
    } else if (Platform.OS === 'android') {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${label})`
    } else {
      // Web - 카카오맵 또는 네이버맵으로 열기
      url = `https://map.kakao.com/link/to/${label},${lat},${lng}`
    }

    Linking.openURL(url).catch(() => {
      // 웹에서 fallback
      Linking.openURL(`https://map.kakao.com/link/to/${label},${lat},${lng}`)
    })
  }

  // 위치 인증
  const handleVerifyLocation = async () => {
    setIsVerifying(true)

    try {
      // Web에서는 Geolocation API 사용
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const targetLat = schedule.poi.location.lat
            const targetLng = schedule.poi.location.lng

            // 거리 계산
            const distance = calculateDistance(latitude, longitude, targetLat, targetLng)

            setIsVerifying(false)

            if (distance <= 1) {
              // 1km 이내
              Alert.alert('성공', TEXTS.verifySuccess)
              onVerifyLocation?.(schedule.id, true)
            } else {
              Alert.alert(
                '실패',
                `${TEXTS.verifyFail}\n(현재 거리: ${distance.toFixed(2)}km)`
              )
              onVerifyLocation?.(schedule.id, false)
            }
          },
          (error) => {
            setIsVerifying(false)
            Alert.alert('오류', TEXTS.verifyError)
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      } else {
        // Mock for testing (웹에서 GPS 없을 때)
        setIsVerifying(false)
        Alert.alert('테스트', '위치 인증 기능은 실제 기기에서 동작합니다.\n(테스트 환경에서는 자동으로 인증됩니다.)')
        onVerifyLocation?.(schedule.id, true)
      }
    } catch (error) {
      setIsVerifying(false)
      Alert.alert('오류', TEXTS.verifyError)
    }
  }

  // 삭제 확인
  const handleDelete = () => {
    Alert.alert(
      TEXTS.delete,
      TEXTS.deleteConfirm,
      [
        { text: '취소', style: 'cancel' },
        {
          text: TEXTS.delete,
          style: 'destructive',
          onPress: () => {
            onDelete?.(schedule.id)
            onClose()
          },
        },
      ]
    )
  }

  // 시간대 배지 색상
  const getTimeBadgeStyle = () => {
    switch (timeSlot) {
      case 'morning':
        return { bg: '#FEF3C7', color: '#D97706' }
      case 'noon':
        return { bg: '#FFEDD5', color: '#EA580C' }
      case 'evening':
        return { bg: '#FED7AA', color: '#C2410C' }
      case 'night':
        return { bg: '#E0E7FF', color: '#4F46E5' }
    }
  }

  const timeBadgeStyle = getTimeBadgeStyle()

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {/* 일정 제목 + 수동일정 우측 아이콘 */}
          <View style={styles.titleSection}>
            {isManual ? (
              <>
                <Text style={styles.scheduleTitle}>{schedule.scheduleTitle || '일정'}</Text>
                <View style={styles.titleActions}>
                  <TouchableOpacity
                    style={styles.titleIconButton}
                    onPress={() => onEdit?.(schedule)}
                  >
                    <EditIcon size={20} color={colors.neutral[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.titleIconButton}
                    onPress={handleDelete}
                  >
                    <TrashIcon size={20} color={colors.error[500]} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.aiTitleRow}>
                <SparkleIcon size={20} color="#F97316" />
                <Text style={styles.aiTitle}>AI 추천일정</Text>
              </View>
            )}
          </View>

          {/* 시간 */}
          <View style={styles.infoRow}>
            <ClockIcon size={20} color={colors.neutral[500]} />
            <Text style={styles.timeText}>{schedule.startTime}</Text>
            <View style={[styles.timeBadge, { backgroundColor: timeBadgeStyle.bg }]}>
              {timeSlot === 'morning' && <SunriseIcon size={12} />}
              {timeSlot === 'noon' && <NoonIcon size={12} />}
              {timeSlot === 'evening' && <SunsetIcon size={12} />}
              {timeSlot === 'night' && <MoonIcon size={12} />}
              <Text style={[styles.timeBadgeText, { color: timeBadgeStyle.color }]}>
                {timeSlotLabel[timeSlot]}
              </Text>
            </View>
          </View>

          {/* 장소 */}
          <View style={styles.infoRow}>
            <LocationIcon size={20} color={colors.neutral[500]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{schedule.poi.name}</Text>
              {schedule.poi.location.lat !== 0 && (
                <Text style={styles.locationAddress}>
                  위치: {schedule.poi.location.lat.toFixed(4)}, {schedule.poi.location.lng.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

          {/* 카테고리 배지 */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: (isManual ? schedule.color : colors.poi[poiType]) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  { color: isManual ? schedule.color : colors.poi[poiType] },
                ]}
              >
                {poiTypeLabel[poiType]}
              </Text>
            </View>
            {!isManual && schedule.estimatedExposure > 0 && (
              <View style={styles.exposureBadge}>
                <Text style={styles.exposureText}>
                  예상 노출 {schedule.estimatedExposure}명
                </Text>
              </View>
            )}
          </View>

          {/* 메모 (수동 일정만) */}
          {isManual && schedule.memo && (
            <View style={styles.memoSection}>
              <View style={styles.memoHeader}>
                <View style={styles.memoIcon}>
                  <Text style={styles.memoIconText}>≡</Text>
                </View>
                <Text style={styles.memoText}>{schedule.memo}</Text>
              </View>
            </View>
          )}

          {/* 버튼 영역 - 닫기, 길찾기, 위치 인증 (자동/수동 통일) */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{TEXTS.close}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <NavigationIcon size={18} color={colors.white} />
              <Text style={styles.directionsButtonText}>{TEXTS.directions}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
              onPress={handleVerifyLocation}
              disabled={isVerifying}
            >
              <GpsIcon size={18} color={colors.white} />
              <Text style={styles.verifyButtonText}>
                {isVerifying ? '확인 중...' : TEXTS.verify}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 자동 일정 안내 문구 */}
          {!isManual && (
            <Text style={styles.autoNote}>{TEXTS.autoScheduleNote}</Text>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },

  // 일정 제목
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scheduleTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
    flex: 1,
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleIconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  aiTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#F97316',
  },

  // 하단 버튼용 길찾기 버튼
  directionsButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
  },
  directionsButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },

  // 정보 행
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeText: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.neutral[700],
  },
  locationAddress: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginTop: 2,
  },

  // 배지 행
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  exposureBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
  },
  exposureText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary[600],
  },

  // 메모
  memoSection: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  memoIcon: {
    width: 20,
    alignItems: 'center',
  },
  memoIconText: {
    fontSize: fontSize.lg,
    color: colors.neutral[400],
  },
  memoText: {
    fontSize: fontSize.md,
    color: colors.neutral[600],
    flex: 1,
    lineHeight: 22,
  },

  // 버튼
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  closeButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  verifyButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },

  // 안내 문구
  autoNote: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    textAlign: 'center',
    marginTop: spacing.md,
  },
})
