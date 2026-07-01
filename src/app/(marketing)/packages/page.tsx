import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { PackageCard } from "@/components/shared/package-card";
import { Reveal } from "@/components/shared/reveal";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";
import { packages } from "@/data/packages";

export const metadata: Metadata = pageMetadata({
  title: "Party Packages — Bundles for Every Celebration",
  description:
    "Save more with Fiesta Platter party bundles: Family, Birthday, Corporate, Fiesta and Holiday packages. Complete Filipino spreads with clear serving sizes and prices.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Party Packages"
        title="Complete Bundles, Bigger Savings"
        description="Pick the package that matches your occasion and headcount. Every bundle costs less than ordering the trays separately."
        crumbs={[{ name: "Packages", path: "/packages" }]}
      />

      <Section className="bg-cream">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i * 0.05}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </Section>

      <HowItWorks />
      <FinalCta />
    </>
  );
}
