import type { Metadata } from "next";
import { Clock, CreditCard, MapPin, Truck } from "lucide-react";
import { StoreMenu } from "@/components/menu/store-menu";
import { DeliveryDateChip } from "@/components/menu/delivery-date-chip";
import { JsonLd } from "@/components/shared/json-ld";
import { menuSchema } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Order Party Trays Online — Menu & Prices",
  description:
    "Order Fiesta Platter party trays online: bundles, bilao, siomai, lumpia, pork BBQ, kakanin and bento. Add to cart, pick your delivery date and confirm on Messenger.",
  path: "/menu",
});

export default function MenuPage() {
  const { ordering, location } = siteConfig;
  const facts = [
    { icon: Clock, text: `Order ${ordering.minLeadTimeHours}h ahead` },
    { icon: Truck, text: `Free delivery over ${formatPrice(ordering.freeDeliveryThreshold)}` },
    { icon: CreditCard, text: `${ordering.paymentMethods.slice(0, 2).join(" / ")} after we confirm` },
  ];

  return (
    <>
      <div className="container pb-4 pt-4 sm:pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Order party trays
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              Home kitchen in {location.city}, {location.region} · cooked fresh on your date
            </p>
          </div>
          <DeliveryDateChip className="self-start sm:self-auto" />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-foreground/80">
          {facts.map((f) => (
            <li key={f.text} className="inline-flex items-center gap-1.5">
              <f.icon className="h-3.5 w-3.5 text-brand" aria-hidden /> {f.text}
            </li>
          ))}
        </ul>
      </div>

      <StoreMenu />
      <JsonLd data={menuSchema()} />
    </>
  );
}
