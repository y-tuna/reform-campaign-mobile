# Technical Requirements Document (TRD)

## 1. Executive Technical Summary
- 프로젝트 개요
  - 단일 데이터 계층(PostgreSQL + PostGIS)을 중심으로 모바일 앱(React Native/Expo)과 웹(Next.js)이 공용 API(주: Spring Boot, 보조: FastAPI)를 통해 작동하는 최소 구현 아키텍처를 채택한다.
  - Spring Boot는 외부 공개 API 게이트웨이이자 인증/인가, RBAC, 파일 업로드, 브로드캐스트 푸시, 증빙/정산/문서 관리의 주 엔드포인트를 제공한다.
  - FastAPI는 스케줄러/챗봇 내 비즈니스 로직을 담당하는 내부 서비스로 동작하며, Spring Boot와 내부 REST로만 통신한다(외부 비공개). 두 서비스는 동일 PostgreSQL과 S3 호환 스토리지를 공유한다.
- 코어 기술 스택
  - 프런트엔드: React Native(Expo), Next.js(TypeScript)
  - 백엔드: Spring Boot(Java, 주 API), FastAPI(Python, 스케줄러/챗봇)
  - 데이터: PostgreSQL(+PostGIS), S3 호환 스토리지
  - 인증/알림: JWT(RBAC), Naver Cloud SENS(SMS), Expo Push
- 핵심 기술 목표
  - 성능: Today 스케줄 API p95 < 300ms(캐시 제외), 증빙 업로드 완료 < 2s(네트워크 제외), 관리자 대시보드 주요 쿼리 p95 < 500ms
  - 확장성: 단일 DB 스키마 유지로 초기 비용 최소화, 서비스 분리는 내부 REST로만(필요시 단계적 분리)
  - 신뢰성: 파일 무결성 해시, GPS/시간 메타 자동 태깅, 선거 종료+30일 자동 파기 잡(Scheduler)
- 주요 기술 가정
  - 지도/ETA는 초기엔 휴리스틱 기반(포인트 간 단순 ETA/거리)으로 제공하고, OR-Tools/OSRM 등 복잡도는 확장 단계에서 도입
  - 결제는 미포함(크레딧 표기 전용), 제휴 상점/벤더 연동은 후속 단계
  - 한국 SMS 인증은 Naver Cloud SENS를 사용, 푸시는 Expo Notifications로 시작
  - 외부에 공개되는 API는 Spring Boot 단일 엔드포인트만 제공(클라이언트 단순화)

## 2. Tech Stack

| Category | Technology / Library | Reasoning (Why it's chosen for this project) |
| ----------------- | --------------------------- | -------------------------------------------- |
| 모바일 플랫폼 | React Native (Expo) | 현장성 높은 앱을 빠르게 개발/배포(OTA)하며 iOS/Android 동시 대응 |
| 모바일 네비게이션 | React Navigation | 경량, 커뮤니티 성숙, Expo와 궁합 우수 |
| 지도/지오 | react-native-mapbox-gl, Mapbox SDK | 한국 커버리지/스타일 유연성, RN/Web 공용 전략에 유리 |
| 상태/데이터 페칭 | React Query + Zustand | 서버 상태/캐시와 로컬 UI 상태를 단순 분리, 학습비용↓ |
| 폼/유효성 | React Hook Form + Zod | 접근성/성능 우수, 스키마 유효성 공용화 |
| 웹 프런트엔드 | Next.js (TypeScript) | 서버/클라이언트 렌더 유연, Vercel 배포 간편, SEO/대시보드에 적합 |
| 웹 UI | Ant Design | 관리자 테이블/필터/폼 생산성, 문서/컴포넌트 성숙 |
| 백엔드(주 API) | Spring Boot 3 + Spring Security + JWT | 타입 안전/엔터프라이즈 친화, RBAC/감사/스케줄링 안정 |
| 백엔드(보조) | FastAPI (Python 3.11) | 스케줄러/챗봇 규칙 엔진 구현에 민첩, 데이터 과학 생태계 호환 |
| 데이터베이스 | PostgreSQL 15 + PostGIS | 단일 소스, 공간쿼리/거리/클러스터 계산, 트랜잭션 일관성 |
| 마이그레이션 | Flyway (Spring Boot 구동 시) | 단일 마이그레이션 소유자 원칙, 다언어 서비스 간 스키마 일관성 |
| ORM/DAO (Java) | Spring Data JPA + QueryDSL | 생산성/가독성, 복잡 조회 최적화에 유리 |
| ORM (Python) | SQLAlchemy 2.0 | 서비스 별도 도메인에 필요한 최소 CRUD 구현 |
| 스토리지 | AWS S3 호환(예: AWS S3/Cloudflare R2) | 증빙/이미지 저장, presigned URL 통한 보안 다운로드 |
| 인증/SMS | Naver Cloud SENS (SMS OTP) | 국내 SMS 인증 안정/비용 효율 |
| 푸시 알림 | Expo Notifications | RN/Expo와 직결, 초기 운영 단순화 |
| API 스펙/SDK | OpenAPI 3 + openapi-generator | TS SDK 자동생성, FE/BE 계약 일관성 |
| 오류 모니터링 | Sentry (web/app/api) | 전면적 에러 추적, 배포 연동 |
| 로그/분석 | Amplitude 또는 Mixpanel | 사용자 행동/퍼널 추적(앱 중심) |
| CI/CD | GitHub Actions | 빌드/테스트/배포 파이프라인 단순화 |
| 호스팅/배포 | Vercel(web), Railway/Render(api), EAS(app) | 저비용/신속 배포, 프리뷰 환경 자동 |
| 캐시(선택) | Redis (Phase 3) | 스케줄 캐시, 레이트 리밋 등 확장 시 도입 |

## 3. System Architecture Design

### Top-Level building blocks
- 모바일 앱(React Native/Expo)
  - 서브: Today 스케줄 뷰, TaskCard, Proof 업로드, 챗봇, 대시보드, Senior 모드
- 웹 프런트엔드(Next.js)
  - 서브: 관리자 대시보드, 후보자/증빙/서류/크레딧/브로드캐스트 관리
- 주 API(Spring Boot)
  - 서브: 인증/SMS OTP, JWT/RBAC, Task/Proof/Credit/Docs/Broadcast 엔드포인트, 파일 업로드, presigned URL, 정기 파기 잡
- 보조 서비스(FastAPI)
  - 서브: 스케줄러 엔진, 챗봇 룰베이스 Q&A, 내부 REST 인터페이스
- 데이터 계층
  - PostgreSQL(+PostGIS), S3 호환 스토리지
- 외부 서비스
  - Naver Cloud SENS(SMS), Expo Push, Mapbox

### Top-Level Component Interaction Diagram
```mermaid
graph TD
    M[Mobile (React Native)] --> G[Spring Boot API]
    W[Web (Next.js)] --> G[Spring Boot API]
    G --> D[(PostgreSQL + PostGIS)]
    G --> S3[(S3-compatible Storage)]
    G --> P[FastAPI (Scheduler/Chatbot)]
    P --> D
    G --> X[Expo Push]
    G --> N[SENS (SMS OTP)]
    M -->|Map tiles| MB[Mapbox]
    W -->|Admin views| D
```

- 모바일/웹은 단일 게이트웨이(Spring Boot)로만 통신하여 클라이언트 구성을 단순화한다.
- Spring Boot는 DB/Storage에 직접 접근하며, 스케줄러/챗봇은 내부 FastAPI로 위임한다.
- 푸시/문자 인증은 Spring Boot가 외부 서비스(Expo/Naver SENS)를 호출한다.
- 지도 타일은 모바일이 Mapbox를 직접 호출(키는 앱 안전장치/도메인 제한 적용).

### Code Organization & Convention
도메인 주도 조직 전략
- 도메인 분리: users/profiles, tasks/routes, proofs, credits/donations, documents, broadcasts, scheduler, chatbot
- 레이어 아키텍처: presentation(controllers) / application(services) / domain(entities) / infrastructure(repos, gateways)
- 기능 단위 모듈화: 후보 관리, 증빙 심사, 브로드캐스트 발송 등 기능별 패키지화
- 공용 컴포넌트: 타입, 유틸, 디자인 토큰, OpenAPI 기반 SDK를 패키지로 공유

폴더 구조(단순/최소)
```
/
├── apps
│   ├── mobile/                    # React Native (Expo)
│   │   ├── app/                   # route/screens
│   │   ├── components/
│   │   ├── features/              # task, proof, chat, credit
│   │   ├── hooks/
│   │   ├── services/              # api client
│   │   └── store/
│   └── web/                       # Next.js (admin portal)
│       ├── app/                   # /dashboard, /candidates, /proofs ...
│       ├── components/
│       ├── features/
│       └── services/
├── services
│   ├── admin-api/                 # Spring Boot
│   │   ├── src/main/java/.../api  # controllers
│   │   ├── src/main/java/.../app  # services
│   │   ├── src/main/java/.../domain
│   │   ├── src/main/java/.../infra
│   │   └── src/main/resources/db/migration  # Flyway
│   └── scheduler/                 # FastAPI
│       ├── app/                   # routers, services
│       ├── domain/
│       └── infra/
├── packages
│   ├── api-client/                # OpenAPI TS SDK (generated)
│   ├── shared/                    # types, zod schemas, utils
│   └── design-tokens/             # colors, spacing, typography
├── infra
│   ├── docker/                    # Dockerfiles, compose for local
│   └── scripts/                   # db init, seed, backup
└── docs/                          # OpenAPI, ADR, ERD
```

### Data Flow & Communication Patterns
- 클라이언트–서버
  - REST(JSON) 기반; 모바일/웹 → Spring Boot API(단일 베이스 URL)
  - 인증: SMS OTP → JWT 발급, 헤더 Authorization: Bearer
- 데이터베이스 상호작용
  - Spring Boot: JPA/QueryDSL, HikariCP 풀; Flyway로 마이그레이션 단일 소유
  - FastAPI: SQLAlchemy 읽기/쓰기(스케줄러/챗봇 테이블 중심), 트랜잭션 최소 원칙
- 외부 서비스 연동
  - SMS: SENS REST API(OTP 요청/검증)
  - Push: Expo Push API(브로드캐스트/경고)
  - 지도: Mapbox 타일/지오코딩(필요 시)
- 실시간 통신
  - 초기 미도입. 긴급 공지는 푸시(Expo)로 전달
- 데이터 동기화
  - 단일 PostgreSQL 사용. 서비스 간 이벤트는 DB 변경 기반으로 폴링/쿼리(초기 단순), 확장은 Redis Pub/Sub 고려(후속 단계)

## 4. Performance & Optimization Strategy
- PostGIS 인덱싱(geometry, GIST)과 핵심 테이블(tasks, proofs, broadcasts)에 조합 인덱스 적용, 대시보드 조회는 필요한 필드만 Select
- Today 스케줄 API는 시간대/지역 키로 간단 캐시(애플리케이션 메모리) 적용, 후보자 설정 변경 시 캐시 무효화
- 증빙 업로드는 presigned URL 직업로드(클라이언트→S3), 백엔드는 메타 수신만 처리하여 I/O 병목 제거
- 페이징/커서 기반 목록 API, 무한 스크롤 연동, N+1 방지(JPA fetch join/Batch size)

## 5. Implementation Roadmap & Milestones
### Phase 1: Foundation (MVP Implementation)
- 코어 인프라
  - Monorepo, DB 스키마 v1(Flyway), S3 버킷, SENS/Expo 키 설정
- 필수 기능
  - 모바일: 오늘의 유세(목록/지도), Task 시작/완료, Proof 업로드(photo/receipt), 챗봇 Q&A(룰베이스), 대시보드, Senior 모드
  - 웹: 후보자 리스트/상세, 증빙 심사(승인/반려/사유), 공지 브로드캐스트 발송, 서류 체크리스트/업로드
  - 백엔드: JWT/RBAC, OTP 로그인, Proof 메타(GPS/시간/해시), 브로드캐스트 푸시, 문서 저장소
  - 스케줄러: 휴리스틱 점수(시간대/POI/성과/중앙가중치), 예비↔후보 모드 전환
- 보안 기본
  - TLS, JWT 만료/갱신, presigned URL 만료, PII 최소 필드 AES-256 암호화
- 개발 환경/CI
  - GitHub Actions(빌드/테스트), Vercel(웹), Railway/Render(API), EAS 빌드/OTA
- 타임라인
  - 4~6주

### Phase 2: Feature Enhancement
- 고급 기능
  - 크레딧 집계/월말 랭킹/환급 CSV, 관리자 대시보드 지표, 공지 이력/철회/감사 로그
  - 챗봇 KB 관리 UI(FAQ/사례 등록), 스케줄러 근거 시트(점수 분해)
- 성능 최적화
  - 주요 조회 캐시, 대량 리스트 커서 기반, 이미지 썸네일 파이프라인
- 보안 강화
  - 관리자 액션 감사로그, 레이트 리밋, 파일 바이러스 스캔(선택)
- 모니터링
  - Sentry 전면 도입, Amplitude 이벤트/퍼널 구성
- 타임라인
  - 4주

### Phase 3: Scaling & Optimization
- 확장성
  - Redis 캐시/레이트 리밋, 스케줄러 백그라운드 잡 큐(선택)
  - 지도/ETA 고도화(OSRM/GraphHopper PoC), OR-Tools 실험
- 고급 연동
  - 공보물/벤더 API 연동(Adsland 등), 후원 정산 CSV/양식 자동화
- 엔터프라이즈
  - 멀티 테넌시 키 칼럼 추가(정당/조직 식별자), 권한 세분화
- 컴플라이언스
  - 데이터 파기 자동화 점검/보고, 변경 이력(Audit) 확장
- 타임라인
  - 6~8주

## 6. Risk Assessment & Mitigation Strategies
### Technical Risk Analysis
- 기술 리스크
  - 이중 언어 백엔드(Java/Python) 복잡도 증가 → 단일 DB/단일 마이그레이션(Flyway) 원칙, 내부 REST만 허용
- 성능 리스크
  - PostGIS 공간쿼리 부하 → 적절한 GIST 인덱스/단순화(geometry simplification), 캐시 계층 도입(Phase 2~3)
- 보안 리스크
  - PII/GPS/증빙 유출 → AES-256 필드 암호화, presigned 단기 URL, 접근 로그/감사
- 통합 리스크
  - 푸시/SMS 외부 장애 → 재시도 큐/지연 재시도, Fallback 모드(체크리스트)

- 완화 전략
  - 성능 테스트(스케줄/증빙/대시보드) 사전 수행, 인덱스/쿼리 프로파일링
  - 에러 버짓/알림 룰 설정(Sentry), 장애 핸드북/Runbook 문서화

### Project Delivery Risks
- 일정 리스크
  - 선거 일정 고정 → MVP 범위 엄격 관리, Nice-to-have는 Phase 2+로 이관
- 리소스 리스크
  - 지도/스케줄러 전문지식 필요 → 휴리스틱 우선, 고급 알고리즘은 PoC 후 단계 반영
- 품질 리스크
  - 다기능 동시 개발 → 도메인 단위 기능 완결(작게 나눠 병렬), 계약 우선(OpenAPI 우선)
- 배포 리스크
  - 스토어 심사 지연 → EAS OTA 활용, 네이티브 변경 최소화
- 대응책
  - 주간 스코프 락/버전 태깅, 기능 플래그로 안전 롤아웃
  - 사전 테스트 계정/데이터 시드, 스테이징 환경 필수 운영

---

## 3. System Architecture Design (세부)

### Top-Level Component Interaction 설명
- 모바일/웹은 단일 API(Spring Boot)와 통신하며 인증/인가/데이터 CRUD/파일 링크를 처리한다.
- 스케줄러/챗봇 로직은 FastAPI에서 수행되고 결과를 Spring Boot가 조합/캐시하여 클라이언트에 응답한다.
- DB는 모든 서비스의 단일 소스이며, 파일은 S3 호환 스토리지에 저장된다.
- 공지/경고는 Expo Push로 발송, SMS OTP는 Naver SENS를 사용한다.

### Data Flow & Communication Patterns (요약)
- 클라이언트 요청 흐름: App/Web → Spring Boot → (DB/S3/Expo/SENS/FastAPI)
- FastAPI 내부 호출: Spring Boot → FastAPI(/schedule/score, /chat/ask 등) → DB
- 파일 업로드: App/Web가 presigned URL로 S3에 직접 업로드 → 메타는 Spring Boot에 기록
- 브로드캐스트: Admin(Web) → Spring Boot → Expo Push → App 배지/리본 표출

--- 

## 4. Performance & Optimization Strategy (추가 지침)
- DB
  - 핵심 FK/상태/시간 인덱스 설계(tasks(user_id,status,scheduled_at), proofs(user_id,created_at), broadcasts(target_scope,created_at))
  - 공간 인덱스(pois.geom GIST), 근접 질의는 ST_DWithin + LIMIT
- API
  - 목록 API는 커서 기반, 필터 조합 제한(화이트리스트된 필터만), 응답 필드 슬라이싱
- 앱/웹
  - 이미지 썸네일/지연 로딩, 무한 스크롤, 배치 업로드 재시도
- 백그라운드
  - 증빙 메타 처리(해시/EXIF)는 비동기 처리 큐(간단 스레드 풀)로 사용자 대기 최소화

## 5. Implementation Roadmap & Milestones (상세)
- Phase 1(4~6주)
  - 데이터 계약(OpenAPI/ERD) 고정, 인증/권한/RBAC, Proof/Task/Docs/Broadcast/Credit 최소플로우, 스케줄러 휴리스틱 v1, 챗봇 KB v1(룰베이스)
  - 관측: Sentry 연결, 핵심 퍼널 이벤트 로깅
- Phase 2(4주)
  - 관리자 지표/CSV, 브로드캐스트 이력/철회/감사, 랭킹/환급 CSV, 챗봇 KB 관리 UI, 성능 캐시
- Phase 3(6~8주)
  - Redis, OSRM/OR-Tools PoC, 벤더 API(공보물), 정산 양식 자동화, 멀티테넌시 키 도입

---

## 6. Risk Assessment & Mitigation Strategies (상세)

### Technical Risks
- 지도 SDK 제약/요금: Mapbox 사용량 모니터링, 타일 스타일 캐시 최적화
- Expo Push 신뢰성: 실패 재시도/토큰 청소, 중요 공지는 SMS 보조

### Performance Risks
- 선거 직전 트래픽 급증: 읽기 위주 쿼리 튜닝/캐시, 이미지 CDN(S3+CloudFront 선택적)
- 스케줄러 계산 지연: 사전 배치 계산+후보 설정 바뀔 때만 증분 계산

### Security Risks
- 파일 위변조: 파일 해시 저장, 서버 측 검증, 원본만 허용
- RBAC 누락: 컨트롤러 단 권한 가드 유닛 테스트, 최소 권한 접근 원칙

### Integration Risks
- 외부 API 장애: 폴백(체크리스트 모드), 재시도/서킷브레이커(간단 구현)

### Mitigation
- ADR로 의사결정 기록, OpenAPI 리그레션 테스트, 로드 테스트(예: k6) 사전 수행
- 데이터 파기 잡에 대한 E2E 테스트 및 운영 리포트 자동 생성

--- 

## Code Organization & Convention (세부 가이드)
- 도메인 바운디드 컨텍스트: user, profile, task/route, proof, credit/donation, document, broadcast, scheduler, chatbot
- 공통 타입/스키마: Zod/TS 타입을 /packages/shared에 집중화, 서버 유효성은 Bean Validation(Persistent) 병행
- API 계약 우선: OpenAPI 스키마에서 TS SDK 자동생성 → 앱/웹 단일 클라이언트 사용

---

## 데이터 계약/모델 맵핑(핵심)
- Task.type: poi-visit | facility-visit | doc-check | ad-purchase
- Task.tertiary: defer | proof | nav | open
- Task.status: planned | started | done | failed
- Proof.kind: photo | receipt
- Broadcast.severity: info | warn | critical
- Profile.intensity: hard | normal | light
- Profile.religion_pref: none | exclude:[X] | only:[Y]
- Mobility: car | pickup | trike | bike | walk
- Credit.kind: in | out | hold
- Document.kind: nomination | nec_form
- Document.status: draft | submitted | reviewed | transferred

---

## API 개요(대표)
- POST /auth/login-sms {phone} → {otpTxId}
- POST /auth/verify-otp {otpTxId, code} → {jwt, role}
- GET /schedule/today → {route, tasks[]}
- POST /tasks/:id/start
- POST /tasks/:id/complete {proofId?}
- POST /proofs (multipart init) → {presignedUrl, fields}
- POST /proofs/confirm {fileMeta,gps,taken_at,hash} → {proofId}
- POST /chat/ask {text} → {answer, refs, goto}
- GET /credit/summary → {balance, pendingCount}
- GET /broadcasts/today → {items[]}
- GET /docs/checklist → {items[]}
- POST /admin/broadcasts (admin)
- POST /admin/proofs/:id/review (admin)

---

## 보안/정책 핵심
- 인증/인가: SMS OTP + JWT + RBAC(candidate, admin, viewer)
- 데이터: PII 최소, AES-256(민감 필드), TLS 전송, 감사 로그(열람/다운로드/수정)
- 증빙: GPS/시간 자동 태깅, 파일 해시 저장, 화이트리스트 검증
- 보관/파기: 선거 종료+30일 자동 삭제(스케줄 잡), CSV 내보내기 후 별도 보존은 오프라인 정책

---

## 부록: 스케줄러/챗봇 구현 메모(최소주의)
- 스케줄러 v1
  - 입력: 시간대, POI 메타, 이벤트, 후보 선호, 과거 성과, 거리/ETA
  - 점수: 가중 합(시간대/타깃/접근성/다변화/성과/중앙가중치)
  - 모드: 예비↔후보 가중치 스위치
  - 근거 시트: 점수 항목별 분해값 반환
- 챗봇 v1
  - 룰베이스 키워드/FAQ 매칭, 근거 스니펫 + “자세히 보기” 링크
  - 모든 답변 로그 저장, 관리자 KB 등록/수정

--- 

## 결론
- 본 TRD는 PRD와 명시된 기술 스택(TypeScript/Next.js, Java Spring + Python, PostgreSQL, 모바일 앱 DB 공용)을 엄수하면서, Spring Boot 단일 게이트웨이 + FastAPI 내부 보조 구조로 최소 복잡도로 목표 기능을 달성한다.
- MVP는 “오늘의 유세/증빙/챗봇/공지/서류/크레딧 표기”에 집중하고, 확장은 캐시/관측/벤더 연동으로 단계적 추진한다.