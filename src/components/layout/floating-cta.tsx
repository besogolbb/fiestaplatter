"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { messengerLink, telLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Scroll past this before floating helpers appear on the homepage — clears the hero's own CTAs first. */
const REVEAL_SCROLL_Y = 480;

/**
 * Conversion helpers that follow the user everywhere.
 *
 * The homepage hero already has its own "Order Now" + "View Bundle
 * Packages" buttons front and center, so showing the floating Messenger/
 * Call buttons and the sticky order bar immediately just crowds that same
 * view with duplicate CTAs. On the homepage they stay hidden until the
 * visitor scrolls past the hero; everywhere else they show immediately as
 * before, since those pages don't have a competing hero CTA at the top.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const onOrderPage = pathname.startsWith("/order");
  const isHome = pathname === "/";
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

  const messengerHref = messengerLink(
    `Hi ${siteConfig.name}! I'd like to ask about your party trays.`,
  );

  return (
    <>
      {/* Floating round buttons */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-40 flex flex-col gap-3 transition-all duration-300 sm:bottom-6",
          revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <a
          href={messengerHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on Messenger"
          tabIndex={revealed ? 0 : -1}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084FF] focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
        <a
          href={telLink}
          aria-label={`Call ${siteConfig.name}`}
          tabIndex={revealed ? 0 : -1}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      {/* Sticky mobile order bar */}
      {!onOrderPage ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md transition-all duration-300 sm:hidden",
            revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
          )}
        >
          <Button asChild size="lg" className="w-full shadow-md" tabIndex={revealed ? 0 : -1}>
            <Link href="/order">Order Now — Reserve Your Date</Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}
