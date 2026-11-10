-- ProjectHub starter schema for Supabase. Run in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'manager', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  organization_name text not null,
  email text,
  kind text not null check (kind in ('Client', 'Investor', 'Partner')),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Qualified', 'Archived')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  recipient text not null,
  subject text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'rejected')),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  provider_message_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  check (status <> 'sent' or (approved_by is not null and approved_at is not null))
);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.prospects enable row level security;
alter table public.email_drafts enable row level security;

create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Members can read their organizations" on public.organizations for select using (exists (select 1 from public.organization_members m where m.organization_id = id and m.user_id = auth.uid()));
create policy "Authenticated users can create organizations" on public.organizations for insert with check (created_by = auth.uid());
create policy "Members can read memberships in their organization" on public.organization_members for select using (exists (select 1 from public.organization_members m where m.organization_id = organization_members.organization_id and m.user_id = auth.uid()));
create policy "Creators can add themselves as owner" on public.organization_members for insert with check (user_id = auth.uid() and role = 'owner' and exists (select 1 from public.organizations o where o.id = organization_id and o.created_by = auth.uid()));
create policy "Members can manage org prospects" on public.prospects for all using (exists (select 1 from public.organization_members m where m.organization_id = prospects.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin','manager','member'))) with check (exists (select 1 from public.organization_members m where m.organization_id = prospects.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin','manager','member')));
create policy "Users can read own email drafts" on public.email_drafts for select using (owner_id = auth.uid());
create policy "Users can create own email drafts" on public.email_drafts for insert with check (owner_id = auth.uid());
create policy "Users can update own email drafts" on public.email_drafts for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
