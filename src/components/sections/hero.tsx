import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Truck, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { bestSellers } from "@/data/menu";

export function Hero() {
  const { stats } = siteConfig;
  const heroItem = bestSellers[0];

  return (
    <section className="relative overflow-hidden bg-warm">
      <div className="container grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-8 lg:py-20">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/60 px-3.5 py-1.5 text-sm font-semibold text-brand shadow-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {stats.ratingValue} rating from {stats.ratingCount}+ happy customers
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/70">
            Freshly prepared Filipino favorites — perfect for birthdays, family gatherings,
            office events, and special occasions. Ordered in minutes, delivered on time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-md">
              <Link href="/order">
                Order Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/70">
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

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/25 to-brand/10 blur-2xl" />
            {heroItem ? (
              <Image
                src={heroItem.image}
                alt={heroItem.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="animate-float object-contain drop-shadow-2xl"
              />
            ) : null}
          </div>

          {/* Floating proof chips */}
          <div className="absolute -left-2 top-6 flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:left-4">
            <StarRating rating={stats.ratingValue} size={14} />
            <span className="text-sm font-bold text-ink">{stats.ratingValue}</span>
          </div>
          <div className="absolute -right-1 bottom-8 rounded-2xl bg-white/95 px-4 py-3 text-center shadow-lg backdrop-blur sm:right-2">
            <p className="font-display text-xl font-extrabold text-brand">{stats.ordersServed}</p>
            <p className="text-xs font-medium text-ink/60">orders served</p>
          </div>
        </div>
      </div>
    </section>
  );
}
