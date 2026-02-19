import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { MobilityType, IntensityLevel } from '../types'
import {
  UserIcon,
  CarIcon,
  PickupIcon,
  BikeIcon,
  ScooterIcon,
  WalkIcon,
  InfoIcon,
  HelpIcon,
  LogoutIcon,
} from '../components/icons'
import AppHeader from '../components/AppHeader'
import { useSettingsStore } from '../stores'

// 온보딩과 동일한 종교시설 옵션
const religionOptions = [
  { value: 'none', label: '모든 종교시설 방문' },
  { value: 'christian', label: '기독교만 방문' },
  { value: 'catholic', label: '천주교만 방문' },
  { value: 'buddhist', label: '불교만 방문' },
  { value: 'all', label: '종교시설 방문 안함' },
]

// Mock 프로필
const mockProfile = {
  name: '홍길동',
  district: '서울특별시 강남구 가',
  position: '기초의원',
}

const mobilityOptions: { value: MobilityType; label: string }[] = [
  { value: 'walk', label: '도보' },
  { value: 'bike', label: '자전거' },
  { value: 'scooter', label: '스쿠터' },
  { value: 'car', label: '승용차' },
  { value: 'pickup', label: '트럭' },
]

function getMobilityIcon(value: MobilityType, selected: boolean) {
  const color = selected ? colors.white : colors.neutral[500]
  switch (value) {
    case 'car':
      return <CarIcon size={20} color={color} />
    case 'pickup':
      return <PickupIcon size={20} color={color} />
    case 'scooter':
      return <ScooterIcon size={20} color={color} />
    case 'bike':
      return <BikeIcon size={20} color={color} />
    case 'walk':
      return <WalkIcon size={20} color={color} />
  }
}

const intensityOptions: { value: IntensityLevel; label: string }[] = [
  { value: 'hard', label: '바쁨' },
  { value: 'normal', label: '보통' },
  { value: 'light', label: '여유' },
]

function OptionButton({
  selected,
  onPress,
  children,
}: {
  selected: boolean
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.optionButtonSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          selected && styles.optionButtonTextSelected,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

function SettingRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  )
}

export default function ProfileScreen() {
  const [intensity, setIntensity] = useState<IntensityLevel>('normal')
  const [religionExclude, setReligionExclude] = useState('none')
  const [religionModalVisible, setReligionModalVisible] = useState(false)

  // Settings store for accessibility and mobility
  const fontScale = useSettingsStore((state) => state.fontScale)
  const setFontScale = useSettingsStore((state) => state.setFontScale)
  const darkMode = useSettingsStore((state) => state.darkMode)
  const setDarkMode = useSettingsStore((state) => state.setDarkMode)
  const mobility = useSettingsStore((state) => state.mobility)
  const setMobility = useSettingsStore((state) => state.setMobility)

  const largeFont = fontScale >= 1.2

  const selectedReligionLabel = religionOptions.find(o => o.value === religionExclude)?.label || '모든 종교시설 방문'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="프로필" />
      <ScrollView style={styles.scrollView}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <UserIcon size={40} color={colors.neutral[400]} />
          </View>
          <Text style={styles.name}>{mockProfile.name}</Text>
          <Text style={styles.subtitle}>{mockProfile.district} · {mockProfile.position}</Text>
        </View>

        {/* 유세 선호 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유세 선호 설정</Text>

          <SettingRow label="스케줄 강도">
            <View style={styles.optionGroup}>
              {intensityOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={intensity === option.value}
                  onPress={() => setIntensity(option.value)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </View>
          </SettingRow>

          <SettingRow label="이동 수단">
            <View style={styles.optionGroup}>
              {mobilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.mobilityButton,
                    mobility === option.value && styles.mobilityButtonSelected,
                  ]}
                  onPress={() => setMobility(option.value)}
                >
                  {getMobilityIcon(option.value, mobility === option.value)}
                  <Text
                    style={[
                      styles.mobilityLabel,
                      mobility === option.value && styles.mobilityLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingRow>

          <SettingRow label="종교 시설">
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setReligionModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedReligionLabel}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </SettingRow>
        </View>

        {/* 접근성 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>접근성 설정</Text>

          {/* 글씨 크기 설정 */}
          <View style={styles.fontScaleSection}>
            <View style={styles.fontScaleHeader}>
              <Text style={styles.toggleLabel}>글씨 크기</Text>
              {largeFont && (
                <View style={styles.largeFontBadge}>
                  <Text style={styles.largeFontBadgeText}>큰 글씨 모드</Text>
                </View>
              )}
            </View>
            <View style={styles.fontScaleButtons}>
              {[
                { value: 1.0, label: 'A', size: 16, desc: '보통' },
                { value: 1.2, label: 'A', size: 20, desc: '크게' },
                { value: 1.4, label: 'A', size: 24, desc: '매우 크게' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.fontScaleButton,
                    fontScale === option.value && styles.fontScaleButtonActive,
                  ]}
                  onPress={() => setFontScale(option.value)}
                >
                  <Text
                    style={[
                      styles.fontScaleButtonText,
                      { fontSize: option.size },
                      fontScale === option.value && styles.fontScaleButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.fontScaleDesc,
                      fontScale === option.value && styles.fontScaleDescActive,
                    ]}
                  >
                    {option.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.fontPreview}>
              <Text style={[styles.previewText, { fontSize: 16 * fontScale }]}>
                미리보기 텍스트입니다
              </Text>
              <Text style={[styles.previewSubtext, { fontSize: 14 * fontScale }]}>
                이 크기로 앱의 글씨가 표시됩니다
              </Text>
            </View>
            {/* 큰 글씨 모드 경고 (추후 활성화 가능 - full-feature-v1 브랜치 참고)
            {largeFont && (
              <View style={styles.largeFontWarning}>
                <Text style={styles.largeFontWarningText}>
                  수동 일정 기능은 큰 글씨 모드에서는 지원되지 않습니다.
                </Text>
              </View>
            )}
            */}
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>다크 모드</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            />
          </View>
        </View>

        {/* 기타 메뉴 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <InfoIcon size={20} color={colors.neutral[500]} />
            </View>
            <Text style={styles.menuText}>앱 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpIcon size={20} color={colors.neutral[500]} />
            </View>
            <Text style={styles.menuText}>도움말</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
            <View style={styles.menuIconContainer}>
              <LogoutIcon size={20} color={colors.error[500]} />
            </View>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 종교시설 선택 모달 */}
      <Modal
        visible={religionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReligionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>종교 시설 설정</Text>
              <TouchableOpacity
                onPress={() => setReligionModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.religionGroup}>
              {religionOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.religionOption,
                    religionExclude === option.value && styles.religionOptionSelected,
                  ]}
                  onPress={() => {
                    setReligionExclude(option.value)
                    setReligionModalVisible(false)
                  }}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      religionExclude === option.value && styles.radioCircleSelected,
                    ]}
                  >
                    {religionExclude === option.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.religionLabel,
                      religionExclude === option.value && styles.religionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  profileHeader: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.neutral[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  dropdownArrow: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
  },
  optionGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary[500],
  },
  optionButtonText: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  optionButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  mobilityButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  mobilityButtonSelected: {
    backgroundColor: colors.primary[500],
  },
  mobilityLabel: {
    fontSize: fontSize.xs,
    color: colors.neutral[700],
  },
  mobilityLabelSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  toggleLabel: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    gap: spacing.sm,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.error[500],
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
  modalTitle: {
    fontSize: fontSize.lg,
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
  religionGroup: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  religionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[50],
  },
  religionOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  religionLabel: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  religionLabelSelected: {
    color: colors.primary[700],
    fontWeight: '500',
  },
  // 글씨 크기 설정 스타일
  fontScaleSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  fontScaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fontScaleValue: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
  },
  fontScaleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fontScaleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontScaleButtonActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  fontScaleButtonText: {
    color: colors.neutral[600],
    fontWeight: '600',
  },
  fontScaleButtonTextActive: {
    color: colors.primary[600],
  },
  fontScaleDesc: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  fontScaleDescActive: {
    color: colors.primary[600],
  },
  largeFontBadge: {
    backgroundColor: colors.success[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  largeFontBadgeText: {
    fontSize: fontSize.xs,
    color: colors.success[700],
    fontWeight: '600',
  },
  fontPreview: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  previewText: {
    color: colors.neutral[800],
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  previewSubtext: {
    color: colors.neutral[500],
  },
  largeFontWarning: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.warning[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  largeFontWarningText: {
    fontSize: fontSize.sm,
    color: colors.warning[700],
    textAlign: 'center',
  },
})
