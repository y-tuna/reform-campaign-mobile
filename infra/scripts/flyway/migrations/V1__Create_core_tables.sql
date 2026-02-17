-- Reform Campaign Manager - Core Database Schema
-- Version: 1.0
-- Description: Create core tables for users, profiles, tasks, proofs, documents, broadcasts, POIs, and credits

-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for data contracts
CREATE TYPE user_role AS ENUM ('candidate', 'admin', 'viewer');
CREATE TYPE task_type AS ENUM ('poi-visit', 'facility-visit', 'doc-check', 'ad-purchase');
CREATE TYPE task_tertiary AS ENUM ('defer', 'proof', 'nav', 'open');
CREATE TYPE task_status AS ENUM ('planned', 'started', 'done', 'failed');
CREATE TYPE proof_kind AS ENUM ('photo', 'receipt');
CREATE TYPE broadcast_severity AS ENUM ('info', 'warn', 'critical');
CREATE TYPE profile_intensity AS ENUM ('hard', 'normal', 'light');
CREATE TYPE mobility_type AS ENUM ('car', 'pickup', 'trike', 'bike', 'walk');
CREATE TYPE credit_kind AS ENUM ('in', 'out', 'hold');
CREATE TYPE document_kind AS ENUM ('nomination', 'nec_form');
CREATE TYPE document_status AS ENUM ('draft', 'submitted', 'reviewed', 'transferred');
CREATE TYPE poi_category AS ENUM ('station', 'market', 'apartment', 'office', 'school', 'hospital', 'government');

-- Users table - Core authentication and basic user data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Profiles table - Extended user information and campaign preferences
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    district VARCHAR(100),
    party_affiliation VARCHAR(100) DEFAULT '개혁신당',
    
    -- Campaign preferences
    intensity profile_intensity NOT NULL DEFAULT 'normal',
    mobility mobility_type NOT NULL DEFAULT 'car',
    religion_pref TEXT, -- JSON: {preference: 'none'|'exclude'|'only', values: []}
    
    -- Campaign mode and settings
    is_candidate_mode BOOLEAN NOT NULL DEFAULT false, -- false = 예비후보, true = 후보
    senior_ui_mode BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- POIs table - Points of Interest for campaign activities
CREATE TABLE pois (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category poi_category NOT NULL,
    address TEXT NOT NULL,
    geom GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS geometry for lat/lng
    
    -- POI metadata
    opening_hours TEXT, -- JSON: {mon: '09:00-18:00', tue: '09:00-18:00', ...}
    target_demographics TEXT, -- JSON: {age_groups: [], occupations: [], etc}
    foot_traffic_data TEXT, -- JSON: hourly/daily traffic data
    accessibility_score INTEGER CHECK (accessibility_score >= 1 AND accessibility_score <= 10),
    
    -- Source tracking
    data_source VARCHAR(100), -- 'manual', 'public_api', 'crawled'
    external_id VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create spatial index on POIs geometry
CREATE INDEX idx_pois_geom ON pois USING GIST (geom);
CREATE INDEX idx_pois_category ON pois (category);

-- Tasks table - Campaign activities and routes
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    poi_id UUID REFERENCES pois(id) ON DELETE SET NULL,
    
    -- Task definition
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type task_type NOT NULL,
    tertiary task_tertiary NOT NULL,
    status task_status NOT NULL DEFAULT 'planned',
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Route information
    route_order INTEGER, -- Order in daily route
    estimated_duration INTEGER, -- minutes
    estimated_contacts INTEGER, -- expected number of people to contact
    
    -- Completion data
    actual_duration INTEGER, -- minutes
    actual_contacts INTEGER,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for tasks
CREATE INDEX idx_tasks_user_id ON tasks (user_id);
CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_scheduled_at ON tasks (scheduled_at);
CREATE INDEX idx_tasks_user_status_scheduled ON tasks (user_id, status, scheduled_at);

-- Proofs table - Evidence uploads for task completion
CREATE TABLE proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    
    -- Proof metadata
    kind proof_kind NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for integrity
    mime_type VARCHAR(100) NOT NULL,
    
    -- Location and time data (auto-tagged)
    geom GEOMETRY(POINT, 4326), -- GPS location when taken
    taken_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- EXIF and metadata
    exif_data TEXT, -- JSON: camera info, GPS, etc.
    
    -- Review process
    review_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    review_reason TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for proofs
CREATE INDEX idx_proofs_user_id ON proofs (user_id);
CREATE INDEX idx_proofs_task_id ON proofs (task_id);
CREATE INDEX idx_proofs_review_status ON proofs (review_status);
CREATE INDEX idx_proofs_taken_at ON proofs (taken_at);
CREATE INDEX idx_proofs_geom ON proofs USING GIST (geom);

-- Credits table - Campaign credit tracking (display purposes)
CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    proof_id UUID REFERENCES proofs(id) ON DELETE SET NULL,
    
    -- Credit details
    kind credit_kind NOT NULL,
    amount INTEGER NOT NULL, -- credit amount (can be negative for 'out')
    description TEXT NOT NULL,
    
    -- Reference data
    reference_id VARCHAR(100), -- external transaction ID if applicable
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for credits
CREATE INDEX idx_credits_user_id ON credits (user_id);
CREATE INDEX idx_credits_kind ON credits (kind);
CREATE INDEX idx_credits_created_at ON credits (created_at);

-- Documents table - Campaign documents and submissions
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document metadata
    kind document_kind NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status document_status NOT NULL DEFAULT 'draft',
    
    -- File information
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_hash VARCHAR(64),
    
    -- Workflow
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    review_notes TEXT,
    
    -- Deadline tracking
    due_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for documents
CREATE INDEX idx_documents_user_id ON documents (user_id);
CREATE INDEX idx_documents_status ON documents (status);
CREATE INDEX idx_documents_due_date ON documents (due_date);
CREATE INDEX idx_documents_kind ON documents (kind);

-- Broadcasts table - System announcements and notifications
CREATE TABLE broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    severity broadcast_severity NOT NULL DEFAULT 'info',
    
    -- Targeting
    target_scope TEXT NOT NULL DEFAULT 'all', -- 'all', 'candidates', 'admins', or JSON for specific targeting
    target_districts TEXT, -- JSON array of districts
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery tracking
    is_sent BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_stats TEXT, -- JSON: {sent: 0, delivered: 0, failed: 0}
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for broadcasts
CREATE INDEX idx_broadcasts_severity ON broadcasts (severity);
CREATE INDEX idx_broadcasts_scheduled_at ON broadcasts (scheduled_at);
CREATE INDEX idx_broadcasts_is_active ON broadcasts (is_active);
CREATE INDEX idx_broadcasts_created_by ON broadcasts (created_by);

-- Education Content table - Guides, videos, and learning materials
CREATE TABLE education_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content metadata
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'guide', 'video', 'faq', 'policy'
    category VARCHAR(100) NOT NULL, -- 'election_law', 'campaign_tactics', 'paperwork', etc.
    
    -- Content
    body_content TEXT, -- For text-based content
    video_url VARCHAR(500), -- For video content
    file_path VARCHAR(500), -- For downloadable resources
    
    -- Organization
    sort_order INTEGER NOT NULL DEFAULT 0,
    tags TEXT, -- JSON array of tags
    
    -- Visibility and access
    is_published BOOLEAN NOT NULL DEFAULT false,
    required_role user_role, -- null = all users, specific role required otherwise
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for education content
CREATE INDEX idx_education_content_category ON education_content (category);
CREATE INDEX idx_education_content_content_type ON education_content (content_type);
CREATE INDEX idx_education_content_is_published ON education_content (is_published);
CREATE INDEX idx_education_content_sort_order ON education_content (sort_order);

-- Policy Documents table - Election law, FAQ, and regulatory information
CREATE TABLE policy_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Document metadata
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'election_law', 'nec_regulation', 'party_policy', etc.
    document_type VARCHAR(50) NOT NULL, -- 'law', 'regulation', 'faq', 'guideline'
    
    -- Content
    content TEXT NOT NULL,
    summary TEXT, -- Brief summary for quick reference
    
    -- Legal/regulatory information
    effective_date DATE,
    version VARCHAR(20),
    source_url VARCHAR(500), -- Original source if available
    authority VARCHAR(100), -- e.g., '중앙선거관리위원회'
    
    -- Organization
    parent_id UUID REFERENCES policy_documents(id) ON DELETE CASCADE, -- For hierarchical organization
    sort_order INTEGER NOT NULL DEFAULT 0,
    tags TEXT, -- JSON array of tags
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for policy documents
CREATE INDEX idx_policy_documents_category ON policy_documents (category);
CREATE INDEX idx_policy_documents_document_type ON policy_documents (document_type);
CREATE INDEX idx_policy_documents_is_active ON policy_documents (is_active);
CREATE INDEX idx_policy_documents_parent_id ON policy_documents (parent_id);
CREATE INDEX idx_policy_documents_effective_date ON policy_documents (effective_date);

-- Chatbot Knowledge Base table - Q&A and automated responses
CREATE TABLE chatbot_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Q&A content
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    
    -- Matching and triggers
    keywords TEXT, -- JSON array of keywords for matching
    intent VARCHAR(100), -- Intent classification
    
    -- References
    policy_document_id UUID REFERENCES policy_documents(id) ON DELETE SET NULL,
    education_content_id UUID REFERENCES education_content(id) ON DELETE SET NULL,
    
    -- Usage statistics
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for chatbot knowledge base
CREATE INDEX idx_chatbot_kb_category ON chatbot_knowledge_base (category);
CREATE INDEX idx_chatbot_kb_is_active ON chatbot_knowledge_base (is_active);
CREATE INDEX idx_chatbot_kb_usage_count ON chatbot_knowledge_base (usage_count);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pois_updated_at BEFORE UPDATE ON pois FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proofs_updated_at BEFORE UPDATE ON proofs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broadcasts_updated_at BEFORE UPDATE ON broadcasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_content_updated_at BEFORE UPDATE ON education_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policy_documents_updated_at BEFORE UPDATE ON policy_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_knowledge_base_updated_at BEFORE UPDATE ON chatbot_knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'Core user authentication and role management';
COMMENT ON TABLE profiles IS 'Extended user profiles with campaign preferences and settings';
COMMENT ON TABLE pois IS 'Points of Interest for campaign activities with geospatial data';
COMMENT ON TABLE tasks IS 'Campaign tasks and activities with scheduling and completion tracking';
COMMENT ON TABLE proofs IS 'Evidence uploads with GPS/time metadata and integrity verification';
COMMENT ON TABLE credits IS 'Campaign credit ledger for tracking achievements and rewards';
COMMENT ON TABLE documents IS 'Campaign documents and submission workflow management';
COMMENT ON TABLE broadcasts IS 'System announcements and push notifications';
COMMENT ON TABLE education_content IS 'Learning materials, guides, and educational resources';
COMMENT ON TABLE policy_documents IS 'Election law, regulations, and policy documentation';
COMMENT ON TABLE chatbot_knowledge_base IS 'Q&A knowledge base for chatbot responses';