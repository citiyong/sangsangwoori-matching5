-- 시니어 프로필 테이블
create table if not exists seniors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  desired_job text not null,
  career_years integer not null default 0,
  created_at timestamptz default now()
);

-- 일자리 테이블
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text not null,
  job_type text not null,
  required_career integer not null default 0,
  created_at timestamptz default now()
);

-- 매칭 결과 테이블
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid not null references seniors(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  score integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- ────────────────────────────────────────────────
-- RLS 비활성화 (학습 환경 전용 — 실서비스 전 재설계 필수)
-- ────────────────────────────────────────────────
alter table seniors disable row level security;
alter table jobs    disable row level security;
alter table matches disable row level security;
