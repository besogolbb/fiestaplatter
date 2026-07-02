"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { MenuItem } from "@/types";
import { Section } from "@/components/shared/section";
import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MenuBrowserProps {
  items: MenuItem[];
  categories: { id: MenuItem["category"]; label: string }[];
}

/** Live search + category filter over the menu grid — helps returning customers jump straight to what they want. */
export function MenuBrowser({ items, categories }: MenuBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MenuItem["category"] | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.shortName?.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, activeCategory]);

  return (
    <>
      <Section className="bg-background pb-0 sm:pb-0">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70"
              aria-hidden
            />
            <Input
              type="text"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu — e.g. lumpia, siomai, dessert…"
              aria-label="Search the menu"
              className="pl-10"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              activeCategory === "all"
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-foreground/70 hover:border-brand/40",
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                activeCategory === cat.id
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card text-foreground/70 hover:border-brand/40",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Section>

      {filtered.length === 0 ? (
        <Section className="bg-background">
          <p className="text-center text-foreground/70">
            No dishes match &ldquo;{query}&rdquo;. Try a different search or{" "}
            <button type="button" onClick={() => setQuery("")} className="font-semibold text-brand underline">
              clear the search
            </button>
            .
          </p>
        </Section>
      ) : (
        categories.map((cat, ci) => {
          const catItems = filtered.filter((m) => m.category === cat.id);
          if (catItems.length === 0) return null;
          return (
            <Section key={cat.id} className={ci % 2 === 0 ? "bg-background" : "bg-warm"}>
              <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                {cat.label}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catItems.map((item, i) => (
                  <Reveal key={item.slug} delay={i * 0.05}>
                    <ProductCard item={item} priority={ci === 0 && i < 2} />
                  </Reveal>
                ))}
              </div>
            </Section>
          );
        })
      )}
    </>
  );
}
