import type { PackageItem } from "@/types";

/**
 * Fiesta Bundle Packages — prices, inclusions and savings from the official
 * Fiesta Platter price list. Ordered entry → premium so the home page shows an
 * affordable-to-signature progression.
 */
export const packages: PackageItem[] = [
  {
    slug: "fiesta-family",
    name: "Fiesta Family",
    audience: "Perfect for Small Families",
    description:
      "A cozy pair of favorites for an intimate family meal — savory pancit and a creamy dessert to finish.",
    includes: ["Pancit Bihon", "Maja Blanca"],
    serving: "Good for 4–5 persons",
    price: 669,
    compareAtPrice: 688,
    image: "/images/packages/fiesta-family.webp",
    imageAlt: "Fiesta Family bundle: pancit bihon and maja blanca trays",
    badge: "Most affordable",
  },
  {
    slug: "fiesta-barkada",
    name: "Fiesta Barkada",
    audience: "Great for Friends & Office Gatherings",
    description:
      "Crowd-pleasing spaghetti paired with a big tray of crispy cheesy pork lumpia — made for the barkada.",
    includes: ["Spaghetti", "Cheesy Pork Lumpia (50 pcs)"],
    serving: "Good for 6–8 persons",
    price: 829,
    compareAtPrice: 858,
    image: "/images/packages/fiesta-barkada.webp",
    imageAlt: "Fiesta Barkada bundle: spaghetti and cheesy pork lumpia trays",
    badge: "Barkada favorite",
  },
  {
    slug: "fiesta-signature",
    name: "Fiesta Signature",
    audience: "Chef's Recommendation",
    description:
      "Our signature Chicken Embutido bilao teamed with jumbo siomai — the best way to meet Fiesta Platter. Ideal for birthdays and first-time customers.",
    includes: ["Chicken Embutido Bilao (3 × 350g)", "Jumbo Siomai (36 pcs)"],
    serving: "Good for 8–10 persons",
    price: 999,
    compareAtPrice: 1085,
    image: "/images/packages/fiesta-signature.webp",
    imageAlt: "Fiesta Signature bundle: chicken embutido and jumbo siomai trays",
    badge: "Chef's Recommendation",
    featured: true,
  },
  {
    slug: "fiesta-celebration",
    name: "Fiesta Celebration",
    audience: "Most Popular",
    description:
      "The perfect balance of smoky pork BBQ, meaty siomai and creamy dessert — our best-selling bundle for birthdays and celebrations.",
    includes: ["Pork BBQ (20 sticks)", "Jumbo Siomai (36 pcs)", "Maja Blanca"],
    serving: "Good for 10–12 persons",
    price: 1599,
    compareAtPrice: 1673,
    image: "/images/packages/fiesta-celebration.webp",
    imageAlt: "Fiesta Celebration bundle: pork BBQ, jumbo siomai and maja blanca trays",
    badge: "🔥 Most Popular",
  },
  {
    slug: "ultimate-fiesta",
    name: "Ultimate Fiesta",
    audience: "Complete Celebration Feast",
    description:
      "The grand spread — noodles, pasta, grilled BBQ, crispy lumpia, our signature embutido and dessert. A complete feast for the whole barangay.",
    includes: [
      "Pancit Bihon",
      "Carbonara",
      "Pork BBQ (20 sticks)",
      "Cheesy Pork Lumpia (50 pcs)",
      "Chicken Embutido Bilao (3 × 350g)",
      "Maja Blanca",
    ],
    serving: "Good for 16–20 persons",
    price: 2699,
    compareAtPrice: 2831,
    image: "/images/packages/ultimate-fiesta.webp",
    imageAlt: "Ultimate Fiesta grand feast: six trays including pancit, spaghetti, pork BBQ, lumpia, embutido and maja blanca",
    badge: "👑 Best Value",
  },
];

export function getPackage(slug: string): PackageItem | undefined {
  return packages.find((p) => p.slug === slug);
}
