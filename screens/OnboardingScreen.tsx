import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { MobilityType, IntensityLevel } from '../types'

const ReformLogo = require('../assets/reform-party-logo.png')

const STEPS = ['캠페인 설정', 'UI 설정', '완료']

interface OnboardingScreenProps {
  onComplete: () => void
  onBack?: () => void
}

const mobilityOptions: { value: MobilityType; label: string; icon: string }[] = [
  { value: 'walk', label: '도보', icon: '🚶' },
  { value: 'bike', label: '자전거', icon: '🚴' },
  { value: 'car', label: '자차', icon: '🚗' },
  { value: 'pickup', label: '픽업', icon: '🛻' },
]

const intensityOptions: { value: IntensityLevel; label: string; description: string }[] = [
  { value: 'light', label: '여유', description: '하루 2-3곳' },
  { value: 'normal', label: '보통', description: '하루 4-5곳' },
  { value: 'hard', label: '바쁨', description: '하루 6곳 이상' },
]

const religionOptions = [
  { value: 'none', label: '제외 없음' },
  { value: 'christian', label: '기독교 제외' },
  { value: 'catholic', label: '천주교 제외' },
  { value: 'buddhist', label: '불교 제외' },
  { value: 'all', label: '모든 종교시설 제외' },
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
  const [mobility, setMobility] = useState<MobilityType>('car')
  const [religionExclude, setReligionExclude] = useState('none')

  // Step 2: UI Settings
  const [fontScale, setFontScale] = useState(1.0)

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
                    <Text style={styles.mobilityIcon}>{option.icon}</Text>
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
            <Text style={styles.stepTitle}>UI 설정</Text>
            <Text style={styles.stepDescription}>
              편안한 사용을 위한 화면 설정입니다
            </Text>

            <View style={styles.settingSection}>
              <View style={styles.fontSizeHeader}>
                <Text style={styles.settingLabel}>글씨 크기</Text>
                {isSeniorMode && (
                  <View style={styles.seniorBadge}>
                    <Text style={styles.seniorBadgeText}>시니어 모드</Text>
                  </View>
                )}
              </View>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>작게</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.8}
                  maximumValue={1.4}
                  step={0.1}
                  value={fontScale}
                  onValueChange={setFontScale}
                  minimumTrackTintColor={colors.primary[500]}
                  maximumTrackTintColor={colors.neutral[200]}
                  thumbTintColor={colors.primary[500]}
                />
                <Text style={styles.sliderLabel}>크게</Text>
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
              <Image source={ReformLogo} style={styles.completeLogo} resizeMode="contain" />
              <Text style={styles.completeTitle}>설정 완료!</Text>
              <Text style={styles.completeDescription}>
                모든 설정이 완료되었습니다.{'\n'}
                이제 캠페인 관리를 시작해보세요!
              </Text>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>설정 요약</Text>
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
                {isSeniorMode && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>시니어 모드</Text>
                    <Text style={styles.summaryValue}>활성화</Text>
                  </View>
                )}
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
  },
  mobilityIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
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
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
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
  completeLogo: {
    width: 150,
    height: 100,
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
