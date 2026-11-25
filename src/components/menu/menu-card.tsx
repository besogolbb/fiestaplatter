"use client";

import Image from "next/image";
import { Flame, Star, Users } from "lucide-react";
import type { CatalogEntry } from "@/lib/cart/catalog";
import { AddToCart } from "@/components/cart/add-to-cart";
import { Price } from "@/components/shared/price";

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

const MAX_TILT_DEG = 4;

/** Tilt the tile toward the mouse (fine pointers only, never with reduced motion). Writes CSS vars — no re-render. */
function handleTilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
}

function resetTilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

/**
 * Apple TV-style store card: the whole card (inset photo, name, pax, price
 * and +) is one floating tile with a deep shadow that lifts and tilts toward
 * the pointer, with light following the cursor across the photo.
 */
export function MenuCard({ entry, onOpen, priority }: MenuCardProps) {
  const flag = entry.bestSeller ? "Best seller" : entry.popular ? "Popular" : entry.badge;
  return (
    <article
      onPointerMove={handleTilt}
      onPointerLeave={resetTilt}
      className="tv-tile group flex h-full flex-col rounded-[1.5rem] bg-card p-2 dark:ring-1 dark:ring-white/10"
    >
      <button
        type="button"
        onClick={() => onOpen(entry)}
        aria-label={`${entry.name} details`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-[1.05rem] bg-muted text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/60"
      >
        <Image
          src={entry.image}
          alt={entry.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05]"
          priority={priority}
        />
        <span aria-hidden className="tv-tile-shine" />
        {/* Hairline inner edge, like a glass tile catching light. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/25" />
        {flag ? (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {entry.bestSeller ? (
              <Flame className="h-3 w-3" aria-hidden />
            ) : entry.popular ? (
              <Star className="h-3 w-3" aria-hidden />
            ) : null}
            {flag}
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3 sm:px-2">
        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] sm:text-base">
          <button
            type="button"
            onClick={() => onOpen(entry)}
            className="text-left hover:text-brand focus-visible:outline-none focus-visible:underline"
          >
            {entry.name}
          </button>
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/70">
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{paxLabel(entry.serving)}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <Price amount={entry.price} className="text-[1.375rem] sm:text-2xl" />
            {entry.compareAtPrice ? <Price amount={entry.compareAtPrice} strike className="text-xs" /> : null}
          </div>
          <AddToCart kind={entry.kind} slug={entry.slug} />
        </div>
      </div>
    </article>
  );
}
