import Image from "next/image";
import { Pencil, Wrench } from "lucide-react";
import type { PackageItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface SelectedBundleSummaryProps {
  pkg: PackageItem | undefined;
  isCustom: boolean;
  onChange: () => void;
}

/**
 * A compact "floating" card that carries the Step 1 selection forward —
 * shows what's chosen (or that the customer is building a custom order)
 * with a one-tap way back to change it, so the choice is never lost.
 */
export function SelectedBundleSummary({ pkg, isCustom, onChange }: SelectedBundleSummaryProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-3 shadow-sm">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-muted to-accent/10">
        {pkg ? (
          <Image src={pkg.image} alt={pkg.imageAlt} fill sizes="56px" className="object-contain p-1" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-brand">
            <Wrench className="h-6 w-6" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {isCustom ? "Your Selection" : "Selected Bundle"}
        </p>
        <p className="truncate font-display text-sm font-bold text-foreground">
          {pkg ? pkg.name : "Custom Order"}
        </p>
        {pkg ? (
          <p className="text-xs text-foreground/60">{formatPrice(pkg.price)}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onChange}
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/30 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
      >
        <Pencil className="h-3.5 w-3.5" /> Change
      </button>
    </div>
  );
}
