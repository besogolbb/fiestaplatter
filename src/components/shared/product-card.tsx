import Image from "next/image";
import Link from "next/link";
import { Flame, Star } from "lucide-react";
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
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream to-accent/10">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
          priority={priority}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {item.bestSeller ? (
            <Badge variant="default" className="shadow-sm">
              <Flame className="h-3 w-3" /> Best Seller
            </Badge>
          ) : null}
          {item.popular && !item.bestSeller ? (
            <Badge variant="accent" className="shadow-sm">
              <Star className="h-3 w-3" /> Popular
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold leading-tight text-ink">
              {item.name}
            </h3>
            {item.shortName ? (
              <p className="text-sm text-ink/50">{item.shortName}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-right">
            <span className="block font-display text-xl font-extrabold text-brand">
              {formatPrice(item.price)}
            </span>
            {item.unitPrice ? (
              <span className="text-xs text-ink/50">
                {formatPrice(item.unitPrice.amount)} {item.unitPrice.unit}
              </span>
            ) : null}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/70">
          {item.description}
        </p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent-600">
          {item.serving}
        </p>

        <Button asChild className="mt-4 w-full" size="sm">
          <Link href={`/order?item=${item.slug}`}>Quick Order</Link>
        </Button>
      </div>
    </article>
  );
}
