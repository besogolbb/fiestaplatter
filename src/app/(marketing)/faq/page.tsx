import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { faqSchema } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/seo";
import { faqs, faqCategories } from "@/data/faqs";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — Ordering, Delivery, Payment & Servings",
  description:
    "Answers to common questions about ordering Fiesta Platter party trays: lead time, delivery areas, payment methods, serving sizes, reservations and cancellations.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Everything you need to know before you order. Can't find an answer? Message us anytime."
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />

      <Section className="bg-background">
        <div className="mx-auto max-w-3xl space-y-10">
          {faqCategories.map((cat) => {
            const items = faqs.filter((f) => f.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="mb-4 font-display text-xl font-extrabold text-foreground">{cat}</h2>
                <Accordion type="single" collapsible className="flex flex-col gap-3">
                  {items.map((faq, i) => (
                    <AccordionItem key={faq.question} value={`${cat}-${i}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      </Section>

      <FinalCta />
      <JsonLd data={faqSchema()} />
    </>
  );
}
