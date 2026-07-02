# Fiesta Platter — Website Requirements & Architecture

This documents what is actually built, as of this session. It reflects the real codebase, not a plan — if something here goes stale, trust the code over this file and ask for a re-sync.

## Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS, `class-variance-authority` for component variants, custom CSS-variable theme (light default, `.dark` class for dark mode)
- **Forms:** React Hook Form + Zod validation
- **Motion:** Framer Motion (order wizard transitions, scroll reveals, count-up stats)
- **UI primitives:** Radix UI (accordion, select, label, slot) wrapped in shadcn-style components
- **Email:** Resend (order notifications — optional, degrades gracefully if unset)
- **Toasts:** sonner
- **Confetti:** canvas-confetti (lazy-loaded, order-success screen only)
- **Deployment:** Docker (`output: "standalone"`) on EasyPanel/VPS, behind Cloudflare (proxied DNS, origin firewall allowlists Cloudflare IP ranges only — see ops notes below)

## Routes

| Route | Purpose | Notes |
|---|---|---|
| `/` | Homepage | Hero, trust bar, best sellers, why-choose-us, how-it-works, packages preview, gallery preview, FAQ preview, final CTA |
| `/menu` | Full à la carte menu | Live client-side search + category filter (`MenuBrowser`) |
| `/packages` | Bundle packages | All 5 bundles, full detail cards |
| `/order` | Order flow | 2-step wizard: bundle selection → contact/delivery/event/payment details. Accepts `?package=slug` or `?item=slug` to deep-link and skip step 1 |
| `/about` | Business story | |
| `/contact` | Contact channels | Messenger, call, email, Facebook |
| `/faq` | FAQ | With `FAQPage` schema |
| `/gallery` | Photo gallery | Categorized image grid |
| `/privacy`, `/terms` | Legal | |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Generated via Next's file conventions (`robots.ts`, `sitemap.ts`, `manifest.ts`) |
| `/opengraph-image` | Dynamic OG image (edge runtime) | |

## Order flow (functions as cart + checkout)

There is no traditional multi-item cart — the order form itself serves that role:

1. **Step 1 — Bundle selection:** visual cards for all 5 bundles + a "Customize Bundle" option, styled like the `/packages` page.
2. **Step 2 — Details:** selected bundle summary (with "Change" to go back), optional add-on trays (best-seller/popular items surfaced first), live estimated total, free-delivery progress nudge, next-tier upgrade nudge, then contact/delivery/event/payment fields.
3. **Submit:** Server Action (`submitOrder` in `src/app/(order)/order/actions.ts`) validates with Zod, checks a honeypot field, emails the business via Resend if configured, fires a server-side Meta Conversions API Lead event if configured, and returns a structured summary.
4. **Success:** `OrderSuccess` shows the reference number, a prefilled Messenger confirmation link (this is the actual "checkout" — payment is arranged manually via Messenger/call, not on-site), and the order summary.

**No online payment is processed on the site.** This is intentional — orders are confirmed and paid via Messenger/GCash/Maya/bank transfer/COD after submission.

## Analytics & tracking

- GA4 and Meta Pixel scripts load only if `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_FB_PIXEL_ID` are set (`src/components/shared/analytics.tsx`).
- E-commerce funnel events are wired into the order flow (`src/lib/analytics-events.ts`):
  - Bundle selected → `add_to_cart` (GA4) / `AddToCart` (Meta)
  - Enter step 2 → `begin_checkout` / `InitiateCheckout`
  - Order submitted successfully → `generate_lead` / `Lead`
- Server-side Meta Conversions API (`src/lib/meta-capi.ts`) mirrors the Lead event, deduped via a shared `event_id` (the order reference), if `META_CAPI_ACCESS_TOKEN` is set. No-ops otherwise.
- **All of the above requires real IDs in the environment to do anything** — the code is ready, but no GA4 property or Meta Pixel has been confirmed created yet (see the Launch Checklist).

## SEO

- Per-page metadata via `pageMetadata()` helper (canonical, OG, Twitter) — every marketing page uses it.
- Structured data: `LocalBusiness`/`FoodEstablishment`, `Menu`, `FAQPage`, `BreadcrumbList` (auto-added by `PageHero` on every inner page), `WebSite`.
- `robots.ts` / `sitemap.ts` generated from route list.
- `llms.txt` for AI answer engines.

## Security

- `next.config.mjs` sets: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and a `Content-Security-Policy`.
- Origin server sits behind a Cloudflare-only iptables allowlist (`CF-LOCK` chain) — direct requests to the VPS IP or any non-Cloudflare-proxied hostname are dropped. **This means any hostname pointed at this deployment must be Cloudflare-proxied (orange cloud) or it will be unreachable.**
- Server Action validates all input with Zod and rejects honeypot hits silently.

## Known placeholder data (must be replaced before launch)

`src/config/site.ts` still contains TODO values that are currently live:

- `contact.email` — confirm the real inbox
- `location.streetAddress`, `city`, `region`, `postalCode`, `latitude`, `longitude`, `serviceArea` — **currently a fake sample address**, which is what's in the `LocalBusiness` JSON-LD right now
- `stats.ordersServed`, `stats.yearsServing`, `stats.happyFamilies` — placeholder numbers shown in the trust bar and hero

`.env.example` documents all required/optional environment variables — copy to `.env.local` for local dev, and set the real values in EasyPanel's Environment tab for production.

## What's deliberately not built

- **Individual product detail pages** (`/menu/[slug]`) — items are cards on `/menu` with a "Quick Order" deep-link into `/order?item=slug`. Only worth building if you want shareable single-product links or SEO for individual dish searches.
- **Fake testimonials/reviews/ratings** — removed intentionally. Do not reintroduce without real customer data; see the Launch Checklist's "10+ real reviews" item.
- **"Customers also ordered" / related products** — would require real order history data that doesn't exist yet.
