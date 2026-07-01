import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { Reveal } from "@/components/shared/reveal";
import { StarRating } from "@/components/shared/star-rating";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection({ limit }: { limit?: number }) {
  const list = limit ? testimonials.slice(0, limit) : testimonials;
  const { stats } = siteConfig;

  return (
    <Section id="testimonials" className="bg-background">
      <SectionHeading
        eyebrow="Loved by Families"
        title="What Our Customers Say"
      />

      <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-white/5 bg-card px-5 py-2.5 shadow-sm">
        <StarRating rating={stats.ratingValue} />
        <span className="text-sm font-semibold text-foreground">
          {stats.ratingValue} average · {stats.ratingCount}+ reviews
        </span>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <TestimonialCard t={t} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
