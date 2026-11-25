import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Bilao emblem + live-text wordmark (text stays crisp, translatable and themeable). */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src={siteConfig.brand.logo}
        alt=""
        width={44}
        height={44}
        priority
        className="h-11 w-11 shrink-0 drop-shadow-sm transition-transform duration-300 motion-safe:group-hover:rotate-[-6deg] motion-safe:group-hover:scale-105"
      />
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
