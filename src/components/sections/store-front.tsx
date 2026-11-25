import Image from "next/image";
import { CalendarClock, CreditCard, MapPin, Truck } from "lucide-react";
import { StoreMenu } from "@/components/menu/store-menu";
import { DeliveryDateChip } from "@/components/menu/delivery-date-chip";
import { siteConfig } from "@/config/site";
import { getPackage } from "@/data/packages";
import { formatPrice } from "@/lib/utils";

const cover = getPackage("ultimate-fiesta");

/**
 * Homepage store front, the way a delivery app opens a restaurant: a short
 * banner (cover strip, name, delivery date, the ordering rules) and then the
 * menu itself, so the first cards and their + buttons sit in the first
 * screen on a phone. Marketing sections follow the menu, not precede it.
 */
export function StoreFront() {
  const { ordering, location } = siteConfig;
  const facts = [
    { icon: CalendarClock, text: `Order ${ordering.minLeadTimeHours}h ahead` },
    { icon: Truck, text: `Free delivery over ${formatPrice(ordering.freeDeliveryThreshold)}` },
    { icon: CreditCard, text: `${ordering.paymentMethods.slice(0, 2).join(" / ")} after we confirm` },
  ];

  return (
    <>
      <section aria-labelledby="store-title" className="container pt-2 sm:pt-4">
        {cover ? (
          <div className="relative h-24 overflow-hidden rounded-2xl bg-muted sm:h-36 lg:h-44">
            <Image
              src={cover.image}
              alt={cover.imageAlt}
              fill
              priority
              fetchPriority="high"
              quality={70}
              sizes="(max-width: 1280px) 100vw, 1248px"
              className="object-cover object-[center_60%]"
            />
          </div>
        ) : null}

        <div className="mt-3 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 id="store-title" className="font-display text-[1.7rem] font-extrabold leading-none tracking-tight sm:text-4xl">
              {siteConfig.name}
              <span className="mt-1.5 block font-sans text-sm font-semibold tracking-normal text-foreground/70 sm:text-lg">
                Filipino party trays · {siteConfig.tagline.toLowerCase()}
              </span>
            </h1>
            <p className="mt-1 flex items-center gap-1 text-xs text-foreground/70 sm:text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
              Home kitchen in {location.city}, {location.region}
            </p>
          </div>
          <DeliveryDateChip className="self-start sm:self-auto" />
        </div>

        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-foreground/80 sm:mt-4">
          {facts.map((f) => (
            <li key={f.text} className="inline-flex items-center gap-1.5">
              <f.icon className="h-3.5 w-3.5 text-brand" aria-hidden /> {f.text}
            </li>
          ))}
        </ul>
      </section>

      <section id="order" aria-label="Menu" className="mt-3 scroll-mt-16">
        <StoreMenu />
      </section>
    </>
  );
}
