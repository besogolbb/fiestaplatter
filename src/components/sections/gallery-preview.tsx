import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { GalleryGrid } from "@/components/shared/gallery-grid";
import { Button } from "@/components/ui/button";
import { gallery } from "@/data/content";

export function GalleryPreview() {
  return (
    <Section id="gallery" className="bg-warm">
      <SectionHeading
        eyebrow="See for Yourself"
        title="A Feast for the Eyes"
        description="Real trays from real celebrations. This is what lands on your table."
      />
      <GalleryGrid images={gallery.slice(0, 8)} className="mt-10" />
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/gallery">
            View Full Gallery <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
