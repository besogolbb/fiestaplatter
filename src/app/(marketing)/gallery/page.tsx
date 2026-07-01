import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";
import { gallery, galleryCategories } from "@/data/content";

export const metadata: Metadata = pageMetadata({
  title: "Gallery — Our Party Trays in Action",
  description:
    "See real Fiesta Platter party trays: food, packaging and celebration spreads. Freshly prepared Filipino favorites, beautifully presented.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A Feast for the Eyes"
        description="Real trays from real celebrations — food, packaging and happy tables."
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
      />

      {galleryCategories.map((cat, i) => {
        const images = gallery.filter((g) => g.category === cat);
        if (images.length === 0) return null;
        return (
          <Section key={cat} className={i % 2 === 0 ? "bg-background" : "bg-warm"}>
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
              {cat}
            </h2>
            <GalleryGrid images={images} className="mt-8" />
          </Section>
        );
      })}

      <FinalCta />
    </>
  );
}
