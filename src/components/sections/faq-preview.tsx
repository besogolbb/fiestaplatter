import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export function FaqPreview({ limit = 6 }: { limit?: number }) {
  const list = faqs.slice(0, limit);

  return (
    <Section id="faq" className="bg-cream">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Good to Know"
            title="Frequently Asked Questions"
            description="Everything you need to know before you order. Still have questions? We're one message away."
          />
          <Button asChild className="mt-6" variant="outline">
            <Link href="/faq">
              View All FAQs <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {list.map((faq, i) => (
            <AccordionItem key={faq.question} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
