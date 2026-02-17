# 🚀 Supabase 연결 가이드

기존 Supabase 프로젝트를 현재 Next.js 앱에 연결하는 방법을 안내합니다.

## 📋 준비사항

1. **기존 Supabase 프로젝트**: https://supabase.com/dashboard 에서 확인
2. **@supabase/supabase-js**: ✅ 이미 설치완료

## 🔧 1단계: 환경변수 설정

### 1.1 `.env.local` 파일 생성
```bash
# 프로젝트 루트에 .env.local 파일을 생성하세요
cp .env.local.example .env.local
```

### 1.2 Supabase 대시보드에서 값 가져오기
1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. **Settings** → **API** 메뉴로 이동
3. 다음 값들을 복사:

```env
# .env.local 파일에 실제 값을 입력하세요
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## 🗄️ 2단계: 기존 데이터베이스 스키마 확인

### 2.1 SQL Editor로 스키마 확인
```sql
-- Supabase Dashboard → SQL Editor에서 실행
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, ordinal_position;
```

### 2.2 TypeScript 타입 생성
```bash
# Supabase CLI 설치 (필요시)
npm install -g supabase

# 데이터베이스 타입 생성
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > app/lib/database.types.ts
```

### 2.3 기존 테이블 목록 확인
```sql
-- 모든 테이블 조회
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 각 테이블의 컬럼 정보 확인
\d+ table_name
```

## 🔄 3단계: Zustand 스토어와 통합

### 3.1 기본 사용법
```typescript
// app/store/documents.ts 예시
import { supabaseHelpers } from '../lib/supabase'

export const useDocumentsStore = create<DocumentsState & DocumentsActions>((set, get) => ({
  // 기존 mock 데이터 유지
  documents: mockDocuments,
  
  // Supabase 연동 함수 추가
  async syncWithSupabase() {
    const { data, error } = await supabaseHelpers.read<Document>('documents')
    if (data) {
      set({ documents: data })
    }
  },

  async uploadToSupabase(document: Partial<Document>) {
    const { data, error } = await supabaseHelpers.create('documents', document)
    if (data) {
      set((state) => ({ 
        documents: [...state.documents, data] 
      }))
    }
    return { data, error }
  }
}))
```

### 3.2 실시간 동기화 (옵션)
```typescript
// 실시간 구독 설정
import { createRealtimeSubscription } from '../lib/supabase'

// 컴포넌트에서 사용
useEffect(() => {
  const subscription = createRealtimeSubscription(
    'documents',
    (payload) => {
      // 실시간 업데이트 처리
      console.log('Database change:', payload)
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## 🛡️ 4단계: 인증 설정 (NextAuth + Supabase)

### 4.1 NextAuth 설정
```typescript
// app/lib/auth.tsx 수정
import { createClient } from '@supabase/supabase-js'

// NextAuth와 Supabase 연동 설정
export const authOptions = {
  providers: [
    // 기존 providers
  ],
  callbacks: {
    async session({ session, token }) {
      // Supabase 사용자 정보 동기화
      return session
    }
  }
}
```

## 🗂️ 5단계: 파일 업로드 설정

### 5.1 Storage Bucket 생성
1. Supabase Dashboard → **Storage** 메뉴
2. 새 bucket 생성: `campaign-files`, `documents`, `proofs`
3. 정책(RLS) 설정

### 5.2 파일 업로드 함수 사용
```typescript
// 파일 업로드 예시
const uploadFile = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabaseHelpers.uploadFile(
    'documents', 
    fileName, 
    file
  )
  
  if (data) {
    const publicUrl = supabaseHelpers.getFileUrl('documents', data.path)
    return publicUrl
  }
}
```

## 🧪 6단계: 연결 테스트

### 6.1 기본 연결 테스트
```typescript
// 연결 상태 확인
import { supabase } from './lib/supabase'

const testConnection = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  console.log('Connection test:', { data, error })
}
```

### 6.2 인증 테스트
```typescript
// 현재 사용자 확인
const { user, error } = await supabaseHelpers.getCurrentUser()
console.log('Current user:', user)
```

## 📊 현재 Mock 데이터와 통합 전략

### Phase 1: 하이브리드 모드
- Mock 데이터 유지하면서 Supabase 연결 테스트
- 점진적으로 실제 데이터로 전환

### Phase 2: 데이터 마이그레이션
- Mock 데이터를 Supabase로 이전
- 스키마 검증 및 조정

### Phase 3: 완전 통합
- Mock 데이터 제거
- 실시간 동기화 활성화

## 🚨 중요 참고사항

1. **환경변수**: `.env.local` 파일은 절대 git에 커밋하지 마세요
2. **RLS (Row Level Security)**: 프로덕션에서는 필수 설정
3. **타입 안정성**: `database.types.ts` 파일을 정기적으로 업데이트
4. **백업**: 기존 Supabase 데이터를 백업하고 진행하세요

## 🔗 유용한 링크

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js + Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)