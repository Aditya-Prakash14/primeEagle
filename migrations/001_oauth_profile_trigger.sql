-- =====================================================
-- Migration: Support Google & GitHub OAuth sign-ups
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. Make sure avatar_url column exists (in case it was missing)
alter table public.profiles
  add column if not exists avatar_url text;

-- 2. Drop old trigger (will be recreated below)
drop trigger if exists on_auth_user_created on auth.users;

-- 3. Replace handle_new_user to support both email and OAuth sign-ups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, company, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',        -- Google OAuth sends 'name'
      new.raw_user_meta_data->>'user_name',   -- GitHub OAuth sends 'user_name'
      split_part(new.email, '@', 1)           -- fallback: use email prefix
    ),
    new.email,
    new.raw_user_meta_data->>'phone',         -- null for OAuth users (fine)
    new.raw_user_meta_data->>'company',       -- null for OAuth users (fine)
    coalesce(
      new.raw_user_meta_data->>'avatar_url',  -- Supabase normalized field
      new.raw_user_meta_data->>'picture'      -- Google raw field
    )
  )
  on conflict (id) do update set
    full_name  = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- 4. Re-create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Verify it ran correctly
select routine_name, routine_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name = 'handle_new_user';
