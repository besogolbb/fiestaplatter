"use client";

import Image from "next/image";
import { Flame, Star, Users } from "lucide-react";
import type { CatalogEntry } from "@/lib/cart/catalog";
import { AddToCart } from "@/components/cart/add-to-cart";
import { formatPrice } from "@/lib/utils";

/** "Good for 8–10 pax" out of a serving string like '12" Bilao · good for 8–10 pax'. */
export function paxLabel(serving: string): string {
  const match = serving.match(/good for ([^·]+)/i);
  return match ? `${match[1].trim()}` : serving;
}

interface MenuCardProps {
  entry: CatalogEntry;
  onOpen: (entry: CatalogEntry) => void;
  priority?: boolean;
}

/**
 * Store card: photo, name, pax and price, with the add control in the corner.
 * The photo and name open the full details sheet; the + adds straight away.
 */
export function MenuCard({ entry, onOpen, priority }: MenuCardProps) {
  const flag = entry.bestSeller ? "Best seller" : entry.popular ? "Popular" : entry.badge;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-[0_10px_28px_-14px_rgba(40,20,4,0.45)]">
      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        aria-label={`${entry.name} details`}
      >
        <Image
          src={entry.image}
          alt={entry.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
          priority={priority}
        />
        {flag ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-1 text-[11px] font-bold text-foreground shadow-sm">
            {entry.bestSeller ? (
              <Flame className="h-3 w-3 text-brand" aria-hidden />
            ) : entry.popular ? (
              <Star className="h-3 w-3 text-brand" aria-hidden />
            ) : null}
            {flag}
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="font-display text-[15px] font-bold leading-snug sm:text-base">
          <button
            type="button"
            onClick={() => onOpen(entry)}
            className="text-left hover:text-brand focus-visible:outline-none focus-visible:underline"
          >
            {entry.name}
          </button>
        </h3>
        <p className="flex items-center gap-1 text-xs text-foreground/70">
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{paxLabel(entry.serving)}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <div className="leading-none">
            <span className="tabular font-display text-lg font-extrabold sm:text-xl">{formatPrice(entry.price)}</span>
            {entry.compareAtPrice ? (
              <span className="tabular ml-1.5 text-xs text-foreground/70 line-through">
                {formatPrice(entry.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <AddToCart kind={entry.kind} slug={entry.slug} />
        </div>
      </div>
    </article>
  );
}
