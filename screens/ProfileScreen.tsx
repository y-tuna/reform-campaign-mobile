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
  WalkIcon,
  InfoIcon,
  HelpIcon,
  LogoutIcon,
} from '../components/icons'

// 온보딩과 동일한 종교시설 옵션
const religionOptions = [
  { value: 'none', label: '제외 없음' },
  { value: 'christian', label: '기독교 제외' },
  { value: 'catholic', label: '천주교 제외' },
  { value: 'buddhist', label: '불교 제외' },
  { value: 'all', label: '모든 종교시설 제외' },
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
  { value: 'car', label: '자차' },
  { value: 'pickup', label: '픽업' },
]

function getMobilityIcon(value: MobilityType, selected: boolean) {
  const color = selected ? colors.white : colors.neutral[500]
  switch (value) {
    case 'car':
      return <CarIcon size={20} color={color} />
    case 'pickup':
      return <PickupIcon size={20} color={color} />
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
  const [mobility, setMobility] = useState<MobilityType>('car')
  const [intensity, setIntensity] = useState<IntensityLevel>('normal')
  const [religionExclude, setReligionExclude] = useState('none')
  const [religionModalVisible, setReligionModalVisible] = useState(false)
  const [largeFont, setLargeFont] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const selectedReligionLabel = religionOptions.find(o => o.value === religionExclude)?.label || '제외 없음'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

          <SettingRow label="종교 시설">
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setReligionModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedReligionLabel}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
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
        </View>

        {/* 접근성 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>접근성 설정</Text>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>큰 글씨 모드</Text>
            <Switch
              value={largeFont}
              onValueChange={setLargeFont}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
            />
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
})
