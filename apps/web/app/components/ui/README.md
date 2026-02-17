# UI 컴포넌트 라이브러리

디자인 토큰 기반의 재사용 가능한 UI 컴포넌트 모음

## 📦 컴포넌트 목록

### Button
디자인 토큰 기반 버튼 컴포넌트

```tsx
import { Button } from '@/app/components/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean
- `disabled`: boolean

---

### Card
디자인 토큰 기반 카드 레이아웃 컴포넌트

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/app/components/ui';

<Card variant="default">
  <CardHeader
    title="제목"
    description="설명"
    action={<Button>액션</Button>}
  />
  <CardContent>
    카드 본문 내용
  </CardContent>
  <CardFooter>
    <Button variant="ghost">취소</Button>
    <Button variant="primary">확인</Button>
  </CardFooter>
</Card>

// Elevated variant (hover shadow)
<Card variant="elevated">
  높은 카드
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated'
- `className`: string

---

### Input
디자인 토큰 기반 입력 필드 컴포넌트

```tsx
import { Input } from '@/app/components/ui';

<Input
  label="이름"
  placeholder="이름을 입력하세요"
  required
/>

<Input
  type="email"
  label="이메일"
  error="이메일 형식이 올바르지 않습니다"
/>

<Input
  label="설명"
  helperText="최대 100자까지 입력 가능합니다"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `required`: boolean
- 모든 HTML input 속성 지원

---

### Badge
디자인 토큰 기반 뱃지/태그 컴포넌트

```tsx
import { Badge } from '@/app/components/ui';

<Badge variant="primary">Primary</Badge>
<Badge variant="success">완료</Badge>
<Badge variant="warning">대기중</Badge>
<Badge variant="danger">긴급</Badge>
<Badge variant="info">정보</Badge>
<Badge variant="default">기본</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `className`: string

---

### Alert
디자인 토큰 기반 알림/경고 컴포넌트

```tsx
import { Alert } from '@/app/components/ui';

<Alert variant="info" title="알림">
  정보 메시지입니다.
</Alert>

<Alert variant="success" title="성공">
  작업이 성공적으로 완료되었습니다.
</Alert>

<Alert variant="warning" title="경고">
  주의가 필요합니다.
</Alert>

<Alert variant="danger" title="오류" onClose={() => console.log('close')}>
  오류가 발생했습니다.
</Alert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'danger'
- `title`: string (optional)
- `onClose`: () => void (optional)
- `children`: ReactNode

---

## 🎨 디자인 토큰 사용

모든 컴포넌트는 CSS 변수 기반 디자인 토큰을 사용합니다:

```css
/* 색상 토큰 */
--primary: 21 90% 52%;           /* 개혁신당 주황 */
--danger: 0 84% 60%;
--warning: 38 92% 50%;
--success: 142 72% 35%;
--info: 217 91% 60%;

/* 레이아웃 토큰 */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--border: 214.3 31.8% 91.4%;
```

### Tailwind 클래스로 사용

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

---

## 🔧 커스터마이징

### 토큰 값 변경

[app/globals.css](../../globals.css)에서 토큰 값을 변경하면 모든 컴포넌트가 자동으로 업데이트됩니다:

```css
:root {
  /* 주황에서 파랑으로 변경 */
  --primary: 217 91% 60%;
}
```

### 컴포넌트 확장

```tsx
// 커스텀 버튼 생성
import { Button } from '@/app/components/ui';

export function CustomButton(props) {
  return (
    <Button
      variant="primary"
      className="hover:scale-105 transition-transform"
      {...props}
    />
  );
}
```

---

## 📝 개발 가이드

### 새 컴포넌트 추가

1. `components/ui/` 디렉토리에 새 파일 생성
2. 디자인 토큰 사용하여 스타일링
3. `components/ui/index.ts`에 export 추가
4. 이 문서에 사용법 추가

### 예시: 새 컴포넌트

```tsx
// components/ui/Spinner.tsx
export function Spinner({ size = 'md' }) {
  return (
    <div className={`
      animate-spin rounded-full
      border-2 border-primary border-t-transparent
      ${size === 'sm' ? 'h-4 w-4' : 'h-8 w-8'}
    `} />
  );
}
```

---

## ✅ 체크리스트

새 컴포넌트 작성 시:
- [ ] 디자인 토큰 사용 (하드코딩된 색상 금지)
- [ ] TypeScript 타입 정의
- [ ] Props 문서화
- [ ] 사용 예시 작성
- [ ] 접근성 고려 (aria-label 등)
- [ ] 반응형 디자인 지원
