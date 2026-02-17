/**
 * 개혁신당 디자인 시스템 - 색상 토큰
 * 공천 시스템과 캠페인 매니저에서 공통으로 사용
 */

export const colors = {
  // 브랜드 주황색 (개혁신당 Primary)
  brand: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // 메인 주황색
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },

  // 중립 그레이 스케일
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // 상태 색상
  danger: {
    DEFAULT: '#EF4444',
    foreground: '#FAFAFA',
  },
  warning: {
    DEFAULT: '#F59E0B',
    foreground: '#1F2937',
  },
  success: {
    DEFAULT: '#10B981',
    foreground: '#FAFAFA',
  },
  info: {
    DEFAULT: '#3B82F6',
    foreground: '#FAFAFA',
  },
} as const;

export type Colors = typeof colors;
