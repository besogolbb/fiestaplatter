import { siteConfig } from "@/config/site";
import { getCatalogEntry, type CartLineKind, type CatalogEntry } from "@/lib/cart/catalog";

/** Wire format of one cart line — the only thing the client ever sends. */
export interface CartLine {
  kind: CartLineKind;
  slug: string;
  qty: number;
}

export const MAX_LINE_QTY = 50;
export const MAX_CART_LINES = 40;

export interface PricedLine extends CartLine {
  entry: CatalogEntry;
  lineTotal: number;
}

export interface CartTotals {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  /** PHP still needed to reach free delivery; 0 once unlocked. */
  freeDeliveryRemaining: number;
  freeDeliveryProgress: number;
}

/**
 * Resolve and price cart lines against the catalog. Unknown slugs are dropped
 * (the menu can change between visits), duplicate lines are merged, and
 * quantities are clamped — so the result is always safe to display or bill.
 */
export function priceCart(lines: readonly CartLine[]): CartTotals {
  const merged = new Map<string, PricedLine>();

  for (const line of lines) {
    const entry = getCatalogEntry(line.kind, line.slug);
    const qty = Math.trunc(line.qty);
    if (!entry || !Number.isFinite(qty) || qty < 1) continue;

    const key = `${line.kind}:${line.slug}`;
    const prevQty = merged.get(key)?.qty ?? 0;
    const nextQty = Math.min(prevQty + qty, MAX_LINE_QTY);
    merged.set(key, {
      kind: line.kind,
      slug: line.slug,
      qty: nextQty,
      entry,
      lineTotal: entry.price * nextQty,
    });
  }

  const priced = Array.from(merged.values());
  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = priced.reduce((sum, l) => sum + l.qty, 0);
  const threshold = siteConfig.ordering.freeDeliveryThreshold;

  return {
    lines: priced,
    itemCount,
    subtotal,
    freeDeliveryRemaining: Math.max(0, threshold - subtotal),
    freeDeliveryProgress: threshold > 0 ? Math.min(1, subtotal / threshold) : 1,
  };
}
