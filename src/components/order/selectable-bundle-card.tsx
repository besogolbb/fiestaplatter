import Image from "next/image";
import { Check, Users, Wrench } from "lucide-react";
import type { PackageItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

interface SelectableBundleCardProps {
  pkg: PackageItem;
  active: boolean;
  onSelect: () => void;
}

/**
 * A clickable bundle card matching the visual language of the /packages
 * PackageCard (image, badge, includes, price) but used for in-form
 * selection instead of linking out. Tapping anywhere selects the bundle.
 */
export function SelectableBundleCard({ pkg, active, onSelect }: SelectableBundleCardProps) {
  const saving = pkg.compareAtPrice ? pkg.compareAtPrice - pkg.price : 0;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        active ? "border-brand ring-2 ring-brand/30" : "border-border hover:border-brand/40",
      )}
    >
      <span
        className={cn(
          "absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm",
          active ? "border-brand bg-brand text-white" : "border-white/80 bg-black/30 text-transparent",
        )}
        aria-hidden
      >
        <Check className="h-4 w-4" />
      </span>

      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-accent/10">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {pkg.badge ? (
          <Badge variant="accent" className="absolute left-3 top-3 shadow-md">
            {pkg.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-base font-extrabold text-foreground">{pkg.name}</p>
        <p className="text-xs font-semibold text-brand">{pkg.audience}</p>

        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground/70">
          <Users className="h-3.5 w-3.5 text-brand" /> {pkg.serving}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
          <span className="font-semibold text-foreground/80">Includes:</span>{" "}
          {pkg.includes.join(" · ")}
        </p>

        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-xl font-extrabold text-brand">
            {formatPrice(pkg.price)}
          </span>
          {pkg.compareAtPrice ? (
            <span className="mb-0.5 text-xs text-foreground/70 line-through">
              {formatPrice(pkg.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {saving > 0 ? (
          <p className="text-xs font-bold text-green-500">You save {formatPrice(saving)}</p>
        ) : null}
      </div>
    </button>
  );
}

/** The "build your own" tile, styled to match the bundle cards. */
export function CustomizeBundleCard({ active, onSelect }: { active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        active ? "border-brand ring-2 ring-brand/30 bg-brand/5" : "border-border hover:border-brand/40",
      )}
    >
      <span
        className={cn(
          "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2",
          active ? "border-brand bg-brand text-white" : "border-border text-transparent",
        )}
        aria-hidden
      >
        <Check className="h-4 w-4" />
      </span>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Wrench className="h-6 w-6" />
      </span>
      <p className="font-display text-base font-extrabold text-foreground">Customize Bundle</p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-foreground/70">
        Build your own — pick exactly the trays you want.
      </p>
    </button>
  );
}
