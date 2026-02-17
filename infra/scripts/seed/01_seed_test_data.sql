-- Reform Campaign Manager - Test Data Seed Script
-- Version: 1.0
-- Description: Insert test and mock data for development and testing

-- Insert test users
INSERT INTO users (id, phone, role, is_active, created_at, updated_at) VALUES
    ('11111111-1111-1111-1111-111111111111', '+821012345678', 'admin', true, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', '+821098765432', 'candidate', true, NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', '+821055556666', 'candidate', true, NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', '+821077778888', 'candidate', true, NOW(), NOW());

-- Insert test profiles
INSERT INTO profiles (id, user_id, name, email, district, party_affiliation, intensity, mobility, religion_pref, is_candidate_mode, senior_ui_mode, created_at, updated_at) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '관리자', 'admin@reform.kr', '중앙당', '개혁신당', 'normal', 'car', '{"preference": "none", "values": []}', false, false, NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '김후보', 'kim@reform.kr', '서울 강남구 을', '개혁신당', 'hard', 'car', '{"preference": "none", "values": []}', true, false, NOW(), NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '이예비', 'lee@reform.kr', '부산 해운대구 갑', '개혁신당', 'normal', 'bike', '{"preference": "exclude", "values": ["특정종교"]}', false, true, NOW(), NOW()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', '박신인', 'park@reform.kr', '대구 수성구 갑', '개혁신당', 'light', 'walk', '{"preference": "none", "values": []}', false, false, NOW(), NOW());

-- Insert test POIs (Points of Interest)
INSERT INTO pois (id, name, category, address, geom, opening_hours, target_demographics, foot_traffic_data, accessibility_score, data_source, created_at, updated_at) VALUES
    ('p1111111-1111-1111-1111-111111111111', '강남역 지하철역', 'station', '서울특별시 강남구 강남대로 지하 396', ST_SetSRID(ST_MakePoint(127.027583, 37.497952), 4326), '{"mon": "05:30-24:00", "tue": "05:30-24:00", "wed": "05:30-24:00", "thu": "05:30-24:00", "fri": "05:30-24:00", "sat": "05:30-24:00", "sun": "05:30-24:00"}', '{"age_groups": ["20-30", "30-40", "40-50"], "occupations": ["office_worker", "student"]}', '{"peak_hours": ["08:00-09:00", "18:00-19:00"], "daily_average": 50000}', 9, 'manual', NOW(), NOW()),
    
    ('p2222222-2222-2222-2222-222222222222', '이마트 강남점', 'market', '서울특별시 강남구 도곡로 지하 416', ST_SetSRID(ST_MakePoint(127.034834, 37.491654), 4326), '{"mon": "10:00-23:00", "tue": "10:00-23:00", "wed": "10:00-23:00", "thu": "10:00-23:00", "fri": "10:00-23:00", "sat": "10:00-23:00", "sun": "10:00-23:00"}', '{"age_groups": ["30-40", "40-50", "50-60"], "occupations": ["housewife", "office_worker"]}', '{"peak_hours": ["19:00-21:00"], "daily_average": 3000}', 8, 'manual', NOW(), NOW()),
    
    ('p3333333-3333-3333-3333-333333333333', '해운대해수욕장', 'station', '부산광역시 해운대구 중동', ST_SetSRID(ST_MakePoint(129.160139, 35.158611), 4326), '{"mon": "24시간", "tue": "24시간", "wed": "24시간", "thu": "24시간", "fri": "24시간", "sat": "24시간", "sun": "24시간"}', '{"age_groups": ["20-30", "30-40", "40-50", "50-60"], "occupations": ["tourist", "local_resident"]}', '{"peak_hours": ["10:00-18:00"], "seasonal": true}', 7, 'public_api', NOW(), NOW()),
    
    ('p4444444-4444-4444-4444-444444444444', '대구시청', 'government', '대구광역시 중구 공평로 88', ST_SetSRID(ST_MakePoint(128.606111, 35.871944), 4326), '{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "휴무", "sun": "휴무"}', '{"age_groups": ["30-40", "40-50", "50-60"], "occupations": ["civil_servant", "citizen"]}', '{"peak_hours": ["09:00-11:00", "14:00-16:00"], "daily_average": 500}', 9, 'manual', NOW(), NOW());

-- Insert test tasks
INSERT INTO tasks (id, user_id, poi_id, title, description, type, tertiary, status, scheduled_at, route_order, estimated_duration, estimated_contacts, created_at, updated_at) VALUES
    ('t1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', '강남역 아침 인사 캠페인', '출근길 시민들께 인사 및 명함 배포', 'poi-visit', 'proof', 'planned', NOW() + INTERVAL '1 day' + INTERVAL '8 hours', 1, 60, 50, NOW(), NOW()),
    
    ('t2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', '이마트 강남점 생활밀착 캠페인', '장보기 나온 주민들과 대화 및 정책 설명', 'facility-visit', 'nav', 'done', NOW() - INTERVAL '1 day' + INTERVAL '19 hours', 2, 90, 30, NOW(), NOW()),
    
    ('t3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', '해운대 관광객 대상 정책 홍보', '관광객들에게 지역발전 정책 안내', 'poi-visit', 'proof', 'started', NOW() + INTERVAL '6 hours', 1, 120, 80, NOW(), NOW()),
    
    ('t4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', null, '선거관리위원회 후보자 등록 서류 제출', '예비후보자 등록 관련 서류 준비 및 제출', 'doc-check', 'defer', 'planned', NOW() + INTERVAL '3 days', 1, 30, 0, NOW(), NOW());

-- Update some tasks with completion data
UPDATE tasks SET 
    started_at = NOW() - INTERVAL '2 hours',
    completed_at = NOW() - INTERVAL '30 minutes',
    actual_duration = 85,
    actual_contacts = 35,
    notes = '주민 반응 좋음. 정책에 대한 관심도가 높았음.'
WHERE id = 't2222222-2222-2222-2222-222222222222';

UPDATE tasks SET 
    started_at = NOW() - INTERVAL '1 hour'
WHERE id = 't3333333-3333-3333-3333-333333333333';

-- Insert test proofs
INSERT INTO proofs (id, user_id, task_id, kind, file_path, file_name, file_size, file_hash, mime_type, geom, taken_at, exif_data, review_status, created_at, updated_at) VALUES
    ('pf111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222', 'photo', '/uploads/proofs/2024/09/campaign_photo_001.jpg', 'campaign_photo_001.jpg', 2048576, 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 'image/jpeg', ST_SetSRID(ST_MakePoint(127.034834, 37.491654), 4326), NOW() - INTERVAL '2 hours', '{"camera": "iPhone 15 Pro", "gps": {"lat": 37.491654, "lng": 127.034834}, "timestamp": "2024-09-08T10:30:00Z"}', 'approved', NOW(), NOW()),
    
    ('pf222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 't3333333-3333-3333-3333-333333333333', 'photo', '/uploads/proofs/2024/09/beach_campaign_001.jpg', 'beach_campaign_001.jpg', 1536000, 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1', 'image/jpeg', ST_SetSRID(ST_MakePoint(129.160139, 35.158611), 4326), NOW() - INTERVAL '30 minutes', '{"camera": "Samsung Galaxy S24", "gps": {"lat": 35.158611, "lng": 129.160139}, "timestamp": "2024-09-08T14:30:00Z"}', 'pending', NOW(), NOW());

-- Insert test credits
INSERT INTO credits (id, user_id, task_id, proof_id, kind, amount, description, created_at) VALUES
    ('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 't2222222-2222-2222-2222-222222222222', 'pf111111-1111-1111-1111-111111111111', 'in', 100, '이마트 강남점 캠페인 완료 보상', NOW() - INTERVAL '1 hour'),
    ('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', null, null, 'in', 50, '일일 출석 보너스', NOW() - INTERVAL '12 hours'),
    ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', null, null, 'in', 25, '프로필 완료 보상', NOW() - INTERVAL '1 day'),
    ('c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', null, null, 'out', -30, '명함 제작비 차감', NOW() - INTERVAL '2 days');

-- Insert test documents
INSERT INTO documents (id, user_id, kind, title, description, status, file_path, file_name, file_size, file_hash, due_date, created_at, updated_at) VALUES
    ('d1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'nomination', '예비후보자 등록 신고서', '강남구 을 예비후보자 등록을 위한 서류', 'submitted', '/uploads/documents/nomination_kim.pdf', 'nomination_kim.pdf', 512000, 'abc123def456789012345678901234567890abcdef1234567890abcdef123456', NOW() + INTERVAL '7 days', NOW() - INTERVAL '1 day', NOW()),
    
    ('d2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'nomination', '예비후보자 등록 신고서', '해운대구 갑 예비후보자 등록을 위한 서류', 'draft', null, null, null, null, NOW() + INTERVAL '10 days', NOW(), NOW()),
    
    ('d3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'nec_form', '선거비용 보전 신청서', '선거비용 보전을 위한 관련 서류', 'reviewed', '/uploads/documents/nec_form_kim.pdf', 'nec_form_kim.pdf', 256000, 'def456789012345678901234567890abcdef1234567890abcdef123456abc123', NOW() + INTERVAL '30 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day');

-- Insert test broadcasts
INSERT INTO broadcasts (id, created_by, title, content, severity, target_scope, scheduled_at, is_sent, sent_at, is_active, created_at, updated_at) VALUES
    ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '서류 제출 마감일 안내', '예비후보자 등록 서류 제출 마감이 3일 남았습니다. 빠른 시일 내에 제출해주세요.', 'warn', 'candidates', NOW() - INTERVAL '2 hours', true, NOW() - INTERVAL '2 hours', true, NOW() - INTERVAL '3 hours', NOW()),
    
    ('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '시스템 점검 안내', '오늘 밤 12시부터 새벽 2시까지 시스템 점검이 있을 예정입니다.', 'info', 'all', NOW() + INTERVAL '6 hours', false, null, true, NOW(), NOW()),
    
    ('b3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '긴급 공지', '선거관리위원회 지침 변경으로 인한 중요 안내사항이 있습니다.', 'critical', 'candidates', NOW() - INTERVAL '1 day', true, NOW() - INTERVAL '1 day', true, NOW() - INTERVAL '1 day', NOW());

-- Insert test education content
INSERT INTO education_content (id, title, description, content_type, category, body_content, sort_order, tags, is_published, required_role, created_at, updated_at) VALUES
    ('e1111111-1111-1111-1111-111111111111', '선거법 기초 가이드', '선거 관련 기본 법령 및 규정 안내', 'guide', 'election_law', '# 선거법 기초\n\n## 1. 공직선거법 개요\n선거의 공정성과 투명성을 보장하기 위한 법률...\n\n## 2. 후보자 등록\n예비후보자 및 후보자 등록 절차...', 1, '["선거법", "기초", "필수"]', true, null, NOW(), NOW()),
    
    ('e2222222-2222-2222-2222-222222222222', '캠페인 전략 수립법', '효과적인 선거 캠페인 전략 수립 방법', 'guide', 'campaign_tactics', '# 캠페인 전략 수립\n\n## 1. 지역 분석\n선거구 특성 파악 방법...\n\n## 2. 타겟 유권자 설정\n핵심 유권자층 정의...', 2, '["전략", "캠페인", "실무"]', true, 'candidate', NOW(), NOW()),
    
    ('e3333333-3333-3333-3333-333333333333', '서류 작성 가이드', '각종 선거 관련 서류 작성 방법 안내', 'guide', 'paperwork', '# 서류 작성 가이드\n\n## 1. 예비후보자 등록 신고서\n작성 시 주의사항...\n\n## 2. 선거비용 보전 신청서\n필요 서류 및 작성법...', 3, '["서류", "신고", "작성법"]', true, null, NOW(), NOW());

-- Insert test policy documents
INSERT INTO policy_documents (id, title, category, document_type, content, summary, effective_date, version, authority, sort_order, tags, is_active, created_at, updated_at) VALUES
    ('pd111111-1111-1111-1111-111111111111', '공직선거법', 'election_law', 'law', '제1조(목적) 이 법은 대통령선거, 국회의원선거, 지방자치단체의 장선거 및 지방의회의원선거(이하 "선거"라 한다)가 국민의 자유로운 의사와 민주적인 절차에 의하여 공정히 행하여지도록 하고...', '선거의 공정성과 투명성을 보장하기 위한 기본 법률', '2022-01-01', '2022.1', '중앙선거관리위원회', 1, '["선거법", "공정선거", "기본법"]', true, NOW(), NOW()),
    
    ('pd222222-2222-2222-2222-222222222222', '후보자 등록 관련 규정', 'nec_regulation', 'regulation', '제1장 일반사항\n제1조 목적\n이 규정은 공직선거법에 따른 후보자 등록에 관한 세부사항을 정함을 목적으로 한다...', '후보자 등록 절차 및 요건에 관한 세부 규정', '2023-06-01', '2023.6', '중앙선거관리위원회', 2, '["후보자등록", "절차", "규정"]', true, NOW(), NOW()),
    
    ('pd333333-3333-3333-3333-333333333333', '선거운동 가이드라인', 'party_policy', 'guideline', '# 개혁신당 선거운동 가이드라인\n\n## 1. 기본 원칙\n- 공정하고 깨끗한 선거운동\n- 정책 중심의 선거운동...\n\n## 2. 운동 방법\n...', '개혁신당 소속 후보자를 위한 선거운동 지침', '2024-01-01', '2024.1', '개혁신당', 3, '["가이드라인", "선거운동", "개혁신당"]', true, NOW(), NOW());

-- Insert test chatbot knowledge base
INSERT INTO chatbot_knowledge_base (id, question, answer, category, keywords, intent, policy_document_id, usage_count, is_active, created_at, updated_at) VALUES
    ('kb111111-1111-1111-1111-111111111111', '예비후보자 등록은 어떻게 하나요?', '예비후보자 등록은 관할 선거관리위원회에 신고서를 제출하시면 됩니다. 필요 서류: 1) 예비후보자 등록 신고서, 2) 본인 동의서, 3) 최근 3개월 이내 사진 등', 'candidate_registration', '["예비후보자", "등록", "신고"]', 'registration_inquiry', 'pd222222-2222-2222-2222-222222222222', 15, true, NOW(), NOW()),
    
    ('kb222222-2222-2222-2222-222222222222', '선거비용 한도는 얼마인가요?', '선거비용 한도는 선거구와 선거종류에 따라 다릅니다. 국회의원선거의 경우 지역구는 약 2억원, 비례대표는 약 5천만원입니다. 정확한 금액은 선관위 공고를 확인해주세요.', 'election_cost', '["선거비용", "한도", "제한"]', 'cost_inquiry', 'pd111111-1111-1111-1111-111111111111', 8, true, NOW(), NOW()),
    
    ('kb333333-3333-3333-3333-333333333333', '명함 배포는 언제부터 가능한가요?', '예비후보자는 등록일로부터 명함 배포가 가능합니다. 다만, 선거운동 기간이 아니므로 "선거운동"이라고 볼 수 있는 행위는 제한됩니다. 명함에는 인사말 정도만 기재하는 것이 좋습니다.', 'campaign_activities', '["명함", "배포", "선거운동"]', 'activity_inquiry', 'pd111111-1111-1111-1111-111111111111', 22, true, NOW(), NOW()),
    
    ('kb444444-4444-4444-4444-444444444444', '정책 설명회는 어떻게 개최하나요?', '정책 설명회는 예비후보자도 개최 가능합니다. 사전에 관할 경찰서에 집회신고를 해야 하며, 선거운동 기간 외에는 특정 후보에 대한 지지나 반대를 명시적으로 표현하면 안 됩니다.', 'policy_events', '["정책설명회", "집회", "개최"]', 'event_inquiry', null, 5, true, NOW(), NOW());

-- Update usage statistics for chatbot knowledge base
UPDATE chatbot_knowledge_base SET last_used_at = NOW() - INTERVAL '2 hours' WHERE usage_count > 0;

-- Final verification queries (commented out for production)
-- SELECT 'Users created:', COUNT(*) FROM users;
-- SELECT 'Profiles created:', COUNT(*) FROM profiles;  
-- SELECT 'POIs created:', COUNT(*) FROM pois;
-- SELECT 'Tasks created:', COUNT(*) FROM tasks;
-- SELECT 'Proofs created:', COUNT(*) FROM proofs;
-- SELECT 'Credits created:', COUNT(*) FROM credits;
-- SELECT 'Documents created:', COUNT(*) FROM documents;
-- SELECT 'Broadcasts created:', COUNT(*) FROM broadcasts;
-- SELECT 'Education content created:', COUNT(*) FROM education_content;
-- SELECT 'Policy documents created:', COUNT(*) FROM policy_documents;
-- SELECT 'Chatbot KB entries created:', COUNT(*) FROM chatbot_knowledge_base;