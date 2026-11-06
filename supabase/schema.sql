-- BurnerOS Schema

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text not null default 'free', -- free | scan | solo | pro
  scan_credits integer not null default 3,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  handles text[] default '{}',        -- usernames across platforms
  bios text[] default '{}',           -- bio text variants
  timezone_claim text,                -- e.g. "Pacific Time"
  payment_handles text[] default '{}',-- cashapp, venmo, etc
  email_aliases text[] default '{}',
  link_hubs text[] default '{}',      -- linktree, etc
  posting_patterns text,
  notes text,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  scan_type text not null,            -- overlap | prepost | exif
  persona_ids uuid[] default '{}',
  input_data jsonb default '{}',      -- caption, image name, etc
  risk_score integer,                 -- 0-100
  findings jsonb default '[]',        -- array of {field, severity, evidence, fix}
  raw_content text,
  created_at timestamptz not null default now()
);

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  persona_id uuid references public.personas(id) on delete set null,
  title text not null,
  notes text,
  checklist jsonb default '[]',       -- array of {action, done}
  status text default 'active',       -- active | resolved
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_personas_updated_at before update on public.personas
  for each row execute procedure public.set_updated_at();
create trigger set_incidents_updated_at before update on public.incidents
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.personas enable row level security;
alter table public.scans enable row level security;
alter table public.incidents enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own personas" on public.personas for all using (auth.uid() = user_id);
create policy "Users manage own scans" on public.scans for all using (auth.uid() = user_id);
create policy "Users manage own incidents" on public.incidents for all using (auth.uid() = user_id);
