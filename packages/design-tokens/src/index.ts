/**
 * 개혁신당 디자인 토큰
 * 공천 시스템과 캠페인 매니저의 통합 디자인 시스템
 */

export { colors, type Colors } from './colors';
export { lightTheme, darkTheme, type Theme } from './theme';

// 브랜드 상수
export const brand = {
  name: '개혁신당',
  primaryColor: '#F97316', // 주황색
  logoPath: '/reform-party-logo.svg',
} as const;
