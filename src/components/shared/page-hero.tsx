import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Breadcrumb trail excluding Home (added automatically). */
  crumbs: { name: string; path: string }[];
}

/** Shared inner-page header with breadcrumbs + BreadcrumbList schema. */
export function PageHero({ eyebrow, title, description, crumbs }: PageHeroProps) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <section className="bg-warm">
      <div className="container py-12 sm:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-foreground/50">
            {trail.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="h-4 w-4" aria-hidden /> : null}
                {i < trail.length - 1 ? (
                  <Link href={c.path} className="hover:text-brand">
                    {c.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground/70" aria-current="page">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-accent-600">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/70">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </section>
  );
}
