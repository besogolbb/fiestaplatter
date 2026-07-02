import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChefHat, Truck, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { heroProduct } from "@/data/menu";
import { formatPrice } from "@/lib/utils";

export function Hero() {
  const { ordering } = siteConfig;

  return (
    <section className="relative overflow-hidden bg-warm">
      <div className="container grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-sm font-semibold text-brand">
            <ChefHat className="h-4 w-4" />
            Home-cooked recipes, made fresh to order
          </span>

          <h1 className="mt-5 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Made for <span className="text-brand">Every Occasion</span>
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/70">
            Premium homemade Filipino party trays, prepared fresh for birthdays, family
            gatherings, office celebrations, reunions and special occasions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-md">
              <Link href="/order">
                Order Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/packages">View Bundle Packages</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground/70">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-brand" /> Freshly cooked daily
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand" /> On-time delivery
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand" /> Generous servings
            </li>
          </ul>
        </div>

        {/* Visual — signature product */}
        <div className="relative mx-auto mt-6 w-full max-w-lg sm:mt-8 sm:pb-6">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand/25 via-accent/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-black/20 dark:shadow-black/50">
            <div className="relative aspect-[4/5]">
              <Image
                src={heroProduct.image}
                alt={heroProduct.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Signature tag */}
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                ⭐ Signature
              </span>

              {/* Product label */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-extrabold text-white drop-shadow">
                    {heroProduct.name}
                  </p>
                  <p className="text-sm text-white/80">{heroProduct.shortName}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 font-display text-lg font-extrabold text-ink shadow-md">
                  {formatPrice(heroProduct.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Floating delivery-threshold chip — bottom-left, dropped clear below the image so it never meets the price tag */}
          <div className="absolute -bottom-6 -left-4 z-10 hidden items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-center shadow-xl sm:flex">
            <Truck className="h-5 w-5 shrink-0 text-brand" aria-hidden />
            <div className="text-left">
              <p className="font-display text-base font-extrabold leading-tight text-brand">
                {formatPrice(ordering.freeDeliveryThreshold)}+
              </p>
              <p className="text-xs font-medium leading-tight text-foreground/60">free delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
