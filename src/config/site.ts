/**
 * SINGLE SOURCE OF TRUTH for all business details.
 * ────────────────────────────────────────────────
 * Edit the values marked `TODO` to take the site live. Every page, CTA,
 * structured-data block and metadata tag reads from this file, so you never
 * have to hunt through components to update a phone number or a link.
 */

// `||` (not `??`) is deliberate: Docker's `ARG NEXT_PUBLIC_SITE_URL` with no
// value passed resolves to an empty string, not undefined, and `??` doesn't
// treat "" as absent — that empty string would otherwise reach `new URL()`
// in the root layout's metadataBase and crash the entire build.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://fiestaplatter.com";

export const siteConfig = {
  name: "Fiesta Platter",
  legalName: "Fiesta Platter Catering Services",
  tagline: "Made for Every Occasion",
  description:
    "Premium homemade Filipino party trays prepared fresh for birthdays, family gatherings, office celebrations, reunions and special occasions. Signature Chicken Embutido, jumbo siomai, pork BBQ, pancit, carbonara and more.",
  url: SITE_URL,

  // ── Contact ────────────────────────────────────────────────────────────
  contact: {
    phoneDisplay: "0968 570 7018",
    phoneE164: "+639685707018",
    email: "hello@fiestaplatter.com", // TODO: confirm email
    // Messenger username or full m.me link target (page username after m.me/)
    messengerUsername: "fiestaplatterph",
    facebookUrl: "https://facebook.com/fiestaplatterph",
    instagramUrl: "", // optional
    tiktokUrl: "", // optional
  },

  // ── Location / service area ────────────────────────────────────────────
  location: {
    // Barangay-level only, intentionally no house/unit number (home-based kitchen).
    streetAddress: "San Jose, Brgy. Francisco Reyes",
    city: "General Mariano Alvarez (GMA)",
    region: "Cavite",
    postalCode: "4117",
    country: "PH",
    serviceArea: "General Mariano Alvarez, Cavite and nearby towns", // TODO: confirm exact delivery radius/towns
    // Approximate GMA, Cavite town-center coordinates — NOT verified against
    // the actual barangay location. Refine by dropping a pin on Google Maps
    // (right-click your spot > "What's here?") and pasting the lat/long here.
    latitude: 14.308, // TODO: verify
    longitude: 120.9924, // TODO: verify
    googleMapsUrl: "", // optional — add once your Google Business Profile is live
  },

  // ── Hours — TODO ──────────────────────────────────────────────────────
  hours: {
    display: "Mon–Sun, 7:00 AM – 8:00 PM",
    // schema.org opening hours specification
    spec: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "20:00",
      },
    ],
  },

  // ── Ordering rules ────────────────────────────────────────────────────
  ordering: {
    minLeadTimeHours: 24,
    downpaymentNote: "50% down payment to reserve your schedule.",
    paymentMethods: ["GCash", "Maya", "Bank Transfer", "Cash on Delivery"] as const,
    deliveryNote: "Free delivery within the city for orders over ₱1,500.",
    /** Order subtotal (PHP) at or above which delivery is free — drives the AOV nudge in the order form. */
    freeDeliveryThreshold: 1500,
    currency: "PHP",
    currencySymbol: "₱",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Prefilled Messenger deep-link (m.me) with an optional message. */
export function messengerLink(text?: string): string {
  const base = `https://m.me/${siteConfig.contact.messengerUsername}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** WhatsApp deep-link fallback. */
export function whatsappLink(text?: string): string {
  const num = siteConfig.contact.phoneE164.replace(/[^0-9]/g, "");
  const base = `https://wa.me/${num}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const telLink = `tel:${siteConfig.contact.phoneE164}`;
export const mailtoLink = `mailto:${siteConfig.contact.email}`;
