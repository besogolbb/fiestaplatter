# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Filipino households and office organisers in General Mariano Alvarez (GMA), Cavite and nearby towns, planning a birthday, reunion, office party or family gathering. Mostly on a phone, often arriving from a Facebook post or Messenger chat. Their job: pick enough food for N guests within a budget, lock in a delivery date, and know exactly what they'll pay.
- **Secondary:** returning customers who already know what they want and need to re-order fast.
- **Internal:** the owner, who reviews orders in `/admin`, confirms them over Messenger and verifies GCash/Maya payment references.

## Product Purpose

An online ordering site for Fiesta Platter, a home-based Filipino party-tray kitchen. Customers browse the menu like a food-delivery app (GrabFood / foodpanda pattern), add trays, bundles and add-ons to a cart, then check out with their delivery date, time and contact details. Success = a complete, correctly priced order lands in the order log and the customer confirms on Messenger.

## Positioning

Freshly cooked, generously portioned homemade party trays (bilao, grilled sticks, kakanin, bento) from a family-run kitchen, ordered ahead for a specific event date. Unlike delivery apps, it's pre-order catering, not on-demand: food is cooked for your date, with a 24-hour minimum lead time.

## Operating Context

- Orders are pre-orders for an event date; minimum 24h lead time.
- Checkout is **manual payment**: GCash, Maya, bank transfer or COD, 50% down payment to reserve. No online payment processing on-site (decided 2026-11-25; PayMongo may come later).
- Delivery time is entered as free text alongside the date (decided 2026-11-25).
- After submitting, the customer confirms through a prefilled Messenger link; an AI Messenger agent and n8n flows handle follow-up and payment-reference checks.
- Orders are recorded in Google Sheets (the order log, read by `/admin`), Google Calendar events, optional Resend email, and Meta Conversions API events.
- Free delivery over ₱1,500 within the city.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, TypeScript, Tailwind; Docker on EasyPanel behind Cloudflare (origin locked to Cloudflare IPs).
- Catalog lives in code: `src/data/menu.ts` (à la carte trays and retail add-ons) and `src/data/packages.ts` (bundles). Bundles are sold as cart items alongside single trays (decided 2026-11-25).
- The Google Sheets column layout is consumed by `/admin` and n8n; order payload changes must stay compatible.
- Strict CSP: images only from self, photos.fiestaplatter.com and facebook.com.
- Open: exact delivery radius/towns, verified coordinates, Instagram/TikTok links.

## Brand Commitments

- Name **Fiesta Platter**, tagline "Made for Every Occasion", existing logo (`src/components/layout/logo.tsx`).
- Keep the brand's orange/brown warmth and the name/logo; the layout and typography may be replaced (decided 2026-11-25: "keep brand, new design").
- Voice: warm, plain, Taglish-friendly food words (bilao, kakanin, pancit) used as-is, prices always shown clearly in ₱.

## Evidence on Hand

- Real product photography for menu items and bundles (`public/`, photos.fiestaplatter.com).
- Real prices from the owner's price list (palabok ₱449 still an estimate).
- Testimonials on the site are samples. Do not present invented reviews, ratings, order counts or customer numbers as real.

## Product Principles

1. Price clarity first: every item, add-on, delivery fee and total is visible before checkout.
2. Phone-first, thumb-first: the full browse → cart → checkout path works one-handed on a 390px screen.
3. Fast re-ordering: a returning customer reaches checkout in a few taps.
4. Honest catering expectations: lead time, down payment and manual confirmation are stated up front, never hidden.
5. Ops compatibility: new ordering UI must keep feeding the existing Sheets/Calendar/Messenger pipeline.

## Accessibility & Inclusion

WCAG 2.2 AA. Many users are on mid-range Android phones over mobile data, so keep pages light.
