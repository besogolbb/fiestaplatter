import type { Metadata } from "next";
import { StoreFront } from "@/components/sections/store-front";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { HowItWorks } from "@/components/sections/how-it-works";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { FaqPreview } from "@/components/sections/faq-preview";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Store-front homepage: the menu first, the reasons to trust us after it. */
export default function HomePage() {
  return (
    <>
      <StoreFront />
      <WhyChooseUs />
      <HowItWorks />
      <GalleryPreview />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
