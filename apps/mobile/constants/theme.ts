// Design System Tokens - Based on apply-reform design system
// 개혁신당 오렌지 컬러 스킴
// WCAG AA Compliant

export const colors = {
  // Primary Brand Colors - 개혁신당 오렌지
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main brand color - 개혁신당 주황
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#16A34A',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC2626',
    600: '#B91C1C',
    700: '#991B1B',
    800: '#7F1D1D',
    900: '#7F1D1D',
  },

  // Neutral Grays
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Shorthand aliases
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  foreground: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',

  // POI type colors
  poi: {
    subway: '#0891B2', // Cyan for subway
    bus: '#16A34A',
    market: '#F97316', // Primary orange
    school: '#7C3AED',
    facility: '#0EA5E9',
    religious: '#92400E',
    other: '#6B7280',
  },

  // Severity colors (for notifications)
  severity: {
    info: '#F97316', // Primary orange
    warn: '#F59E0B',
    critical: '#DC2626',
  },

  // Aliases for backward compatibility
  get gray() {
    return this.neutral
  },
  get primary500() {
    return this.primary[500]
  },
  get error500() {
    return this.error[500]
  },
}

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  // Named aliases for convenience
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

export const fontSize = {
  // Default mode
  xs: 12,
  sm: 14,
  base: 16,
  md: 16, // Alias for base
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,

  // Senior mode (larger sizes)
  senior: {
    xs: 16,
    sm: 18,
    base: 20,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
  },
}

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
}

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
}

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
}

// Animation durations
export const animation = {
  fast: 150,
  base: 200,
  slow: 300,
}

// Dark Mode Colors
export const darkColors = {
  // Background colors
  background: '#111827', // neutral[900]
  surface: '#1F2937', // neutral[800]
  surfaceSecondary: '#374151', // neutral[700]

  // Text colors
  textPrimary: '#F9FAFB', // neutral[50]
  textSecondary: '#D1D5DB', // neutral[300]
  textMuted: '#9CA3AF', // neutral[400]

  // Border colors
  border: '#374151', // neutral[700]
  borderLight: '#4B5563', // neutral[600]

  // Card colors
  card: '#1F2937', // neutral[800]
  cardHover: '#374151', // neutral[700]

  // Primary brand (remains the same for consistency)
  primary: '#F97316',
  primaryLight: '#FB923C',
  primaryDark: '#EA580C',

  // Semantic colors (adjusted for dark mode)
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#EF4444',

  // Input colors
  inputBackground: '#374151', // neutral[700]
  inputBorder: '#4B5563', // neutral[600]
  placeholder: '#6B7280', // neutral[500]
}
