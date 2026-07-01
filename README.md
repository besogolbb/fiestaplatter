# Fiesta Platter — Website & Order Funnel

Production-ready [Next.js](https://nextjs.org) (App Router) marketing site + order funnel for **Fiesta Platter**, a premium Filipino party-tray & catering business.

Built with: Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui-style primitives · Framer Motion · React Hook Form · Zod · Server Actions · Resend.

---

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

Build & run production:

```bash
npm run build
npm run start
```

Other scripts: `npm run lint`, `npm run typecheck`.

---

## ✅ Go-live checklist (edit these to launch)

1. **`src/config/site.ts`** — the single source of truth. Replace every value marked
   `TODO`: phone number, Messenger username, Facebook URL, address, service area,
   business hours, and the social-proof stats (rating, orders served, years).
2. **`.env.local`** — copy from `.env.example` and set:
   - `NEXT_PUBLIC_SITE_URL` — your live domain (used for canonical URLs, sitemap, OG).
   - `RESEND_API_KEY` — from [resend.com](https://resend.com) so new orders are emailed to you.
     _Optional:_ without it, orders still succeed and fall back to Messenger confirmation.
   - `ORDER_NOTIFICATION_EMAIL` / `ORDER_FROM_EMAIL` — where orders are sent / verified sender.
   - `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FB_PIXEL_ID` — optional analytics.
3. **Menu & prices** — `src/data/menu.ts` (prices already set from your price list;
   `palabok` price is an estimate — confirm it).
4. **Packages** — `src/data/packages.ts`.
5. **Testimonials** — `src/data/testimonials.ts` (replace samples with real reviews).
6. **Photos** — optimized transparent WebP cutouts live in `public/images/`.

---

## 🧭 Project structure

```
src/
  app/
    (marketing)/      # Home + Menu, Packages, About, Gallery, FAQ, Contact, Privacy, Terms
    (order)/          # Distraction-free order flow (form + Server Action)
    layout.tsx        # Root: fonts, site-wide JSON-LD, analytics
    sitemap.ts robots.ts opengraph-image.tsx
    loading.tsx error.tsx not-found.tsx
  components/
    ui/               # Button, Card, Input, Select, Accordion, Badge, … (shadcn-style)
    layout/           # Header, Footer, Logo, FloatingCta
    sections/         # Funnel blocks (Hero, BestSellers, HowItWorks, …)
    shared/           # ProductCard, PackageCard, TestimonialCard, PageHero, JsonLd, …
    order/            # OrderForm, OrderSuccess, Field
  config/             # site.ts (business details), nav.ts
  data/               # menu, packages, testimonials, faqs, content
  lib/                # utils, order-schema (Zod), order-format, seo, structured-data
  types/
```

## 🔎 SEO & performance

- Per-page Metadata API (canonical, OpenGraph, Twitter) + dynamic OG image.
- JSON-LD: `FoodEstablishment`, `Menu`, `FAQPage`, `BreadcrumbList`, `WebSite`.
- `sitemap.xml` + `robots.txt` generated from config.
- Server Components by default; only 3 small client islands (header, order form, animations).
- `next/image` (AVIF/WebP), `next/font`, route-level loading UI.

## 📦 Deploy

Deploy to [Vercel](https://vercel.com): import the repo, add the env vars above, deploy.
Any Node host works too (`npm run build && npm run start`).
