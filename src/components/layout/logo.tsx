import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm transition-transform group-hover:scale-105">
        <UtensilsCrossed className="h-5 w-5" aria-hidden />
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold leading-none tracking-tight",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        Fiesta <span className={onDark ? "text-accent" : "text-brand"}>Platter</span>
      </span>
    </Link>
  );
}
