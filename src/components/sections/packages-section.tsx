import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PackageCard } from "@/components/shared/package-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { packages } from "@/data/packages";

interface PackagesSectionProps {
  /** Limit the number shown (home page shows a curated subset). */
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export function PackagesSection({
  limit,
  showViewAll = false,
  className,
}: PackagesSectionProps) {
  const list = limit ? packages.slice(0, limit) : packages;

  return (
    <Section id="packages" className={className ?? "bg-warm"}>
      <SectionHeading
        eyebrow="Party Packages"
        title="Bundles That Save You More"
        description="Hand-picked combinations for every occasion — bigger savings than ordering trays individually."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((pkg, i) => (
          <Reveal key={pkg.slug} delay={i * 0.06}>
            <PackageCard pkg={pkg} />
          </Reveal>
        ))}
      </div>

      {showViewAll ? (
        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/packages">
              Compare All Packages <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
