import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { FloatingCta } from "@/components/layout/floating-cta";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/**
 * Minimal, distraction-free shell for the order flow — fewer escape routes
 * than the marketing pages keeps the customer focused on completing the order.
 */
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/60 transition-colors hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" /> Back to site
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-xs text-foreground/70 sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-600" /> Secure &amp; no upfront payment
          </span>
        </div>
      </footer>

      <FloatingCta />
    </div>
  );
}
