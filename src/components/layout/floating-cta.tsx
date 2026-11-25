"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { messengerLink, telLink, siteConfig } from "@/config/site";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

/** Scroll past this before floating helpers appear on the homepage — clears the hero's own CTAs first. */
const REVEAL_SCROLL_Y = 480;

/**
 * Contact bubbles + the mobile "start your order" bar on marketing pages.
 *
 * One bottom bar at a time: once the cart has items the cart bar owns the
 * bottom edge, so the start-order bar steps aside. On the store page and
 * checkout the bubbles stay out of the way entirely — they used to sit on
 * top of menu cards — and the header keeps the call button within reach.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const isHome = pathname === "/";
  const onStore = pathname.startsWith("/menu") || pathname.startsWith("/order");
  const hasCart = hydrated && itemCount > 0;
  const [revealed, setRevealed] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setRevealed(true);
      return;
    }
    const onScroll = () => setRevealed(window.scrollY > REVEAL_SCROLL_Y);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (onStore) return null;

  const messengerHref = messengerLink(`Hi ${siteConfig.name}! I'd like to ask about your party trays.`);
  // The homepage is the store itself, so a "go to the menu" bar there is redundant.
  const showStartBar = revealed && !hasCart && !isHome;

  return (
    <>
      <div
        className={cn(
          "fixed right-4 z-40 flex flex-col gap-3 transition-[opacity,transform] duration-300",
          // With a cart, phones keep the bottom edge for the cart bar only; the header has Call.
          hasCart ? "max-sm:hidden sm:bottom-32" : isHome ? "bottom-6" : "bottom-24 sm:bottom-6",
          revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <a
          href={messengerHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on Messenger"
          tabIndex={revealed ? 0 : -1}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0866FF] text-white shadow-[0_8px_20px_-8px_rgba(8,102,255,0.8)] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866FF] focus-visible:ring-offset-2 motion-safe:hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </a>
        <a
          href={telLink}
          aria-label={`Call ${siteConfig.name}`}
          tabIndex={revealed ? 0 : -1}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-safe:hover:scale-105"
        >
          <Phone className="h-5 w-5" aria-hidden />
        </a>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[opacity,transform] duration-300 sm:hidden",
          showStartBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <Link
          href="/menu"
          tabIndex={showStartBar ? 0 : -1}
          aria-hidden={!showStartBar}
          className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          Order now — browse the menu
        </Link>
      </div>
    </>
  );
}
