import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-white/5 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <StarRating rating={t.rating} />
        <Quote className="h-6 w-6 text-brand/15" aria-hidden />
      </div>

      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/80">
        “{t.quote}”
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand"
          aria-hidden
        >
          {t.avatarInitials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{t.name}</p>
          <p className="truncate text-xs text-foreground/50">{t.role}</p>
        </div>
        <Badge variant="muted" className="ml-auto shrink-0">
          {t.event}
        </Badge>
      </figcaption>
    </figure>
  );
}
