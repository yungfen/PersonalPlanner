-- 在 Supabase SQL Editor 執行這段 SQL
-- 建立 planner_progress 資料表

create table if not exists planner_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users not null unique,
  done_state jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 開啟 Row Level Security（重要！）
alter table planner_progress enable row level security;

-- 每個用戶只能讀寫自己的資料
create policy "Users can manage their own progress"
  on planner_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
