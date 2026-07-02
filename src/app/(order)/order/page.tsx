import type { Metadata } from "next";
import { Truck, Clock, CreditCard } from "lucide-react";
import { OrderForm } from "@/components/order/order-form";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { getPackage } from "@/data/packages";
import { getMenuItem } from "@/data/menu";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Order Now — Reserve Your Party Trays",
    description:
      "Place your Fiesta Platter order in minutes. Choose a package, pick your delivery date and time, and we'll confirm your reservation via Messenger.",
    path: "/order",
  }),
  robots: { index: true, follow: true },
};

interface OrderPageProps {
  searchParams: Promise<{ package?: string; item?: string }>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;

  // Prefill package from ?package= or infer from ?item=
  const pkg = params.package ? getPackage(params.package) : undefined;
  const item = params.item ? getMenuItem(params.item) : undefined;
  const defaultPackage = pkg?.slug ?? (item ? "custom" : undefined);
  const defaultItems = item ? [item.slug] : [];

  const assurances = [
    { icon: Clock, text: `Book ${siteConfig.ordering.minLeadTimeHours}h ahead` },
    { icon: Truck, text: "On-time delivery" },
    { icon: CreditCard, text: siteConfig.ordering.paymentMethods.slice(0, 2).join(" / ") },
  ];

  return (
    <div className="py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Reserve Your Party Trays
          </h1>
          <p className="mt-3 text-pretty text-foreground/70">
            Fill in a few details and we&apos;ll confirm your order and delivery schedule.
            {item ? (
              <>
                {" "}
                We&apos;ve added <strong className="text-brand">{item.name}</strong> to get
                you started.
              </>
            ) : null}
            {pkg ? (
              <>
                {" "}
                You picked the <strong className="text-brand">{pkg.name}</strong> — great
                choice!
              </>
            ) : null}
          </p>

          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-foreground/70">
            {assurances.map((a) => (
              <li key={a.text} className="inline-flex items-center gap-1.5">
                <a.icon className="h-4 w-4 text-brand" aria-hidden /> {a.text}
              </li>
            ))}
          </ul>
        </div>

        <OrderForm defaultPackage={defaultPackage} defaultItems={defaultItems} />
      </div>
    </div>
  );
}
