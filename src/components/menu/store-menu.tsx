"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { catalogBySection, type CatalogEntry } from "@/lib/cart/catalog";
import { BuntingNav, sectionAnchor } from "@/components/menu/bunting-nav";
import { MenuCard } from "@/components/menu/menu-card";
import { ItemSheet } from "@/components/menu/item-sheet";
import { Pennant } from "@/components/cart/pennant";

const groups = catalogBySection({ withFavorites: true });

interface StoreMenuProps {
  /** Heading level for section titles — h3 when the menu sits under a page-level h2 (homepage). */
  sectionHeading?: "h2" | "h3";
}

/** The ordering surface: bunting nav, searchable sections of cards, item sheet. */
export function StoreMenu({ sectionHeading: SectionTitle = "h2" }: StoreMenuProps = {}) {
  const [query, setQuery] = useState("");
  const [openEntry, setOpenEntry] = useState<CatalogEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    // Favorites repeat items from other sections — skip them so results don't double up.
    return groups
      .filter((g) => g.section.id !== "favorites")
      .map((g) => ({
        ...g,
        entries: g.entries.filter((e) =>
          [e.name, e.description, ...(e.includes ?? [])].some((t) => t.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.entries.length > 0);
  }, [query]);

  return (
    <>
      <BuntingNav sections={filtered.map((g) => g.section)} />

      <div className="bg-[hsl(30_18%_92%)] dark:bg-background">
      <div className="container pb-20 pt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trays, e.g. siomai, pancit"
            aria-label="Search the menu"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-12 text-base placeholder:text-foreground/70 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <p className="sr-only" aria-live="polite">
          {query ? `${filtered.reduce((n, g) => n + g.entries.length, 0)} results for ${query}` : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-xl font-extrabold">Nothing matches &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-foreground/70">Try another dish name, or clear the search to see the full menu.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 inline-flex h-11 items-center rounded-full border-2 border-brand px-5 text-sm font-bold text-brand hover:bg-brand/5"
            >
              Clear search
            </button>
          </div>
        ) : (
          filtered.map((g, gi) => (
            <section
              key={g.section.id}
              id={sectionAnchor(g.section.id)}
              aria-labelledby={`${sectionAnchor(g.section.id)}-title`}
              className="scroll-mt-40 pt-8"
            >
              <SectionTitle
                id={`${sectionAnchor(g.section.id)}-title`}
                className="flex items-center gap-2.5 font-display text-2xl font-extrabold sm:text-3xl"
              >
                <Pennant color={g.section.flag} className="h-7 w-[22px]" />
                {g.section.label}
              </SectionTitle>
              {g.section.id === "frozen" ? (
                <p className="mt-1 text-sm text-foreground/70">Packed frozen, to cook at home. Add them to any order.</p>
              ) : null}
              <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                {g.entries.map((entry, i) => (
                  <MenuCard
                    key={`${entry.kind}:${entry.slug}`}
                    entry={entry}
                    onOpen={setOpenEntry}
                    priority={gi === 0 && i < 2}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
      </div>

      <ItemSheet entry={openEntry} onClose={() => setOpenEntry(null)} />
    </>
  );
}
