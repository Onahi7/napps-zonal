-- Schema Update for NAPPS North Central Zone Portal
-- Adds: State activation, payment-first flow, admin roles, financial tracking

-- =============== STATES TABLE (New) ===============
create table if not exists public.states (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  zone text default 'North Central',
  is_active boolean default false,
  activated_at timestamp with time zone,
  activated_by uuid references public.proprietors(id),
  total_schools integer default 0,
  total_revenue numeric(10,2) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert North Central States
insert into public.states (name, is_active) values
  ('Benue', false),
  ('Kogi', false),
  ('Kwara', false),
  ('Niger', false),
  ('Nasarawa', false),
  ('Plateau', false),
  ('FCT', false)
on conflict (name) do nothing;

-- =============== ADMIN USERS TABLE (New) ===============
create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  proprietor_id uuid references public.proprietors(id),
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('zonal_president', 'state_chairman', 'zonal_admin', 'state_admin')),
  state text, -- Null for zonal roles, specific state for state roles
  is_active boolean default true,
  last_login timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============== PAYMENTS TABLE UPDATE ===============
-- Add fields for payment-first flow
alter table public.payments add column if not exists registration_completed boolean default false;
alter table public.payments add column if not exists form_data jsonb; -- Store form data after payment
alter table public.payments add column if not exists receipt_url text;
alter table public.payments add column if not exists payment_date timestamp with time zone;
alter table public.payments add column if not exists verified_by uuid references public.admin_users(id);
alter table public.payments add column if not exists verified_at timestamp with time zone;

-- =============== SCHOOLS TABLE UPDATE ===============
-- Add fields for better tracking
alter table public.schools add column if not exists is_active boolean default true;
alter table public.schools add column if not exists qr_code_url text;
alter table public.schools add column if not exists id_card_generated boolean default false;
alter table public.schools add column if not exists id_card_printed boolean default false;
alter table public.schools add column if not exists id_card_delivered boolean default false;
alter table public.schools add column if not exists last_payment_date timestamp with time zone;

-- =============== PROPRIETORS TABLE UPDATE ===============
-- Add role field for proprietors
alter table public.proprietors add column if not exists role text default 'proprietor';
alter table public.proprietors add column if not exists is_verified boolean default false;

-- =============== REGISTRATION TOKENS TABLE (New) ===============
-- For payment-first flow: payment generates token, token used to access form
create table if not exists public.registration_tokens (
  id uuid default uuid_generate_v4() primary key,
  token text unique not null,
  payment_reference text references public.payments(reference),
  proprietor_id uuid references public.proprietors(id),
  school_id uuid references public.schools(id),
  is_used boolean default false,
  used_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- =============== FINANCIAL SUMMARY VIEW ===============
create or replace view public.financial_summary as
select
  s.name as state,
  s.is_active as state_active,
  count(distinct sch.id) as total_schools,
  count(distinct p.proprietor_id) as total_proprietors,
  coalesce(sum(case when p.status = 'completed' then p.amount else 0 end), 0) as total_revenue,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'local')::numeric else 0 end), 0) as local_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'state')::numeric else 0 end), 0) as state_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'zonal')::numeric else 0 end), 0) as zonal_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'national')::numeric else 0 end), 0) as national_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'id_card')::numeric else 0 end), 0) as id_card_revenue,
  count(case when p.status = 'completed' then 1 end) as completed_payments,
  count(case when p.status = 'pending' then 1 end) as pending_payments
from public.states s
left join public.schools sch on sch.state = s.name
left join public.proprietors pr on pr.state = s.name
left join public.payments p on p.proprietor_id = pr.id
group by s.name, s.is_active;

-- =============== ZONAL FINANCIAL SUMMARY VIEW ===============
create or replace view public.zonal_financial_summary as
select
  'North Central' as zone,
  count(distinct s.id) as total_schools,
  count(distinct pr.id) as total_proprietors,
  coalesce(sum(case when p.status = 'completed' then p.amount else 0 end), 0) as total_revenue,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'local')::numeric else 0 end), 0) as local_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'state')::numeric else 0 end), 0) as state_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'zonal')::numeric else 0 end), 0) as zonal_dues,
  coalesce(sum(case when p.status = 'completed' then (p.dues_breakdown->>'national')::numeric else 0 end), 0) as national_dues,
  count(case when p.status = 'completed' then 1 end) as completed_payments
from public.states s
left join public.schools sch on sch.state = s.name
left join public.proprietors pr on pr.state = s.name
left join public.payments p on p.proprietor_id = pr.id;

-- =============== INDEXES ===============
create index if not exists idx_states_name on public.states(name);
create index if not exists idx_states_active on public.states(is_active);
create index if not exists idx_admin_users_email on public.admin_users(email);
create index if not exists idx_admin_users_role on public.admin_users(role);
create index if not exists idx_registration_tokens_token on public.registration_tokens(token);
create index if not exists idx_registration_tokens_payment on public.registration_tokens(payment_reference);

-- =============== ROW LEVEL SECURITY ===============
alter table public.states enable row level security;
alter table public.admin_users enable row level security;
alter table public.registration_tokens enable row level security;

-- Policies for states (readable by all, writable by admins)
create policy "States are viewable by all"
  on public.states for select
  using (true);

-- Policies for admin users
create policy "Admin users can view own data"
  on public.admin_users for select
  using (auth.uid()::text = id::text);

-- Policies for registration tokens
create policy "Tokens viewable by linked proprietor"
  on public.registration_tokens for select
  using (proprietor_id = auth.uid());

-- =============== FUNCTIONS ===============
-- Function to activate a state
create or replace function activate_state(state_name text, admin_user_id uuid)
returns void as $$
begin
  update public.states
  set is_active = true,
      activated_at = now(),
      activated_by = admin_user_id
  where name = state_name;
end;
$$ language plpgsql;

-- Function to generate registration token after payment
create or replace function generate_registration_token(payment_ref text)
returns text as $$
declare
  new_token text;
  payment_record public.payments%rowtype;
begin
  -- Get payment record
  select * into payment_record from public.payments where reference = payment_ref;
  
  if not found then
    raise exception 'Payment not found';
  end if;
  
  if payment_record.status != 'completed' then
    raise exception 'Payment not completed';
  end if;
  
  -- Generate unique token
  new_token := 'REG-' || upper(substr(md5(random()::text || payment_ref), 1, 12));
  
  -- Insert token (expires in 7 days)
  insert into public.registration_tokens (token, payment_reference, proprietor_id, expires_at)
  values (new_token, payment_ref, payment_record.proprietor_id, now() + interval '7 days');
  
  return new_token;
end;
$$ language plpgsql;

-- Function to get school public info (for QR code)
create or replace function get_school_public_info(school_id_text text)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'school_id', s.school_id,
    'name', s.name,
    'state', s.state,
    'lga', s.lga,
    'chapter', s.chapter,
    'type', s.type,
    'category', s.category,
    'address', s.address,
    'proprietor_name', concat(p.first_name, ' ', p.last_name),
    'proprietor_phone', p.phone,
    'registration_date', s.created_at,
    'payment_status', (select status from public.payments where school_id = s.id order by created_at desc limit 1)
  )
  into result
  from public.schools s
  left join public.proprietors p on p.id = s.proprietor_id
  where s.school_id = school_id_text;
  
  return result;
end;
$$ language plpgsql;
