import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { benefits } from "@/data/content";

export function WhyChooseUs() {
  return (
    <Section id="why-us" className="bg-warm">
      <SectionHeading
        eyebrow="Why Fiesta Platter"
        title="Premium Party Food You Can Trust"
        description="We treat every order like it's for our own family — because your celebration deserves nothing less."
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b, i) => (
          <Reveal as="li" key={b.title} delay={i * 0.05}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon name={b.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{b.description}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
