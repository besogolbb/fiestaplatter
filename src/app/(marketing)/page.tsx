import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { BestSellers } from "@/components/sections/best-sellers";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PackagesSection } from "@/components/sections/packages-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { FaqPreview } from "@/components/sections/faq-preview";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BestSellers />
      <WhyChooseUs />
      <HowItWorks />
      <PackagesSection limit={3} showViewAll />
      <TestimonialsSection limit={3} />
      <GalleryPreview />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
