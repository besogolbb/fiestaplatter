import Image from "next/image";
import type { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";

export function GalleryGrid({
  images,
  className,
}: {
  images: GalleryImage[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {images.map((img, i) => (
        <li
          key={img.src}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-cream to-accent/10 shadow-sm"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            loading={i < 4 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-semibold text-ink/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {img.category}
          </span>
        </li>
      ))}
    </ul>
  );
}
