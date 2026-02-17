# Reform Campaign Manager (비서AI · 캠페인 웹) Design Guide

## 1. Overall Mood (전체적인 무드)
- Concept: Trustworthy and Professional with a gentle warmth
- Rationale: Compliance-first workflows (proof with GPS/time, whitelist purchasing, +30 days data deletion) and dual roles (candidates incl. seniors, central admins) demand clarity and credibility. A slight warm accent adds friendliness without sacrificing simplicity.
- Tone: Cool-neutral base, low–mid saturation, simple and clean. Warmth appears sparingly in accents and empty-states only.

## 2. Reference Service (참조 서비스)
- Name: Stripe Dashboard (primary reference)
- Description: Payments and data dashboard focused on clarity and hierarchy
- Design Mood: Professional, minimal, data legible, low noise
- Primary Color: #635BFF
- Secondary Color: #0A2540

Blended cues:
- GOV.UK Design System for accessibility rigor and compliance clarity
- Asana for subtle warmth accents (only in empty/help states)

## 3. Color & Gradient (색상 & 그라데이션)
- Primary Color (Trust Navy): #1F2A44
- Secondary / Primary Action (Info Blue): #2563EB
- Accent Warm (Soft Apricot): #FFB36B
- Success: #16A34A
- Warning: #F59E0B
- Critical: #DC2626
- Grayscale (Cool-neutral)
  - Text Strong: #0F172A
  - Text Medium: #334155
  - Text Subtle: #64748B
  - Border: #E2E8F0
  - Surface Alt: #F8FAFC
  - Background: #FFFFFF

Mood
- Overall: Cool-neutral, low–mid saturation with a very light warm accent
- Accessibility: Maintain AA 4.5:1 contrast for body text; 3:1 for large headings

Color Usage
- Navigation/Header/Key titles: Trust Navy (#1F2A44)
- Primary CTAs/links/highlight actions: Info Blue (#2563EB)
- Empty/help/celebration micro-moments only: Soft Apricot (#FFB36B), never for body text
- Status mapping (PRD alignment):
  - Broadcast.severity info: #2563EB
  - Broadcast.severity warn: #F59E0B
  - Broadcast.severity critical: #DC2626
  - Task.status done: Success (#16A34A)
  - Task.status failed: Critical (#DC2626)
- Gradients: Avoid in data-heavy views. Optional subtle hero gradient for marketing/empty shells only (very low opacity)

## 4. Typography & Font (타이포그래피 & 폰트)
- Font Stack (KR-first, cross-platform):
  - Primary: Noto Sans KR, Inter
  - Fallback: Apple SD Gothic Neo, Segoe UI, Roboto, system-ui, sans-serif
- Type Scale (App/Web shared; Senior mode +2 steps)
  - H1: 28/36, Semibold
  - H2: 24/32, Semibold
  - H3: 20/28, Medium
  - Body: 16/24, Regular
  - Small: 14/20, Regular
  - Caption: 12/16, Regular
- Emphasis rules:
  - Use weight and spacing; avoid color-only emphasis
  - Numbers critical to tasks (ETA, expected contacts) use tabular nums (Inter) for alignment

## 5. Layout & Structure (레이아웃 & 구조)
- Spacing system: 4/8/12/16/24/32/48 px scale; component radius 8 px; interactive elevation subtle only
- Mobile App (RN/Expo)
  - Safe-area margins: 16 px
  - Bottom nav: max 4 tabs (Today, Dashboard, Chatbot, More)
  - Home stack: Ribbon → Mini-map overview → 2 TaskCards upfront (infinite list loads on scroll)
- Web (Next.js)
  - Grid: 12 columns, container 1200 px, gutter 24 px
  - Data pages: left filter column (optional 3 cols), content table (9 cols)
  - Fixed table headers, sticky action bar for approvals
- Senior Mode
  - font_scale=large: H2 as primary title on screens; single-card viewport; CTA buttons ≥56 px height; simplified icon density

## 6. Visual Style (비주얼 스타일)
- Icons: Stroke 1.5 px, monochrome by default (#334155), state color only when necessary (Success/Warning/Critical)
- Illustrations: Flat minimal line/shape for empty/help states in Soft Apricot accents
- Map pins: Navy outline, blue fill for active; ETA badge uses Info Blue with white text
- Photos/Proofs: Square or 4:3 thumbnails with rounded 8 px; show GPS/time meta chips below
- Ribbons: Full-width top band; severity colors mapped; single-line text with optional “More” link; dismissible

## 7. UX Guide (UX 가이드) — Beginners-first
Aligned with PRD and User Journey.

- Home = Today’s Route focus
  - Show top broadcast ribbon (info/warn/critical)
  - Mini-map with route and expected contacts/distance/score summary
  - Only 2 TaskCards above the fold; more load as user scrolls
- TaskCard principles (Task.type aligned)
  - One dominant CTA only: “Start” (poi-visit), “Open” (facility-visit/doc-check/ad-purchase), “Upload” (proof)
  - Secondary slot maps to Task.tertiary (defer/proof/nav/open) consistently on the right
  - “Why this place?” opens a short 3-line rationale (TimeMatch, Accessibility, PastPerformance)
- 3-minute onboarding
  - Required minimal settings: Profile.intensity, Profile.mobility, Profile.religion_pref (skip allowed)
  - font_scale detection → auto Senior recommendation
- Proof upload wizard (3 steps)
  - 1) Capture/Select → 2) Auto-metadata check (GPS/time) → 3) Submit
  - Offline queue and auto-resend; status badges (Pending/Retry)
  - Review results: toast + one-line reason on rejection
- Chatbot (rule-based)
  - Starter chips (e.g., “현수막 가능?”, “어깨띠 규정”) → concise answer + basis snippet → [View details] to web policy viewer
  - Short disclaimer maintained
- Web redirect clarity
  - Pre-redirect modal states destination and action (e.g., “You’ll submit a nomination document on web.”)
- Error/fallback
  - Scheduler down → checklist mode with brief reason and ETA
  - Clear retry buttons; keep user progress cached
- Microcopy (Korean, polite, action-first)
  - Short verbs (“시작하기”, “업로드 완료”)
  - Replace jargon: “증빙” → “사진·영수증”
  - Use user’s name only where necessary; keep tone supportive

## 8. UI Component Guide (UI 컴포넌트 가이드)
- Buttons
  - Primary: 48–56 px height; Blue #2563EB bg, white text; radius 8 px
  - Secondary: Navy #1F2A44 text on white bg with Navy border
  - Tertiary: Text-only, Blue #2563EB
  - Destructive: Red #DC2626 bg, white text
  - Loading: inline spinner; disable with 60% opacity
- Inputs
  - Field height 44–48 px; label outside; helper/error text below
  - Focus border: Blue #2563EB; Error: Red #DC2626
- TaskCard (App)
  - Structure: Title → short detail row (ETA, expected contacts) → CTA row
  - Status chips: planned (Subtle #64748B), started (Blue), done (Green), failed (Red)
  - Tertiary button slot: “defer/proof/nav/open” per Data Contract
- Broadcast Ribbon
  - Info: #2563EB; Warn: #F59E0B; Critical: #DC2626
  - Left icon + 1-line text + optional “More” link; dismissible
- Bottom Navigation (App)
  - Max 4 items; icon 24 px; label 12–13 px; active color Blue; inactive #64748B
- Map & Pins
  - Active pin: Blue fill; ETA badge in white text on Blue chip
  - Route preview uses subtle Blue stroke; reachable POIs dimmed
- Proof Uploader
  - Large capture button; thumbnail gallery; GPS/time meta chips auto-filled
  - Pending/Retry labels; progress indicator; “Submit” fixed at bottom
- Toast/Snackbar
  - Success: Green; Warning: Amber; Error: Red; duration 2–3 s; no blocking
- Tables (Web Admin)
  - Sticky header, zebra rows (F8FAFC alt)
  - Status pill colors: Approved(Green), Pending(Amber), Rejected(Red)
  - Bulk actions in top bar; right drawer for detail review

## 9. Data Contract Mappings (PRD 키 매핑)
- Task.type → icon + CTA
  - poi-visit: map-pin icon; CTA “Start”
  - facility-visit: building/handshake; CTA “Open”
  - doc-check: document icon; CTA “Open”
  - ad-purchase: bag/megaphone; CTA “Open”
- Task.tertiary → right-side action slot
  - defer | proof | nav | open
- Task.status → visuals
  - planned (subtle gray), started (blue outline), done (green), failed (red)
- Proof.kind → upload preset
  - photo | receipt, with metadata chips (gps, taken_at, hash)
- Broadcast.severity → ribbon color
  - info (#2563EB), warn (#F59E0B), critical (#DC2626)
- Profile.font_scale=large → Senior UI
- Credit.kind → ledger badges
  - in (Green), out (Blue/Navy), hold (Gray/Amber depending on review)

## 10. Accessibility & Internationalization (접근성/국제화)
- Contrast: AA 4.5:1 for body/minimum; large text AA 3:1
- Touch targets: ≥48 px; focus rings visible on web
- Motion: Reduced motion preference respected; limit parallax/animations
- Language: Default Korean UI copy; English admin labels optional; number formatting with thousands separators

## 11. Empty States, Loading, and Errors (상태별 가이드)
- Empty
  - Short encouragement line + one primary action
  - Soft Apricot accent in small illustration only
- Loading
  - Skeletons for lists/cards; progress bars for uploads
- Errors
  - Clear cause + recovery action; avoid technical jargon
  - Offline mode banners and auto-resume for proofs

## 12. Micro-interactions (마이크로 인터랙션)
- Haptics on primary success/failure in app
- Subtle fade/elevate on card tap; 120–160 ms transitions
- Score rationale sheet expands with slide-up; dismiss with swipe-down

## 13. Brand Assets & Do/Don’t (브랜드 운용)
- Do
  - Use Navy/Blue for all core flows; reserve Warm accent only for help/empty/celebration
  - Keep iconography monochrome unless conveying state
- Don’t
  - No gradients on data tables; no warm accent on body text
  - Avoid more than one accent per screen

## 14. Screen Patterns (대표 화면 패턴)
- App Home (Today)
  - Ribbon → Mini-map → 2 TaskCards → “View more”
- Proof Flow
  - Capture → Auto meta → Submit → Pending badge → Admin result toast
- Chatbot
  - Chips → Answer + basis snippet → [View details] to web
- Admin Web
  - Candidate list → detail drawer (activities, proofs, documents) → approve/reject with reason → audit log