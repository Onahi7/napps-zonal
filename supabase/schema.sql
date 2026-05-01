-- Supabase Database Schema for NAPPS North Central Zone Portal

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============== SCHOOLS TABLE ===============
create table if not exists public.schools (
  id uuid default uuid_generate_v4() primary key,
  school_id text unique not null, -- Format: NC-XXXXXXXX
  name text not null,
  state text not null,
  lga text not null,
  chapter text,
  proprietor_id uuid references public.proprietors(id) on delete set null,
  type text, -- 'Nursery', 'Primary', 'Secondary', 'Mixed'
  category text, -- 'Private', 'Voluntary', etc.
  address text,
  total_enrollment integer default 0,
  status text default 'pending' check (status in ('pending', 'approved', 'suspended')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-generate school_id trigger
create or replace function generate_school_id()
returns trigger as $$
declare
  new_id text;
  done bool;
begin
  done := false;
  while not done loop
    -- Generate: NC + 8 random alphanumeric chars
    new_id := 'NC-' || upper(
      substr(md5(random()::text), 1, 8)
    );
    
    -- Check if ID already exists
    done := not exists (
      select 1 from public.schools where school_id = new_id
    );
    
    if done then
      new.school_id := new_id;
    end if;
  end loop;
  return new;
end;
$$ language plpgsql;

drop trigger if exists school_id_trigger on public.schools;
create trigger school_id_trigger
  before insert on public.schools
  for each row execute function generate_school_id();

-- =============== PROPRIETORS TABLE ===============
create table if not exists public.proprietors (
  id uuid default uuid_generate_v4() primary key,
  submission_id text unique,
  first_name text not null,
  middle_name text,
  last_name text not null,
  email text unique not null,
  phone text not null,
  state text not null,
  lga text not null,
  passport_photo_url text,
  chapters text[], -- Array of chapter names
  napps_registered text default 'Not Registered',
  participation_history text[], -- Array of participation strings
  awards text,
  position_held text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============== PAYMENTS TABLE ===============
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  reference text unique not null,
  proprietor_id uuid references public.proprietors(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  school_id_text text, -- The generated NC-XXXXXXXX ID
  amount numeric(10,2) not null,
  dues_breakdown jsonb not null, -- {local: 6000, state: 4000, zonal: 2000, national: 5000, id_card: 3500}
  deductions jsonb, -- {national: 1500, zonal: 500, state: 1000}
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  payment_method text, -- 'opay', 'bank_transfer'
  receipt_number text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============== ENROLLMENT TABLE ===============
create table if not exists public.enrollment (
  id uuid default uuid_generate_v4() primary key,
  school_id uuid references public.schools(id) on delete cascade,
  level text not null, -- 'KG1', 'Primary1', etc.
  male integer default 0,
  female integer default 0,
  created_at timestamp with time zone default now()
);

-- =============== ROW LEVEL SECURITY ===============
alter table public.schools enable row level security;
alter table public.proprietors enable row level security;
alter table public.payments enable row level security;
alter table public.enrollment enable row level security;

-- Policies: Proprietors can only see their own data
create policy "Proprietors can view own data"
  on public.proprietors for select
  using (auth.uid()::text = id::text);

create policy "Schools can be viewed by proprietor"
  on public.schools for select
  using (proprietor_id = auth.uid());

create policy "Payments can be viewed by proprietor"
  on public.payments for select
  using (proprietor_id = auth.uid());

-- =============== INDEXES ===============
create index if not exists idx_schools_school_id on public.schools(school_id);
create index if not exists idx_schools_state on public.schools(state);
create index if not exists idx_proprietors_email on public.proprietors(email);
create index if not exists idx_payments_reference on public.payments(reference);
create index if not exists idx_payments_status on public.payments(status);

-- =============== SAMPLE DATA ===============
-- Insert sample chapters (run after table creation)
-- insert into public.chapters (name, state) values
--   ('Karu 1', 'Nasarawa'),
--   ('Karu 2', 'Nasarawa'),
--   ('Lafia A', 'Nasarawa');

-- =============== FUNCTIONS ===============
-- Function to get next receipt number
create or replace function get_next_receipt_number()
returns text as $$
declare
  next_num integer;
  receipt_text text;
begin
  -- Simple counter from payments count (can be improved)
  select count(*) + 1 into next_num from public.payments;
  receipt_text := 'RCP-' || lpad(next_num::text, 6, '0');
  return receipt_text;
end;
$$ language plpgsql;
