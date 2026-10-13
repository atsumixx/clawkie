# Atelier Noir — Bakery & Nail Studio PWA

Next.js 14 (App Router) · Tailwind CSS · Supabase (Postgres, Auth, RLS) · Vercel.
Monochrome neomorphic UI built from the supplied Stitch designs ("Tactile Monochrome" design system).

## 1. Set up Supabase
1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql`, then (optional) `supabase/seed.sql`.
3. Authentication → Providers → Email: enabled. For quick testing you can turn off "Confirm email".
   Authentication → URL Configuration: add `http://localhost:3000/auth/callback` and your Vercel URL + `/auth/callback`.
4. Sign up in the app, then make yourself the owner (SQL editor):
   ```sql
   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
   ```

## 2. Run locally
```bash
cp .env.example .env.local   # fill in the Supabase URL + anon key
npm install
npm run dev
```
The service worker is registered in production builds only: `npm run build && npm start` to test installability/offline.

## 3. Deploy
Push to GitHub → import in Vercel → add the same env vars (set `NEXT_PUBLIC_SITE_URL` to the Vercel URL).

## Requirement map
| Req | Where |
|---|---|
| AUTH-01/02 | `app/actions/auth.ts`, `handle_new_user` trigger |
| AUTH-03 | `middleware.ts` + `lib/auth.ts#requireAdmin` + `app/admin/layout.tsx` |
| BAKE-01..04 | `app/bakery`, `app/cart`, `app/checkout`, `place_order()` RPC (atomic, decrements stock) |
| NAIL-01..03 | `app/salon`, `getAvailableSlots`, `book_appointment()` + DB exclusion constraint (no double-booking) |
| CUST-01 | `app/dashboard` |
| ADM-01..04 | `app/admin/*`, `app/actions/admin.ts` |
| NFR-03 | `public/manifest.webmanifest`, `public/sw.js`, `public/offline.html` |
| NFR-04 | RLS on every table in `schema.sql` |

## Notes & decisions
- Prices/stock are always read from the DB inside `place_order`; the client cart is never trusted.
- No online payment is collected (the SRS doesn't specify one) — customers pay on pickup/delivery. Add Stripe in `placeOrder` when ready.
- Salon hours, slot length and booking window: `lib/config.ts`. Timezone/currency: env vars.
- Artists live in the `staff` table (manage via Supabase Table Editor).
- Product images are URLs (paste into the admin form); Supabase Storage upload can be added later.
- Cancelling an order (admin) automatically restocks its items.
