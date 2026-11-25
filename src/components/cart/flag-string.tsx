"use client";

import { sectionFor } from "@/lib/cart/catalog";
import type { PricedLine } from "@/lib/cart/pricing";
import { Pennant } from "@/components/cart/pennant";
import { cn } from "@/lib/utils";

interface FlagStringProps {
  lines: PricedLine[];
  /** Max flags drawn before collapsing into "+n". */
  max?: number;
  className?: string;
  /** Colour of the string itself. */
  tone?: "light" | "dark";
}

/**
 * The cart drawn as bunting: one pennant per tray, coloured by its menu
 * section, hung on a sagging string. Newly added flags swing into place.
 */
export function FlagString({ lines, max = 12, className, tone = "light" }: FlagStringProps) {
  const flags = lines.flatMap((l) =>
    Array.from({ length: l.qty }, (_, i) => ({
      key: `${l.kind}:${l.slug}:${i}`,
      color: sectionFor(l.entry.section).flag,
    })),
  );
  const shown = flags.slice(0, max);
  const extra = flags.length - shown.length;

  return (
    <div aria-hidden className={cn("relative flex h-5 items-start gap-[3px] pl-1", className)}>
      <span
        className={cn(
          "absolute inset-x-0 top-[1px] h-px",
          tone === "light" ? "bg-white/60" : "bg-foreground/40",
        )}
      />
      {shown.map((f) => (
        <Pennant
          key={f.key}
          color={f.color}
          className="relative h-[18px] w-[14px] origin-top animate-flag-hang"
        />
      ))}
      {extra > 0 ? (
        <span
          className={cn(
            "relative -mt-0.5 text-[11px] font-bold",
            tone === "light" ? "text-white" : "text-foreground/80",
          )}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
