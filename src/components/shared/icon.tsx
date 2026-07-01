import {
  Sparkles,
  ChefHat,
  UtensilsCrossed,
  Clock,
  PiggyBank,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

/** Whitelisted icon map so we never ship the whole lucide bundle dynamically. */
const icons: Record<string, LucideIcon> = {
  Sparkles,
  ChefHat,
  UtensilsCrossed,
  Clock,
  PiggyBank,
  HeartHandshake,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden />;
}
