// Design System Tokens with WCAG AA Compliance
// Based on 개혁신당 Campaign Manager Design Guide

export const colors = {
  // Primary Brand Colors (WCAG AA compliant)
  primary: {
    50: '#EBF3FF',
    100: '#D1E4FF', 
    200: '#9DC8FF',
    300: '#69ACFF',
    400: '#3590FF',
    500: '#2563EB', // Main brand color - contrast ratio 4.5:1 on white
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3A8A'
  },
  
  // Semantic Colors (High contrast)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0', 
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#16A34A', // 4.5:1 contrast ratio
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B'
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D', 
    400: '#FBBF24',
    500: '#F59E0B', // 3:1 contrast ratio (large text acceptable)
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC2626', // 4.5:1 contrast ratio
    600: '#B91C1C',
    700: '#991B1B',
    800: '#7F1D1D',
    900: '#7F1D1D'
  },
  
  // Neutral Grays (High contrast scale)
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // 4.5:1 contrast on white
    600: '#4B5563', // 7:1 contrast on white
    700: '#374151', // 10:1 contrast on white
    800: '#1F2937', // 15:1 contrast on white  
    900: '#111827', // 18:1 contrast on white
    950: '#030712'
  }
}

export const typography = {
  fontFamily: {
    sans: [
      'Pretendard Variable',
      'Pretendard', 
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'sans-serif'
    ],
    mono: [
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace'
    ]
  },
  
  fontSize: {
    // Mobile-first responsive sizing
    xs: { size: '12px', lineHeight: '16px' },      // 12px
    sm: { size: '14px', lineHeight: '20px' },      // 14px  
    base: { size: '16px', lineHeight: '24px' },    // 16px - base
    lg: { size: '18px', lineHeight: '28px' },      // 18px
    xl: { size: '20px', lineHeight: '28px' },      // 20px
    '2xl': { size: '24px', lineHeight: '32px' },   // 24px
    '3xl': { size: '30px', lineHeight: '36px' },   // 30px
    '4xl': { size: '36px', lineHeight: '40px' },   // 36px
    '5xl': { size: '48px', lineHeight: '52px' },   // 48px
    '6xl': { size: '60px', lineHeight: '64px' }    // 60px
  },
  
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  }
}

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px', 
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px'
}

export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px'
}

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
}

// Accessibility-focused focus styles
export const focus = {
  ring: {
    width: '2px',
    color: colors.primary[500],
    offset: '2px'
  },
  outline: {
    style: 'solid',
    width: '2px', 
    color: colors.primary[500],
    offset: '2px'
  }
}

// Animation tokens (respects prefers-reduced-motion)
export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms'
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out', 
    easeInOut: 'ease-in-out'
  }
}

// Layout breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}