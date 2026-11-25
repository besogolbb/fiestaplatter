import { menu, menuCategories } from "@/data/menu";
import { packages } from "@/data/packages";
import type { MenuItem, PackageItem } from "@/types";

/**
 * Cart catalog — one lookup over bundles and menu items so the cart, the
 * checkout and the server action all price from the same source. Prices are
 * never read from the client: the server re-resolves every line here.
 */

export type CartLineKind = "package" | "item";

/** A section of the store page; bundles + every menu category + retail add-ons. */
export type StoreSectionId = "bundles" | MenuItem["category"] | "frozen";

/** Fiesta flag colours, one per store section (repeat like real banderitas). */
export type FlagColor = "magenta" | "yellow" | "green" | "blue" | "orange";

export interface CatalogEntry {
  kind: CartLineKind;
  slug: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
  serving: string;
  description: string;
  section: StoreSectionId;
  bestSeller?: boolean;
  popular?: boolean;
  badge?: string;
  includes?: string[];
  compareAtPrice?: number;
  unitPrice?: { amount: number; unit: string };
}

export interface StoreSection {
  id: StoreSectionId;
  label: string;
  /** Short label for the bunting nav. */
  short: string;
  flag: FlagColor;
}

const categoryLabel = new Map(menuCategories.map((c) => [c.id, c.label]));

export const storeSections: StoreSection[] = [
  { id: "bundles", label: "Fiesta Bundles", short: "Bundles", flag: "magenta" },
  { id: "bilao", label: categoryLabel.get("bilao") ?? "Bilao Trays", short: "Bilao", flag: "yellow" },
  { id: "appetizer", label: categoryLabel.get("appetizer") ?? "Appetizers", short: "Appetizers", flag: "green" },
  { id: "sticks", label: categoryLabel.get("sticks") ?? "Grilled Sticks", short: "Sticks", flag: "blue" },
  { id: "dessert", label: categoryLabel.get("dessert") ?? "Desserts & Kakanin", short: "Desserts", flag: "orange" },
  { id: "bento", label: categoryLabel.get("bento") ?? "Bento Packs", short: "Bento", flag: "magenta" },
  { id: "frozen", label: "Frozen Add-ons", short: "Frozen", flag: "yellow" },
];

const sectionById = new Map(storeSections.map((s) => [s.id, s]));

export function sectionFor(id: StoreSectionId): StoreSection {
  return sectionById.get(id) ?? storeSections[0];
}

function fromPackage(p: PackageItem): CatalogEntry {
  return {
    kind: "package",
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    imageAlt: p.imageAlt,
    serving: p.serving,
    description: p.description,
    section: "bundles",
    badge: p.badge,
    includes: p.includes,
    compareAtPrice: p.compareAtPrice,
    popular: p.featured,
  };
}

function fromMenuItem(m: MenuItem): CatalogEntry {
  return {
    kind: "item",
    slug: m.slug,
    name: m.name,
    price: m.price,
    image: m.image,
    imageAlt: m.imageAlt,
    serving: m.serving,
    description: m.description,
    section: m.addOnOnly ? "frozen" : m.category,
    bestSeller: m.bestSeller,
    popular: m.popular,
    unitPrice: m.unitPrice,
  };
}

export const catalog: CatalogEntry[] = [...packages.map(fromPackage), ...menu.map(fromMenuItem)];

const index = new Map(catalog.map((e) => [catalogKey(e.kind, e.slug), e]));

export function catalogKey(kind: CartLineKind, slug: string): string {
  return `${kind}:${slug}`;
}

export function getCatalogEntry(kind: CartLineKind, slug: string): CatalogEntry | undefined {
  return index.get(catalogKey(kind, slug));
}

/** Catalog entries grouped by store section, in nav order, empty sections dropped. */
export function catalogBySection(): { section: StoreSection; entries: CatalogEntry[] }[] {
  return storeSections
    .map((section) => ({ section, entries: catalog.filter((e) => e.section === section.id) }))
    .filter((g) => g.entries.length > 0);
}
