import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { bestSellers } from "@/data/menu";

export function BestSellers() {
  return (
    <Section id="best-sellers" className="bg-background">
      <SectionHeading
        eyebrow="Crowd Favorites"
        title="Our Best-Selling Party Trays"
        description="Loved by thousands of celebrations. These are the trays that disappear first at every fiesta."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.06}>
            <ProductCard item={item} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/menu">
            See the Full Menu <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
