"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreSection } from "@/lib/cart/catalog";
import { Pennant } from "@/components/cart/pennant";
import { cn } from "@/lib/utils";

interface BuntingNavProps {
  sections: StoreSection[];
}

export const sectionAnchor = (id: string) => `menu-${id}`;

/**
 * Sticky category nav drawn as a string of banderitas. Each pennant is a
 * link to its section; the section in view drops its flag lower (scroll-spy),
 * and the strip keeps the active flag in view on narrow screens.
 */
export function BuntingNav({ sections }: BuntingNavProps) {
  const [active, setActive] = useState(sections[0]?.id);
  const stripRef = useRef<HTMLUListElement>(null);
  const clickLock = useRef<number | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(sectionAnchor(s.id)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLock.current !== null) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace(/^menu-/, "") as StoreSection["id"]);
      },
      // The band just under the sticky header + bunting decides the active section.
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active pennant visible inside the horizontal strip.
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!strip || !el) return;
    const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
    >
      <ul
        ref={stripRef}
        className="scrollbar-none container flex snap-x gap-1 overflow-x-auto pb-1.5 pt-0"
      >
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} data-section={s.id} className="relative shrink-0 snap-start">
              {/* The string: one sagging segment per flag, so the strip reads as continuous bunting. */}
              <svg
                aria-hidden
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                className="absolute inset-x-[-2px] top-0 h-2.5 w-[calc(100%+4px)] overflow-visible"
              >
                <path d="M0 1 Q50 9 100 1" fill="none" className="stroke-foreground/35" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              </svg>
              <a
                href={`#${sectionAnchor(s.id)}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  setActive(s.id);
                  if (clickLock.current) window.clearTimeout(clickLock.current);
                  clickLock.current = window.setTimeout(() => {
                    clickLock.current = null;
                  }, 900);
                }}
                className={cn(
                  "group flex min-h-[4.25rem] min-w-[4.5rem] flex-col items-center gap-1 rounded-b-xl px-2.5 pt-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                  isActive ? "font-extrabold text-foreground" : "font-semibold text-foreground/70 hover:text-foreground",
                )}
              >
                <Pennant
                  color={s.flag}
                  className={cn(
                    "h-7 w-[22px] origin-top transition-transform duration-300 ease-out",
                    isActive ? "translate-y-1 scale-110" : "motion-safe:group-hover:rotate-6",
                  )}
                />
                <span className={cn("mt-1 whitespace-nowrap", isActive && "underline decoration-2 underline-offset-4")}>
                  {s.short}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
