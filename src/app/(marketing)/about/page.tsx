import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Leaf, Award, Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Home-Made Filipino Catering",
  description:
    "Fiesta Platter is a family-run Filipino party tray and catering business. Learn our story, our promise of fresh home-made quality, and why families trust us for every celebration.",
  path: "/about",
});

const values = [
  { icon: Leaf, title: "Fresh, Always", text: "Cooked on your delivery date — never pre-frozen or reheated." },
  { icon: Heart, title: "Home-Made Love", text: "Recipes perfected over the years, made the way family does it." },
  { icon: Award, title: "Consistent Quality", text: "The same great taste and generous servings, every single order." },
  { icon: Users, title: "Family First", text: "We cook for your celebration like it's our own family's table." },
];

export default function AboutPage() {
  const { stats } = siteConfig;
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Home-Made Filipino Flavors for Every Celebration"
        description={`For over ${stats.yearsServing} years, Fiesta Platter has been serving fresh, generous party trays to families across ${siteConfig.location.serviceArea}.`}
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <Section className="bg-background">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-brand/10 blur-2xl" />
            <Image
              src="/images/menu/chicken-embutido.webp"
              alt="Fiesta Platter signature chicken embutido party tray"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="A Family Kitchen You Can Count On"
            />
            <div className="mt-5 space-y-4 text-pretty leading-relaxed text-foreground/75">
              <p>
                Fiesta Platter started with a simple belief: every celebration deserves
                food that tastes like it was made at home — because it is. What began as
                cooking for family birthdays and fiestas grew into a trusted name for party
                trays across the community.
              </p>
              <p>
                Today we prepare thousands of orders for birthdays, office events, weddings,
                house blessings and holidays. Through it all, our promise hasn&apos;t changed:
                fresh ingredients, generous servings, honest prices, and on-time delivery.
              </p>
              <p className="font-semibold text-foreground">
                When you order from Fiesta Platter, you&apos;re not just getting food —
                you&apos;re getting a partner who wants your celebration to be perfect.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-warm">
        <SectionHeading
          eyebrow="What We Stand For"
          title="Our Promise to Every Customer"
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <li
              key={v.title}
              className="flex h-full flex-col rounded-2xl border border-white/5 bg-card p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <v.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <WhyChooseUs />
      <TestimonialsSection limit={3} />
      <FinalCta />
    </>
  );
}
