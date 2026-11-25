"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

/** Header cart button with a live count badge. */
export function CartButton({ className }: { className?: string }) {
  const { itemCount, hydrated, openSheet } = useCart();
  const count = hydrated ? itemCount : 0;
  return (
    <button
      type="button"
      onClick={openSheet}
      aria-haspopup="dialog"
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {count > 0 ? (
        <span className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white ring-2 ring-background">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
