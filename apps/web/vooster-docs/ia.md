# Reform Campaign Manager (비서AI · 캠페인 웹) Information Architecture (IA)

Captain, here’s the locked IA reflecting our 3 pillars:
- Pillar 1: App execution of Today’s Route + Web retrospective intelligence (heatmap, dwell, clusters, rationale snapshot)
- Pillar 2: Proof upload and credit feedback loop
- Pillar 3: Admin oversight (approvals, broadcasts, refunds)
Navigation: Web = sidebar console; App = 4-tab bottom bar
Auth: Required (SMS OTP → JWT → RBAC)

## 1. Site Map (사이트맵)

- Mobile App (Auth Required)
  - Today (Home)
    - Broadcast Ribbon
    - Mini-map Route Overview
    - TaskCards (poi-visit, facility-visit, doc-check, ad-purchase)
    - “Why this place?” rationale sheet
  - Dashboard
    - Daily summary (contacts, distance, tasks)
    - Monthly ranking & credit summary
  - Chatbot
    - Q&A → basis snippet → [View details] link to Web Policy Viewer
  - More
    - Profile & Preferences (intensity, mobility, religion, font scale)
    - Proof Upload History
    - Help & Tutorial
    - App Settings & Logout
- Web Admin Console (Auth Required, Sidebar)
  - Dashboard
  - Activity Intelligence
    - Heatmap
    - Movement Traces
    - Place Performance
    - Target Clusters
    - Rationale Evidence (read-only inputs/weights snapshot)
  - Candidates
    - List
    - Candidate Detail (activities, proofs, documents, credits)
  - Proofs (Photos/Receipts)
    - Review Queue
    - Approved / Rejected
  - Documents (Nomination / NEC forms)
    - Submission Inbox
    - Review & Transfer
  - Broadcasts
    - Create / Targeting / History / Revokes
  - Credits & Donations
    - Ledgers / Refunds / Exports
  - Logs & Exports
  - Settings (Roles, Feature Flags, Policies)
  - Policy Viewer (linked from App/Chatbot)
- Auth & Onboarding
  - Login (Phone verification / SMS OTP)
  - Onboarding (intensity, mobility, religion, font scale)
  - Role-based landing (candidate/app, admin/web)

Responsive considerations
- App: Bottom tabs (max 4). Senior mode: single-card viewport, H2 primary, 56+ px CTAs.
- Web: Sidebar collapses to icon-only at <=1280 px and to drawer at <=1024 px; data tables horizontal-scroll with fixed headers.

## 2. User Flow (사용자 흐름)

- Candidate: Today’s Route Execution (App)
  1. Open App → Today tab shows Broadcast Ribbon.
  2. Review mini-map (expected contacts, distance, score).
  3. Tap TaskCard (poi-visit) → Start → GPS tracking ON.
  4. Complete → capture photo/memo → auto GPS/time tag → Submit.
  5. If facility/doc/ad → Open → pre-redirect notice → proceed to relevant web page when needed.
  6. View “Why this place?” rationale (TimeMatch, Accessibility, PastPerformance, CentralDirective).
  7. If scheduler down → checklist fallback.

- Candidate: Proof Upload & Credit Feedback (App → Web sync)
  1. Start Proof Wizard: Capture/Select.
  2. Auto-metadata check (GPS/time/hash) → fix if missing.
  3. Submit → Pending/Retry state visible offline → auto-resend.
  4. Dashboard shows balance, in/out/hold and pending count; rejection toast with reason and fix link.

- Admin: Retrospective Intelligence (Web)
  1. Activity Intelligence → Heatmap (time range selector + timeline scrubber).
  2. Click region → POI list → open POI detail drawer (proofs/photos/notes).
  3. Move to Movement Traces to view GPS trails + dwell pins.
  4. Compare Place Performance (exposure vs actual), Target Clusters overlay, Central directives effect.
  5. Export CSV or map snapshot.

- Admin: Approvals & Broadcasts (Web)
  1. Proofs → Review Queue (filters, bulk actions).
  2. Open right drawer → Approve/Reject with reason → audit log saved.
  3. Documents → review → approve/transfer.
  4. Broadcasts → compose (severity, targeting) → send → track delivery/reads → revoke if needed.
  5. Month-end → Credits & Donations → ranking confirm → refunds → export CSV.

- Chatbot → Policy Viewer (App → Web)
  1. Ask “Is banner at X allowed?” → rule-based answer + basis snippet.
  2. Tap [View details] → web Policy Viewer with canonical doc and examples.

## 3. Navigation Structure (네비게이션 구조)

- Web (Admin Console): Sidebar (primary), Header (secondary)
  - Sidebar (persistent): Dashboard, Activity Intelligence (group), Candidates, Proofs, Documents, Broadcasts, Credits & Donations, Logs & Exports, Settings, Policy Viewer.
  - Header: Page title (Trust Navy), breadcrumbs for nested areas, global search, user menu.
  - Local filters: Left filter column (optional 3 cols) on data-heavy pages; sticky table headers.
  - Rationale: Stripe-like data console; many hubs require persistent access and clear scannability.

- Mobile App: Bottom Tab Bar (max 4)
  - Tabs: Today, Dashboard, Chatbot, More.
  - Today stack: Ribbon → Mini-map → 2 TaskCards above fold → infinite load on scroll.
  - Senior mode: larger type (+2 steps), single-card viewport.

- Access control
  - All routes behind authentication (SMS OTP → JWT → RBAC: candidate, admin, viewer).
  - Sensitive actions (refunds, revokes) may require re-auth.

## 4. Page Hierarchy (페이지 계층 구조)

- Web (Admin)
  - / (Dashboard)
  - /activity
    - /activity/heatmap
    - /activity/traces
    - /activity/places
    - /activity/clusters
    - /activity/rationale
  - /candidates
    - /candidates/:candidateId
      - /candidates/:candidateId/activities
      - /candidates/:candidateId/proofs
      - /candidates/:candidateId/documents
      - /candidates/:candidateId/credits
  - /proofs
    - /proofs/review
    - /proofs/approved
    - /proofs/rejected
  - /documents
    - /documents/inbox
    - /documents/review
    - /documents/transferred
  - /broadcasts
    - /broadcasts/new
    - /broadcasts/history
  - /credits
    - /credits/ledgers
    - /credits/refunds
  - /logs
    - /logs/exports
  - /settings
    - /settings/roles
    - /settings/flags
    - /settings/policies
  - /policy/:slug
- Auth
  - /auth/login
  - /auth/verify-otp
- Mobile App (route names)
  - app://today
    - app://today/task/:taskId
  - app://dashboard
  - app://chatbot
  - app://more
  - app://proofs/:proofId
  - app://onboarding

## 5. Content Organization (콘텐츠 구성)

| Page | Key Content Elements |
|---|---|
| App – Today | Broadcast Ribbon, Mini-map summary (contacts/distance/score), 2 TaskCards above fold, “Why this place?” rationale sheet, Start/Open CTAs |
| App – Dashboard | Daily counters, charts (contacts, distance, tasks), credit summary (in/out/hold), ranking badge |
| App – Chatbot | Input, starter chips, answer card with basis snippet, disclaimer, [View details] link |
| App – Proof Wizard | Stepper (Capture → Meta check → Submit), thumbnails, GPS/time/hash chips, Pending/Retry badges |
| Web – Dashboard | KPIs (active candidates, pending proofs, broadcasts), trend charts, quick links |
| Web – Activity Heatmap | Map canvas, heat legend, time range, timeline scrubber, region click → POI list |
| Web – Movement Traces | Map with GPS trails, dwell-time pins, coverage metrics |
| Web – Place Performance | Table/cards: POI, exposure score, actual contacts, dwell, proof count, trend sparkline |
| Web – Target Clusters | Cluster overlays, reach vs plan, directives lift indicators |
| Web – Candidates | Table with filters; detail drawer/tabs: activities, proofs, documents, credits |
| Web – Proofs Review | Table (status, kind, taken_at, gps), bulk actions, right drawer (photo, meta, decision) |
| Web – Documents | Inbox list, template viewer, checklist, approve/transfer with audit |
| Web – Broadcasts | Composer (severity, target, schedule), delivery/read metrics, revoke history |
| Web – Credits & Donations | Ledger table, month-end ranking view, refund executor, CSV export |
| Web – Logs & Exports | Audit log table (who/when/what), export job list |
| Web – Settings | Roles & permissions, feature flags, policy docs, retention settings |
| Policy Viewer | Canonical policy doc, related FAQs, version and effective date |

Accessibility notes
- AA contrast for body text; focus states visible; keyboard navigation for tables and drawer actions.
- App touch targets ≥48 px; voice-over labels on key CTAs.

## 6. Interaction Patterns (인터랙션 패턴)

- List → Detail Drawer
  - Tables open a right-side drawer for quick review/approval; preserves context.
- Sticky Table Header & Bulk Actions
  - Headers fixed; bulk approve/reject on top bar; filter chips persist.
- Pre-redirect Notice (App → Web)
  - Modal explains destination and action before opening web (e.g., “You’ll submit a nomination document on web.”).
- Proof Upload Wizard (3 steps)
  - Capture → Auto metadata check → Submit; Pending/Retry; offline queue auto-resend.
- “Why this place?” Rationale Sheet
  - 3-line summary (TimeMatch, Accessibility, PastPerformance, CentralDirective).
- Broadcast Ribbon
  - Severity colors: info blue, warn amber, critical red; dismissible; More link to full post.
- Fallback Mode
  - Scheduler outage → checklist mode with brief reason and ETA; cached progress kept.
- Infinite Scroll (App TaskCards)
  - Show 2 items above the fold → load more on scroll; spinner with back-pressure.
- Approvals Confirmation
  - Approve/Reject requires reason on Reject; destructive actions double-confirm and re-auth where necessary.
- Toasts & Snackbars
  - Success/Warning/Error with consistent colors; short copy; non-blocking.

## 7. URL Structure (URL 구조)

Conventions
- Lowercase, hyphen-separated, nouns first (SEO readable even though behind auth).
- Resource detail uses IDs or slugs (`/candidates/:candidateId`, `/policy/:slug`).
- Filters via query params (`?status=pending&date=2025-10-10`).
- Canonical per page; avoid hash fragments for primary content.

Examples (Web, admin)
- General: https://console.reform-campaign.kr/
- Auth: https://console.reform-campaign.kr/auth/login
- Activity: https://console.reform-campaign.kr/activity/heatmap?range=7d
- Candidate: https://console.reform-campaign.kr/candidates/abc123/activities
- Proof review: https://console.reform-campaign.kr/proofs/review?status=pending
- Broadcast history: https://console.reform-campaign.kr/broadcasts/history
- Policy viewer: https://console.reform-campaign.kr/policy/whitelist-purchase

Deep links (App)
- app://task/poi-visit/123
- app://proofs/987?state=pending
- app://web-redirect?to=https%3A%2F%2Fconsole.reform-campaign.kr%2Fdocuments%2Freview

SEO best practices (even if private)
- Semantic titles and headings; descriptive slugs (e.g., policy docs).
- Open Graph tags for policy pages if ever shared (still gated).
- Robots noindex on authenticated areas; allow only marketing/front pages if any (none in this scope).

Internationalization
- Default KR copy; route slugs remain English for consistency. If KR slugs required, map via router aliases.

## 8. Component Hierarchy (컴포넌트 계층 구조)

- Global (App/Web)
  - Header (Web), Sidebar Nav (Web), Bottom Tab Bar (App), Page Title, Breadcrumbs (Web), Footer (Web minimal), Toast/Snackbar, Modal/Dialog, Spinner/Skeleton
- Data & Layout
  - FilterBar, Table (zebra rows, sticky header), Pagination/InfiniteScroll, RightDrawer, ApprovalsStickyBar, StatsCard, ChartMini (sparklines), EmptyState
- Mapping & Geo
  - MapCanvas, HeatmapLayer, TraceLayer, Pin/Badge, TimelineScrubber, Legend
- App-Specific
  - BroadcastRibbon, MiniMapSummary, TaskCard (poi-visit/facility/doc/ad), RationaleSheet, ProofWizard (Capture, MetaCheck, Submit), CreditSummary, RankingBadge
- Admin-Specific
  - CandidateList, CandidateDetailTabs, ProofReviewCard, DocumentChecklist, DocumentViewer, BroadcastComposer, TargetSelector, LedgerTable, RefundExecutor, AuditLogTable, ExportJobList, PolicyDocViewer
- Inputs & Feedback
  - Button (Primary/Secondary/Tertiary/Destructive), Input/TextArea, Select/MultiSelect, DateRangePicker, Chips/Badges (status), Tooltip/Popover, ConfirmationDialog
- Accessibility/Mode
  - SeniorModeProvider (font scale, single-card toggle), FocusRing, AnnounceRegion (ARIA live)

Reusability and tokens
- Shared design tokens for color, spacing, typography; tabular numerals for key metrics (ETA, counts).
- State mapping aligned to data contracts (Task.status, Proof.kind, Broadcast.severity, Credit.kind).

Responsive behaviors
- Sidebar: full → icon-only → drawer across breakpoints (≥1280 / 1024 / <1024).
- Tables: horizontal scroll with sticky headers; column priority order on narrow screens.
- Maps: legend collapses into a floating chip group on narrow widths.
- App Senior Mode: H2 primary titles; single-card viewport; ≥56 px CTAs.

---