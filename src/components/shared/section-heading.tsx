import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}

/** Reusable eyebrow + title + description block used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-accent-600">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink/70 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
