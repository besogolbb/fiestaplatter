import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { FaqPreview } from "@/components/sections/faq-preview";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, telLink, mailtoLink, messengerLink } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Order & Inquiries",
  description:
    "Get in touch with Fiesta Platter. Call, text, or message us on Facebook Messenger to order party trays or ask about custom bundles and delivery.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact, location, hours } = siteConfig;

  const channels = [
    {
      icon: MessageCircle,
      label: "Facebook Messenger",
      value: "Chat with us — fastest reply",
      href: messengerLink(`Hi ${siteConfig.name}! I'd like to inquire about your party trays.`),
      external: true,
      primary: true,
    },
    { icon: Phone, label: "Call or Text", value: contact.phoneDisplay, href: telLink },
    { icon: Mail, label: "Email", value: contact.email, href: mailtoLink },
    {
      icon: Facebook,
      label: "Facebook Page",
      value: "Follow for updates & promos",
      href: contact.facebookUrl,
      external: true,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We'd Love to Hear From You"
        description="Have a question or ready to reserve? Reach us on your preferred channel — we usually reply within minutes during business hours."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <Section className="bg-background">
        <div className="grid gap-6 lg:grid-cols-2">
          <ul className="grid gap-4 sm:grid-cols-2">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    c.primary ? "border-brand bg-brand/5" : "border-border bg-card"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="mt-4 font-display text-base font-bold text-foreground">
                    {c.label}
                  </span>
                  <span className="mt-1 text-sm text-foreground/70">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-foreground">Business Details</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="font-semibold text-foreground">Service Area</dt>
                  <dd className="text-foreground/70">{location.serviceArea}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="font-semibold text-foreground">Business Hours</dt>
                  <dd className="text-foreground/70">{hours.display}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="font-semibold text-foreground">Phone</dt>
                  <dd className="text-foreground/70">{contact.phoneDisplay}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 rounded-xl bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Ready to reserve your date?</p>
              <p className="mt-1 text-sm text-foreground/60">
                Book at least {siteConfig.ordering.minLeadTimeHours} hours ahead to secure
                your schedule.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/order">Order Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <FaqPreview limit={4} />
    </>
  );
}
