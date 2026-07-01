import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

/** Accessible star rating (rounds to nearest half visually, exact in aria-label). */
export function StarRating({ rating, size = 16, className, showValue = false }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(
            i < rounded ? "fill-accent text-accent" : "fill-white/10 text-white/10",
          )}
          aria-hidden
        />
      ))}
      {showValue ? (
        <span className="ml-1.5 text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
      ) : null}
    </span>
  );
}
