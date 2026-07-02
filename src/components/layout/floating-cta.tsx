"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, Plus, X } from "lucide-react";
import { messengerLink, telLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Conversion helpers that follow the user everywhere.
 *
 * Mobile already gets a full-width sticky "Order Now" bar, so stacking two
 * more always-visible round buttons on top of it crowds the corner and
 * competes with the header/hero CTAs already on screen. On mobile the
 * Messenger + Call buttons collapse into a single "speed dial" FAB that
 * expands on tap. Desktop has no competing sticky bar, so both stay
 * always-visible there.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const onOrderPage = pathname.startsWith("/order");
  const [open, setOpen] = useState(false);

  const messengerHref = messengerLink(
    `Hi ${siteConfig.name}! I'd like to ask about your party trays.`,
  );

  return (
    <>
      {/* Desktop — always-visible pair, no competing sticky bar here */}
      <div className="fixed bottom-6 right-4 z-40 hidden flex-col gap-3 sm:flex">
        <a
          href={messengerHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on Messenger"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084FF] focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
        <a
          href={telLink}
          aria-label={`Call ${siteConfig.name}`}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      {/* Mobile — single speed-dial FAB, sits above the sticky order bar */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 sm:hidden">
        <div
          className={cn(
            "flex flex-col items-end gap-3 transition-all duration-200",
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          <a
            href={messengerHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on Messenger"
            tabIndex={open ? 0 : -1}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084FF] focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
          <a
            href={telLink}
            aria-label={`Call ${siteConfig.name}`}
            tabIndex={open ? 0 : -1}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close contact options" : "Contact us"}
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>

      {/* Sticky mobile order bar */}
      {!onOrderPage ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md sm:hidden">
          <Button asChild size="lg" className="w-full shadow-md">
            <Link href="/order">Order Now — Reserve Your Date</Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}
