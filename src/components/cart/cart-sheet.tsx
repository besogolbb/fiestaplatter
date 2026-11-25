"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { sectionFor } from "@/lib/cart/catalog";
import { useCart } from "@/components/cart/cart-provider";
import { QtyStepper } from "@/components/cart/qty-control";
import { FlagString } from "@/components/cart/flag-string";
import { Pennant } from "@/components/cart/pennant";
import { Sheet } from "@/components/ui/sheet";
import { cn, formatPrice } from "@/lib/utils";

export function FreeDeliveryMeter({ className }: { className?: string }) {
  const { freeDeliveryRemaining, freeDeliveryProgress } = useCart();
  const unlocked = freeDeliveryRemaining === 0;
  return (
    <div className={cn("rounded-2xl bg-muted px-4 py-3", className)}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className={cn("h-4 w-4 shrink-0", unlocked ? "text-success" : "text-brand")} aria-hidden />
        {unlocked ? (
          <span className="text-success">Free delivery unlocked</span>
        ) : (
          <span>
            Add <strong className="tabular text-brand">{formatPrice(freeDeliveryRemaining)}</strong> more
            for free delivery
          </span>
        )}
      </p>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={siteConfig.ordering.freeDeliveryThreshold}
        aria-valuenow={Math.round(freeDeliveryProgress * siteConfig.ordering.freeDeliveryThreshold)}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            unlocked ? "bg-success" : "bg-brand",
          )}
          style={{ width: `${Math.round(freeDeliveryProgress * 100)}%` }}
        />
      </div>
    </div>
  );
}

/** The cart, opened from the cart bar or the header cart button. */
export function CartSheet() {
  const { sheetOpen, closeSheet, lines, itemCount, subtotal, setQty } = useCart();

  return (
    <Sheet
      open={sheetOpen}
      onClose={closeSheet}
      title={itemCount > 0 ? `Your order · ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Your order"}
      footer={
        itemCount > 0 ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-foreground/70">Subtotal</span>
              <span className="tabular font-display text-2xl font-extrabold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/order"
              onClick={closeSheet}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              Checkout <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <p className="text-center text-xs text-foreground/70">
              No payment yet. We confirm your order on Messenger first.{" "}
              {siteConfig.ordering.downpaymentNote}
            </p>
          </div>
        ) : null
      }
    >
      {itemCount === 0 ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="flex gap-1" aria-hidden>
            <Pennant color="magenta" className="h-9 w-7" />
            <Pennant color="yellow" className="h-9 w-7" />
            <Pennant color="green" className="h-9 w-7" />
          </div>
          <p className="mt-5 font-display text-xl font-extrabold">No trays yet</p>
          <p className="mt-1 max-w-xs text-sm text-foreground/70">
            Add bundles, bilao trays and add-ons from the menu. Your order builds up here.
          </p>
          <Link
            href="/menu"
            onClick={closeSheet}
            className="mt-6 inline-flex h-12 items-center rounded-full bg-brand px-6 font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="px-5 py-4">
          <FlagString lines={lines} max={24} tone="dark" className="mb-4" />
          <ul className="divide-y divide-border">
            {lines.map((l) => {
              const section = sectionFor(l.entry.section);
              return (
                <li key={`${l.kind}:${l.slug}`} className="flex gap-3 py-3.5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={l.entry.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70">
                      <Pennant color={section.flag} className="h-3.5 w-2.5" />
                      {section.short}
                    </p>
                    <p className="font-display text-base font-bold leading-tight">{l.entry.name}</p>
                    <p className="tabular text-xs text-foreground/70">{formatPrice(l.entry.price)} each</p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <span className="tabular font-display text-base font-extrabold">{formatPrice(l.lineTotal)}</span>
                    <QtyStepper name={l.entry.name} qty={l.qty} onChange={(n) => setQty(l.kind, l.slug, n)} />
                  </div>
                </li>
              );
            })}
          </ul>
          <FreeDeliveryMeter className="mt-4" />
          <Link
            href="/menu"
            onClick={closeSheet}
            className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-brand underline-offset-4 hover:underline"
          >
            + Add more trays
          </Link>
        </div>
      )}
    </Sheet>
  );
}
