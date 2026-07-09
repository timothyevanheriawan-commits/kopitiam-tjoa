-- Kopitiam Tjoa — Supabase schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null check (price >= 0), -- IDR, no decimals
  category text not null check (
    category in ('kopi_teh', 'roti_kaya', 'telur', 'snacks_kueh', 'combo_sets')
  ),
  tags text[] not null default '{}', -- subset of: signature, best_seller, sold_out
  variant_options jsonb, -- array of { name, options: [{ label, price_delta }] }
  is_available boolean not null default true,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_idx on menu_items (category, sort_order);

-- ---------------------------------------------------------------------------
-- orders (admin log only — WhatsApp is the real handoff, this is a mirror)
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  items jsonb not null, -- array of { menu_item_id, name, quantity, unit_price, selected_variant }
  total integer not null check (total >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);

-- ---------------------------------------------------------------------------
-- business_settings — single row table
-- ---------------------------------------------------------------------------
create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  hours jsonb not null,
  manual_open_override boolean, -- null = defer to hours, true/false = force
  updated_at timestamptz not null default now()
);

-- Seed a single settings row with Kopitiam Tjoa's default hours.
insert into business_settings (hours, manual_open_override)
select
  '{
    "monday":    { "open": "05:00", "close": "15:00", "closed": false },
    "tuesday":   { "open": "05:00", "close": "15:00", "closed": false },
    "wednesday": { "open": "05:00", "close": "15:00", "closed": false },
    "thursday":  { "open": "05:00", "close": "15:00", "closed": false },
    "friday":    { "open": "05:00", "close": "15:00", "closed": false },
    "saturday":  { "open": "05:00", "close": "13:00", "closed": false },
    "sunday":    { "open": null,    "close": null,    "closed": true  }
  }'::jsonb,
  null
where not exists (select 1 from business_settings);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists menu_items_set_updated_at on menu_items;
create trigger menu_items_set_updated_at
  before update on menu_items
  for each row execute function set_updated_at();

drop trigger if exists business_settings_set_updated_at on business_settings;
create trigger business_settings_set_updated_at
  before update on business_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) can read menu_items and business_settings, and insert orders.
-- Only authenticated admin users can write menu_items/business_settings
-- or read the orders log.
-- ---------------------------------------------------------------------------
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table business_settings enable row level security;

create policy "menu_items readable by anyone"
  on menu_items for select
  using (true);

create policy "menu_items writable by authenticated admin"
  on menu_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "business_settings readable by anyone"
  on business_settings for select
  using (true);

create policy "business_settings writable by authenticated admin"
  on business_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "anyone can submit an order"
  on orders for insert
  with check (true);

create policy "orders readable by authenticated admin only"
  on orders for select
  using (auth.role() = 'authenticated');
