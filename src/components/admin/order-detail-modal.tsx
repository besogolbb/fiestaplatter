"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Pencil, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { OrderRecord } from "@/lib/google-sheets";
import { updateOrderAction } from "@/app/admin/(dashboard)/actions";
import { eventTypes, paymentMethods, orderStatuses } from "@/lib/order-schema";
import { menu } from "@/data/menu";
import { packages } from "@/data/packages";
import { Field } from "@/components/order/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Best-effort reconstruction of qty-per-menu-item from the saved add-ons
 * display string (e.g. "Siomai x2, Puto Pao") — the sheet only ever stores
 * add-ons as a name string, so anything that doesn't match a current menu
 * item name (renamed/discontinued items, or "Others" free-text lines) is
 * handed back as leftover text for the admin to reconcile manually.
 */
function parseAddOns(addOns: string) {
  const qtyBySlug: Record<string, number> = {};
  const leftover: string[] = [];
  for (const raw of addOns.split(",").map((t) => t.trim()).filter(Boolean)) {
    const match = raw.match(/^(.*?)\s*x(\d+)$/i);
    const name = (match ? match[1] : raw).trim();
    const qty = match ? parseInt(match[2], 10) : 1;
    const item = menu.find((m) => m.name.toLowerCase() === name.toLowerCase());
    if (item) {
      qtyBySlug[item.slug] = (qtyBySlug[item.slug] ?? 0) + qty;
    } else {
      leftover.push(raw);
    }
  }
  return { qtyBySlug, leftoverText: leftover.join(", ") };
}

/**
 * View + edit panel for a single order row. Opens read-only (the table
 * itself already has quick actions for delete / mark delivered), and
 * switches to an editable form on demand. Editing add-ons uses the same
 * menu qty picker as the Add Order modal, prefilled from the saved add-ons
 * string on a best-effort basis (see parseAddOns above).
 */
export function OrderDetailModal({ order, onClose }: { order: OrderRecord; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [eventType, setEventType] = useState(order.eventType);
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod);
  const [packageName, setPackageName] = useState(order.packageName);
  const [status, setStatus] = useState(order.status || "Created");

  const initialParse = parseAddOns(order.addOns);
  const [qtyBySlug, setQtyBySlug] = useState<Record<string, number>>(initialParse.qtyBySlug);
  const [otherName, setOtherName] = useState(initialParse.leftoverText);
  const [otherPrice, setOtherPrice] = useState("");
  const [otherQty, setOtherQty] = useState(1);

  const [pending, startTransition] = useTransition();
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

  const matchedPackage = packages.find((p) => p.name === packageName);
  const packagePrice = matchedPackage?.price ?? 0;

  const itemsTotal = selectedItems.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  const estimatedTotal = packagePrice + itemsTotal + otherLineTotal;
  const estimatedProfit = selectedItems.reduce(
    (sum, { item, qty }) => sum + (item.cost != null ? (item.price - item.cost) * qty : 0),
    0,
  );
  const addOnsSummary = [
    ...selectedItems.map(({ item, qty }) => (qty > 1 ? `${item.name} x${qty}` : item.name)),
    ...(hasOther ? [otherQty > 1 ? `${otherName.trim()} x${otherQty}` : otherName.trim()] : []),
  ].join(", ");

  function handleSubmit(formData: FormData) {
    formData.set("reference", order.reference);
    formData.set("submittedAt", order.submittedAt);
    formData.set("delivered", order.delivered);
    formData.set("status", status);
    formData.set("eventType", eventType);
    formData.set("paymentMethod", paymentMethod);
    formData.set("packageName", packageName);
    formData.set("addOns", addOnsSummary);
    formData.set("estimatedTotal", String(estimatedTotal));
    formData.set("estimatedProfit", String(estimatedProfit));

    startTransition(async () => {
      const result = await updateOrderAction(formData);
      if (result.success) {
        toast.success(`Order ${order.reference} updated.`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? "Could not update the order.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-foreground">
              {editing ? "Edit Order" : "Order Details"}
            </h2>
            <p className="font-mono text-xs text-foreground/50">{order.reference}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {!editing ? (
              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-foreground/50 hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="name" required>
                <Input id="name" name="name" required defaultValue={order.name} />
              </Field>
              <Field label="Mobile Number" htmlFor="phone" required>
                <Input id="phone" name="phone" required defaultValue={order.phone} />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" defaultValue={order.email} />
              </Field>
              <Field label="Facebook Profile" htmlFor="facebook">
                <Input id="facebook" name="facebook" defaultValue={order.facebook} />
              </Field>
            </div>

            <Field label="Delivery Address" htmlFor="address" required>
              <Textarea id="address" name="address" required defaultValue={order.address} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Delivery Date" htmlFor="deliveryDate" required>
                <Input id="deliveryDate" name="deliveryDate" type="date" required defaultValue={order.deliveryDate} />
              </Field>
              <Field label="Delivery Time" htmlFor="deliveryTime">
                <Input id="deliveryTime" name="deliveryTime" defaultValue={order.deliveryTime} />
              </Field>
              <Field label="Event Type" htmlFor="eventType">
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Guests" htmlFor="guests">
                <Input id="guests" name="guests" type="number" min={1} defaultValue={order.guests} />
              </Field>
            </div>

            <Field
              label="Package"
              htmlFor="packageName"
              hint={matchedPackage ? `Matched — adds ${formatPrice(matchedPackage.price)} to the total.` : "Type a bundle name to auto-add its price, or leave as-is for a custom order."}
            >
              <Input
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
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
                        <span className="w-16 shrink-0 text-right font-semibold text-brand">
                          {formatPrice(item.price * Math.max(qty, 1))}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Free-text catch-all — also where unmatched saved add-ons land on open. */}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment Method" htmlFor="paymentMethod">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status" htmlFor="status">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Reference Number" htmlFor="referenceNumber" hint="GCash/Maya/bank transaction reference for the down payment, once verified.">
              <Input id="referenceNumber" name="referenceNumber" defaultValue={order.referenceNumber} />
            </Field>

            <Field label="Special Instructions" htmlFor="specialInstructions">
              <Textarea id="specialInstructions" name="specialInstructions" defaultValue={order.specialInstructions} />
            </Field>

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
              <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4 text-sm">
            <DetailRow label="Status" value={order.status || "Created"} />
            <DetailRow label="Name" value={order.name} />
            <DetailRow label="Phone" value={order.phone} />
            <DetailRow label="Email" value={order.email} />
            <DetailRow label="Facebook" value={order.facebook} />
            <DetailRow label="Address" value={order.address} />
            <DetailRow label="Delivery" value={`${order.deliveryDate} ${order.deliveryTime}`.trim()} />
            <DetailRow label="Event" value={`${order.eventType}${order.guests ? ` · ${order.guests} pax` : ""}`} />
            <DetailRow label="Package" value={order.packageName} />
            <DetailRow label="Add-ons" value={order.addOns || "—"} />
            <DetailRow label="Payment Method" value={order.paymentMethod} />
            <DetailRow label="Reference Number" value={order.referenceNumber || "—"} />
            <DetailRow label="Special Instructions" value={order.specialInstructions || "—"} />
            <DetailRow label="Delivered" value={order.delivered === "Yes" ? "Yes" : "No"} />
            <div className="flex items-center justify-between rounded-xl border-2 border-brand bg-brand/15 px-4 py-3">
              <div>
                <span className="block text-sm font-bold text-foreground">Estimated Total</span>
                {Number(order.estimatedProfit) > 0 ? (
                  <span className="block text-xs font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(Number(order.estimatedProfit))} net profit
                  </span>
                ) : null}
              </div>
              <span className="font-display text-xl font-extrabold text-brand">
                {formatPrice(Number(String(order.estimatedTotal).replace(/[^0-9.]/g, "")) || 0)}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border pb-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}
