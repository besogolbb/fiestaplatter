import type { FlagColor } from "@/lib/cart/catalog";
import { cn } from "@/lib/utils";

export const flagFill: Record<FlagColor, string> = {
  magenta: "fill-flag-magenta",
  yellow: "fill-flag-yellow",
  green: "fill-flag-green",
  blue: "fill-flag-blue",
  orange: "fill-flag-orange",
};

export const flagBg: Record<FlagColor, string> = {
  magenta: "bg-flag-magenta",
  yellow: "bg-flag-yellow",
  green: "bg-flag-green",
  blue: "bg-flag-blue",
  orange: "bg-flag-orange",
};

interface PennantProps {
  color: FlagColor;
  className?: string;
}

/**
 * One banderita: a cloth triangle hung by its top edge. The slight belly on
 * the sides and the darker hem read as fabric, not a geometric icon.
 * Decorative — callers carry the meaning in text.
 */
export function Pennant({ color, className }: PennantProps) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden focusable="false" className={cn("block", className)}>
      <path
        d="M1 1.5 H23 Q21.4 9 12.6 28.6 Q12 29.6 11.4 28.6 Q2.6 9 1 1.5 Z"
        className={flagFill[color]}
      />
      <path d="M1 1.5 H23 V4 H1.2 Z" className="fill-black/20" />
    </svg>
  );
}
