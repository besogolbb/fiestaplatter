"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Users } from "lucide-react";
import { sectionFor, type CatalogEntry } from "@/lib/cart/catalog";
import { useCart } from "@/components/cart/cart-provider";
import { QtyStepper } from "@/components/cart/qty-control";
import { Pennant } from "@/components/cart/pennant";
import { Sheet } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";

interface ItemSheetProps {
  entry: CatalogEntry | null;
  onClose: () => void;
}

/** Full details for one tray or bundle, with a quantity picker. */
export function ItemSheet({ entry, onClose }: ItemSheetProps) {
  const { qtyOf, setQty } = useCart();
  const inCart = entry ? qtyOf(entry.kind, entry.slug) : 0;
  const [qty, setLocalQty] = useState(1);

  useEffect(() => {
    if (entry) setLocalQty(Math.max(1, qtyOf(entry.kind, entry.slug)));
    // Only reset when a different item opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.kind, entry?.slug]);

  const section = entry ? sectionFor(entry.section) : null;
  const saving = entry?.compareAtPrice ? entry.compareAtPrice - entry.price : 0;

  return (
    <Sheet
      open={Boolean(entry)}
      onClose={onClose}
      title={entry?.name ?? ""}
      hideTitle
      footer={
        entry ? (
          <div className="flex items-center gap-3">
            <QtyStepper name={entry.name} qty={qty} onChange={(n) => setLocalQty(Math.max(1, n))} allowZero={false} size="lg" />
            <button
              type="button"
              onClick={() => {
                setQty(entry.kind, entry.slug, qty);
                onClose();
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 text-base font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              <span>{inCart > 0 ? "Update cart" : "Add to cart"}</span>
              <span className="tabular">· {formatPrice(entry.price * qty)}</span>
            </button>
          </div>
        ) : null
      }
    >
      {entry && section ? (
        <div>
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image src={entry.image} alt={entry.imageAlt} fill sizes="(max-width: 768px) 100vw, 440px" className="object-cover" />
          </div>
          <div className="space-y-4 px-5 py-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70">
              <Pennant color={section.flag} className="h-4 w-3" />
              {section.label}
            </p>
            <div>
              <p className="font-display text-2xl font-extrabold leading-tight" aria-hidden>
                {entry.name}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tabular font-display text-2xl font-extrabold text-brand">{formatPrice(entry.price)}</span>
                {entry.compareAtPrice ? (
                  <span className="tabular text-sm text-foreground/70 line-through">{formatPrice(entry.compareAtPrice)}</span>
                ) : null}
                {saving > 0 ? (
                  <span className="text-sm font-bold text-success">Save {formatPrice(saving)}</span>
                ) : null}
              </div>
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-brand" aria-hidden /> {entry.serving}
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">{entry.description}</p>
            {entry.includes?.length ? (
              <div>
                <p className="text-sm font-bold">What&apos;s in the bundle</p>
                <ul className="mt-2 space-y-1.5">
                  {entry.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden /> {inc}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {entry.unitPrice ? (
              <p className="text-xs text-foreground/70">
                Smaller order? {formatPrice(entry.unitPrice.amount)} {entry.unitPrice.unit} — tell us in your
                order notes.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </Sheet>
  );
}
