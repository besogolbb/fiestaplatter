"use client";

import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { FlagString } from "@/components/cart/flag-string";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Floating cart bar — the signature of the ordering app. Appears as soon as
 * the cart has something in it, shows the bunting filling up, the total, and
 * the next step (free delivery gap, then View cart). Hidden on checkout,
 * where the order summary takes over.
 */
export function CartBar() {
  const pathname = usePathname();
  const { hydrated, itemCount, subtotal, lines, freeDeliveryRemaining, openSheet, sheetOpen, announcement } =
    useCart();

  const onCheckout = pathname.startsWith("/order");
  const visible = hydrated && itemCount > 0 && !onCheckout && !sheetOpen;

  return (
    <>
      {/* Polite announcements for add / remove, independent of the bar's visibility. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ease-out md:px-6",
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        <button
          type="button"
          onClick={openSheet}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          aria-haspopup="dialog"
          className="pointer-events-auto mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-left text-white shadow-[0_14px_32px_-10px_rgba(90,40,4,0.65)] transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          <span className="min-w-0 flex-1">
            <FlagString lines={lines} max={10} />
            <span className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-lg font-extrabold leading-none">
                {itemCount} {itemCount === 1 ? "item" : "items"} · View cart
              </span>
            </span>
            <span className="mt-1 block truncate text-xs font-semibold text-white/90">
              {freeDeliveryRemaining > 0
                ? `Add ${formatPrice(freeDeliveryRemaining)} more for free delivery`
                : "Free delivery unlocked"}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="tabular font-display text-2xl font-extrabold leading-none">
              {formatPrice(subtotal)}
            </span>
            <ChevronUp className="h-5 w-5" aria-hidden />
          </span>
        </button>
      </div>
    </>
  );
}
