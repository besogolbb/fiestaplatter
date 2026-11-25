"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { earliestDeliveryDate, formatDeliveryDate, isValidDeliveryDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * Delivery date picked up front, the way a delivery app asks for your
 * address first. Stored with the cart and carried into checkout.
 */
export function DeliveryDateChip({ className }: { className?: string }) {
  const { deliveryDate, setDeliveryDate, hydrated } = useCart();
  // Computed on the client only — the server's "today" may differ from Manila's.
  const [min, setMin] = useState("");
  useEffect(() => setMin(earliestDeliveryDate()), []);

  const valid = hydrated && deliveryDate && min && isValidDeliveryDate(deliveryDate);

  return (
    <label
      className={cn(
        "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2",
        valid ? "border-foreground bg-foreground text-background" : "border-brand bg-card text-brand hover:bg-brand/5",
        className,
      )}
    >
      <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
      <span>{valid ? `Deliver ${formatDeliveryDate(deliveryDate)}` : "Set delivery date"}</span>
      <span className="sr-only">(choose a date at least one day ahead)</span>
      <input
        type="date"
        min={min || undefined}
        value={valid ? deliveryDate : ""}
        onChange={(e) => setDeliveryDate(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            // Older browsers open the picker on focus instead.
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  );
}
