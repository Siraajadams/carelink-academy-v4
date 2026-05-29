-- CareLink Academy Supabase Schema

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  country text check (country in ('England', 'Wales', 'Scotland', 'South Africa', 'New Zealand')),
  role text check (role in ('Doctor', 'Pharmacist', 'Nurse', 'Counsellor', 'Psychologist', 'Pharmacy Assistant', 'Admin')),
  registration_number text,
  organisation text,
  platform_access_needed text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  country text default 'Global',
  role text default 'All',
  content_type text check (content_type in ('SOP', 'Video', 'Slide Deck', 'Policy', 'Checklist', 'Other')) default 'Other',
  content_url text,
  sort_order int default 1,
  created_at timestamptz default now()
);

create table if not exists progress (
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  primary key (user_id, module_id)
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  assessment_name text,
  score int,
  passed boolean,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table modules enable row level security;
alter table progress enable row level security;
alter table assessments enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Authenticated users can view modules" on modules for select using (auth.role() = 'authenticated');

create policy "Users can view own progress" on progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on progress for update using (auth.uid() = user_id);

create policy "Users can view own assessments" on assessments for select using (auth.uid() = user_id);
create policy "Users can insert own assessments" on assessments for insert with check (auth.uid() = user_id);

insert into modules (title, description, country, role, content_type, content_url, sort_order) values
('Welcome to CareLink Academy', 'Introduction to the digital healthcare onboarding journey.', 'Global', 'All', 'Video', 'https://drive.google.com', 1),
('Digital Health Privacy and Consent', 'Core privacy, confidentiality and consent principles for digital care.', 'Global', 'All', 'Policy', 'https://drive.google.com', 2),
('CareLink Booking Workflow', 'How to manage appointment requests and patient bookings.', 'Global', 'All', 'SOP', 'https://drive.google.com', 3),
('Videomed Consultation Workflow', 'How GP-in-pharmacy virtual consultations are managed.', 'South Africa', 'Pharmacist', 'Slide Deck', 'https://drive.google.com', 4),
('CPNBS Pharmacy Workflow', 'Training pathway for community pharmacy booking services.', 'England', 'Pharmacist', 'SOP', 'https://drive.google.com', 5),
('New Zealand Digital Care Workflow', 'Country-specific introduction for New Zealand users.', 'New Zealand', 'All', 'SOP', 'https://drive.google.com', 6);


-- Contract templates and electronic sign-off

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  role text default 'All',
  country text default 'Global',
  version text default '1.0',
  contract_url text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists contract_signatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  contract_id uuid references contracts(id) on delete cascade,
  signer_name text not null,
  signature_text text not null,
  identity_or_registration_number text,
  email text,
  mobile text,
  accepted boolean default true,
  ip_acknowledgement text,
  signed_at timestamptz default now(),
  unique(user_id, contract_id)
);

alter table contracts enable row level security;
alter table contract_signatures enable row level security;

create policy "Authenticated users can view active contracts" on contracts
  for select using (auth.role() = 'authenticated' and is_active = true);

create policy "Authenticated users can add contract templates" on contracts
  for insert with check (auth.role() = 'authenticated');

create policy "Users can view own contract signatures" on contract_signatures
  for select using (auth.uid() = user_id);

create policy "Users can insert own contract signatures" on contract_signatures
  for insert with check (auth.uid() = user_id);

create policy "Users can update own contract signatures" on contract_signatures
  for update using (auth.uid() = user_id);

insert into contracts (title, description, role, country, version, contract_url, is_active) values
('VideoMed Doctor in a Pharmacy Contract', 'Doctor onboarding contract for VideoMed doctor-in-pharmacy services, including appointment, obligations, confidentiality, personal information, payment provisions and service description.', 'Doctor', 'South Africa', '1.0', '/documents/VideoMed Doctors Contract.docx', true)
on conflict do nothing;

insert into modules (title, description, country, role, content_type, content_url, sort_order) values
('VideoMed Doctor Operations Guide', 'Doctor onboarding guide covering platform registration, CareLink bookings, attendance, services, billing, medical aid, pathology, stock, room safety and key contacts.', 'South Africa', 'Doctor', 'SOP', '/documents/videomed_doctor_guide.pdf', 7),
('Contract Review and Electronic Sign-off', 'Review the assigned contract and complete electronic sign-off before platform activation.', 'South Africa', 'Doctor', 'Checklist', '/contracts', 8);
