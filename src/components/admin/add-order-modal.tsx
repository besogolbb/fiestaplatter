"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { menu } from "@/data/menu";
import { addManualOrderAction } from "@/app/admin/(dashboard)/actions";
import { Field } from "@/components/order/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Manual order entry for phone/Messenger orders that never went through the
 * customer-facing order form. Kept short on purpose — just enough to log
 * who, where, and what — with the same menu + qty picker as the site's
 * order form so pricing stays consistent. Writes straight to the Orders
 * sheet via appendManualOrder; packageName is fixed to "Custom order"
 * since these are raw menu-item picks, not a bundle.
 */
export function AddOrderModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [qtyBySlug, setQtyBySlug] = useState<Record<string, number>>({});
  const [otherName, setOtherName] = useState("");
  const [otherPrice, setOtherPrice] = useState("");
  const [otherQty, setOtherQty] = useState(1);
  const router = useRouter();

  function setQty(slug: string, qty: number) {
    setQtyBySlug((prev) => {
      const next = { ...prev };
      if (qty > 0) next[slug] = qty;
      else delete next[slug];
      return next;
    });
  }

  const selectedItems = menu
    .filter((item) => qtyBySlug[item.slug] > 0)
    .map((item) => ({ item, qty: qtyBySlug[item.slug] }));

  const otherPriceNum = Number(otherPrice);
  const hasOther = otherName.trim() !== "" && otherPriceNum > 0;
  const otherLineTotal = hasOther ? otherPriceNum * otherQty : 0;

  const estimatedTotal =
    selectedItems.reduce((sum, { item, qty }) => sum + item.price * qty, 0) + otherLineTotal;
  // "Others" items have no menu cost basis, so they contribute 0 to profit —
  // this stays a partial "known cost" figure, not the full order margin.
  const estimatedProfit = selectedItems.reduce(
    (sum, { item, qty }) => sum + (item.cost != null ? (item.price - item.cost) * qty : 0),
    0,
  );
  const addOnsSummary = [
    ...selectedItems.map(({ item, qty }) => (qty > 1 ? `${item.name} x${qty}` : item.name)),
    ...(hasOther ? [otherQty > 1 ? `${otherName.trim()} x${otherQty}` : otherName.trim()] : []),
  ].join(", ");

  function handleSubmit(formData: FormData) {
    if (selectedItems.length === 0 && !hasOther) {
      toast.error("Select at least one menu item, or fill in the Others item.");
      return;
    }
    formData.set("packageName", "Custom order");
    formData.set("addOns", addOnsSummary);
    formData.set("estimatedTotal", String(estimatedTotal));
    formData.set("estimatedProfit", String(estimatedProfit));

    startTransition(async () => {
      const result = await addManualOrderAction(formData);
      if (result.success) {
        toast.success(`Order ${result.reference} added.`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? "Could not add the order.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-foreground">Add Manual Order</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-foreground/50 hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          For orders taken by phone or Messenger — this writes directly to the Orders sheet.
        </p>

        <form action={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" htmlFor="name" required>
              <Input id="name" name="name" required placeholder="Juan Dela Cruz" />
            </Field>
            <Field label="Mobile Number" htmlFor="phone" required>
              <Input id="phone" name="phone" required placeholder="0917 123 4567" />
            </Field>
          </div>

          <Field label="Delivery Address" htmlFor="address" required>
            <Textarea id="address" name="address" required placeholder="House/Unit no., street, barangay, city" />
          </Field>

          <Field label="Delivery Date" htmlFor="deliveryDate" required>
            <Input id="deliveryDate" name="deliveryDate" type="date" required />
          </Field>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Menu Items <span className="font-normal text-foreground/70">(select with quantity)</span>
            </p>
            <div className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
              {menu.map((item) => {
                const qty = qtyBySlug[item.slug] ?? 0;
                const checked = qty > 0;
                return (
                  <div
                    key={item.slug}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                      checked ? "border-brand bg-brand/10" : "border-border bg-background/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setQty(item.slug, checked ? 0 : 1)}
                      className="flex-1 text-left text-foreground"
                    >
                      {item.name}
                    </button>
                    <div className="flex shrink-0 items-center gap-2.5">
                      {checked ? (
                        <div className="flex items-center gap-1 rounded-full border border-brand/30 bg-card">
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, qty - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-brand hover:bg-brand/10"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold text-foreground">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.slug, qty + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-brand hover:bg-brand/10"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : null}
                      <span className="w-16 shrink-0 text-right">
                        <span className="block font-semibold text-brand">
                          {formatPrice(item.price * Math.max(qty, 1))}
                        </span>
                        {item.cost != null ? (
                          <span className="block text-[10px] font-medium text-green-600 dark:text-green-400">
                            +{formatPrice((item.price - item.cost) * Math.max(qty, 1))} profit
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Free-text catch-all for items not on the menu — admin types both name and price. */}
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                  hasOther ? "border-brand bg-brand/10" : "border-border bg-background/60",
                )}
              >
                <Input
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  placeholder="Others — item name"
                  className="h-9 flex-1 basis-40"
                />
                <Input
                  value={otherPrice}
                  onChange={(e) => setOtherPrice(e.target.value)}
                  type="number"
                  min={0}
                  placeholder="Price"
                  className="h-9 w-24 shrink-0"
                />
                {hasOther ? (
                  <div className="flex shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-card">
                    <button
                      type="button"
                      onClick={() => setOtherQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease Others quantity"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brand hover:bg-brand/10"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-foreground">{otherQty}</span>
                    <button
                      type="button"
                      onClick={() => setOtherQty((q) => q + 1)}
                      aria-label="Increase Others quantity"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brand hover:bg-brand/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
                <span className="w-16 shrink-0 text-right font-semibold text-brand">
                  {hasOther ? formatPrice(otherLineTotal) : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border-2 border-brand bg-brand/15 px-4 py-3">
            <div>
              <span className="block text-sm font-bold text-foreground">Estimated Total</span>
              {estimatedProfit > 0 ? (
                <span className="block text-xs font-semibold text-green-600 dark:text-green-400">
                  {formatPrice(estimatedProfit)} net profit
                </span>
              ) : null}
            </div>
            <span className="font-display text-xl font-extrabold text-brand">{formatPrice(estimatedTotal)}</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Add Order"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
