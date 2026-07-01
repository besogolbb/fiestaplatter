"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { messengerLink, telLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Conversion helpers that follow the user everywhere:
 *  - Floating Messenger + Call buttons (bottom-right, all viewports)
 *  - Sticky "Order Now" bar on mobile (bottom, hidden on the order page)
 * Single client island; no layout shift (fixed positioning).
 */
export function FloatingCta() {
  const pathname = usePathname();
  const onOrderPage = pathname.startsWith("/order");

  return (
    <>
      {/* Floating round buttons */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 sm:bottom-6">
        <a
          href={messengerLink(
            `Hi ${siteConfig.name}! I'd like to ask about your party trays.`,
          )}
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

      {/* Sticky mobile order bar */}
      {!onOrderPage ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-cream/95 p-3 backdrop-blur-md sm:hidden">
          <Button asChild size="lg" className="w-full shadow-md">
            <Link href="/order">Order Now — Reserve Your Date</Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}
