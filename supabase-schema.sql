-- Lanka Market database setup for Supabase.
-- Run this entire file in Supabase Dashboard > SQL Editor > New query.
create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 100),
  category text not null check (category in ('Electronics','Vehicles','Property','Fashion','Home & Garden','Sports','Other')),
  price numeric(12,2) not null check (price >= 0),
  description text not null check (char_length(description) between 2 and 2000),
  location text not null check (char_length(location) between 2 and 80),
  phone text not null,
  whatsapp text,
  image_url text,
  status text not null default 'active' check (status in ('active','sold','hidden')),
  created_at timestamptz not null default now()
);

create index if not exists listings_status_created_idx on public.listings(status, created_at desc);
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_price_idx on public.listings(price);
alter table public.listings enable row level security;

drop policy if exists "Anyone can read active listings" on public.listings;
create policy "Anyone can read active listings" on public.listings
for select using (status = 'active' or auth.uid() = user_id);

drop policy if exists "Logged in users can create their own listings" on public.listings;
create policy "Logged in users can create their own listings" on public.listings
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own listings" on public.listings;
create policy "Users can update their own listings" on public.listings
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own listings" on public.listings;
create policy "Users can delete their own listings" on public.listings
for delete to authenticated using (auth.uid() = user_id);

-- Product photo storage bucket. Images are public to display in public listings.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view listing photos" on storage.objects;
create policy "Public can view listing photos" on storage.objects
for select using (bucket_id = 'listing-images');

drop policy if exists "Users upload listing photos to own folder" on storage.objects;
create policy "Users upload listing photos to own folder" on storage.objects
for insert to authenticated with check (
  bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update own listing photos" on storage.objects;
create policy "Users update own listing photos" on storage.objects
for update to authenticated using (
  bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
) with check (
  bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete own listing photos" on storage.objects;
create policy "Users delete own listing photos" on storage.objects
for delete to authenticated using (
  bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
);
