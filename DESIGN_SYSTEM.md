# 개혁신당 통합 디자인 시스템

공천 시스템과 캠페인 매니저의 일관된 디자인을 위한 토큰 기반 시스템

## 🎨 핵심 브랜드 색상

### Primary (개혁신당 주황)
- **색상 코드**: `#F97316`
- **HSL**: `21 90% 52%`
- **사용처**: 주요 버튼, 강조 요소, 브랜드 아이덴티티

```css
/* CSS 변수 사용 */
color: hsl(var(--primary));

/* Tailwind 클래스 */
<button className="bg-primary text-primary-foreground">
  버튼
</button>
```

## 📦 디자인 토큰 구조

```
packages/design-tokens/
├── src/
│   ├── colors.ts      # 브랜드 색상 팔레트
│   ├── theme.ts       # 라이트/다크 테마 정의
│   └── index.ts       # 공통 진입점
```

## 🔧 토큰 사용 방법

### 1. CSS 변수로 직접 사용

모든 토큰은 CSS 변수로 정의되어 있습니다:

```css
:root {
  --primary: 21 90% 52%;           /* 개혁신당 주황 */
  --danger: 0 84% 60%;             /* 위험/에러 */
  --warning: 38 92% 50%;           /* 경고 */
  --success: 142 72% 35%;          /* 성공 */
  --info: 217 91% 60%;             /* 정보 */
}
```

**사용 예시**:
```tsx
<div style={{ color: 'hsl(var(--primary))' }}>
  개혁신당 주황색
</div>
```

### 2. Tailwind 유틸리티 클래스

```tsx
<div className="bg-primary text-primary-foreground">
  Primary 배경
</div>

<div className="text-danger">
  위험 텍스트
</div>

<div className="border-border rounded-lg">
  둥근 테두리
</div>
```

### 3. TypeScript에서 타입 안전하게 사용

```tsx
import { designTokens } from '@/app/theme/design-tokens';

const primaryColor = designTokens.colors.primary;
// "hsl(var(--primary))"
```

## 🌓 라이트/다크 모드

### 라이트 모드 (기본)
```css
:root {
  --background: 0 0% 100%;        /* 흰색 배경 */
  --foreground: 222.2 84% 4.9%;   /* 어두운 텍스트 */
}
```

### 다크 모드
```css
.dark {
  --background: 222.2 84% 4.9%;   /* 어두운 배경 */
  --foreground: 210 40% 98%;      /* 밝은 텍스트 */
}
```

**사용법**:
```tsx
<html className="dark">
  {/* 다크 모드 활성화 */}
</html>
```

## 🎯 시맨틱 토큰

### 색상
| 토큰 | 용도 | 색상 |
|------|------|------|
| `primary` | 주요 액션, 브랜드 강조 | 🟠 주황 (#F97316) |
| `secondary` | 보조 액션 | 회색 계열 |
| `danger` | 삭제, 위험한 액션 | 🔴 빨강 |
| `warning` | 경고, 주의 | 🟡 노랑 |
| `success` | 성공, 완료 | 🟢 초록 |
| `info` | 정보, 알림 | 🔵 파랑 |

### 레이아웃
| 토큰 | 용도 |
|------|------|
| `background` | 페이지 배경 |
| `foreground` | 기본 텍스트 |
| `card` | 카드/패널 배경 |
| `border` | 경계선 |
| `muted` | 덜 강조된 요소 |

## 🖼️ 브랜드 자산

### 로고
```tsx
<img
  src="/reform-party-logo.svg"
  alt="개혁신당"
  style={{ height: '40px' }}
/>
```

**위치**:
- 공천 시스템: `/Users/marycho/Nomination/apply-reform/public/reform-party-logo.svg`
- 캠페인 매니저: `/Users/marycho/reform-campaign/campaign-monorepo/apps/web/public/reform-party-logo.svg`

## 🔄 디자인 일괄 변경하기

### 단계 1: CSS 변수 수정

[apps/web/app/globals.css](./apps/web/app/globals.css) 파일에서 토큰 값 변경:

```css
:root {
  /* 주황에서 파랑으로 변경 예시 */
  --primary: 217 91% 60%;  /* 기존: 21 90% 52% */
}
```

### 단계 2: 자동 적용

모든 컴포넌트가 자동으로 새 색상을 사용합니다!

```tsx
/* 변경 불필요 - 자동으로 새 primary 색상 적용됨 */
<Button className="bg-primary">버튼</Button>
```

## ⚠️ 주의사항

### ✅ 올바른 사용
```tsx
// CSS 변수 사용
<div style={{ color: 'hsl(var(--primary))' }}>텍스트</div>

// Tailwind 토큰 클래스
<div className="bg-primary text-primary-foreground">카드</div>
```

### ❌ 잘못된 사용
```tsx
// 하드코딩된 색상 사용 (일관성 깨짐)
<div style={{ color: '#F97316' }}>텍스트</div>
<div className="bg-orange-500">카드</div>
```

## 📚 참고 자료

- **공천 프로젝트**: `/Users/marycho/Nomination/apply-reform`
  - [tailwind.config.ts](../../../Nomination/apply-reform/tailwind.config.ts)
  - [globals.css](../../../Nomination/apply-reform/src/app/globals.css)

- **캠페인 프로젝트**: `/Users/marycho/reform-campaign/campaign-monorepo`
  - [tailwind.config.ts](./apps/web/tailwind.config.ts)
  - [globals.css](./apps/web/app/globals.css)

## 🚀 빠른 시작

### 1. 새 컴포넌트 만들기

```tsx
import { designTokens } from '@/app/theme/design-tokens';

export function MyComponent() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-foreground font-bold mb-4">제목</h2>
      <p className="text-muted-foreground">설명</p>
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
        액션
      </button>
    </div>
  );
}
```

### 2. 다크 모드 토글

```tsx
'use client'

export function DarkModeToggle() {
  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
  };

  return <button onClick={toggleDark}>다크 모드 전환</button>;
}
```

## 📝 체크리스트

새 컴포넌트 작성 시:
- [ ] 하드코딩된 색상 대신 CSS 변수 사용
- [ ] Tailwind 토큰 클래스 사용 (`bg-primary` 등)
- [ ] 다크 모드에서 테스트
- [ ] 일관된 간격 사용 (`spacing` 토큰)
- [ ] 둥근 모서리는 `rounded-lg` 등 토큰 사용