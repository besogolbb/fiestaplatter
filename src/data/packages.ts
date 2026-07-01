import type { PackageItem } from "@/types";

/**
 * Party packages. Prices for Family / Celebration / Birthday come from the
 * official bundle price list; the Corporate and Holiday bundles follow the
 * same margin logic. `compareAtPrice` = sum of à-la-carte items (honest saving).
 */
export const packages: PackageItem[] = [
  {
    slug: "family-bundle",
    name: "Family Bundle",
    audience: "Small family gatherings",
    description:
      "Everything you need for an intimate weekend celebration with the family — mains, crispy favorites and dessert.",
    includes: ["Spaghetti Bilao", "Cheesy Pork Lumpia (50 pcs)", "Maja Blanca Bilao"],
    serving: "Good for 8–10 pax",
    price: 999,
    compareAtPrice: 1078,
    image: "/images/menu/spaghetti.webp",
    imageAlt: "Fiesta Platter Family Bundle with spaghetti, lumpia and maja blanca",
    badge: "Most affordable",
  },
  {
    slug: "birthday-bundle",
    name: "Birthday Bundle",
    audience: "Birthday parties",
    description:
      "Make the birthday celebrant happy with creamy pasta, smoky BBQ, crispy lumpia and a sweet dessert to finish.",
    includes: [
      "Carbonara Bilao",
      "Pork BBQ (20 sticks)",
      "Cheesy Pork Lumpia (50 pcs)",
      "Maja Blanca Bilao",
    ],
    serving: "Good for 12–15 pax",
    price: 1599,
    compareAtPrice: 1848,
    image: "/images/menu/carbonara.webp",
    imageAlt: "Fiesta Platter Birthday Bundle with carbonara, pork BBQ, lumpia and dessert",
    badge: "Most popular",
    featured: true,
  },
  {
    slug: "corporate-bundle",
    name: "Corporate Bundle",
    audience: "Office meetings & events",
    description:
      "Impress the team and clients with a professional spread that's easy to serve, mess-free and generously portioned.",
    includes: [
      "Pancit Bihon Bilao",
      "Carbonara Bilao",
      "Jumbo Siomai (36 pcs)",
      "Embutido (3 bars)",
    ],
    serving: "Good for 15–18 pax",
    price: 1499,
    compareAtPrice: 1718,
    image: "/images/menu/jumbo-siomai.webp",
    imageAlt: "Fiesta Platter Corporate Bundle with pancit, carbonara, siomai and embutido",
    badge: "Best for offices",
  },
  {
    slug: "fiesta-bundle",
    name: "Fiesta Bundle",
    audience: "Fiestas & big get-togethers",
    description:
      "A true Filipino handaan — noodles, pasta, grilled BBQ and merienda favorites for a full table of guests.",
    includes: [
      "Spaghetti Bilao",
      "Palabok Bilao",
      "Cheesy Pork Lumpia (50 pcs)",
      "Pork BBQ (20 sticks)",
      "Puto Pao (50 pcs)",
    ],
    serving: "Good for 18–22 pax",
    price: 1999,
    compareAtPrice: 2398,
    image: "/images/menu/palabok.webp",
    imageAlt: "Fiesta Platter Fiesta Bundle spread with palabok, spaghetti, lumpia and BBQ",
    badge: "Best value",
  },
  {
    slug: "holiday-bundle",
    name: "Holiday Bundle",
    audience: "Christmas & big celebrations",
    description:
      "Our grandest spread for noche buena and milestone events — a complete feast that feeds the whole barangay.",
    includes: [
      "Spaghetti Bilao",
      "Palabok Bilao",
      "Carbonara Bilao",
      "Pork BBQ (20 sticks)",
      "Cheesy Pork Lumpia (50 pcs)",
      "Maja Blanca Bilao",
    ],
    serving: "Good for 25–30 pax",
    price: 2299,
    compareAtPrice: 2686,
    image: "/images/menu/pork-bbq.webp",
    imageAlt: "Fiesta Platter Holiday Bundle grand feast with pasta, BBQ, lumpia and dessert",
    badge: "Feeds a crowd",
  },
];

export function getPackage(slug: string): PackageItem | undefined {
  return packages.find((p) => p.slug === slug);
}
