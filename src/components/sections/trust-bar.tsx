import { Star, Users, CalendarClock, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";

export function TrustBar() {
  const { stats } = siteConfig;
  const items = [
    { icon: Star, value: `${stats.ratingValue}/5`, label: "Facebook rating" },
    { icon: Users, value: stats.ordersServed, label: "Orders served" },
    { icon: CalendarClock, value: `${stats.yearsServing} yrs`, label: "Serving celebrations" },
    { icon: HeartHandshake, value: stats.happyFamilies, label: "Happy families" },
  ];

  return (
    <section aria-label="Business highlights" className="border-y border-black/5 bg-white">
      <div className="container grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <item.icon className="mb-2 h-6 w-6 text-accent-600" aria-hidden />
            <p className="font-display text-2xl font-extrabold text-ink">{item.value}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
