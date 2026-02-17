-- Safe additions for web app features. Uses IF NOT EXISTS to avoid conflicts with mobile schema.
-- Review and adjust names if your mobile app already uses these tables.

-- Candidate profile (user-scoped)
create table if not exists public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  district text,
  party text,
  created_at timestamptz not null default now()
);
alter table public.candidate_profiles enable row level security;

-- Documents (user-scoped)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_type text not null,
  file_url text not null,
  status text not null default 'pending',
  uploaded_at timestamptz not null default now()
);
alter table public.documents enable row level security;

-- Proofs (user-scoped)
create table if not exists public.proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  file_url text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.proofs enable row level security;

-- Broadcasts (public read)
create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text default 'all',
  published_at timestamptz default now()
);
alter table public.broadcasts enable row level security;

-- Templates (public read)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  category text,
  name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);
alter table public.templates enable row level security;

-- Education contents (public read)
create table if not exists public.education_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_url text,
  category text,
  created_at timestamptz not null default now()
);
alter table public.education_contents enable row level security;

-- Policies (public read)
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text,
  published_at timestamptz default now()
);
alter table public.policies enable row level security;

-- RLS policies: guard by existence via DO blocks

-- candidate_profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='candidate_profiles' AND policyname='Allow select own profile'
  ) THEN
    CREATE POLICY "Allow select own profile" ON public.candidate_profiles
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='candidate_profiles' AND policyname='Allow upsert own profile'
  ) THEN
    CREATE POLICY "Allow upsert own profile" ON public.candidate_profiles
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- documents
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='Allow select own documents'
  ) THEN
    CREATE POLICY "Allow select own documents" ON public.documents
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='documents' AND policyname='Allow modify own documents'
  ) THEN
    CREATE POLICY "Allow modify own documents" ON public.documents
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- proofs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='proofs' AND policyname='Allow select own proofs'
  ) THEN
    CREATE POLICY "Allow select own proofs" ON public.proofs
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='proofs' AND policyname='Allow modify own proofs'
  ) THEN
    CREATE POLICY "Allow modify own proofs" ON public.proofs
      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Public read for content tables
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='broadcasts' AND policyname='Public read'
  ) THEN
    CREATE POLICY "Public read" ON public.broadcasts FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='templates' AND policyname='Public read'
  ) THEN
    CREATE POLICY "Public read" ON public.templates FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='education_contents' AND policyname='Public read'
  ) THEN
    CREATE POLICY "Public read" ON public.education_contents FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='policies' AND policyname='Public read'
  ) THEN
    CREATE POLICY "Public read" ON public.policies FOR SELECT USING (true);
  END IF;
END $$;
