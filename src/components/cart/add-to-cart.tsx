"use client";

import { Plus } from "lucide-react";
import type { CartLineKind } from "@/lib/cart/catalog";
import { getCatalogEntry } from "@/lib/cart/catalog";
import { useCart } from "@/components/cart/cart-provider";
import { QtyStepper } from "@/components/cart/qty-control";
import { cn, formatPrice } from "@/lib/utils";

interface AddToCartProps {
  kind: CartLineKind;
  slug: string;
  /** "round": compact + on cards. "wide": full-width button on bundle cards. */
  variant?: "round" | "wide";
  className?: string;
}

/**
 * The one add control used everywhere a product appears. A round + becomes a
 * − n + stepper once the item is in the cart.
 */
export function AddToCart({ kind, slug, variant = "round", className }: AddToCartProps) {
  const { qtyOf, add, setQty, hydrated } = useCart();
  const entry = getCatalogEntry(kind, slug);
  if (!entry) return null;
  const qty = hydrated ? qtyOf(kind, slug) : 0;

  if (qty > 0) {
    return (
      <QtyStepper
        name={entry.name}
        qty={qty}
        onChange={(n) => setQty(kind, slug, n)}
        size={variant === "wide" ? "lg" : "md"}
        className={cn(
          // Narrow phone cards: the stepper takes its own full-width row.
          variant === "wide" ? "w-full justify-between" : "max-sm:w-full max-sm:justify-between",
          className,
        )}
      />
    );
  }

  if (variant === "wide") {
    return (
      <button
        type="button"
        onClick={() => add(kind, slug)}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-bold text-white shadow-[0_6px_16px_-6px_rgba(175,83,8,0.6)] transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-safe:active:scale-[0.98]",
          className,
        )}
      >
        <Plus className="h-5 w-5" /> Add to cart · {formatPrice(entry.price)}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(kind, slug)}
      aria-label={`Add ${entry.name} to cart`}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_6px_14px_-6px_rgba(175,83,8,0.7)] transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 motion-safe:active:scale-95",
        className,
      )}
    >
      <Plus className="h-5 w-5" strokeWidth={2.75} />
    </button>
  );
}
