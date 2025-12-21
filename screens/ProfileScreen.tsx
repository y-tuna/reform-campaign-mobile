import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { MobilityType, IntensityLevel } from '../types'

// Mock 프로필
const mockProfile = {
  name: '홍길동',
  district: '서울 강남구',
  candidateType: 'preliminary' as const,
}

const mobilityOptions: { value: MobilityType; label: string; icon: string }[] = [
  { value: 'car', label: '자차', icon: '🚗' },
  { value: 'pickup', label: '픽업', icon: '🛻' },
  { value: 'bike', label: '자전거', icon: '🚴' },
  { value: 'walk', label: '도보', icon: '🚶' },
]

const intensityOptions: { value: IntensityLevel; label: string }[] = [
  { value: 'hard', label: '빡셈' },
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
  const [largeFont, setLargeFont] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>{mockProfile.name}</Text>
          <Text style={styles.district}>
            {mockProfile.district}{' '}
            {mockProfile.candidateType === 'preliminary' ? '예비후보' : '후보자'}
          </Text>
        </View>

        {/* 유세 선호 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>유세 선호 설정</Text>

          <SettingRow label="종교 시설">
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>제외없음</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </SettingRow>

          <SettingRow label="이동 수단">
            <View style={styles.optionGroup}>
              {mobilityOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={mobility === option.value}
                  onPress={() => setMobility(option.value)}
                >
                  {option.icon}
                </OptionButton>
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
              trackColor={{ false: colors.gray[300], true: colors.primary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>다크 모드</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
            />
          </View>
        </View>

        {/* 기타 메뉴 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>앱 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>도움말</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  district: {
    fontSize: fontSize.md,
    color: colors.gray[500],
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
    color: colors.gray[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  dropdownArrow: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  optionGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
  },
  optionButtonText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  optionButtonTextSelected: {
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
    borderBottomColor: colors.gray[100],
  },
  toggleLabel: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    gap: spacing.sm,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.error,
  },
})
