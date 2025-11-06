-- Create users table (profiles extending auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  user_type text not null check (user_type in ('client', 'walker', 'admin')),
  avatar_url text,
  bio text,
  rating numeric(3,2) default 5.00,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create walkers table (additional walker-specific info)
create table if not exists public.walkers (
  id uuid primary key references public.profiles(id) on delete cascade,
  hourly_rate numeric(8,2) not null,
  max_dogs integer default 5,
  service_zones text[] default array[]::text[],
  experience_years integer default 0,
  certifications text[] default array[]::text[],
  is_available boolean default true,
  verification_document_url text,
  background_check_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create dogs table
create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  breed text,
  age integer,
  weight text,
  temperament text,
  special_needs text,
  medical_conditions text,
  photos text[] default array[]::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create walk bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  walker_id uuid not null references public.walkers(id) on delete cascade,
  dogs text[] not null,
  scheduled_start timestamp with time zone not null,
  scheduled_end timestamp with time zone not null,
  actual_start timestamp with time zone,
  actual_end timestamp with time zone,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  duration_minutes integer,
  location text not null,
  notes text,
  price_per_dog numeric(8,2),
  total_price numeric(8,2),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create walk timeline/tracking table
create table if not exists public.walk_timeline (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  event_type text not null check (event_type in ('started', 'paused', 'resumed', 'completed', 'issue')),
  location jsonb,
  notes text,
  timestamp timestamp with time zone default now()
);

-- Create ratings/reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  walker_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Create payments table for tracking transactions
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(8,2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.walkers enable row level security;
alter table public.dogs enable row level security;
alter table public.bookings enable row level security;
alter table public.walk_timeline enable row level security;
alter table public.reviews enable row level security;
alter table public.payments enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- RLS Policies for walkers (public viewable)
create policy "walkers_select_public"
  on public.walkers for select
  using (true);

create policy "walkers_insert_own"
  on public.walkers for insert
  with check (auth.uid() = id);

create policy "walkers_update_own"
  on public.walkers for update
  using (auth.uid() = id);

-- RLS Policies for dogs
create policy "dogs_select_own"
  on public.dogs for select
  using (auth.uid() = client_id);

create policy "dogs_insert_own"
  on public.dogs for insert
  with check (auth.uid() = client_id);

create policy "dogs_update_own"
  on public.dogs for update
  using (auth.uid() = client_id);

create policy "dogs_delete_own"
  on public.dogs for delete
  using (auth.uid() = client_id);

-- RLS Policies for bookings
create policy "bookings_select_own"
  on public.bookings for select
  using (auth.uid() = client_id or auth.uid() = walker_id);

create policy "bookings_insert_client"
  on public.bookings for insert
  with check (auth.uid() = client_id);

create policy "bookings_update_own"
  on public.bookings for update
  using (auth.uid() = client_id or auth.uid() = walker_id);

-- RLS Policies for walk_timeline
create policy "walk_timeline_select"
  on public.walk_timeline for select
  using (
    auth.uid() in (
      select client_id from public.bookings where id = walk_timeline.booking_id
      union
      select walker_id from public.bookings where id = walk_timeline.booking_id
    )
  );

create policy "walk_timeline_insert"
  on public.walk_timeline for insert
  with check (
    auth.uid() in (
      select walker_id from public.bookings where id = walk_timeline.booking_id
    )
  );

-- RLS Policies for reviews
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

-- RLS Policies for payments
create policy "payments_select_own"
  on public.payments for select
  using (
    auth.uid() in (
      select client_id from public.bookings where id = payments.booking_id
      union
      select walker_id from public.bookings where id = payments.booking_id
    )
  );

create policy "payments_insert_own"
  on public.payments for insert
  with check (
    auth.uid() in (
      select client_id from public.bookings where id = payments.booking_id
    )
  );

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'user_type', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
