import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { howItWorks } from "@/data/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-cream">
      <SectionHeading
        eyebrow="Simple & Stress-Free"
        title="How Ordering Works"
        description="From choosing your package to enjoying your event — five easy steps, no hassle."
      />

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {howItWorks.map((step, i) => (
          <Reveal as="li" key={step.step} delay={i * 0.06} className="relative">
            <div className="flex h-full flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand font-display text-xl font-extrabold text-white shadow-md">
                {step.step}
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
            </div>
            {i < howItWorks.length - 1 ? (
              <ArrowRight
                className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-accent-600 lg:block"
                aria-hidden
              />
            ) : null}
          </Reveal>
        ))}
      </ol>

      <div className="mt-10 text-center">
        <Button asChild size="lg">
          <Link href="/order">
            Start Your Order <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
