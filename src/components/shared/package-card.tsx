import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { PackageItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: PackageItem }) {
  const saving = pkg.compareAtPrice ? pkg.compareAtPrice - pkg.price : 0;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        pkg.featured ? "border-brand ring-2 ring-brand/20" : "border-black/5",
      )}
    >
      {pkg.featured ? (
        <div className="bg-brand py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white">
          ⭐ Most Popular Choice
        </div>
      ) : null}

      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cream to-accent/10">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 drop-shadow-md"
        />
        {pkg.badge ? (
          <Badge variant="accent" className="absolute left-3 top-3 shadow-sm">
            {pkg.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-extrabold text-ink">{pkg.name}</h3>
        <p className="text-sm font-medium text-accent-600">{pkg.audience}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{pkg.description}</p>

        <ul className="mt-4 space-y-2" aria-label={`Included in ${pkg.name}`}>
          {pkg.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2 text-sm text-ink/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span>{inc}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-dashed border-black/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {pkg.serving}
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-display text-3xl font-extrabold text-brand">
              {formatPrice(pkg.price)}
            </span>
            {pkg.compareAtPrice ? (
              <span className="mb-1 text-sm text-ink/40 line-through">
                {formatPrice(pkg.compareAtPrice)}
              </span>
            ) : null}
          </div>
          {saving > 0 ? (
            <p className="mt-1 text-xs font-bold text-green-600">
              You save {formatPrice(saving)}
            </p>
          ) : null}
        </div>

        <Button
          asChild
          className="mt-5 w-full"
          size="lg"
          variant={pkg.featured ? "default" : "outline"}
        >
          <Link href={`/order?package=${pkg.slug}`}>Order {pkg.name}</Link>
        </Button>
      </div>
    </article>
  );
}
