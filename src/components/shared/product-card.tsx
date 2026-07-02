import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Users, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  item: MenuItem;
  /** Priority-load the image (use for above-the-fold best sellers). */
  priority?: boolean;
}

export function ProductCard({ item, priority = false }: ProductCardProps) {
  // pull the "good for X pax" out of the serving string for the meta row
  const paxMatch = item.serving.match(/good for ([^·]+)/i);
  const pax = paxMatch ? paxMatch[1].trim() : item.serving;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-accent/10">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {item.bestSeller ? (
            <Badge variant="default" className="shadow-md">
              <Flame className="h-3 w-3" /> Best Seller
            </Badge>
          ) : null}
          {item.popular && !item.bestSeller ? (
            <Badge variant="accent" className="shadow-md">
              <Star className="h-3 w-3" /> Popular
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-extrabold leading-tight text-foreground">
          {item.name}
        </h3>
        {item.shortName ? (
          <p className="font-display text-sm font-bold text-brand">{item.shortName}</p>
        ) : null}

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground/60">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-brand" aria-hidden /> {pax}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UtensilsCrossed className="h-4 w-4 text-brand" aria-hidden /> Ready to serve
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand px-4 py-1.5 font-display text-lg font-extrabold text-white shadow-sm shadow-brand/30">
            {formatPrice(item.price)}
          </span>
          {item.unitPrice ? (
            <span className="text-xs text-foreground/50">
              {formatPrice(item.unitPrice.amount)} {item.unitPrice.unit}
            </span>
          ) : null}
        </div>

        <Button asChild className="mt-4 w-full" size="sm">
          <Link href={`/order?item=${item.slug}`}>Quick Order</Link>
        </Button>
      </div>
    </article>
  );
}
