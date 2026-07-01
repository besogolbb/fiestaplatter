"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/config/nav";
import { siteConfig, telLink } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  active ? "text-brand" : "text-foreground/70 hover:text-brand",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href={telLink} aria-label={`Call ${siteConfig.name}`}>
              <Phone className="h-4 w-4" /> Call
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/order">Order Now</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="px-4">
            <Link href="/order">Order</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/5 bg-background lg:hidden">
          <nav aria-label="Mobile navigation" className="container flex flex-col py-4">
            {mainNav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-white/5 py-4 text-lg font-semibold",
                    active ? "text-brand" : "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/order">Order Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={telLink}>
                  <Phone className="h-4 w-4" /> Call {siteConfig.contact.phoneDisplay}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
