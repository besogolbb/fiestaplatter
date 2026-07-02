import { Users, CalendarClock, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CountUpStat } from "@/components/shared/count-up-stat";

export function TrustBar() {
  const { stats } = siteConfig;
  const items = [
    { icon: Users, value: stats.ordersServed, label: "Orders served" },
    { icon: CalendarClock, value: `${stats.yearsServing} yrs`, label: "Serving celebrations" },
    { icon: HeartHandshake, value: stats.happyFamilies, label: "Happy families" },
  ];

  return (
    <section aria-label="Business highlights" className="border-y border-border bg-card">
      <div className="container grid grid-cols-3 gap-y-6 py-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <item.icon className="mb-2 h-6 w-6 text-accent-600" aria-hidden />
            <CountUpStat
              value={item.value}
              className="font-display text-2xl font-extrabold text-foreground"
            />
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
