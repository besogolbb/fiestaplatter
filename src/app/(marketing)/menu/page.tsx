import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { MenuBrowser } from "@/components/shared/menu-browser";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { menuSchema } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/seo";
import { menu, menuCategories } from "@/data/menu";

export const metadata: Metadata = pageMetadata({
  title: "Menu — Party Trays, Bilao & Filipino Favorites",
  description:
    "Browse the full Fiesta Platter menu: pancit, carbonara, lumpia, siomai, pork BBQ, puto pao and maja blanca — with clear prices and serving sizes.",
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

      <MenuBrowser items={menu.filter((m) => !m.addOnOnly)} categories={menuCategories} />

      <FinalCta />
      <JsonLd data={menuSchema()} />
    </>
  );
}
