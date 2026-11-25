import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  className?: string;
  /** Struck-through "was" price: plain, muted. */
  strike?: boolean;
}

const numberFormat = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 });

/**
 * Retail-style price: Manrope tabular numerals with a smaller, raised ₱ set in
 * Figtree (Manrope has no peso sign). Reads as "₱499" to screen readers.
 */
export function Price({ amount, className, strike }: PriceProps) {
  const symbol = siteConfig.ordering.currencySymbol;
  const value = numberFormat.format(amount);
  if (strike) {
    return <s className={cn("font-price tabular text-foreground/70", className)}>{`${symbol}${value}`}</s>;
  }
  return (
    <span className={cn("inline-flex items-start leading-none", className)}>
      <span className="sr-only">{`${symbol}${value}`}</span>
      <span aria-hidden className="mr-[0.08em] mt-[0.14em] font-sans text-[0.62em] font-semibold">
        {symbol}
      </span>
      <span aria-hidden className="font-price tabular font-extrabold tracking-[-0.03em]">
        {value}
      </span>
    </span>
  );
}
