import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { MobilityType, IntensityLevel } from '../types'
import {
  CarIcon,
  PickupIcon,
  BikeIcon,
  ScooterIcon,
  WalkIcon,
} from '../components/icons'
import { useSettingsStore } from '../stores'

function ReformSymbol({ size = 80 }: { size?: number }) {
  const ratio = 116 / 78
  const w = size * ratio
  return (
    <Svg width={w} height={size} viewBox="0 0 116 78" fill="none">
      <Path
        d="M43.1953 5.96484L5.96625 43.1938C-1.98875 51.1488-1.98875 64.0458 5.96625 72.0008C13.9212 79.9558 26.8183 79.9558 34.7733 72.0008L57.5993 49.1758L43.1953 34.7718C35.2403 26.8168 35.2403 13.9198 43.1953 5.96484Z"
        fill="#ED6C00"
      />
      <Path
        d="M109.232 43.1952L72.0028 5.96625C64.0478-1.98875 51.1498-1.98875 43.1948 5.96625C35.2398 13.9212 35.2398 26.8183 43.1948 34.7733L57.5988 49.1772L80.4238 72.0023C88.3788 79.9573 101.277 79.9573 109.232 72.0023C117.187 64.0473 117.187 51.1502 109.232 43.1952Z"
        fill="#EA5514"
      />
    </Svg>
  )
}

const STEPS = ['캠페인 설정', '화면 설정', '완료']

interface OnboardingScreenProps {
  onComplete: () => void
  onBack?: () => void
}

const mobilityOptions: { value: MobilityType; label: string }[] = [
  { value: 'walk', label: '도보' },
  { value: 'bike', label: '자전거' },
  { value: 'scooter', label: '스쿠터' },
  { value: 'car', label: '승용차' },
  { value: 'pickup', label: '트럭' },
]

function getMobilityIcon(value: MobilityType, selected: boolean) {
  const color = selected ? colors.primary[700] : colors.neutral[500]
  switch (value) {
    case 'car':
      return <CarIcon size={24} color={color} />
    case 'pickup':
      return <PickupIcon size={24} color={color} />
    case 'scooter':
      return <ScooterIcon size={24} color={color} />
    case 'bike':
      return <BikeIcon size={24} color={color} />
    case 'walk':
      return <WalkIcon size={24} color={color} />
  }
}

const intensityOptions: { value: IntensityLevel; label: string; description: string }[] = [
  { value: 'light', label: '여유', description: '하루 2-3곳' },
  { value: 'normal', label: '보통', description: '하루 4-5곳' },
  { value: 'hard', label: '바쁨', description: '하루 6곳 이상' },
]

const religionOptions = [
  { value: 'none', label: '모든 종교시설 방문' },
  { value: 'christian', label: '기독교만 방문' },
  { value: 'catholic', label: '천주교만 방문' },
  { value: 'buddhist', label: '불교만 방문' },
  { value: 'all', label: '종교시설 방문 안함' },
]

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index <= currentStep && styles.stepDotActive,
          ]}
        />
      ))}
    </View>
  )
}

function OptionButton({
  selected,
  onPress,
  children,
  style,
}: {
  selected: boolean
  onPress: () => void
  children: React.ReactNode
  style?: object
}) {
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selected && styles.optionButtonSelected,
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  )
}

export default function OnboardingScreen({ onComplete, onBack }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Campaign Settings
  const [intensity, setIntensity] = useState<IntensityLevel>('normal')
  const [religionExclude, setReligionExclude] = useState('none')

  // Settings store - UI 및 이동수단 설정
  const fontScale = useSettingsStore((state) => state.fontScale)
  const setFontScale = useSettingsStore((state) => state.setFontScale)
  const mobility = useSettingsStore((state) => state.mobility)
  const setMobility = useSettingsStore((state) => state.setMobility)

  const isSeniorMode = fontScale >= 1.2

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (onBack) {
      onBack()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Save preferences - mock for now
    setTimeout(() => {
      setIsLoading(false)
      onComplete()
    }, 1000)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Campaign Settings
      case 1: // UI Settings
      case 2: // Complete
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>캠페인 설정</Text>
            <Text style={styles.stepDescription}>
              유세 일정 추천을 위한 선호도를 설정해주세요
            </Text>

            {/* Intensity */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>스케줄 강도</Text>
              <View style={styles.intensityGroup}>
                {intensityOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={intensity === option.value}
                    onPress={() => setIntensity(option.value)}
                    style={styles.intensityButton}
                  >
                    <Text
                      style={[
                        styles.intensityLabel,
                        intensity === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.intensityDesc,
                        intensity === option.value && styles.optionDescSelected,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </OptionButton>
                ))}
              </View>
            </View>

            {/* Mobility */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>이동 수단</Text>
              <View style={styles.mobilityGroup}>
                {mobilityOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={mobility === option.value}
                    onPress={() => setMobility(option.value)}
                    style={styles.mobilityButton}
                  >
                    {getMobilityIcon(option.value, mobility === option.value)}
                    <Text
                      style={[
                        styles.mobilityLabel,
                        mobility === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </OptionButton>
                ))}
              </View>
            </View>

            {/* Religion */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>종교 시설</Text>
              <View style={styles.religionGroup}>
                {religionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.religionOption,
                      religionExclude === option.value && styles.religionOptionSelected,
                    ]}
                    onPress={() => setReligionExclude(option.value)}
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
        )

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>화면 설정</Text>
            <Text style={styles.stepDescription}>
              편안한 사용을 위한 화면 설정입니다
            </Text>

            <View style={styles.settingSection}>
              <View style={styles.fontSizeHeader}>
                <Text style={styles.settingLabel}>글씨 크기</Text>
                {isSeniorMode && (
                  <View style={styles.seniorBadge}>
                    <Text style={styles.seniorBadgeText}>큰 글씨 모드</Text>
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
            </View>
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.completeContainer}>
              <View style={styles.logoWrapper}>
                <ReformSymbol size={80} />
              </View>
              <Text style={styles.completeTitle}>설정 완료!</Text>
              <Text style={styles.completeDescription}>
                모든 설정이 완료되었습니다.{'\n'}
                이제 캠페인 관리를 시작해보세요!
              </Text>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>설정 요약</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>이름</Text>
                  <Text style={styles.summaryValue}>홍길동</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>지역구</Text>
                  <Text style={styles.summaryValue}>서울특별시 강남구 가</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>직책</Text>
                  <Text style={styles.summaryValue}>기초의원</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>스케줄 강도</Text>
                  <Text style={styles.summaryValue}>
                    {intensityOptions.find((o) => o.value === intensity)?.label}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>이동 수단</Text>
                  <Text style={styles.summaryValue}>
                    {mobilityOptions.find((o) => o.value === mobility)?.label}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>종교 시설</Text>
                  <Text style={styles.summaryValue}>
                    {religionOptions.find((o) => o.value === religionExclude)?.label}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>글씨 크기</Text>
                  <Text style={styles.summaryValue}>
                    {fontScale === 1.0 ? '보통' : fontScale === 1.2 ? '크게' : '매우 크게'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>
            {currentStep === 0 ? '취소' : '이전'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>
          {currentStep + 1} / {STEPS.length}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === STEPS.length - 1 ? '시작하기' : '다음'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: fontSize.md,
    color: colors.primary[500],
  },
  stepLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  headerSpacer: {
    width: 60,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[200],
  },
  stepDotActive: {
    backgroundColor: colors.primary[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  stepDescription: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
    marginBottom: spacing.xl,
  },
  settingSection: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  intensityGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  intensityLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
    textAlign: 'center',
  },
  intensityDesc: {
    fontSize: fontSize.xs,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  mobilityGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mobilityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  mobilityLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[700],
  },
  optionButton: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  optionTextSelected: {
    color: colors.primary[700],
  },
  optionDescSelected: {
    color: colors.primary[600],
  },
  religionGroup: {
    gap: spacing.sm,
  },
  religionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
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
  fontSizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  seniorBadge: {
    backgroundColor: colors.success[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  seniorBadgeText: {
    fontSize: fontSize.xs,
    color: colors.success[700],
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
  fontPreview: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
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
  completeContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  logoWrapper: {
    marginBottom: spacing.md,
  },
  completeTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  completeDescription: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  summaryTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  summaryValue: {
    fontSize: fontSize.sm,
    color: colors.neutral[800],
    fontWeight: '500',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  nextButton: {
    height: 48,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.neutral[300],
  },
  nextButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },
})
