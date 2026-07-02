import { Flame, CalendarClock, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

/**
 * Honest, verifiable claims only — no order counts/tenure/customer numbers
 * until we actually have real ones to report. Every value here comes
 * straight from the ordering rules in siteConfig, not a placeholder stat.
 */
export function TrustBar() {
  const { ordering } = siteConfig;
  const items = [
    { icon: Flame, value: "Fresh", label: "Cooked to order, never frozen" },
    {
      icon: CalendarClock,
      value: `${ordering.minLeadTimeHours}-Hr`,
      label: "Advance booking",
    },
    {
      icon: Truck,
      value: `${formatPrice(ordering.freeDeliveryThreshold)}+`,
      label: "Free delivery",
    },
  ];

  return (
    <section aria-label="Why order from us" className="border-y border-border bg-card">
      <div className="container grid grid-cols-3 gap-y-6 py-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <item.icon className="mb-2 h-6 w-6 text-accent-600" aria-hidden />
            <p className="font-display text-2xl font-extrabold text-foreground">{item.value}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
