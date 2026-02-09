import React, { createContext, useContext, useMemo } from 'react'
import { useSettingsStore } from '../stores'
import { colors, darkColors, fontSize as baseFontSize } from '../constants/theme'

// 테마 컨텍스트 타입
interface ThemeContextType {
  isDarkMode: boolean
  isSeniorMode: boolean
  fontScale: number
  colors: typeof colors & { dark?: typeof darkColors }
  fontSize: typeof baseFontSize
  getScaledFontSize: (size: number) => number
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// 테마 프로바이더
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const fontScale = useSettingsStore((state) => state.fontScale)
  const darkMode = useSettingsStore((state) => state.darkMode)
  const isSeniorMode = useSettingsStore((state) => state.isSeniorMode)

  const value = useMemo(() => {
    // 다크모드 적용된 색상
    const themeColors = darkMode
      ? {
          ...colors,
          background: darkColors.background,
          white: darkColors.surface,
          card: darkColors.card,
          foreground: darkColors.textPrimary,
          muted: darkColors.textMuted,
          border: darkColors.border,
          neutral: {
            ...colors.neutral,
            0: darkColors.surface,
            50: darkColors.surfaceSecondary,
            100: darkColors.surface,
            200: darkColors.border,
            300: darkColors.borderLight,
            400: darkColors.textMuted,
            500: darkColors.textSecondary,
            600: darkColors.textSecondary,
            700: darkColors.textSecondary,
            800: darkColors.textPrimary,
            900: darkColors.textPrimary,
            950: darkColors.textPrimary,
          },
        }
      : colors

    // 스케일 적용된 폰트 사이즈
    const scaledFontSize = {
      xs: Math.round(baseFontSize.xs * fontScale),
      sm: Math.round(baseFontSize.sm * fontScale),
      base: Math.round(baseFontSize.base * fontScale),
      md: Math.round(baseFontSize.md * fontScale),
      lg: Math.round(baseFontSize.lg * fontScale),
      xl: Math.round(baseFontSize.xl * fontScale),
      '2xl': Math.round(baseFontSize['2xl'] * fontScale),
      '3xl': Math.round(baseFontSize['3xl'] * fontScale),
      '4xl': Math.round(baseFontSize['4xl'] * fontScale),
      senior: baseFontSize.senior,
    }

    return {
      isDarkMode: darkMode,
      isSeniorMode: isSeniorMode(),
      fontScale,
      colors: themeColors,
      fontSize: scaledFontSize,
      getScaledFontSize: (size: number) => Math.round(size * fontScale),
    }
  }, [fontScale, darkMode, isSeniorMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 테마 훅
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 다크모드 훅 (간단 사용)
export function useDarkMode() {
  const { isDarkMode, colors } = useTheme()
  return { isDarkMode, colors }
}

// 폰트 스케일 훅 (간단 사용)
export function useFontScale() {
  const { fontScale, fontSize, getScaledFontSize } = useTheme()
  return { fontScale, fontSize, getScaledFontSize }
}
