export type MenuCategory = "bilao" | "appetizer" | "sticks" | "dessert";

export interface MenuItem {
  slug: string;
  name: string;
  /** Short Filipino/native descriptor shown under the name. */
  shortName?: string;
  description: string;
  /** Base price in PHP. */
  price: number;
  /** Optional "per piece / per stick" unit price for smaller orders. */
  unitPrice?: { amount: number; unit: string };
  category: MenuCategory;
  /** Serving descriptor, e.g. "Good for 8–10 pax". */
  serving: string;
  image: string;
  imageAlt: string;
  bestSeller?: boolean;
  popular?: boolean;
  /** Optional tags used for filtering / badges. */
  tags?: string[];
}

export interface PackageItem {
  slug: string;
  name: string;
  audience: string;
  description: string;
  includes: string[];
  serving: string;
  price: number;
  /** Optional original price to show anchored savings. */
  compareAtPrice?: number;
  image: string;
  imageAlt: string;
  badge?: string;
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "Ordering" | "Delivery" | "Payment" | "Servings" | "Reservations";
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: "Food" | "Events" | "Packaging" | "Kitchen";
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string; // lucide icon name
}
