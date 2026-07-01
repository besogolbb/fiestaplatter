import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { menuSchema } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/seo";
import { menu, menuCategories } from "@/data/menu";

export const metadata: Metadata = pageMetadata({
  title: "Menu — Party Trays, Bilao & Filipino Favorites",
  description:
    "Browse the full Fiesta Platter menu: spaghetti, palabok, pancit, carbonara, cheesy pork lumpia, jumbo siomai, pork BBQ, puto pao and maja blanca — with prices and serving sizes.",
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Menu"
        title="Freshly Prepared Filipino Party Trays"
        description="Generously portioned bilao, grilled sticks and kakanin — priced clearly, cooked fresh on your delivery date."
        crumbs={[{ name: "Menu", path: "/menu" }]}
      />

      {menuCategories.map((cat, ci) => {
        const items = menu.filter((m) => m.category === cat.id);
        if (items.length === 0) return null;
        return (
          <Section
            key={cat.id}
            className={ci % 2 === 0 ? "bg-background" : "bg-warm"}
          >
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
              {cat.label}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.05}>
                  <ProductCard item={item} priority={ci === 0 && i < 2} />
                </Reveal>
              ))}
            </div>
          </Section>
        );
      })}

      <FinalCta />
      <JsonLd data={menuSchema()} />
    </>
  );
}
