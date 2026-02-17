/**
 * 개혁신당 디자인 시스템 - 테마 토큰
 * CSS 변수와 매핑되는 시맨틱 토큰
 */

export const lightTheme = {
  // 공통
  radius: '0.5rem',

  // 배경/전경
  background: '0 0% 100%',
  foreground: '222.2 84% 4.9%',

  // 경계선/입력/포커스
  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  ring: '21 90% 52%', // primary 주황 기반

  // 카드
  card: '0 0% 100%',
  cardForeground: '222.2 84% 4.9%',

  // Muted (덜 강조)
  muted: '210 40% 96.1%',
  mutedForeground: '215.4 16.3% 46.9%',

  // Primary (개혁신당 주황)
  primary: '21 90% 52%', // F97316
  primaryForeground: '0 0% 100%',

  // Secondary
  secondary: '210 40% 96.1%',
  secondaryForeground: '222.2 47.4% 11.2%',

  // Accent
  accent: '24 90% 96%',
  accentForeground: '24 90% 30%',

  // 상태 색상
  danger: '0 84% 60%',
  dangerForeground: '0 0% 98%',

  warning: '38 92% 50%',
  warningForeground: '0 0% 15%',

  success: '142 72% 35%',
  successForeground: '0 0% 98%',

  info: '217 91% 60%',
  infoForeground: '0 0% 98%',
} as const;

export const darkTheme = {
  // 공통
  radius: '0.5rem',

  // 배경/전경
  background: '222.2 84% 4.9%',
  foreground: '210 40% 98%',

  // 카드
  card: '222.2 84% 4.9%',
  cardForeground: '210 40% 98%',

  // Muted
  muted: '217.2 32.6% 17.5%',
  mutedForeground: '215 20.2% 65.1%',

  // 경계선/입력/포커스
  border: '217.2 32.6% 17.5%',
  input: '217.2 32.6% 17.5%',
  ring: '21 90% 60%',

  // Primary
  primary: '21 90% 56%',
  primaryForeground: '0 0% 100%',

  // Secondary
  secondary: '217.2 32.6% 17.5%',
  secondaryForeground: '210 40% 98%',

  // Accent
  accent: '24 70% 20%',
  accentForeground: '24 100% 96%',

  // 상태 색상
  danger: '0 72% 55%',
  dangerForeground: '0 0% 98%',

  warning: '38 92% 60%',
  warningForeground: '0 0% 10%',

  success: '142 72% 40%',
  successForeground: '0 0% 98%',

  info: '217 91% 65%',
  infoForeground: '0 0% 98%',
} as const;

export type Theme = typeof lightTheme;
