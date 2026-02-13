import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'

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

interface LoginScreenProps {
  onLogin: () => void
  onNavigateToOnboarding?: () => void
}

export default function LoginScreen({ onLogin, onNavigateToOnboarding }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    // Mock login - replace with actual auth
    setTimeout(() => {
      setIsLoading(false)
      // For now, accept any login
      onLogin()
    }, 1000)
  }

  const handleTestLogin = () => {
    setEmail('test@reform.party')
    setPassword('test1234')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Title */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <ReformSymbol size={72} />
            </View>
            <Text style={styles.title}>AI 사무장</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 주소를 입력하세요"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={colors.neutral[400]}
                secureTextEntry
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Test Account Info */}
          <View style={styles.devInfo}>
            <Text style={styles.devTitle}>테스트 계정</Text>
            <TouchableOpacity onPress={handleTestLogin}>
              <Text style={styles.devText}>test@reform.party / test1234</Text>
            </TouchableOpacity>
            <Text style={styles.devHint}>탭하여 자동 입력</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              계정이 없으신가요?{' '}
              <Text style={styles.footerLink} onPress={onNavigateToOnboarding}>
                회원가입
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoWrapper: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    color: colors.neutral[800],
    backgroundColor: colors.white,
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error[500],
    textAlign: 'center',
  },
  loginButton: {
    height: 48,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.white,
  },
  devInfo: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  devTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  devText: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  devHint: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
  },
  footerLink: {
    color: colors.primary[500],
    fontWeight: '600',
  },
})
