-- Kopitiam Tjoa — Supabase schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.
--
-- Regenerated 2026-07-24 to match the live database. The previous
-- checked-in version predates the orders/order_items split and was
-- missing order_items, order_rate_limit, and order_status_history
-- entirely. Reconstructed from types/database.ts (Supabase-generated
-- types, the actual live shape) plus the RLS policy audit run against
-- the live project. NOTE: exact check constraints (e.g. the OrderStatus
-- enum values, price precision) are inferred from application code in
-- types/domain.ts and lib/rate-limit.ts, not read back from Postgres
-- directly — if you have CLI access, `supabase db dump --schema public`
-- is the fully authoritative source and should supersede this file.

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
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists menu_items_category_idx on menu_items (category, sort_order);

-- ---------------------------------------------------------------------------
-- orders — one row per customer order. Item detail lives in order_items;
-- this table no longer stores a raw items/total jsonb blob (that was the
-- pre-order_items shape and is now stale).
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text, -- human-readable order code shown to customer/staff
  customer_name text not null,
  customer_note text,
  subtotal integer not null default 0 check (subtotal >= 0), -- IDR, no decimals
  status text not null default 'received' check (
    status in ('received', 'preparing', 'ready', 'completed', 'cancelled')
  ),
  notes text, -- internal staff notes, distinct from customer_note
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);

-- ---------------------------------------------------------------------------
-- order_items — line items for an order, inserted by the service-role
-- client immediately after the parent order row (see app/api/orders/route.ts).
-- ---------------------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  menu_item_id uuid references menu_items (id) on delete set null,
  item_name text not null, -- snapshot of menu_items.name at order time
  selected_variant text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ---------------------------------------------------------------------------
-- order_status_history — audit trail of status transitions, written by the
-- admin dashboard when staff update an order's status.
-- ---------------------------------------------------------------------------
create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  status text not null,
  changed_by text,
  changed_at timestamptz not null default now()
);

create index if not exists order_status_history_order_id_idx on order_status_history (order_id);

-- ---------------------------------------------------------------------------
-- order_rate_limit — sliding-window IP throttle for order submission.
-- Written/read only via the service-role client (lib/rate-limit.ts);
-- never touched by anon or authenticated roles directly, hence no RLS
-- policy is defined for it below.
-- ---------------------------------------------------------------------------
create table if not exists order_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists order_rate_limit_ip_created_idx
  on order_rate_limit (ip_address, created_at desc);

-- ---------------------------------------------------------------------------
-- staff — explicit allow-list of which authenticated Supabase Auth users
-- are actually Kopitiam Tjoa staff. Added because every previous RLS
-- policy and API route checked only auth.role() = 'authenticated', which
-- means ANY signed-up user (not just staff) had full admin access. Rows
-- here must be inserted manually (Supabase Studio / SQL editor) by
-- someone with service-role access — there is intentionally no public or
-- authenticated insert policy, so a new Supabase Auth user gains zero
-- extra access on signup.
-- ---------------------------------------------------------------------------
create table if not exists staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table staff enable row level security;

-- A logged-in user may check ONLY whether their own id is on the staff
-- list (needed so the app can answer "am I staff?" without a service
-- client) — they cannot enumerate other staff members.
create policy "staff_read_own_row"
  on staff for select
  using (auth.uid() = user_id);
-- No insert/update/delete policy for anon or authenticated: staff rows
-- are managed exclusively via the service-role client / Supabase Studio.

create or replace function is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from staff where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- login_rate_limit — sliding-window IP throttle for admin login attempts.
-- Written/read only via the service-role client (lib/rate-limit.ts);
-- never touched by anon or authenticated roles directly, hence no RLS
-- policy is defined for it below (deny-all).
-- ---------------------------------------------------------------------------
create table if not exists login_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists login_rate_limit_ip_created_idx
  on login_rate_limit (ip_address, created_at desc);

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

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- get_order_status — RPC used by the public /order/[id] tracking page.
-- Returns the order plus its items as a single jsonb array, so the client
-- doesn't need a second round trip or its own read access to order_items.
-- ---------------------------------------------------------------------------
create or replace function get_order_status(p_order_id uuid)
returns table (
  order_number text,
  customer_name text,
  status text,
  subtotal integer,
  created_at timestamptz,
  items jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    o.order_number,
    o.customer_name,
    o.status,
    o.subtotal,
    o.created_at,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'item_name', oi.item_name,
          'selected_variant', oi.selected_variant,
          'unit_price', oi.unit_price,
          'quantity', oi.quantity,
          'line_total', oi.line_total
        )
      ) filter (where oi.id is not null),
      '[]'::jsonb
    ) as items
  from orders o
  left join order_items oi on oi.order_id = o.id
  where o.id = p_order_id
  group by o.id;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Public (anon): read menu_items and business_settings. No direct insert/
-- update access to orders/order_items — order creation and item insertion
-- both go through the service-role client in app/api/orders/route.ts,
-- which bypasses RLS by design, after server-side price/availability
-- re-validation. Order tracking (/order/[id]) reads through the
-- get_order_status() RPC (security definer), not direct table access.
--
-- Staff (is_staff() = true, i.e. rows present in the staff table): read/
-- update orders, read order_items and order_status_history, read/write
-- menu_items and business_settings. Being a logged-in Supabase Auth user
-- is NOT sufficient on its own — see the staff table above.
--
-- order_rate_limit: RLS enabled with zero policies — deny-all for both
-- anon and authenticated, since it's only ever touched by the service
-- client in lib/rate-limit.ts.
-- ---------------------------------------------------------------------------
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table order_rate_limit enable row level security;
alter table login_rate_limit enable row level security;
alter table business_settings enable row level security;

create policy "menu_items_public_read"
  on menu_items for select
  using (true);

create policy "menu_items_staff_write"
  on menu_items for all
  using (is_staff())
  with check (is_staff());

create policy "business_settings readable by anyone"
  on business_settings for select
  using (true);

create policy "business_settings writable by authenticated admin"
  on business_settings for all
  using (is_staff())
  with check (is_staff());

create policy "orders_staff_read"
  on orders for select
  using (is_staff());

create policy "orders_staff_update"
  on orders for update
  using (is_staff());
-- No public/anon insert policy: order creation goes through the
-- service-role client only.

create policy "order_items_staff_read"
  on order_items for select
  using (is_staff());
-- No insert policy: item rows are only ever written by the service-role
-- client immediately after the parent order.

create policy "order_status_history_staff_read"
  on order_status_history for select
  using (is_staff());

-- order_rate_limit: intentionally no policies — deny-all for anon and
-- authenticated. Only the service-role client (which bypasses RLS) reads
-- or writes this table.