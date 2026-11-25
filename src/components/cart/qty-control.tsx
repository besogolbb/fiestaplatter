"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_LINE_QTY } from "@/lib/cart/pricing";
import { cn } from "@/lib/utils";

interface QtyStepperProps {
  name: string;
  qty: number;
  onChange: (qty: number) => void;
  /** Allow stepping down to 0 (removes the line) — shows a bin at qty 1. */
  allowZero?: boolean;
  size?: "md" | "lg";
  className?: string;
}

/** − n + stepper. Being in the cart reads by shape, not by colour alone. */
export function QtyStepper({ name, qty, onChange, allowZero = true, size = "md", className }: QtyStepperProps) {
  const btn = size === "lg" ? "h-12 w-12" : "h-11 w-11";
  const removing = allowZero && qty <= 1;
  return (
    <div
      role="group"
      aria-label={`${name} quantity`}
      className={cn(
        "inline-flex items-center rounded-full border-2 border-brand bg-card text-brand",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={!allowZero && qty <= 1}
        aria-label={removing ? `Remove ${name}` : `One less ${name}`}
        className={cn(
          btn,
          "flex items-center justify-center rounded-full transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40",
        )}
      >
        {removing ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>
      <span className="tabular min-w-[1.75rem] text-center font-display text-lg font-extrabold leading-none text-foreground">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= MAX_LINE_QTY}
        aria-label={`One more ${name}`}
        className={cn(
          btn,
          "flex items-center justify-center rounded-full transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40",
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
