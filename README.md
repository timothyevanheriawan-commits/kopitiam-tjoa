# Kopitiam Tjoa

Storefront + staff admin panel for a fictional Peranakan Chinese-Indonesian
kopitiam. Next.js 16 (App Router) + Supabase (Postgres/Auth) + Zustand.

## Stack

- Next.js 16 / React 19 / TypeScript (strict)
- Tailwind v4
- Supabase (Postgres, Auth, RLS) via `@supabase/ssr`
- Zustand for cart state
- Framer Motion for animation

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project**, then run `supabase/schema.sql` in the
   Supabase SQL editor (or `supabase db push`). This creates all tables,
   RLS policies, the `is_staff()` helper, and the `get_order_status()`
   tracking RPC.

3. **Provision a staff account.** Order/menu management is staff-only —
   being a logged-in Supabase Auth user is *not* enough by itself. After
   creating a user in Supabase Auth (Studio → Authentication → Users, with
   public sign-up left OFF), insert a row for them:
   ```sql
   insert into staff (user_id, email)
   values ('<their-auth-user-uuid>', '<their-email>');
   ```

4. **Copy `.env.example` to `.env.local`** and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from
     Supabase Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — same page. **Never** expose this to the
     browser or commit it; it bypasses RLS entirely.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — the number the checkout flow sends
     customers to (international format, no leading `+`).

5. **Seed the menu** (optional, one-time):
   ```bash
   npx tsx scripts/migrate-menu.ts
   ```

6. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin panel

`/admin` is protected by `middleware.ts`, which requires a logged-in
Supabase user *and* a matching `staff` table row (checked again inside
every `/api/admin/*` route handler as defense-in-depth). Log in at
`/admin/login`.

## Deployment

Deploy target is assumed to be Vercel — `lib/rate-limit.ts` trusts the
`x-forwarded-for` header, which is only safe to trust behind Vercel's edge
network (or another proxy you control that sets it correctly). If
deploying elsewhere, review that assumption first.

Set all four env vars from step 4 above in your deployment platform before
the first deploy — the app will throw at build/runtime if
`NEXT_PUBLIC_WHATSAPP_NUMBER` is missing when the checkout flow is used.

## Known gaps

See the project's production audit for a full list. Not yet implemented:
automated tests, CI/CD, monitoring/error tracking, analytics.
