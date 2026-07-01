import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig, messengerLink } from "@/config/site";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center shadow-xl sm:px-12">
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-card/10 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              Ready to celebrate?
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ready for Your Next Celebration?
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-white/85">
              Order today and reserve your preferred delivery schedule. Fresh trays,
              generous servings, and on-time delivery — {siteConfig.location.serviceArea}.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="white" className="shadow-md">
                <Link href="/order">
                  Order Now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="accent">
                <a href={messengerLink(`Hi ${siteConfig.name}! I'd like to order.`)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Message Us
                </a>
              </Button>
            </div>

            <p className="mt-5 text-sm text-white/70">
              {siteConfig.ordering.downpaymentNote} · Book at least{" "}
              {siteConfig.ordering.minLeadTimeHours} hours ahead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
