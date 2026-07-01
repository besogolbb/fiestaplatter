import Link from "next/link";
import { ChevronLeft, ShieldCheck, Star } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { FloatingCta } from "@/components/layout/floating-cta";
import { siteConfig } from "@/config/site";

/**
 * Minimal, distraction-free shell for the order flow — fewer escape routes
 * than the marketing pages keeps the customer focused on completing the order.
 */
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/60 transition-colors hover:text-brand"
          >
            <ChevronLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/5 py-6">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-xs text-foreground/50 sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-600" /> Secure &amp; no upfront payment
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-accent text-accent" /> {siteConfig.stats.ratingValue}/5
            from {siteConfig.stats.ratingCount}+ customers
          </span>
        </div>
      </footer>

      <FloatingCta />
    </div>
  );
}
