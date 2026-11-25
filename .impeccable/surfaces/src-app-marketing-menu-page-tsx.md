---
version: 1
slug: "src-app-marketing-menu-page-tsx"
primary_target: "src/app/(marketing)/menu/page.tsx"
related_targets: ["src/app/(order)/order/page.tsx"]
---

# Surface: Ordering app (menu store → cart → checkout)

Mode: Operate. Routes: /menu (store), cart sheet (global), /order (checkout). Related: header cart button, product/package cards site-wide.

Audience/job: Cavite households on phones building a party order for a date. Task: add bundles, trays and add-ons, see the running total and free-delivery gap, check out with contact, date, free-text time, address, event and payment. Constraints: manual GCash/Maya payment, 24h lead time, server re-prices every line, Sheets/Calendar/Messenger payload stays compatible.

## Direction contract
THESIS: The cart is a string of banderitas: every tray you add hangs another flag. Refuses the grey delivery-app clone with one orange accent and the cream-serif catering brochure.
OWN-WORLD: White ground; brand orange #AF5308 owns actions and the cart bar; fiesta flag colours magenta, yellow, green, blue each tag one menu category (flag, section marker, cart flags), never body text. Rounded display face (Baloo 2) for names and prices, Figtree for UI. Triangle pennants are the only ornament.
STORY: Visitor sees the whole menu by category, adds items with one tap, watches flags fill the cart bar, learns what free delivery needs, checks out in one screen and confirms on Messenger.
FIRST VIEWPORT: Header with logo, delivery-date chip and cart button; a bunting string under it that is the sticky category nav (flag + label per category, active flag dropped lower); section title; 2-column photo cards with name, pax, price and round + (becomes − n + stepper); floating orange cart bar at bottom with growing flag string, item count, View cart and total.
FORM: Banderitas, candidate 1 on my ordered list (IMPECCABLE'S PICK); seed:9664c91aeee723a9
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
