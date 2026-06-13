-- ETDR classroom demo schema.
-- These RLS policies are for presentation/demo use only.
-- In production, teacher authentication, class ownership checks, and student access limits are required.
-- Do not use these policies as real service security rules.

create table if not exists class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_code text unique not null,
  title text not null,
  selected_problem_ids text[] not null,
  created_at timestamptz default now()
);

create table if not exists student_sessions (
  id uuid primary key default gen_random_uuid(),
  class_code text not null references class_sessions(class_code) on delete cascade,
  nickname text not null,
  created_at timestamptz default now()
);

create table if not exists attempt_logs (
  id uuid primary key default gen_random_uuid(),
  class_code text not null,
  student_id uuid references student_sessions(id) on delete set null,
  nickname text,
  puzzle_id text not null,
  success boolean not null,
  error_message text,
  code text,
  created_at timestamptz default now()
);

alter table class_sessions enable row level security;
alter table student_sessions enable row level security;
alter table attempt_logs enable row level security;

drop policy if exists "demo_select_class_sessions" on class_sessions;
drop policy if exists "demo_insert_class_sessions" on class_sessions;
drop policy if exists "demo_select_student_sessions" on student_sessions;
drop policy if exists "demo_insert_student_sessions" on student_sessions;
drop policy if exists "demo_select_attempt_logs" on attempt_logs;
drop policy if exists "demo_insert_attempt_logs" on attempt_logs;

create policy "demo_select_class_sessions"
on class_sessions for select
using (true);

create policy "demo_insert_class_sessions"
on class_sessions for insert
with check (true);

create policy "demo_select_student_sessions"
on student_sessions for select
using (true);

create policy "demo_insert_student_sessions"
on student_sessions for insert
with check (true);

create policy "demo_select_attempt_logs"
on attempt_logs for select
using (true);

create policy "demo_insert_attempt_logs"
on attempt_logs for insert
with check (true);

-- 교사 콘솔의 "수업 기록 삭제"를 위한 delete 정책 (시연용: 누구나 삭제 가능).
-- 실제 서비스에서는 교사 소유권 검증으로 대체해야 한다.
drop policy if exists "demo_delete_class_sessions" on class_sessions;
drop policy if exists "demo_delete_student_sessions" on student_sessions;
drop policy if exists "demo_delete_attempt_logs" on attempt_logs;

create policy "demo_delete_class_sessions"
on class_sessions for delete
using (true);

create policy "demo_delete_student_sessions"
on student_sessions for delete
using (true);

create policy "demo_delete_attempt_logs"
on attempt_logs for delete
using (true);
